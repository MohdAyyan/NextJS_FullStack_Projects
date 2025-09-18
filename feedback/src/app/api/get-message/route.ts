import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import connectToDatabase from "@/lib/dbConnect";
import UserModel from "@/model/user.model";
import { User } from "next-auth";
import mongoose from "mongoose";

export async function GET(request: Request) {
  await connectToDatabase();
  const session = await getServerSession(authOptions);
  const user: User = session?.user;
  if (!session || !session.user) {
    return Response.json({ error: "User not authenticated" }, { status: 401 });
  }
  const userId = new mongoose.Types.ObjectId(user._id);
  try {
    const user = await UserModel.aggregate([
      {
        $match: {
          _id: userId,
        },
      },
      {
        $unwind: "$messages",
      },
      {
        $sort: {
          "messages.createdAt": -1,
        },
      },
        {
            $group: {
            _id: "$_id",
            messages: {
                $push: "$messages",
            },
            },
        },
    ]);

    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    return Response.json(
    {
        message: "User fetched successfully",
        user: user[0],
        },
        { status: 200}
    
    )

  } catch (error) {
    console.log("Failed to fetch user", error);
    return Response.json(
      { error: "Failed to fetch user" },
      { status: 500 }
    );
  }
}
