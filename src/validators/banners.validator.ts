import { check } from "express-validator";
import { NextFunction, Request, Response } from "express";
import { handlerValidator } from "../utils/handler.validator";

const BannersCreationValidator = [
  check("name")
    .exists()
    .withMessage("El nombre del banner es requerido.")
    .notEmpty()
    .withMessage("El nombre del banner no puede estar vacio.")
    .isString()
    .withMessage("El nombre del banner debe ser una cadena de texto.")
    .isLength({ min: 5, max: 90 })
    .withMessage(
      "El nombre del banner debe tener entre 5 y máximo 90 caracteres."
    )
    .custom(async (value: string) => {
      const isValidValue = /^[a-zA-Z0-9 ]+$/.test(value);
      if (!isValidValue) {
        throw new Error(
          "El nombre del banner solo puede tener letras y números"
        );
      }
      return true;
    }),
    (req: Request, res: Response, next: NextFunction) =>
        handlerValidator(req, res, next),
];

export { BannersCreationValidator };
