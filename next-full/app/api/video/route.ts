import { NextResponse, NextRequest } from "next/server";
import Video, { IVideo } from "@/models/Video.model";
import { connectToDatabase } from "@/lib/db";
import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
export async function GET() {
    try {
        await connectToDatabase();
        const videos = await Video.find({}).sort({ createdAt: -1 }).lean(); 
        if (!videos || videos.length === 0) {
            return NextResponse.json([], { status: 200 });
          }
      
          return NextResponse.json(videos);

    } catch (error) {
        console.error("Error fetching videos: ", error);
        return NextResponse.json({
            error: "Failed to fetch videos"
        }, { status: 500 });
    }
}


export async function POST(request: NextRequest) {
    try {
        
        const session = await getServerSession(authOptions);
        if(!session){
            return NextResponse.json({
                error: "Unauthorized"
            }, { status: 401 });
        }

    await connectToDatabase();
     const body: IVideo = await request.json();
   
    if (!body.title || !body.description || !body.videoUrl || !body.thumbnailUrl) {
        return NextResponse.json({
            error: "All fields are required"
        }, { status: 400 });
        
    }

    const videoData =  {
        ...body,
        controls: body?.controls ?? true,
        transformation:{
            height: 1920,
            width: 1080,
            quality: body.transformation?.quality ?? 100,
        }
    }

    const uploadedVideo = await Video.create(videoData);

    return NextResponse.json(uploadedVideo, { status: 201 });

    } catch (error) {
        console.error("Error uploading video: ", error);
        return NextResponse.json({
            error: "Failed to upload video"
        }, { status: 500 });
    }
}