import { GoogleGenerativeAI, GenerativeModel, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
  
const apiKey: string | undefined = process.env.GEMINI_API_KEY;
if (!apiKey) throw new Error("API key is missing.");

  const genAI = new GoogleGenerativeAI(apiKey);
  
  const model: GenerativeModel = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
  });
  
  const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 8192,
    responseMimeType: "application/json",
  };
  
    export const chatSession = model.startChat({
      generationConfig,
      history: [
        {
          role: "user",
          parts: [
            {text: "write a script to generate 30 seconds video on topic: Interesting historical story along with AI image prompt in Realistic format for each scene and give me result in JSON format with imagePrompt and ContentText as field "},
          ],
        },
        {
          role: "model",
          parts: [
            {text: "```json\n[\n  {\n    \"imagePrompt\": \"A bustling marketplace in ancient Rome, with merchants selling goods and people going about their daily lives. Focus on the details of the market, the clothing, and the architecture.\",\n    \"ContentText\": \"In the heart of ancient Rome, a bustling marketplace teemed with life. Merchants hawked their wares, their voices mingling with the clanging of metal and the rhythmic thud of hooves on cobblestone. Amidst the chaos, a young man named Caius stood, his eyes scanning the crowds.\"\n  },\n  {\n    \"imagePrompt\": \"Caius, a young Roman man with a determined expression, looking intently at a group of merchants selling exotic spices. He is dressed in simple but well-worn clothes.\",\n    \"ContentText\": \"Caius was no ordinary merchant. He sought not gold or jewels, but knowledge. He yearned to learn the secrets of the world beyond Rome's borders, and his heart was set on acquiring a rare spice rumored to hold medicinal properties.\"\n  },\n  {\n    \"imagePrompt\": \"A close-up of a jar of vibrant, exotic spices. The scene is dimly lit, adding to the mystery and allure of the spices.\",\n    \"ContentText\": \"The spice, known as 'Cinnabar,' was said to possess miraculous healing powers. It was a treasure coveted by emperors and healers alike, and its origins were shrouded in mystery.\"\n  },\n  {\n    \"imagePrompt\": \"A shadowy figure, shrouded in a cloak, whispering to Caius in the bustling marketplace. The figure's face is hidden, adding to the sense of intrigue.\",\n    \"ContentText\": \"One day, Caius was approached by a mysterious stranger. The figure's voice was low and gravelly, speaking of a secret route to the land where Cinnabar was grown.\"\n  },\n  {\n    \"imagePrompt\": \"Caius, looking apprehensive but determined, listening to the mysterious figure. The scene is dimly lit, creating an atmosphere of suspense.\",\n    \"ContentText\": \"Caius felt a thrill of excitement mixed with apprehension. He knew the journey would be dangerous, but the lure of the spice was too strong to resist.\"\n  },\n  {\n    \"imagePrompt\": \"A map of the ancient world, with a route highlighted in red leading from Rome to a distant land. The map is old and worn, suggesting its age and importance.\",\n    \"ContentText\": \"The stranger provided Caius with a cryptic map and a whispered warning. He was told to seek out a hidden oasis, guarded by fierce tribesmen, where the Cinnabar plant grew.\"\n  },\n  {\n    \"imagePrompt\": \"Caius, with a determined expression, preparing for his journey. He packs his supplies and adjusts his clothing, ready for the adventure ahead.\",\n    \"ContentText\": \"Caius, fueled by ambition and a burning desire for knowledge, set out on his perilous quest. He knew the journey would be long and fraught with danger, but he was determined to find the Cinnabar and unlock its secrets.\"\n  }\n]\n```\n\n**Explanation:**\n\nThis JSON array contains objects for each scene, with two fields:\n\n* **imagePrompt:** A detailed description for an AI image generator to create a realistic image that corresponds to the scene.\n* **ContentText:** The narration for the scene, providing the historical context and story elements.\n\n**Using the script:**\n\n1. **Choose an AI image generator:** There are many available, such as Midjourney, DALL-E 2, and Stable Diffusion. \n2. **Input the image prompts:** Feed each \"imagePrompt\" into the chosen AI image generator.\n3. **Generate images:** The AI will produce images based on the prompts.\n4. **Assemble the video:** Use a video editing software to combine the generated images and add the corresponding \"ContentText\" as narration.\n\n**Note:**\n\n* The number of scenes and duration of each scene can be adjusted to create a 30-second video.\n* You can further refine the image prompts and narration to enhance the story and visuals.\n* For more realism, consider using historical references and details in your content.\n* The AI image generator will determine the visual style and quality of the generated images. \n"},
          ],
        },
      ],
    });