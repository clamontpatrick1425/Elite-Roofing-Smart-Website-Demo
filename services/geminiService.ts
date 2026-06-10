import { EstimateFormData } from '../types';

// Client-side helper to call the server API
const callServerApi = async (endpoint: string, body: any) => {
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error: any) {
    console.error(`API Error in ${endpoint}:`, error);
    throw error;
  }
};

// Generates an identifier to keep chat sessions separate on the server side
const getSessionId = () => {
  let id = localStorage.getItem('elite_roofing_session_id');
  if (!id) {
    id = Math.random().toString(36).substring(2) + Date.now().toString(36);
    localStorage.setItem('elite_roofing_session_id', id);
  }
  return id;
};

export const resetChatSession = async () => {
  const sessionId = getSessionId();
  try {
    await fetch('/api/gemini/reset-chat', {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId })
    });
  } catch (e) {
    console.error("Failed to reset chat session", e);
  }
};

export const sendMessageToChatbotStream = async (
  message: string,
  onChunk: (text: string) => void
): Promise<any> => {
  const sessionId = getSessionId();
  const response = await fetch('/api/gemini/chat-stream', {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, sessionId }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
  }

  const reader = response.body?.getReader();
  if (!reader) {
    throw new Error("No readable stream in response");
  }

  const decoder = new TextDecoder();
  let done = false;
  let buffer = '';

  while (!done) {
    const { value, done: doneReading } = await reader.read();
    done = doneReading;
    if (value) {
      buffer += decoder.decode(value, { stream: !done });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (line.trim().startsWith('data: ')) {
          try {
            const dataStr = line.trim().substring(6);
            const parsed = JSON.parse(dataStr);
            if (parsed.chunk) {
              onChunk(parsed.chunk);
            }
            if (parsed.full) {
              return parsed.full;
            }
            if (parsed.error) {
              throw new Error(parsed.error);
            }
          } catch (e: any) {
            if (e.message) throw e;
          }
        }
      }
    }
  }
};

export const generateComparisonImage = async (prompt: string, imageBase64?: string): Promise<string> => {
  const data = await callServerApi('/api/gemini/generate-comparison', { prompt, imageBase64 });
  return data.imageUrl;
};

export const generateHeroImage = async (prompt: string): Promise<string> => {
  const data = await callServerApi('/api/gemini/generate-hero-image', { prompt });
  return data.imageUrl;
};

export const generateHeroVideo = async (prompt: string): Promise<string> => {
  // Call Start
  const startRes = await fetch('/api/gemini/generate-video', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt })
  });
  if (!startRes.ok) {
    const errorData = await startRes.json().catch(() => ({}));
    throw new Error(errorData.error || "Failed to start video generation");
  }
  const { operationName } = await startRes.json();
  
  // Call Poll in a loop
  let done = false;
  while (!done) {
    await new Promise(r => setTimeout(r, 6000));
    const statusRes = await fetch('/api/gemini/video-status', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ operationName })
    });
    if (!statusRes.ok) {
      throw new Error("Failed to poll video status");
    }
    const statusData = await statusRes.json();
    if (statusData.error) {
      throw new Error(statusData.error.message || "Video generation failed on backend");
    }
    done = statusData.done;
  }
  
  // Call Download/Stream
  const downloadRes = await fetch('/api/gemini/video-download', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ operationName })
  });
  if (!downloadRes.ok) {
    throw new Error("Failed to download video");
  }
  const blob = await downloadRes.blob();
  return URL.createObjectURL(blob);
};

export const getAIEstimate = async (data: EstimateFormData) => {
  return await callServerApi('/api/gemini/get-ai-estimate', { data });
};

// Helper to convert File to Base64 in client-side to easily send via JSON
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};

export const analyzeRoofImage = async (file: File): Promise<string> => {
  const base64Data = await fileToBase64(file);
  const data = base64Data.split(',')[1];
  const responseData = await callServerApi('/api/gemini/analyze-roof', {
    mimeType: file.type,
    base64Data: data
  });
  return responseData.analysis;
};

export const analyzeRoofVideo = async (file: File): Promise<string> => {
  return analyzeRoofImage(file);
};

export function createBlob(data: Float32Array): { data: string; mimeType: string } {
  let binary = '';
  const int16 = new Int16Array(data.length);
  for (let i = 0; i < data.length; i++) {
    int16[i] = data[i] * 32768;
  }
  const bytes = new Uint8Array(int16.buffer);
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return {
    data: btoa(binary),
    mimeType: 'audio/pcm;rate=16000',
  };
}
