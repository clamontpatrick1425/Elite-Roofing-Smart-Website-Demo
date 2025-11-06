import { GoogleGenAI, Chat, Type, Blob as GenAIBlob } from "@google/genai";
import { CHATBOT_SYSTEM_INSTRUCTION } from '../constants';
import { EstimateFormData, ChatMessage } from '../types';

let ai: GoogleGenAI;
let chat: Chat;

const getAI = () => {
  if (!ai) {
    if (!process.env.API_KEY) {
      throw new Error("API_KEY environment variable not set");
    }
    ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }
  return ai;
};

const initializeChat = () => {
    if (!chat) {
        const aiInstance = getAI();
        chat = aiInstance.chats.create({
            model: 'gemini-2.5-flash',
            config: {
                systemInstruction: CHATBOT_SYSTEM_INSTRUCTION,
            },
        });
    }
}

// FIX: Removed unused history parameter. The chat object maintains its own history.
export const sendMessageToChatbot = async (message: string): Promise<string> => {
    try {
        initializeChat();
        const response = await chat.sendMessage({ message });
        return response.text;
    } catch (error) {
        console.error("Error sending message to chatbot:", error);
        return "I'm sorry, I'm having trouble connecting right now. Please try again in a moment.";
    }
};

const fileToGenerativePart = async (file: File) => {
    const base64EncodedDataPromise = new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
        reader.readAsDataURL(file);
    });
    return {
        inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
    };
}

export const analyzeRoofImage = async (imageFile: File): Promise<string> => {
    try {
        const aiInstance = getAI();
        const imagePart = await fileToGenerativePart(imageFile);
        const textPart = {
            text: `Analyze the provided image of a roof. As a roofing expert, identify potential issues such as missing, cracked, or curled shingles, algae or moss growth, damaged flashing, or signs of water damage. Provide a bullet-point summary of your findings using asterisks, followed by a 'Recommendation' paragraph. Keep the tone helpful and professional. If the image is not a roof, state that you cannot analyze it and ask for a picture of a roof.`
        };

        const response = await aiInstance.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: [imagePart, textPart] },
        });

        return response.text;
    } catch (error) {
        console.error("Error analyzing roof image:", error);
        throw new Error("Failed to analyze the roof image. Please try again later.");
    }
};

export const analyzeRoofVideo = async (videoFile: File): Promise<string> => {
    try {
        const aiInstance = getAI();
        const videoPart = await fileToGenerativePart(videoFile);
        const textPart = {
            text: `Analyze the provided video of a roof. As a roofing expert, carefully review the footage. Identify potential issues such as missing, cracked, or curled shingles, algae or moss growth, damaged flashing, signs of water damage, or any other visible defects. Provide a bullet-point summary of your findings using asterisks, followed by a 'Recommendation' paragraph. Keep the tone helpful and professional. If the video does not show a roof, state that you cannot analyze it and ask for a video of a roof.`
        };

        const response = await aiInstance.models.generateContent({
            model: 'gemini-2.5-pro', // Using a more capable model for video
            contents: { parts: [videoPart, textPart] },
        });

        return response.text;
    } catch (error) {
        console.error("Error analyzing roof video:", error);
        throw new Error("Failed to analyze the roof video. Please try again later. This can be due to video length or format.");
    }
};

// FIX: Renamed function from getAI-Estimate to getAIEstimate to be a valid identifier.
export const getAIEstimate = async (formData: EstimateFormData) => {
    try {
        const aiInstance = getAI();
        const prompt = `
            You are an expert AI roofing cost estimator for a company in a high-cost-of-living area like Southern California.
            Generate a rough, non-binding cost estimate range for a roof project based on the following data.
            The estimate should be for labor and materials.

            Project Data:
            - Roof Material: ${formData.roofType}
            - Square Footage: ${formData.sqft} sq ft
            - Roof Slope: ${formData.slope}
            - Number of Stories: ${formData.stories}
            - Location Zip Code: ${formData.zipCode}

            Please provide the estimate in a JSON format. The JSON object should have three keys:
            1. 'lowEstimate': A number representing the lower end of the cost range.
            2. 'highEstimate': A number representing the higher end of the cost range.
            3. 'explanation': A brief (2-3 sentences) user-friendly explanation of the estimate, mentioning the key factors that influence the cost, and emphasizing that this is a preliminary estimate and a formal quote requires an on-site inspection.

            Base your estimate on typical costs for premium materials and labor in an affluent area. Be realistic.
        `;
        
        const response = await aiInstance.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        lowEstimate: { type: Type.NUMBER },
                        highEstimate: { type: Type.NUMBER },
                        explanation: { type: Type.STRING },
                    },
                    required: ["lowEstimate", "highEstimate", "explanation"],
                },
            },
        });
        
        const jsonString = response.text.trim();
        const result = JSON.parse(jsonString);
        return result;

    } catch (error) {
        console.error("Error getting AI estimate:", error);
        throw new Error("Failed to generate an AI-powered estimate. Please check your inputs or try again later.");
    }
};


// Helper functions for Live API audio processing
function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

export function createBlob(data: Float32Array): GenAIBlob {
  const l = data.length;
  const int16 = new Int16Array(l);
  for (let i = 0; i < l; i++) {
    int16[i] = data[i] * 32768;
  }
  return {
    data: encode(new Uint8Array(int16.buffer)),
    mimeType: 'audio/pcm;rate=16000',
  };
}