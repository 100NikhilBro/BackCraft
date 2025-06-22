import mongoose ,{Schema,Document} from "mongoose";
import { Itask } from "../types/taskInterface";


interface ItaskDocument extends Itask,Document{}; // jb aange mongoose.model<yahan pr use krna hai isko>


const TaskSchema:Schema = new Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }
},{timestamps:true});


const TaskModel = mongoose.model<ItaskDocument>('Task',TaskSchema);
export default TaskModel;


