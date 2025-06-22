
import mongoose ,{Schema,Document} from "mongoose";
import { IUser } from "../types/userIntrface";


export interface IUserDocument extends IUser,Document {} ;// aange jakr jb aap mongoose.model ko export krenge --> mongoose.model<andar isko use krna hai> 

const UserSchema:Schema = new Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        trim:true
    },
    password:{
        type:String,
        required:true
    },
    refreshToken:{
        type:String,
    },
    task:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Task"
    }],
},{timestamps:true});


const UserModel = mongoose.model<IUserDocument>('User',UserSchema);
export default UserModel;



