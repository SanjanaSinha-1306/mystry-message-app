import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/option";
import dbConnect from "@/src/lib/dbConnect";
import UserModel from "@/src/model/User";
import { User } from "next-auth";

export async function POST(request: Request) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  
  // 1. Check session existence
  if (!session || !session.user) {
    return new Response(JSON.stringify({
      success: false,
      message: "Unauthorized"
    }), { status: 401 });
  }

  // 2. Cast session.user as User to satisfy TypeScript
  const user = session.user as User;
  const userId = user._id;

  try {
    const { acceptMessages } = await request.json();
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { isAcceptingMessages: acceptMessages },
      { new: true },
    );

    if (!updatedUser) {
      return new Response(JSON.stringify({
        success: false,
        message: "User not found."
      }), { status: 404 });
    }

    return new Response(JSON.stringify({
      success: true,
      message: "User status updated successfully.",
      updatedUser
    }), { status: 200 });
  } catch (error) {
    console.error("failed to update user status:", error);
    return new Response(JSON.stringify({
      success: false,
      message: "An error occurred while updating user status."
    }), { status: 500 });
  }
}

export async function GET(request: Request) {
  await dbConnect();
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return new Response(JSON.stringify({
      success: false,
      message: "Unauthorized"
    }), { status: 401 });
  }

  // 3. APPLY TYPE ASSERTION HERE AS WELL
  const user = session.user as User;
  const userId = user._id;

  try {
    const foundUser = await UserModel.findById(userId);
    if (!foundUser) {
      return new Response(JSON.stringify({
        success: false,
        message: "User not found."
      }), { status: 404 });
    }
    return new Response(JSON.stringify({
      success: true,
      message: "User found.",
      isAcceptingMessages: foundUser.isAcceptingMessages
    }), { status: 200 });
  } catch (error) {
    console.error("failed to get user status:", error);
    return new Response(JSON.stringify({
      success: false,
      message: "An error occurred while getting user status."
    }), { status: 500 });
  }
}