import {Request,Response} from 'express';
import UserModel from '../models/userModel';
import TaskModel from '../models/taskModel';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import cleanInput from '../utils/cleanInput';
import { hashedPassword, verifyPassword } from '../utils/securePassword';
import { IUserPayload } from '../types/userPayloadInterface';


dotenv.config();



export const createUser = async(req:Request,res:Response):Promise<void>=>{
    try{

        const {name,email,password} = cleanInput(req.body);



        if(!name || !email ){
            res.status(788).json({
                message:"name , email  is required",
            })
            return
        }


        const existingUser = await  UserModel.findOne({email:email});

        if(existingUser){
            res.status(566).json({
                message:"Already regitered with this email",
            })
            return
        }

    
        if(!password){
             res.status(788).json({
                message:"password is required to hash",
            })
            return
        }


        const hash = await hashedPassword(password);

        if(!hash){
            res.status(878).json({
                message:"Password hashing failed"
            })
            return
        }


        const newUser = new UserModel({
            name:name,
            email:email,
            password:hash
        })


       await newUser.save();


       res.status(200).json({
        success:true,
        message:"User created Succesfully",
        user:{
            name:newUser.name,
            email:newUser.email,
        }
       })


    }catch(e){
        res.status(330).json({
            message:"Failed to create a User",
            success:false,
        })
    }
}




export const logIn = async(req:Request,res:Response):Promise<void>=>{
    try{

        const {email,password} = cleanInput(req.body);

        if(!email || !password){
            res.status(882).json({
                message:"email and paaword are required"
            })
            return
        }


        const existingUser = await UserModel.findOne({email:email.toLowerCase()});

        if(!existingUser){
            res.status(678).json({
                message:"firstly , create an Account",
            })
            return
        }

        let isVerify = false;

        if(password && existingUser){
            isVerify = await verifyPassword(existingUser.password,password);
        }


        if(!isVerify){
              res.status(789).json({ message: "Invalid password" });
             return;
        }


        const payload:IUserPayload = {
            id:existingUser._id as string,
            name:existingUser?.name,
            email:existingUser?.email
        }


        

       const accessToken = jwt.sign(payload,process.env.ACCESS_TOKEN as string , {expiresIn:"15m"});

       const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN as string, {expiresIn: "7d"});


      existingUser.refreshToken = refreshToken;
      await existingUser.save();

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true, 
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, 
    });


     res.status(200).json({
      success: true,
      message: "Login successful",
      accessToken,
      user: {
        name: existingUser?.name,
        email: existingUser?.email,
        id: existingUser?._id,
      },
    });
        



    }catch(e){

    console.error("Error in logUser:", e);
    res.status(500).json({ success: false, message: "Login failed" });
    }
}



export const logoutUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      res.status(400).json({ message: "No refresh token found" });
      return;
    }

    const user = await UserModel.findOne({ refreshToken });

    if (user) {
      user.refreshToken = ""; 
      await user.save();
    }

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });

    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (e) {
    console.error("Logout Error:", e);
    res.status(500).json({ success: false, message: "Logout failed" });
  }
};



export const getMyProfile = async (req: Request, res: Response): Promise<void> => {
  try {

    const id = req.user.id;

    if (!id) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const user = await UserModel.findById(id).select("-password -refreshToken").populate('task','title description');

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json({
      success: true,
      message: "User profile fetched successfully",
      user,
    });
  } catch (e) {
    console.error("Get Profile Error:", e);
    res.status(500).json({ success: false, message: "Failed to fetch profile" });
  }
};



export const updateProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.user.id;
    const { name, email, password } = cleanInput(req.body);

    if (!id) {
       res.status(400).json({ message: "User ID missing" });
       return
    }

    if (!name && !email && !password) {
       res.status(400).json({ message: "No data provided to update" });
       return
    }

    const userToUpdate = await UserModel.findById(id);
    if (!userToUpdate) {
       res.status(404).json({ message: "User not found" });
       return
    }

    if (name) userToUpdate.name = name;
    if (email) userToUpdate.email = email;

    if (password) {
      const hash = await hashedPassword(password);
      userToUpdate.password = hash;
    }

    await userToUpdate.save();

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      user: {
        name: userToUpdate.name,
        email: userToUpdate.email,
        id: userToUpdate._id,
      },
    });

  } catch (e) {
    console.error("Update error:", e);
    res.status(500).json({ message: "User update failed" });
  }
};




export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.user.id;

    if (!id) {
      res.status(400).json({ message: "User ID missing" });
      return;
    }

    const user = await UserModel.findById(id);

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

// yahan pr dhyan dene wali baat yeh hai --> delete apun jb krte hai jb woh cheej exits krti hai --> we have arr.length>0 ---> hai yaa nhi 
    if (user.task && user.task.length > 0) {
      await TaskModel.deleteMany({ _id: { $in: user.task } });
    }



    await UserModel.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "User and associated tasks deleted successfully",
    });

  } catch (e) {
    console.error("Error deleting user:", e);
    res.status(500).json({
      success: false,
      message: "Failed to delete user",
    });
  }
};





// ! --> yeh bhai --> kabhi not null nhi hone dega --> are graphql se relate kr le yarr 
export const refreshTokenHandler = (req: Request, res: Response): void => {
  const token = req.cookies?.refreshToken;

  if (!token) {
    res.status(401).json({ message: "No refresh token" });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN! ) as IUserPayload  ;

    const newAccessToken = jwt.sign(
      { id: decoded.id, name: decoded.name, email: decoded.email },
      process.env.ACCESS_TOKEN!,
      { expiresIn: '15m' }
    );

    res.status(200).json({
      success: true,
      accessToken: newAccessToken,
    });

  } catch (e) {
    res.status(403).json({ message: "Invalid refresh token" });
  }
};











