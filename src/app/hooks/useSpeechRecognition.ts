// hooks/useSpeechRecognition.ts
import { useState } from "react";

export interface SpeechRecognitionResult {
  transcript: string;
  isFinal: boolean;
}

interface SpeechRecognitionAPI {
  new (): SpeechRecognitionInstance;
}

interface SpeechRecognitionInstance {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start(): void;
  stop(): void;
  onstart: (() => void) | null;
  onend: (() => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
}

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

export const useSpeechRecognition = () => {
  const [isListening, setIsListening] = useState(false);

  const start = (onResult: (result: SpeechRecognitionResult) => void) => {
    const SpeechRecognition =
      (window as unknown as { SpeechRecognition: SpeechRecognitionAPI })
        .SpeechRecognition ||
      (window as unknown as { webkitSpeechRecognition: SpeechRecognitionAPI })
        .webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("此瀏覽器不支援語音辨識，請使用 Chrome");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "zh-TW";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error("語音辨識錯誤:", event.error);
      setIsListening(false);
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript;
      onResult({ transcript, isFinal: event.results[0].isFinal });
    };

    recognition.start();
  };

  return { start, isListening };
};
