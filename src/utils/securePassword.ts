
import SecurePassword from "secure-password";


const pwd = new SecurePassword();


export const hashedPassword = async(plainPassword:string):Promise<string>=>{
    try{

        const hashedBuffer = await pwd.hash(Buffer.from(plainPassword));
        return hashedBuffer.toString('base64');

    }catch(e){

        throw new Error('password hashing Failed');

    }
}


export const verifyPassword = async(storedBuffer:string,inputPassword:string):Promise<boolean>=>{
    try{

        const hashedBuffer = Buffer.from(storedBuffer,'base64');
        const result = await pwd.verify(Buffer.from((inputPassword)),hashedBuffer);


        if(result === SecurePassword.VALID){
            return true;
        }
        else if(result === SecurePassword.VALID_NEEDS_REHASH){
            return true
        }
        else{
            return false;
        }

    }catch(e){
        console.error("Error",e);
        throw new Error('Verification Failed of Password');
    }
}
