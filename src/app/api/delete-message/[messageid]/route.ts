import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/option";
import dbConnect from "@/src/lib/dbConnect";
import UserModel from "@/src/model/User";
import { User } from "next-auth";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ messageid: string }> }
) {
  // Await params first as required by newer Next.js versions
  const { messageid: messageId } = await params;

  await dbConnect();
  const session = await getServerSession(authOptions);

  // 1. Guard Clause: Check if session and user exist
  // This prevents the "Type 'undefined' is not assignable to type 'User'" error
  if (!session || !session.user) {
    return new Response(
      JSON.stringify({
        success: false,
        message: "Unauthorized",
      }),
      { status: 401 }
    );
  }

  // 2. Now it is safe to assign the user variable
  const user: User = session.user;

  try {
    // Perform the update to pull the message from the array
    const updateResult = await UserModel.updateOne(
      { _id: user._id },
      { $pull: { messages: { _id: messageId } } }
    );

    if (updateResult.modifiedCount === 0) {
      return Response.json(
        {
          success: false,
          message: "Message not found or already deleted",
        },
        { status: 404 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "Message Deleted",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting message:", error);
    return Response.json(
      {
        success: false,
        message: "Error deleting message",
      },
      { status: 500 }
    );
  }
}