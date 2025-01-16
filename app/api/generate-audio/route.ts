// import { storage } from "@/configs/FirebaseConfig";
// import  textToSpeech from "@google-cloud/text-to-speech";
// import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
// import { NextResponse } from "next/server";

// const fs = require('fs');
// const util = require('util');
// const client = new textToSpeech.TextToSpeechClient({
// 	apiKey:process.env.TEXT-TO-SPEECH
// });

export async function POST() {
	// const { text, id } = await req.json();
	// const storageRef = ref(storage,'ai-video-generator/'+id+'.mp3')
	// const request = {
	// 	input: { text: text },
	// 	voice: { languageCode: 'en-US', ssmlGender: 'FEMALE' },
	// 	audioConfig: { audioEncoding: 'MP3' },
	// };
	// const [response] = await client.synthesizeSpeech(request);
	
	// const audioBuffer = Buffer.from(response.audioContent, 'binary');
	// await uploadBytes(storageRef, audioBuffer, { contentType: 'audio/mp3' });
	// const downloadUrl = await getDownloadURL(storageRef);
	// console.log(downloadUrl);
	
	// console.log('Audio content written to file:Output.mp3');

	// return NextResponse.json({ Result: downloadUrl });
	
}