import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/option";
import dbConnect from "@/src/lib/dbConnect";
import UserModel from "@/src/model/User";
import { User } from "next-auth";
import mongoose from "mongoose";

export async function GET(request: Request) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  const user = session?.user as User;

  if (!session || !session.user) {
    return new Response(JSON.stringify({ success: false, message: "Not Authenticated" }), { status: 401 });
  }

  // Convert string ID to MongoDB ObjectId
  const userId = new mongoose.Types.ObjectId(user._id);

  try {
    const userWithMessages = await UserModel.aggregate([
      { $match: { _id: userId } },
      { $unwind: { path: '$messages', preserveNullAndEmptyArrays: true } },
      { $sort: { 'messages.createdAt': -1 } },
      { $group: { _id: '$_id', messages: { $push: '$messages' } } }
    ]);

    // IMPORTANT: Aggregation returns an array. We need the first element [0]
    if (!userWithMessages || userWithMessages.length === 0) {
      return new Response(JSON.stringify({ success: true, messages: [] }), { status: 200 });
    }

    return new Response(JSON.stringify({
      success: true,
      messages: userWithMessages[0].messages // Access the first element
    }), { status: 200 });

  } catch (error) {
    console.error("Fetch Error:", error);
    return new Response(JSON.stringify({ success: false, message: "Error fetching messages" }), { status: 500 });
  }
}

