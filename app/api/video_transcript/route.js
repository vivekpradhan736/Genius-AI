import { NextResponse } from "next/server";
import puppeteer from "puppeteer";
import xml2js from "xml2js";

async function getYouTubeTranscriptWithTimestamps(videoUrl) {
  try {
    const browser = await puppeteer.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
      timeout: 30000,
    });
    const page = await browser.newPage();

    console.log("Navigating to video URL...");
    await page.goto(videoUrl, { waitUntil: "networkidle2", timeout: 30000 });

    const transcriptUrl = await page.evaluate(() => {
      const playerResponse = window.ytInitialPlayerResponse;
      const captionTracks =
        playerResponse?.captions?.playerCaptionsTracklistRenderer?.captionTracks;

      if (!captionTracks || captionTracks.length === 0) {
        throw new Error("No captions available for this video.");
      }

      const selectedTrack =
        captionTracks.find((track) => track.kind === "asr") || captionTracks[0];
      return selectedTrack.baseUrl;
    });

    await browser.close();
    console.log("Transcript URL found: ", transcriptUrl);

    const response = await fetch(transcriptUrl);
    const xmlData = await response.text();
    console.log("Fetched transcript XML data");

    let transcriptWithTimestamps = [];

    await xml2js.parseString(
      xmlData,
      { explicitArray: false },
      (err, result) => {
        if (err) {
          console.error("Error parsing XML:", err.message);
          throw new Error("Error parsing XML: " + err.message);
        }
        const textArray = result.transcript.text;

        if (textArray && Array.isArray(textArray)) {
          transcriptWithTimestamps = textArray.map((text) => ({
            text: text._,
            start: parseFloat(text.$.start), // Extracting the start time of each subtitle in seconds
          }));
        } else {
          throw new Error("Unexpected transcript structure.");
        }
      }
    );

    return transcriptWithTimestamps;
  } catch (error) {
    console.error("Error in getYouTubeTranscriptWithTimestamps:", error.message);
    throw error;
  }
}

function groupTranscriptByInterval(transcript, intervalInSeconds) {
  let groupedTranscript = [];
  let currentIntervalStart = 0;
  let currentText = "";

  transcript.forEach((entry) => {
    if (entry.start >= currentIntervalStart + intervalInSeconds) {
      // Push the accumulated text for the current interval
      groupedTranscript.push({
        intervalStart: currentIntervalStart,
        text: currentText,
      });
      // Start a new interval
      currentIntervalStart = entry.start;
      currentText = entry.text;
    } else {
      // Accumulate text within the current interval
      currentText += " " + entry.text;
    }
  });

  // Push the last interval's text
  if (currentText) {
    groupedTranscript.push({
      intervalStart: currentIntervalStart,
      text: currentText,
    });
  }

  return groupedTranscript;
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { prompt } = body;

    if (!prompt) {
      return new NextResponse("Prompt is required!", { status: 400 });
    }

    const transcript = await getYouTubeTranscriptWithTimestamps(prompt);
    const intervalTranscript = groupTranscriptByInterval(transcript, 25);

    console.log("intervalTranscript", intervalTranscript);

    return NextResponse.json(intervalTranscript);
  } catch (error) {
    console.error("❌ (route.js) [API_VIDEO_SUMMARY_ERROR]: ", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
