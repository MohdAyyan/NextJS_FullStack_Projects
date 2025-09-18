import { NextResponse } from "next/server";
import UserModel from "@/model/user.model";
import dbConnect from "@/lib/dbConnect";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helper/sendVerificationEmail";

export async function POST(request: Request) {
    try {
        await dbConnect();
        const { email, username, password } = await request.json();

        if (!email || !username || !password) {
            return NextResponse.json(
                { error: "All fields are required" },
                { status: 400 }
            );
        }

        const existingUser = await UserModel.findOne({ email });
        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

        if (existingUser) {
            return NextResponse.json(
                { error: "Email already exists" },
                { status: 409 }
            );
        }

        // Create new user
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new UserModel({
            username,
            email,
            password: hashedPassword,
            verifyCode,
            verifyCodeExpire: new Date(Date.now() + 3600000), // 1 hour
            isVerified: false
        });

        await newUser.save();

        // Send verification email
        const emailResponse = await sendVerificationEmail(email, username, verifyCode);

        if (!emailResponse.success) {
            return NextResponse.json(
                { error: "Error sending verification email" },
                { status: 500 }
            );
        }

        return NextResponse.json(
            { 
                message: "User registered successfully",
                userId: newUser._id 
            },
            { status: 201 }
        );

    } catch (error: any) {
        console.error("Signup error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}