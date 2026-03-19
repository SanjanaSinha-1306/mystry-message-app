import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/option";
import dbConnect from "@/src/lib/dbConnect";
import UserModel from "@/src/model/User";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ messageid: string }> }
) {
  // 1. Await params (Required in Next.js 15+)
  const { messageid: messageId } = await params;

  await dbConnect();
  
  // 2. Get and validate session
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return new Response(
      JSON.stringify({
        success: false,
        message: "Unauthorized",
      }),
      { status: 401 }
    );
  }

  // 3. Extract user ID (TypeScript now knows _id exists thanks to the .d.ts file)
  const userId = session.user._id;

  try {
    const updateResult = await UserModel.updateOne(
      { _id: userId },
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