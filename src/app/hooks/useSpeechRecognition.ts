// hooks/useSpeechRecognition.ts
import { useState, useRef } from "react";
import { toast } from "sonner"; // ✅ 確保你有引入

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
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const stopRecognition = () => {
    recognitionRef.current?.stop();
    setIsListening(false);
  };

  const resetSilenceTimer = () => {
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
    }
    silenceTimerRef.current = setTimeout(() => {
      toast.warning("3 秒內未偵測語音，自動停止辨識");
      stopRecognition();
    }, 3000); // 3 秒靜音關閉
  };

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
    recognitionRef.current = recognition;

    recognition.lang = "zh-TW";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
      resetSilenceTimer(); // 開始時就啟動倒數
    };

    recognition.onend = () => {
      setIsListening(false);
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error("語音辨識錯誤:", event.error);
      setIsListening(false);
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript;
      onResult({ transcript, isFinal: event.results[0].isFinal });

      resetSilenceTimer(); // 有聲音就重新倒數
    };

    recognition.start();
  };

  return { start, isListening };
};
