import { check } from "express-validator";
import CategoriesModel from "../models/categories.model";
import { Request, Response, NextFunction } from "express";
import { TypeCategory } from "../types/categories.interface";
import { handlerValidator } from "../utils/handler.validator";

const CategoriesCreationValidator = [
  check("name")
    .exists()
    .withMessage("Debes especificar el nombre de la categoría.")
    .notEmpty()
    .withMessage("El nombre de la categoría no puede estar vacia.")
    .isString()
    .withMessage("El nombre de la categoría debe ser un string.")
    .isLength({ min: 1, max: 90 })
    .withMessage(
      "El nombre del categoría debe tener entre 1 y máximo 90 caracteres."
    )
    .custom(async (value: string, { req }) => {
      const { id } = req.params as any; // get param user to edit

      // validate if value is valid with regex
      const isValidValue = /^[a-zA-Z0-9 ]+$/.test(value);
      if (!isValidValue) {
        throw new Error(
          "El nombre de la categoría solo puede tener letras y números"
        );
      }

      // validate if is already exists
      const category = await CategoriesModel.findOne({
        name: value,
      });
      if (category && category.id !== id) {
        throw new Error("La categoría ya existe");
      }
      return true;
    }),
  check("type")
    .notEmpty()
    .withMessage("El tipo de categoría es obligatorio")
    .isString()
    .withMessage("El tipo de categoría debe ser una cadena de texto.")
    .custom(async (value: string) => {
      const types = Object.keys(TypeCategory);
      if (!types.includes(value)) {
        throw new Error(
          `El tipo de categoría debe ser una de las siguientes opciones: ${types.join(
            ", "
          )}.`
        );
      }
      return true;
    }),
  check("is_active").optional(),
  (req: Request, res: Response, next: NextFunction) =>
    handlerValidator(req, res, next),
];

const CategoryIdValidator = [
  check("id")
    .exists()
    .withMessage("El id de la categoría es requerido.")
    .notEmpty()
    .withMessage("El id de la categoría no puede estar vacio.")
    .isString()
    .withMessage("El id de la categoría debe ser una cadena de texto.")
    .isMongoId()
    .withMessage("El id de la categoría debe ser un id de mongo.")
    .custom(async (id: string) => {
      const category = await CategoriesModel.findById(id);
      if (!category) {
        throw new Error("El categoría no existe");
      }
      return true;
    }),
  (req: Request, res: Response, next: NextFunction) =>
    handlerValidator(req, res, next),
];

export { CategoriesCreationValidator, CategoryIdValidator };
