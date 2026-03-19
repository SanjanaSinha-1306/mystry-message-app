import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/option";
import dbConnect from "@/src/lib/dbConnect";
import UserModel from "@/src/model/User";
import { User } from "next-auth";



export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ messageid: string }> }
) {
const { messageid: messageId } = await params

await dbConnect();
const session = await  getServerSession(authOptions)
const  user:User = session?.user ;

if(!session || !session.user){
  return new Response(JSON.stringify({
    success: false,
    message: "Unauthorized"
  }), {status: 401});
}

try {
  
 const  updateReasult = await UserModel.updateOne(
    {_id: user._id},
    {$pull:{messages:{_id:messageId}}}
  )

  if (updateReasult.modifiedCount==0) {
    return Response.json(
      {
        success:false,
        message : "Message not found or already delete"
      },
      { status: 404}
    )
  }
    return Response.json(
      {
        success:true,
        message : "Message Deleted"
      },
      { status: 200}
    )
} catch (error) {
    return Response.json(
      {
        success:false,
        message : "Error deleteting message"
      },
      { status: 500}
    )
}
 
}