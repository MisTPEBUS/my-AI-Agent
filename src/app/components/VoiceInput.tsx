"use client";

import { Button } from "@/app/components/ui/button";
import { useRef, useState } from "react";

type SpeechRecognitionType = {
  new (): SpeechRecognitionInstance;
};

interface SpeechRecognitionInstance {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start: () => void;
  stop: () => void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
}

type SpeechRecognitionEvent = Event & {
  results: SpeechRecognitionResultList;
};

type SpeechRecognitionErrorEvent = Event & {
  error: string;
};

const VoiceInput = () => {
  const textRef = useRef<HTMLTextAreaElement>(null);
  const [isRecording, setIsRecording] = useState(false);

  const handleVoiceInput = () => {
    const SpeechRecognition =
      (
        window as unknown as {
          SpeechRecognition: SpeechRecognitionType;
          webkitSpeechRecognition: SpeechRecognitionType;
        }
      ).SpeechRecognition ||
      (window as unknown as { webkitSpeechRecognition: SpeechRecognitionType })
        .webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("此瀏覽器不支援語音辨識，請使用 Chrome");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "zh-TW";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript;
      if (textRef.current) {
        textRef.current.value += transcript;
      }
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error("語音辨識錯誤:", event.error);
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognition.start();
    setIsRecording(true);
  };

  return (
    <div className="flex flex-col items-start gap-4 p-4">
      <textarea
        ref={textRef}
        className="w-full p-3 border rounded-2xl resize-none min-h-[120px] focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="請開始語音輸入..."
      />
      <Button
        onClick={handleVoiceInput}
        className="w-full text-3xl bg-gray-500 text-white font-extrabold py-4 rounded-2xl hover:bg-green-600 transition-colors"
        disabled={isRecording}
      >
        {isRecording ? (
          <div className="flex items-center gap-2">
            正在錄音中...
            <span className="text-red-400 text-2xl animate-pulse">●</span>
          </div>
        ) : (
          "開始語音輸入"
        )}
      </Button>
    </div>
  );
};

export default VoiceInput;
