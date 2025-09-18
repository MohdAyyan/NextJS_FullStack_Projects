import User, { IUser } from "@/models/User.model";
import { connectToDatabase } from "@/lib/db";

export async function POST(request: Request) {
  try {
   
    const body: IUser = await request.json();

    if (!body.email || !body.password) {
      return Response.json(
        {
          error: "Both email and password are required",
        },
        { status: 400 }
      );
    }
    await connectToDatabase();

    const existingUser = await User.findOne({ email: body.email });

    if (existingUser) {
      return Response.json(
        {
          error: "User already exists",
        },
        { status: 400 }
      );
    }
    
    const user = await User.create({
      email: body.email,
      password: body.password,
    });

    return Response.json(user);
    
  } catch (error) {
    console.error("Error registering user: ", error);

    return Response.json(
      {
        error: "Failed to register user",
      },
      { status: 500 }
    );
  }
}