import { Request } from "express";
import { User } from "./users.interface";
import { JwtPayload } from "jsonwebtoken";

export interface RequestExt extends Request {
  user?: JwtPayload | { id: string, scopes: string[] } | User | any;
}