
import { GoogleGenAI, Chat, Type, Blob as GenAIBlob, Modality, GenerateContentResponse } from "@google/genai";
import { CHATBOT_SYSTEM_INSTRUCTION } from '../constants';
import { EstimateFormData } from '../types';

// Helper to initialize AI instance with the provided API key.
const createAIInstance = () => {
  const apiKey = (process.env.API_KEY || "").trim();
  if (!apiKey) {
    throw new Error("API_KEY_MISSING");
  }
  return new GoogleGenAI({ apiKey });
};

let activeChatSession: Chat | null = null;

export const resetChatSession = () => {
  activeChatSession = null;
};

// Helper to get or create a chat session with system instructions and JSON schema.
const getChatSession = (ai: GoogleGenAI) => {
  if (!activeChatSession) {
    activeChatSession = ai.chats.create({
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction: CHATBOT_SYSTEM_INSTRUCTION + "\nIMPORTANT: Your entire response must be a single valid JSON object. Do not include any text outside the JSON structure.",
        responseMimeType: "application/json",
        tools: [{ googleSearch: {} }],
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            reply: { type: Type.STRING },
            suggestedQuestions: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            appointmentSummary: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                address: { type: Type.STRING },
                time: { type: Type.STRING },
                email: { type: Type.STRING },
                phone: { type: Type.STRING }
              }
            }
          },
          required: ["reply"]
        }
      },
    });
  }
  return activeChatSession;
};

// Centralized error handling for Gemini API responses.
export const handleApiError = (error: any) => {
  let message = "An unexpected error occurred.";
  let status = "N/A";
  let fullLog = "";

  try {
    if (typeof error === 'string') {
      message = error;
      fullLog = error;
    } else if (error instanceof Error) {
      message = error.message;
      status = String((error as any).status || (error as any).code || "N/A");
      fullLog = `${error.name}: ${error.message}`;
    } else if (typeof error === 'object' && error !== null) {
      const deepError = error.error || error;
      message = deepError.message || deepError.description || "Unknown Object Error";
      status = String(deepError.status || deepError.code || deepError.errorCode || "N/A");
      fullLog = JSON.stringify(error);
    }
  } catch (e) {
    message = "Error parsing API response details.";
    fullLog = "Failed to stringify error object.";
  }

  console.error(`Gemini API Error Detail: ${message}`);
  const errorStr = (fullLog + " " + message).toLowerCase();

  if (errorStr.includes("requested entity was not found") || errorStr.includes("api key not found")) {
      resetChatSession();
      throw new Error("ENTITY_NOT_FOUND");
  }

  if (status === "503" || status === "504" || errorStr.includes("deadline expired") || errorStr.includes("deadline exceeded") || errorStr.includes("unavailable")) {
      throw new Error("TRANSIENT_ERROR");
  }

  if (status === "429" || errorStr.includes("quota") || errorStr.includes("limit exceeded") || errorStr.includes("rate limit") || errorStr.includes("resource_exhausted")) {
    resetChatSession();
    throw new Error("QUOTA_EXHAUSTED");
  }
  
  if (status === "400" || status === "401" || status === "403" || errorStr.includes("expired") || errorStr.includes("invalid") || errorStr.includes("permission")) {
    resetChatSession();
    throw new Error("INVALID_KEY_OR_PROJECT");
  }

  throw new Error(message);
};

// Exponential backoff retry logic.
async function withRetry<T>(fn: () => Promise<T>, retries = 2, delay = 1000): Promise<T> {
  try {
    return await fn();
  } catch (error: any) {
    const isRetryable = error.message === "QUOTA_EXHAUSTED" || error.message === "TRANSIENT_ERROR";
    if (retries > 0 && isRetryable) {
      console.log(`Retrying API call (${retries} retries left)...`);
      await new Promise(r => setTimeout(r, delay));
      return withRetry(fn, retries - 1, delay * 2);
    }
    throw error;
  }
}

const extractJson = (text: string) => {
    try {
        return JSON.parse(text);
    } catch (e) {
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            try {
                return JSON.parse(jsonMatch[0]);
            } catch (innerE) {
                const clean = jsonMatch[0].replace(/^```json\n?/, '').replace(/\n?```$/, '');
                try {
                    return JSON.parse(clean);
                } catch (finalE) {
                    return null;
                }
            }
        }
    }
    return null;
};

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};

const encode = (bytes: Uint8Array) => {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
};

export const sendMessageToChatbotStream = async (
  message: string,
  onChunk: (text: string) => void
): Promise<any> => {
  return withRetry(async () => {
    try {
      const ai = createAIInstance();
      const chat = getChatSession(ai);

      const result = await chat.sendMessageStream({ message });
      let fullText = "";
      let lastExtractedReply = "";

      for await (const chunk of result) {
        const chunkText = (chunk as GenerateContentResponse).text || "";
        fullText += chunkText;

        const replyMatch = fullText.match(/"reply":\s*"((?:[^"\\]|\\.)*)"/);
        if (replyMatch && replyMatch[1]) {
          const currentReply = replyMatch[1].replace(/\\n/g, '\n').replace(/\\"/g, '"');
          if (currentReply.length > lastExtractedReply.length) {
            onChunk(currentReply.substring(lastExtractedReply.length));
            lastExtractedReply = currentReply;
          }
        }
      }

      const parsed = extractJson(fullText);
      if (parsed) return parsed;
      
      return { reply: lastExtractedReply || "I'm Hannah, how can I help?" };
    } catch (error: any) {
      return handleApiError(error);
    }
  });
};

export const generateComparisonImage = async (prompt: string, imageBase64?: string): Promise<string> => {
  return withRetry(async () => {
    try {
      const ai = createAIInstance();
      let contents;

      if (imageBase64) {
        const data = imageBase64.includes(',') ? imageBase64.split(',')[1] : imageBase64;
        const mimeType = imageBase64.includes(';') ? imageBase64.split(';')[0].split(':')[1] : 'image/jpeg';
        
        contents = {
            parts: [
                {
                    text: `Create a side-by-side comparison image. Left side: The original provided image. Right side: The same scene but with this change: ${prompt}. Maintain exact camera angle, lighting, and environment.`
                },
                {
                    inlineData: {
                        mimeType: mimeType,
                        data: data
                    }
                }
            ]
        };
      } else {
        contents = { 
            parts: [{ 
                text: `Create a high-resolution, side-by-side before and after comparison of a residential home. Left side (Before): ${prompt.split(' vs ')[0]}. Right side (After): ${prompt.split(' vs ')[1] || 'Brand new premium roof'}. Style: Cinematic wide drone shot, 45-degree angle, professional real estate photography.` 
            }] 
        };
      }

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: contents,
        config: { imageConfig: { aspectRatio: "16:9" } }
      });
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) return `data:image/png;base64,${part.inlineData.data}`;
      }
      throw new Error("No image generated.");
    } catch (error: any) {
      return handleApiError(error);
    }
  });
};

export const generateHeroImage = async (prompt: string): Promise<string> => {
  return withRetry(async () => {
    try {
        const ai = createAIInstance();
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: { parts: [{ text: prompt }] },
            config: { imageConfig: { aspectRatio: "16:9" } }
        });
        for (const part of response.candidates[0].content.parts) if (part.inlineData) return `data:image/png;base64,${part.inlineData.data}`;
        throw new Error("No image.");
    } catch (error) { return handleApiError(error); }
  });
};

export const generateHeroVideo = async (prompt: string): Promise<string> => {
    return withRetry(async () => {
        try {
            let ai = createAIInstance();
            let op = await ai.models.generateVideos({
              model: 'veo-3.1-fast-generate-preview',
              prompt,
              config: { numberOfVideos: 1, resolution: '1080p', aspectRatio: '16:9' }
            });
            
            while (!op.done) {
              await new Promise(r => setTimeout(r, 10000));
              try {
                // Re-initialize to ensure we have valid project context for polling
                ai = createAIInstance();
                op = await ai.operations.getVideosOperation({operation: op});
              } catch (pollError: any) {
                  const pollMsg = String(pollError).toLowerCase();
                  if (pollMsg.includes("unavailable") || pollMsg.includes("503") || pollMsg.includes("deadline")) {
                      console.warn("Transient poll error, continuing...");
                      continue;
                  }
                  throw pollError;
              }
            }
            
            if (op.error) {
                const errorMsg = String(op.error.message || op.error).toLowerCase();
                if (errorMsg.includes("permission") || errorMsg.includes("unsupported") || errorMsg.includes("billing")) {
                    throw new Error("VIDEO_NOT_SUPPORTED");
                }
                throw new Error(op.error.message || "Video operation failed");
            }

            const link = op.response?.generatedVideos?.[0]?.video?.uri;
            if (!link) {
              throw new Error("Video generation produced no output. This might be due to safety filters.");
            }
            
            // Get the latest API key just before the download fetch
            const apiKey = (process.env.API_KEY || "").trim();
            const downloadUrl = link.includes('?') 
                ? `${link}&key=${encodeURIComponent(apiKey)}` 
                : `${link}?key=${encodeURIComponent(apiKey)}`;
            
            console.log("Attempting to download video from Veo...");
            const res = await fetch(downloadUrl, { mode: 'cors' });
            
            if (!res.ok) {
                console.error("Video download fetch failed:", res.status, res.statusText);
                if (res.status === 400 || res.status === 403) throw new Error("INVALID_KEY_OR_PROJECT");
                throw new Error(`Download failed: HTTP ${res.status}`);
            }

            const blob = await res.blob();
            if (blob.size < 100) { // Unlikely small size for a video
              throw new Error("Downloaded video file is empty or corrupted.");
            }
            
            return URL.createObjectURL(blob);
        } catch (error: any) {
            throw handleApiError(error);
        }
    });
};

export const getAIEstimate = async (data: EstimateFormData) => {
  return withRetry(async () => {
    try {
      const ai = createAIInstance();
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Research current local roofing material prices and provide a replacement cost estimate for a ${data.stories} home with a ${data.roofType} roof, approximately ${data.sqft} sqft, in zip code ${data.zipCode}. Include local labor trends.`,
        config: {
          responseMimeType: "application/json",
          tools: [{ googleSearch: {} }],
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              lowEstimate: { type: Type.NUMBER },
              highEstimate: { type: Type.NUMBER },
              explanation: { type: Type.STRING }
            },
            required: ["lowEstimate", "highEstimate", "explanation"]
          }
        }
      });
      return JSON.parse(response.text || "{}");
    } catch (error: any) {
      return handleApiError(error);
    }
  });
};

export const analyzeRoofImage = async (file: File): Promise<string> => {
  return withRetry(async () => {
    try {
      const ai = createAIInstance();
      const base64Data = await fileToBase64(file);
      const data = base64Data.split(',')[1];
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [{
          parts: [
            { text: "Analyze this roof for damage, age, and material condition. Provide a summary of issues found in markdown format." },
            { inlineData: { mimeType: file.type, data: data } }
          ]
        }]
      });
      return response.text || "No analysis available.";
    } catch (error: any) {
      return handleApiError(error);
    }
  });
};

export const analyzeRoofVideo = async (file: File): Promise<string> => {
  return analyzeRoofImage(file);
};

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
