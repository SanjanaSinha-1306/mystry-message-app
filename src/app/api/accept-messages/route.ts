import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/option";
import dbConnect from "@/src/lib/dbConnect";
import UserModel from "@/src/model/User";
import { User } from "next-auth";

export async function POST(request: Request) {
await dbConnect();
const session = await  getServerSession(authOptions)
const  user:User = session?.user ;

if(!session || !session.user){
  return new Response(JSON.stringify({
    success: false,
    message: "Unauthorized"
  }), {status: 401});
}
 const userId = user._id;

 const { acceptMessages } = await request.json();


 try{
 const updatedUser = await UserModel.findByIdAndUpdate(
  userId,
  { isAcceptingMessages: acceptMessages },
  { new: true },
 );
   if(!updatedUser){
    return new Response(JSON.stringify({
      success: false,
      message: "User not found."
    }), {status: 404});
   }
   return new Response(JSON.stringify({ 
    success: true,
    message: "User status updated successfully.",
    updatedUser
  }), {status: 200});
 }
 catch(error){
  console.log("failed to update user status to accept message :", error);
  return new Response(JSON.stringify({
    success: false,
    message: "An error occurred while updating user status."
  }), {status: 500});
 }
}
export async function GET(request: Request) {

await dbConnect();
const session = await  getServerSession(authOptions)
const  user:User = session?.user ;

if(!session || !session.user){
  return new Response(JSON.stringify({
    success: false,
    message: "Unauthorized"
  }), {status: 401});
}
 const userId = user._id;

const foundUser = await UserModel.findById(userId);
try{if(!foundUser){
  return new Response(JSON.stringify({
    success: false,
    message: "User not found."
  }), {status: 404});
}
return new Response(JSON.stringify({
  success: true,
  message: "User found.",
  isAcceptingMessages: foundUser.isAcceptingMessages
}), {status: 200});}
catch(error){

  console.log("failed to get user status to accept message :", error);
  return new Response(JSON.stringify({
    success: false,
    message: "An error occurred while getting user status."
  }), {status: 500});
}
}