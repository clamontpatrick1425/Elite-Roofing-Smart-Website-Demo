import { GoogleGenAI, Chat, Type, Blob as GenAIBlob } from "@google/genai";
import { CHATBOT_SYSTEM_INSTRUCTION } from '../constants';
import { EstimateFormData, ChatbotResponse } from '../types';

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
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        reply: { type: Type.STRING },
                        suggestedQuestions: {
                            type: Type.ARRAY,
                            items: { type: Type.STRING }
                        }
                    },
                    required: ["reply", "suggestedQuestions"]
                }
            },
        });
    }
}

export const sendMessageToChatbot = async (message: string, imageFile?: File): Promise<ChatbotResponse> => {
    try {
        initializeChat();
        
        let response;
        if (imageFile) {
            const imagePart = await fileToGenerativePart(imageFile);
            // Construct a multipart message
            response = await chat.sendMessage({ 
                message: { 
                    role: 'user', 
                    parts: [imagePart, { text: message || "Analyze this image." }] 
                } 
            });
        } else {
             response = await chat.sendMessage({ message });
        }

        const jsonString = response.text?.trim() || "{}";
        
        let parsedResult: any;
        try {
            parsedResult = JSON.parse(jsonString);
        } catch (parseError) {
            console.error("Error parsing JSON response from AI:", parseError, "Raw response:", jsonString);
            return {
                reply: jsonString || "I'm sorry, I received an unusual response. Please try again.",
                suggestedQuestions: ["What services do you offer?", "Can I get a free estimate?", "Do you handle storm damage?"]
            };
        }

        const reply = typeof parsedResult.reply === 'string' ? parsedResult.reply : "I'm sorry, I couldn't formulate a proper response. Please ask me something else.";
        const suggestedQuestions = Array.isArray(parsedResult.suggestedQuestions)
            ? parsedResult.suggestedQuestions.filter((q: any): q is string => typeof q === 'string')
            : [];

        return {
            reply,
            suggestedQuestions
        };

    } catch (error) {
        console.error("Error sending message to chatbot API:", error);
        return {
            reply: "I'm sorry, I'm having trouble connecting right now. Please try again in a moment.",
            suggestedQuestions: ["What services do you offer?", "How can I contact support?"]
        };
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

        return response.text || "No analysis could be generated.";
    } catch (error) {
        console.error("Error analyzing roof image:", error);
        throw error;
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
            model: 'gemini-2.5-pro', 
            contents: { parts: [videoPart, textPart] },
        });

        return response.text || "No video analysis could be generated.";
    } catch (error) {
        console.error("Error analyzing roof video:", error);
        throw error;
    }
};

export const getAIEstimate = async (formData: EstimateFormData) => {
    try {
        const aiInstance = getAI();
        const prompt = `
            You are an expert AI roofing cost estimator.
            Generate a rough, non-binding cost estimate range for a roof project based on the following data.
            Project Data:
            - Roof Material: ${formData.roofType}
            - Square Footage: ${formData.sqft} sq ft
            - Roof Slope: ${formData.slope}
            - Number of Stories: ${formData.stories}
            - Location Zip Code: ${formData.zipCode}

            Please provide the estimate in a JSON format with 'lowEstimate', 'highEstimate', and 'explanation'.
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
        
        const jsonString = response.text?.trim() || "{}";
        return JSON.parse(jsonString);
    } catch (error) {
        console.error("Error getting AI estimate:", error);
        throw error;
    }
};

export const generateHeroImage = async (prompt: string): Promise<string> => {
    try {
        const aiInstance = getAI();
        const fullPrompt = `A beautiful, photorealistic image of a house roof for a roofing company website hero section. Prompt: "${prompt}"`;
        
        const response = await aiInstance.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: fullPrompt,
            config: {
              numberOfImages: 1,
              outputMimeType: 'image/jpeg',
              aspectRatio: '16:9',
            },
        });

        const base64ImageBytes = response.generatedImages?.[0]?.image?.imageBytes;
        if (!base64ImageBytes) throw new Error("No image data received from API.");
        return `data:image/jpeg;base64,${base64ImageBytes}`;
    } catch (error) {
        console.error("Error generating hero image:", error);
        throw error;
    }
};

export const generateHeroVideo = async (prompt: string): Promise<string> => {
    try {
        const aiInstance = new GoogleGenAI({ apiKey: process.env.API_KEY });
        
        // Use the 'fast' model as it might have higher availability/different quota limits
        let operation = await aiInstance.models.generateVideos({
          model: 'veo-3.1-fast-generate-preview',
          prompt: prompt,
          config: {
            numberOfVideos: 1,
            resolution: '1080p',
            aspectRatio: '16:9'
          }
        });

        while (!operation.done) {
          await new Promise(resolve => setTimeout(resolve, 5000));
          operation = await aiInstance.operations.getVideosOperation({operation: operation});
        }
        
        if (operation.error) {
            throw operation.error;
        }

        const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
        if (!downloadLink) {
            throw new Error("Video generation completed but no video URI was returned.");
        }

        const separator = downloadLink.includes('?') ? '&' : '?';
        const response = await fetch(`${downloadLink}${separator}key=${process.env.API_KEY}`);
        
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to fetch video: ${response.status} - ${errorText}`);
        }
        
        const blob = await response.blob();
        return URL.createObjectURL(blob);
    } catch (error: any) {
        console.error("Error generating hero video:", error);
        throw error;
    }
};

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