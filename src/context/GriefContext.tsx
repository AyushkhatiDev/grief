import { createContext, useContext, useState, ReactNode } from "react";

export type Memory = {
  id: string;
  date: string;
  text: string;
  tag: "her-words" | "your-memory" | "voice-note" | "photo";
};

export type ChatMsg = { id: string; role: "ai" | "user"; text: string };

type Ctx = {
  personName: string;
  setPersonName: (s: string) => void;
  dob: string;
  setDob: (s: string) => void;
  dop: string;
  setDop: (s: string) => void;
  relationship: string;
  setRelationship: (s: string) => void;
  uploads: { messages: boolean; voice: boolean; photos: boolean };
  toggleUpload: (k: "messages" | "voice" | "photos") => void;
  mood: number | null;
  setMood: (n: number) => void;
  memories: Memory[];
  addMemory: (m: Omit<Memory, "id">) => void;
  letters: string[];
  addLetter: (s: string) => void;
  chat: ChatMsg[];
  pushChat: (m: ChatMsg) => void;
};

const GriefCtx = createContext<Ctx | null>(null);

const seedMemories: Memory[] = [
  { id: "1", date: "March 12, 2024", text: "\"You don't have to be brave for me. You just have to be here.\" — something she said the last morning.", tag: "her-words" },
  { id: "2", date: "January 4, 2024", text: "Voice note — humming the melody she made up for rainy mornings.", tag: "voice-note" },
  { id: "3", date: "December 24, 2023", text: "The kitchen smelled like cardamom and orange peel. She wore the green apron with the burn mark.", tag: "your-memory" },
  { id: "4", date: "October 19, 2023", text: "Photo from the porch — late afternoon light on her hands.", tag: "photo" },
  { id: "5", date: "August 2, 2023", text: "\"Make the soup the way I taught you. Salt it twice.\"", tag: "her-words" },
  { id: "6", date: "May 30, 2023", text: "Walking back from the lake. She stopped to listen to a bird neither of us could name.", tag: "your-memory" },
];

const seedChat: ChatMsg[] = [
  { id: "a1", role: "ai", text: "It's 3am. I'm here. What's on your mind tonight?" },
  { id: "a2", role: "ai", text: "There's no right way to feel. Whatever you're carrying, you can put it down here." },
  { id: "a3", role: "ai", text: "I've been looking through your memories of her. She sounds like someone who made every room warmer." },
];

export function GriefProvider({ children }: { children: ReactNode }) {
  const [personName, setPersonName] = useState("Eleanor");
  const [dob, setDob] = useState("1952-06-14");
  const [dop, setDop] = useState("2024-04-03");
  const [relationship, setRelationship] = useState("Mother");
  const [uploads, setUploads] = useState({ messages: false, voice: false, photos: false });
  const [mood, setMood] = useState<number | null>(null);
  const [memories, setMemories] = useState<Memory[]>(seedMemories);
  const [letters, setLetters] = useState<string[]>([]);
  const [chat, setChat] = useState<ChatMsg[]>(seedChat);

  return (
    <GriefCtx.Provider
      value={{
        personName, setPersonName, dob, setDob, dop, setDop,
        relationship, setRelationship,
        uploads,
        toggleUpload: (k) => setUploads((u) => ({ ...u, [k]: !u[k] })),
        mood, setMood,
        memories,
        addMemory: (m) => setMemories((prev) => [{ ...m, id: crypto.randomUUID() }, ...prev]),
        letters,
        addLetter: (s) => setLetters((prev) => [s, ...prev]),
        chat,
        pushChat: (m) => setChat((prev) => [...prev, m]),
      }}
    >
      {children}
    </GriefCtx.Provider>
  );
}

export function useGrief() {
  const ctx = useContext(GriefCtx);
  if (!ctx) throw new Error("useGrief must be inside GriefProvider");
  return ctx;
}
