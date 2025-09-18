import { NextResponse, NextRequest } from 'next/server';
import openai from '@/config/OpenAiModel';
import { AIDoctorAgents } from '@/shared/list';

export async function POST(req: NextRequest) {
    try {
        const { notes } = await req.json();
        if (!notes) {
            return NextResponse.json({ error: 'Notes are required.' }, { status: 400 });
        }

        const completion = await openai.chat.completions.create({
            model: 'google/gemini-2.0-flash-exp:free',
            messages: [
                {
                    role: 'system',
                    content: JSON.stringify(AIDoctorAgents)
                },
                {
                    role: 'user',
                    content: `User Notes/Symptoms: ${notes}, Depends on user notes and symptoms, Please suggest list of doctors. Return Object in JSON format.`,
                },
            ],
        });

        const rawResp = completion.choices[0].message;
        console.log('Raw Response:', rawResp);
      
        const Resp = rawResp.content?.trim().replace('```json', '').replace('```', '') || '{}';
        const JsonResp = JSON.parse(Resp);

        return NextResponse.json(JsonResp);

    } catch (error) {
        return NextResponse.json(
            { error: error instanceof Error ? error.message : String(error) },
            { status: 500 }
        );
    }
}
