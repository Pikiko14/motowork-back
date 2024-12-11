import { Utils } from "../utils/utils";
import Bull, { Job, Queue, QueueOptions } from "bull";
import { CloudinaryService } from "../services/cloudinary.service";
import CategoriesRepository from "../repositories/categories.repository";

export class TaskQueue<T> {
  private utils: Utils;
  private path: string;
  private queue: Queue<T>;
  public folder: string;
  public redisConfig: QueueOptions["redis"] = {
    host: "127.0.0.1",
    port: 6379,
  };
  public cloudinaryService: CloudinaryService;

  constructor(queueName: string, folder: string, path: string) {
    this.queue = new Bull<T>(queueName, {
      redis: this.redisConfig,
    });
    this.path = path;
    this.folder = folder;
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
    if (job.data.taskType === "uploadFile") {
      const { file, entity } = job.data.payload;
      const imgBuffer = await this.utils.generateBuffer(file.path);
      const fileResponse = await this.cloudinaryService.uploadImage(
        imgBuffer,
        this.folder
      );
      entity.icon = fileResponse.secure_url;
      await this.utils.deleteItemFromStorage(
        `${this.path}${file ? file.filename : ""}`
      );
      // save result in our bbdd
      let repository = null;
      switch (this.folder) {
        case "categories":
            repository = new CategoriesRepository();
          break;
      }
      await repository?.update(entity._id, entity);
    } else {
      const { icon } = job.data.payload;
      await this.cloudinaryService.deleteImageByUrl(icon);
    }
    console.log(`Tarea procesada con datos:`, job.data);
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
