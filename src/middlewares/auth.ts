import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";





export const authMiddleware = (req: Request,res: Response,  next: NextFunction): void => {
  try {

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({ message: "Unauthorized: No token provided" });
      return;
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN as string);

    req.user = decoded;

    next();

  } catch (e) {
    console.error("Auth error:", e);
    res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};
