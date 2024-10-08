import { Utils } from "../utils/utils";
import { check } from "express-validator";
import { scopesArray } from "../utils/array.scopes";
import { UserRole } from "../types/users.interface";
import { Request, Response, NextFunction } from "express";
import UserRepository from "../repositories/users.repository";
import { handlerValidator } from "../utils/handler.validator";

// instanciate all class neccesaries
const utils = new Utils();
const repository = new UserRepository();

// build validators

const RegisterValidator = [
  check("username")
    .exists()
    .withMessage("Username does not exist")
    .notEmpty()
    .withMessage("Username is empty")
    .isString()
    .withMessage("Username must be a string")
    .isLength({ min: 5, max: 90 })
    .withMessage("Username must have a minimum of 5 characters")
    .custom(async (username: string) => {
      const existUser = await repository.getUserByUsername(username);
      if (existUser) {
        throw new Error("Username exist in our records");
      }
      return true;
    }),
  check("password")
    .exists()
    .withMessage("Password is empty")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .matches(/[A-Z]/)
    .withMessage("Password must contain at least one uppercase letter")
    .matches(/[a-z]/)
    .withMessage("Password must contain at least one lowercase letter")
    .matches(/\d/)
    .withMessage("Password must contain at least one number")
    .matches(/[$@#&!*-]/)
    .withMessage(
      "Password must contain at least one special character like $, @, #, &, - or !"
    ),
  check("name")
    .exists()
    .withMessage("name does not exist")
    .notEmpty()
    .withMessage("name is empty")
    .isString()
    .withMessage("name must be a string")
    .isLength({ min: 4, max: 90 })
    .withMessage("name must have a minimum of 4 characters and maximum 90"),
  check("last_name")
    .exists()
    .withMessage("Last name dost not exist")
    .notEmpty()
    .withMessage("Last name is empty")
    .isString()
    .withMessage("Last name must be a string")
    .isLength({ min: 3, max: 90 })
    .withMessage("Last name must have a minimum of 3 characters"),
  check("email")
    .exists()
    .withMessage("Email does not exist")
    .notEmpty()
    .withMessage("Email is empty")
    .isString()
    .withMessage("Email must be a string")
    .isEmail()
    .withMessage("Invalid email format")
    .isLength({ min: 5, max: 90 })
    .withMessage("Email must have a minimum of 5 characters")
    .custom(async (email: string) => {
      const existEmail = await repository.getUserByEmail(email);
      if (existEmail) {
        throw new Error("Email exist in our records");
      }
      return true;
    }),
  check("role")
    .exists()
    .withMessage("Role does not exist")
    .notEmpty()
    .withMessage("Role is empty")
    .isString()
    .withMessage("Role must be a string")
    .isLength({ min: 1, max: 20 })
    .withMessage("Role must have a minimum of 1 characters")
    .custom(async (role: UserRole) => {
      if (!Object.values(UserRole).includes(role)) {
        throw new Error(`Role must be one option from this: ${Object.values(UserRole).join(', ')}`);
      }
      return true;
    }),
  check("scopes")
    .exists()
    .withMessage("Scomes does not exist")
    .notEmpty()
    .withMessage("Scopes is empty")
    .custom(async (scopes: any) => {
      if (typeof scopes !== 'object') {
        throw new Error("Scope must be an array");
      }
      scopes.map((item: string) => {
        if (!scopesArray.includes(item)) {
          throw new Error(`Scope array must have one of this options: ${scopesArray.join(', ')}`);
        }
      });
      return true;
    }),
  (req: Request, res: Response, next: NextFunction) =>
    handlerValidator(req, res, next),
];

const ConfirmationUserValidator = [
  check("action")
    .exists()
    .withMessage("Action is required")
    .notEmpty()
    .withMessage("Action is empty")
    .isString()
    .withMessage("Action must be a string"),
  check("token")
    .exists()
    .withMessage("Token is required")
    .notEmpty()
    .withMessage("Token is empty")
    .isString()
    .withMessage("Token must be a string")
    .custom(async (token: string) => {
      const existToken = await repository.getUserByToken(token);
      if (!existToken) {
        throw new Error("Token don't exist in our records");
      }
      return true;
    }),
  (req: Request, res: Response, next: NextFunction) =>
    handlerValidator(req, res, next),
];

const LoginValidator = [
  check("username")
    .exists()
    .withMessage("Username does not exist")
    .notEmpty()
    .withMessage("Username is empty")
    .isString()
    .withMessage("Username must be a string")
    .isLength({ min: 5, max: 90 })
    .withMessage("Username must have a minimum of 5 characters")
    .custom(async (username: string) => {
      const existUser = await repository.getUserByUsername(username);
      // validate if user don't exist
      if (!existUser) {
        throw new Error("El usuario ingresado no existe.");
      }
      // validate if user is ! active
      if (existUser && !existUser.is_active) {
        throw new Error("El usuario no se encuentra activo.");
      }
      return true;
    }),
  check("password")
    .exists()
    .withMessage("Password is empty")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .matches(/[A-Z]/)
    .withMessage("Password must contain at least one uppercase letter")
    .matches(/[a-z]/)
    .withMessage("Password must contain at least one lowercase letter")
    .matches(/\d/)
    .withMessage("Password must contain at least one number")
    .matches(/[$@#&!*-]/)
    .withMessage(
      "Password must contain at least one special character like $, @, #, &, - or !"
    ),
  check("remember")
  .optional(),
  (req: Request, res: Response, next: NextFunction) =>
    handlerValidator(req, res, next),
];

const RecoveryValidator = [
  check("email")
    .exists()
    .withMessage("Email does not exist")
    .notEmpty()
    .withMessage("Email is empty")
    .isString()
    .withMessage("Email must be a string")
    .isEmail()
    .withMessage("Invalid email format")
    .isLength({ min: 5, max: 90 })
    .withMessage("Email must have a minimum of 5 characters")
    .custom(async (email: string) => {
      const existEmail = await repository.getUserByEmail(email);
      if (!existEmail) {
        throw new Error("Email don't exist in our records");
      }
      return true;
    }),
  (req: Request, res: Response, next: NextFunction) =>
    handlerValidator(req, res, next),
];

const ChangePasswordValidator = [
  check("password")
    .exists()
    .withMessage("Password is empty")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .matches(/[A-Z]/)
    .withMessage("Password must contain at least one uppercase letter")
    .matches(/[a-z]/)
    .withMessage("Password must contain at least one lowercase letter")
    .matches(/\d/)
    .withMessage("Password must contain at least one number")
    .matches(/[$@#&!*-]/)
    .withMessage(
      "Password must contain at least one special character like $, @, #, &, - or !"
    ),
  check("confirmation_password")
    .exists()
    .withMessage("Password is empty")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .matches(/[A-Z]/)
    .withMessage("Password must contain at least one uppercase letter")
    .matches(/[a-z]/)
    .withMessage("Password must contain at least one lowercase letter")
    .matches(/\d/)
    .withMessage("Password must contain at least one number")
    .matches(/[$@#&!*-]/)
    .withMessage(
      "Password must contain at least one special character like $, @, #, &, - or !"
    )
    .custom((val: string, { req }) => {
      if (val !== req.body?.password) {
        throw new Error("Password don´t match");
      }
      return true;
    }),
  check("token")
    .exists()
    .withMessage("Token is empty")
    .custom(async (token: string) => {
      const existToken = await repository.getUserByToken(token);
      if (!existToken) {
        throw new Error("Token don't exist in our records");
      }
      return true;
    })
    .custom(async (token: string) => {
      const isValid = await utils.verifyToken(token);
      if (!isValid) {
        throw new Error("Token expired");
      }
      return true;
    }),
  (req: Request, res: Response, next: NextFunction) =>
    handlerValidator(req, res, next),
];

export {
  LoginValidator,
  RegisterValidator,
  RecoveryValidator,
  ChangePasswordValidator,
  ConfirmationUserValidator,
};
