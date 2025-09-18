import connectToDatabase from "@/lib/dbConnect";
import UserModel from "@/model/user.model";
import { Message } from "@/model/user.model";


export async function POST(request: Request) {
    await connectToDatabase();
   const {username, content} = await request.json();
    try {
        const user = await UserModel.findOne({username})
        if (!user) {
            return Response.json({ error: "User not found" }, { status: 404 });
        }

        if(!user.isAcceptingMessages){
            return Response.json({ error: "User is not accepting messages" }, { status: 403 });
        }

        const newMessage = {content,createdAt: new Date()}
        user.messages.push(newMessage as Message);
        await user.save();
        return Response.json({
            message: "Message sent successfully",
            user: {
                username: user.username,
                messages: user.messages,
            },
        }, { status: 200
        })
    } catch (error) {
        console.log("Failed to send message", error);
        return Response.json(
            { error: "Failed to send message" },
            { status: 500 }
        );
    }
}