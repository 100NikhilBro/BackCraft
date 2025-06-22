import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";



export const validateRequest = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      res.status(400).json({
        message: "Validation error",
        issues: result.error.errors,
      });
      return;
    }

    req.body = result.data;
    next();
  };
};



// advance-middleware-handling

// import { RequestHandler } from "express";

// export const validateRequest = (schema: ZodSchema): RequestHandler => {
//   return (req, res, next) => {
//     const result = schema.safeParse(req.body);
//     if (!result.success) {
//       return res.status(400).json({ issues: result.error.errors });
//     }
//     req.body = result.data;
//     next();
//   };
// };















