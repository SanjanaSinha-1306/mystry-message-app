import dbConnect from "@/src/lib/dbConnect";
import UserModel from "@/src/model/User";
import { Message } from "@/src/model/User";

export async function POST(request: Request) {
  await dbConnect();
 const {username,content}= await request.json()

  try{
    const user = await UserModel.findOne({ username, isVerified: true });
    if(!user){
      return new Response(JSON.stringify({
        success: false,
        message: "Recipient user not found."
      }), {status: 404});
    } 
    if(!user.isAcceptingMessages){
      return new Response(JSON.stringify({
        success: false,
        message: "Recipient is not accepting messages."
      }), {status: 403});
    }
    const newMessage = {content,createdAt: new Date()}
    user.messages.push(newMessage as Message);
    await user.save();
    return new Response(JSON.stringify({
      success: true,
      message: "Message sent successfully."
    }), {status: 200});
  }
  catch(error){
    console.log("Error sending message :", error);
    return new Response(JSON.stringify({
      success: false,
      message: "An error occurred while sending message."
    }), {status: 500});
  }
}