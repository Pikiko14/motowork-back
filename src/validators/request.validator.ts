import { check } from "express-validator";
import { Request, Response, NextFunction } from "express";
import { handlerValidator } from "../utils/handler.validator";

const PaginationValidator = [
  check("page")
    .exists()
    .withMessage("Debes especificar una pagina.")
    .notEmpty()
    .withMessage("La pagina no puede estar vacia.")
    .isNumeric()
    .withMessage("La pagina debe ser un numero."),
  check("perPage")
    .exists()
    .withMessage("Debes especificar la cantidad de registros por pagina.")
    .notEmpty()
    .withMessage("La cantidad de registros por pagina no puede estar vacia.")
    .isNumeric()
    .withMessage("La cantidad de registros por pagina debe ser un numero."),
  check("search")
    .optional(),
  (req: Request, res: Response, next: NextFunction) =>
    handlerValidator(req, res, next),
];

export { PaginationValidator };
