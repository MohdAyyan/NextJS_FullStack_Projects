import { connectToDatabase } from "@/lib/db";
import Video from "@/models/Video";
import { NextResponse } from "next/server";


export async function GET() {
    try {
        await connectToDatabase();
        const videos = await Video.find({}).sort({ createdAt: -1 }).limit(10);
        return NextResponse.json(videos);
    } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to fetch videos";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}


export async function POST(request: Request) {
    try {
        const videoData = await request.json();
        await connectToDatabase();
        const newVideo = new Video(videoData);
        await newVideo.save();
        return NextResponse.json(newVideo, { status: 201 });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to create video";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}