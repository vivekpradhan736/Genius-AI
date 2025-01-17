import { NextResponse } from "next/server";
import fetch from 'node-fetch';
import puppeteer from 'puppeteer';
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import xml2js from 'xml2js';

import { increaseApiLimit, checkApiLimit } from "@/lib/api-limit";
import { checkSubscription } from '@/lib/subscription';

// Extend the global object to include ytInitialPlayerResponse
global.ytInitialPlayerResponse = null;

const model = new ChatGoogleGenerativeAI({
  model: "gemini-pro",
  apiKey: "AIzaSyCSDGHe_Lcceu5j_Ukvcwg117rJSutotQY",
  maxOutputTokens: 2048
});

async function getYouTubeTranscript(videoUrl) {
  try {
    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      timeout: 30000,
    });
    const page = await browser.newPage();

    console.log("Navigating to video URL...");
    await page.goto(videoUrl, { waitUntil: 'networkidle2', timeout: 30000 });

    const transcriptUrl = await page.evaluate(() => {
      const playerResponse = window.ytInitialPlayerResponse;
      const captionTracks = playerResponse?.captions?.playerCaptionsTracklistRenderer?.captionTracks;

      if (!captionTracks || captionTracks.length === 0) {
        throw new Error('No captions available for this video.');
      }

      const selectedTrack = captionTracks.find((track) => track.kind === 'asr') || captionTracks[0];
      return selectedTrack.baseUrl;
    });

    await browser.close();
    console.log("Transcript URL found: ", transcriptUrl);

    const response = await fetch(transcriptUrl);
    const xmlData = await response.text();
    console.log("Fetched transcript XML data");

    let transcript = '';
    await xml2js.parseString(xmlData, { explicitArray: false }, (err, result) => {
      if (err) {
        console.error("Error parsing XML:", err.message);
        throw new Error('Error parsing XML: ' + err.message);
      }
      const textArray = result.transcript.text;

      if (textArray && Array.isArray(textArray)) {
        transcript = textArray.map(text => text._).join(' ');
      } else {
        throw new Error('Unexpected transcript structure.');
      }
    });

    return transcript;
  } catch (error) {
    console.error("Error in getYouTubeTranscript:", error.message);
    throw error;
  }
}

async function summarizeVideo(videoUrl) {
  try {
    console.log("Starting summarization process...");
    const transcript = await getYouTubeTranscript(videoUrl);
    console.log("Transcript: ", transcript);

    const summary = await model.invoke(`Summarize this transcript: ${transcript}`);
    console.log("Generated summary: ", summary);

    return summary;
  } catch (error) {
    console.error("Error during summarization:", error.message);
    throw new Error(`Summarization failed: ${error.message}`);
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { prompt } = body;

    if (!prompt) {
      return new NextResponse("Prompt is required!", { status: 400 });
    }

    const freeTrial = await checkApiLimit();
    const isPro = await checkSubscription();

    if (!freeTrial && !isPro) {
      return new NextResponse("Free trial has expired.", { status: 403 });
    }

    const summaryResponse = await summarizeVideo(prompt);
    const summary = summaryResponse;

    if (!isPro) {
      await increaseApiLimit();
    }

    return NextResponse.json(summary);
  } catch (error) {
    console.error("❌ (route.js) [API_VIDEO_SUMMARY_ERROR]: ", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
