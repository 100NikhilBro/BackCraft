import mongoose from "mongoose";
import dotenv from 'dotenv';

dotenv.config();


const dbConnect = async() => {
    try{

        const mongooseUrl =  process.env.DATABASE_URL ;

        if(!mongooseUrl){
            throw new Error("Mongoose Url is not found");
        } 

        await mongoose.connect(mongooseUrl as string); // as string kyu pehle baat typesript aur duri baat apun --> mongoose ke saath types install kiye the yaad hai yaa nhi 

        console.log("Successfully Connected");

    }catch(e){
        console.error("Mongoose Error",e);
        throw new Error('Connection Failed');
    }
}

export default dbConnect;