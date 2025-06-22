
import { IUserPayload } from "./userPayloadInterface";


declare global {
  namespace Express {
    interface Request {
      user?: IUserPayload;
    }
  }
}
