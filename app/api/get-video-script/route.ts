import { chatSession } from "@/lib/AiModel";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { prompt } = await req.json();
        console.log(prompt);

        const result = await chatSession.sendMessage(prompt);
        console.log(result.response.text());
        const responseText = await result.response.text();
        return NextResponse.json({ result: JSON.parse(responseText) });
        
    } catch (e) {
         return NextResponse.json({'Error':e})
    }
}