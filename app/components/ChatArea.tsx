"use client";

import { useEffect, useRef } from "react";
import { Mic, MicOff, Volume2, VolumeX } from "lucide-react";

interface Message {
  sender: "user" | "bot";
  text: string;
}

interface ChatAreaProps {
  messages: Message[];
  isLoading: boolean;
  isListening: boolean;
  isMuted: boolean;
  onToggleListening: () => void;
  onToggleMute: () => void;
}

export function ChatArea({
  messages,
  isLoading,
  isListening,
  isMuted,
  onToggleListening,
  onToggleMute,
}: ChatAreaProps) {
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-1 flex flex-col relative">
      {/* TOP BAR: Audio Controls */}
      <div className="h-14 border-b border-slate-800/80 px-6 flex items-center justify-end bg-slate-950/40 backdrop-blur-sm z-10">
        <button
          onClick={onToggleMute}
          title={isMuted ? "Unmute Text-to-Speech" : "Mute Text-to-Speech"}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
            isMuted
              ? "bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20"
              : "bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-700"
          }`}
        >
          {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          <span>{isMuted ? "Muted" : "Audio On"}</span>
        </button>
      </div>

      {/* MESSAGES CONTAINER */}
      <div className="flex-1 overflow-y-auto p-8 space-y-6 pb-32">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-slate-500 space-y-4">
            <div className="w-16 h-16 rounded-full bg-slate-900 flex items-center justify-center mb-4">
              <Mic size={32} className="text-slate-700" />
            </div>
            <p className="text-lg">Tap the microphone to start talking.</p>
          </div>
        )}

        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${
              msg.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`p-4 rounded-2xl max-w-2xl text-[15px] leading-relaxed shadow-sm ${
                msg.sender === "user"
                  ? "bg-blue-600 text-white rounded-br-sm"
                  : "bg-slate-800 text-slate-100 rounded-bl-sm border border-slate-700"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="p-4 rounded-2xl bg-slate-800 border border-slate-700 text-slate-400 rounded-bl-sm animate-pulse">
              Sam is typing...
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* MICROPHONE BUTTON */}
      <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-slate-950 via-slate-950/90 to-transparent flex justify-center">
        <button
          onClick={onToggleListening}
          className={`p-6 rounded-full transition-all duration-300 shadow-xl ${
            isListening
              ? "bg-red-500 hover:bg-red-600 shadow-red-500/30 scale-110"
              : "bg-blue-600 hover:bg-blue-700 shadow-blue-600/30 hover:scale-105"
          }`}
        >
          {isListening ? (
            <MicOff size={28} className="text-white" />
          ) : (
            <Mic size={28} className="text-white" />
          )}
        </button>
      </div>
    </div>
  );
}
