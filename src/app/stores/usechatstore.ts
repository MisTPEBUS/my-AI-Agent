import { create } from "zustand";

export type Message = {
  role: "user" | "system" | "assistant" | "loading" | "cards";
  content: string;
};

type ChatState = {
  messages: Message[];
  input: string;
  planningMode: boolean;
  setInput: (value: string) => void;
  addMessage: (msg: Message) => void;
  setPlanningMode: (mode: boolean) => void;
};

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  input: "",
  planningMode: false,
  setInput: (input) => set({ input }),
  addMessage: (msg) => set((state) => ({ messages: [...state.messages, msg] })),
  setPlanningMode: (mode) => set({ planningMode: mode }),
}));
