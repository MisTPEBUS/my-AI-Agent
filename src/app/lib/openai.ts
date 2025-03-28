import axios from "axios";

const apiUrl = "https://api.openai.com/v1/chat/completions";
const token = process.env.NEXT_PUBLIC_OPENAI_API_KEY;

type Message = {
  role: "user" | "system";
  content: string;
};

export const openAiRequest = async (messages: Message[]): Promise<string> => {
  try {
    const { data } = await axios.post(
      apiUrl,
      {
        messages: [
          {
            role: "system",
            content: "你必須用繁體中文以及台灣用語回覆我。",
          },
          ...messages,
        ],
        model: "gpt-3.5-turbo",
        max_tokens: 200,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    return data.choices[0].message.content.trim();
  } catch (error) {
    return `很抱歉，我發生錯誤了。${error}`;
  }
};
