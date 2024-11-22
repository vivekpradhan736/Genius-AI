// npm install assemblyai

import { AssemblyAI } from "assemblyai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
         const { audioFileUrl } = await req.json();
   const client = new AssemblyAI({
     apiKey: process.env.CAPTION_API,
   });

   const audioUrl = audioFileUrl;

   const config = {
     audio_url: audioUrl,
   };

  
     const transcript = await client.transcripts.transcribe(config);
        console.log(transcript.words);
        return NextResponse.json({'result':transcript.words})
    }
    catch(err) {
       return NextResponse.json({'error':err}) 
    }
}