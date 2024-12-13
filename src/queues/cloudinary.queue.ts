import { Utils } from "../utils/utils";
import Bull, { Job, Queue, QueueOptions } from "bull";
import { CloudinaryService } from "../services/cloudinary.service";
import BannersRepository from "../repositories/banners.repository";
import CategoriesRepository from "../repositories/categories.repository";

export class TaskQueue<T> {
  private utils: Utils;
  private queue: Queue<T>;
  public redisConfig: QueueOptions["redis"] = {
    host: "127.0.0.1",
    port: 6379,
  };
  public cloudinaryService: CloudinaryService;

  constructor(queueName: string) {
    this.queue = new Bull<T>(queueName, {
      redis: this.redisConfig,
    });
    this.utils = new Utils();
    this.initializeProcessor();
    this.cloudinaryService = new CloudinaryService();
  }

  /**
   * Inicializa el procesador de la cola
   */
  private initializeProcessor() {
    this.queue.process(async (job: Job<T>) => {
      try {
        console.log(`Procesando trabajo: ${job.id}`);
        await this.handleTask(job);
      } catch (error) {
        console.error(`Error procesando trabajo ${job.id}:`, error);
        throw error;
      }
    });
  }

  /**
   * Lógica para manejar cada tarea
   */
  private async handleTask(job: Job<any>): Promise<void> {
    let fileResponse = null;
    let repository = null;
    let entityBd = null;

    // upload single file
    let folderString = '';
    if (job.data.taskType === "uploadFile") {
      const { file, entity, folder, path } = job.data.payload;
      folderString = folder;
      const imgBuffer = await this.utils.generateBuffer(file.path);
      fileResponse = await this.cloudinaryService.uploadImage(
        imgBuffer,
        folder
      );
      entity.icon = fileResponse.secure_url;
      await this.utils.deleteItemFromStorage(
        `${path}${file ? file.filename : ""}`
      );
      entityBd = entity;
    }

    // upload multiple files
    if (job.data.taskType === "uploadMultipleFiles") {
      const { entity, images, folder } = job.data.payload;
      folderString = folder;
      const newImages = [];
      for (const image of images) {
        if (image.src) {
          const imgBuffer = await this.utils.generateBuffer(image.src);
          // delete local storage
          await this.utils.deleteItemFromStorage(
            `${image.path ? image.path : ""}`
          );

          // upload single
          fileResponse = await this.cloudinaryService.uploadImage(
            imgBuffer,
            folder
          );
          image.path = fileResponse.secure_url;
          newImages.push(image);
        } else {
          newImages.push(image);
        }
      }
      entity.images = newImages;
      entityBd = entity;

      // upload multiples
      // fileResponse = await this.cloudinaryService.uploadMultipleFiles(bufferArray, this.folder);
    }

    // delete file
    if (job.data.taskType === "deleteFile") {
      const { icon, folder } = job.data.payload;
      folderString = folder;
      fileResponse = await this.cloudinaryService.deleteImageByUrl(icon);
    }

    // save items in bbdd
    if (entityBd) {
      // save result in our bbdd
      switch (folderString) {
        case "categories":
          repository = new CategoriesRepository();
          break;
        
        case 'banners':
          repository = new BannersRepository();
          break;
      }
      await repository?.update(entityBd._id, entityBd);
      entityBd = null;
      repository = null;
    }
    console.log(`Tarea procesada con respuesta:`, fileResponse);
  }

  /**
   * Agrega un trabajo a la cola
   */
  public async addJob(data: T, options?: Bull.JobOptions): Promise<Job<T>> {
    const job = await this.queue.add(data, options);
    console.log(`Trabajo encolado: ${job.id}`);
    return job;
  }

  /**
   * Configura eventos de la cola
   */
  public setupListeners() {
    this.queue.on("completed", (job: Job) => {
      console.log(`Trabajo completado: ${job.id}`);
    });

    this.queue.on("failed", (job: Job, err: Error) => {
      console.error(`Trabajo fallido: ${job.id}`, err);
    });
  }
}
