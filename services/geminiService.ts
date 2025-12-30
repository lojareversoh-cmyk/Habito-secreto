
import { GoogleGenAI } from "@google/genai";

export const getPartnerReply = async (userMessage: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const chat = ai.chats.create({
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction: "Você é um parceiro anônimo em um desafio de 30 dias de hábitos saudáveis. Você está no dia 12 e seu objetivo é motivar o usuário. Não revele seu nome (Alexandre) em hipótese alguma. Fale em Português do Brasil. Seja amigável, use emojis e aja como se você também estivesse lutando para manter os hábitos de beber água, ler e exercitar.",
      },
    });

    const result = await chat.sendMessage({ message: userMessage });
    return result.text || "Estou focado aqui também! Vamos juntos nessa.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Tive uma queda na conexão, mas o foco continua! Como está seu progresso hoje?";
  }
};

export const generateDefaultAvatar = async (userName: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            text: `Generate a high-quality, professional, and minimalist abstract profile avatar for a user named "${userName}". 
            Style: Modern geometric abstraction, smooth gradients, soft shadows.
            Palette: Emerald green (#13ec5b), deep forest greens, and dark slate backgrounds.
            Composition: Centered artistic shapes or patterns. 
            Strict Rules: NO text, NO realistic faces, NO humans, NO letters. Only abstract shapes.`,
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1"
        },
      },
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.error("Avatar Generation Error:", error);
    // Retorna uma imagem de fallback ou null para que o app use o ícone padrão
    return null;
  }
};
