import { db } from "@/config/db";
import { SessionChatTable } from "@/config/schema";
import { v4 as uuidv4 } from "uuid";
import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { desc, eq } from "drizzle-orm";


export async function POST(req: NextRequest) {
    const {notes,selectedDoctor} = await req.json();
    const sessionId =uuidv4();
    const user = await currentUser();
    try {
       
        if(sessionId =="all"){
            const result = await db.select().from(SessionChatTable).where(eq(SessionChatTable.createdBy, user?.primaryEmailAddress?.emailAddress || '')).orderBy(desc(SessionChatTable.id));
            return NextResponse.json(result);
        }
        
       else{
        const result = await db.insert(SessionChatTable).values({
            sessionId:sessionId,
            createdBy:user?.primaryEmailAddress?.emailAddress || '',
            notes,
            selectedDoctor,
            createdOn:(new Date()).toString()
            //@ts-ignore
        }).returning({SessionChatTable})

        return NextResponse.json(result[0]?.SessionChatTable);
    }} catch (error: any) {
        
       return NextResponse.json({ error: error.message }, { status: 500 });
    }
}


export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const sessionId = searchParams.get("sessionId");
        if (!sessionId) {
            return NextResponse.json({ error: "Session ID is required" }, { status: 400 });
        }
        const user = await currentUser();
        
        const result = await db.select().from(SessionChatTable).where(eq(SessionChatTable.sessionId, sessionId))
        
        return NextResponse.json(result[0]);
    } catch (error : any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}