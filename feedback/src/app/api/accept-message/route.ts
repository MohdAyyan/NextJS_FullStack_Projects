import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import connectToDatabase from "@/lib/dbConnect";
import UserModel from "@/model/user.model";
import { User } from "next-auth";

export async function POST(request: Request) {
  await connectToDatabase();
  const session = await getServerSession(authOptions);
  const user: User = session?.user;
  if (!session || !session.user) {
    return Response.json({ error: "User not authenticated" }, { status: 401 });
  }
  const userId = user._id;
  const { acceptMessage } = await request.json();
  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      {
        $set: {
          isAcceptingMessages: acceptMessage,
        },
      },
      { new: true }
    );

    if (!updatedUser) {
      return Response.json({ error: "Failed to update user" }, { status: 500 });
    }

    return Response.json(
      { message: "User updated successfully", user: updatedUser },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return Response.json(
      { error: "Failed to accept message" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  await connectToDatabase();
  const session = await getServerSession(authOptions);
  const user: User = session?.user;
  if (!session || !session.user) {
    return Response.json({ error: "User not authenticated" }, { status: 401 });
  }
  const userId = user._id;
  try {
    const user = await UserModel.findById(userId);
    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    return Response.json(
      {
        message: "User fetched successfully",
        isAcceptingMessages: user.isAcceptingMessages,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Failed to fetch user", error);
    return Response.json(
      {
        message: "Failed to fetch user",
        error: "Failed to fetch user for acceptance message",
      },
      { status: 500 }
    );
  }
}
