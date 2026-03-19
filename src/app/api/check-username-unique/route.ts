import dbConnect from "@/src/lib/dbConnect";
import UserModel from "@/src/model/User";
import { z} from "zod";
import { usernameValidation } from "@/src/schemas/signUpSchema";


const UsernameQuerySchema = z.object({
    username: usernameValidation,
})

export async function GET(request: Request) {

 
  await dbConnect();
  
  try {  
    const{searchParams} = new URL(request.url);

     const queryParam={   
    username: searchParams.get("username"),
     }
    
  const result = UsernameQuerySchema.safeParse(queryParam);
  if(!result.success){
    const usernameError = result.error.format().username?._errors||[];
    return new Response(JSON.stringify({
      success: false,
      message: "Invalid username.",
      errors: usernameError
    }), {status: 400});
  }

    const {username} = result.data;
   const existingVarifiedUser =await UserModel.findOne({username,isVarified:true})
   if(existingVarifiedUser){
    return new Response(JSON.stringify({
      success: false,
      message: "Username is already taken."
    }), {status: 200});
   }

    return new Response(JSON.stringify({  
      success: true,
      message: "Username is available."
    }), {status: 200});
  }
  catch (error)
  {
    console.log("Error checking username :", error);
    return new Response(JSON.stringify({
      success: false,
      message: "An error occurred while checking username uniqueness."
    }), {status: 500});
  }
}