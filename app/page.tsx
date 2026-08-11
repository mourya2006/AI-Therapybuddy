"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { AuthScreen } from "./components/AuthScreen";
import { Sidebar } from "./components/Sidebar";
import { ChatArea } from "./components/ChatArea";
import { useSpeechRecognition } from "./hooks/useSpeechRecognition";

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [messages, setMessages] = useState<
    { sender: "user" | "bot"; text: string }[]
  >([]);
  const [chatHistory, setChatHistory] = useState<any[]>([]);
  const [sessions, setSessions] = useState<{ id: string; name: string }[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  // Auth Listener
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Fetch Chat Sessions
  const fetchSessions = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase
      .from("chat_sessions")
      .select("id, name")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (data) {
      setSessions(data);
      if (!currentSessionId && data.length > 0) {
        setCurrentSessionId(data[0].id);
      }
    }
  }, [user, currentSessionId]);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  // Load Active Chat Logs
  useEffect(() => {
    if (!currentSessionId || !user) return;

    const loadActiveChat = async () => {
      const { data } = await supabase
        .from("chat_logs")
        .select("*")
        .eq("session_id", currentSessionId)
        .order("created_at", { ascending: false });

      if (data) {
        const chronologicalChats = [...data].reverse();
        setMessages(
          chronologicalChats.map((row) => ({
            sender: row.sender as "user" | "bot",
            text: row.message,
          }))
        );
        setChatHistory(
          chronologicalChats.map((row) => ({
            role: row.sender === "user" ? "user" : "model",
            parts: [{ text: row.message }],
          }))
        );
      }
    };

    loadActiveChat();
  }, [currentSessionId, user]);

  // Handle Speech Output Condition
  const handleGeminiReply = useCallback(
    async (userText: string) => {
      if (!currentSessionId || !user) return;

      stopListening();
      setIsLoading(true);

      const newMessages = [
        ...messages,
        { sender: "user" as const, text: userText },
      ];
      setMessages(newMessages);

      await supabase
        .from("chat_logs")
        .insert([
          {
            sender: "user",
            message: userText,
            session_id: currentSessionId,
            user_id: user.id,
          },
        ]);

      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: userText, history: chatHistory }),
        });
        const data = await response.json();

        if (data.reply) {
          setMessages([...newMessages, { sender: "bot", text: data.reply }]);
          setChatHistory([
            ...chatHistory,
            { role: "user", parts: [{ text: userText }] },
            { role: "model", parts: [{ text: data.reply }] },
          ]);

          await supabase
            .from("chat_logs")
            .insert([
              {
                sender: "bot",
                message: data.reply,
                session_id: currentSessionId,
                user_id: user.id,
              },
            ]);

          // Speak only if not muted
          if (!isMuted && typeof window !== "undefined") {
            window.speechSynthesis.cancel(); // Cancel any lingering audio first
            const utterance = new SpeechSynthesisUtterance(data.reply);
            window.speechSynthesis.speak(utterance);
          }
        }
      } catch (error) {
        console.error("Error communicating with Gemini:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [currentSessionId, user, messages, chatHistory, isMuted]
  );

  const { isListening, toggleListening, stopListening } =
    useSpeechRecognition(handleGeminiReply);

  // Toggle Mute Handler
  const handleToggleMute = () => {
    setIsMuted((prev) => {
      const nextState = !prev;
      if (nextState && typeof window !== "undefined") {
        window.speechSynthesis.cancel(); // Stop talking immediately if muted
      }
      return nextState;
    });
  };

  // Actions
  const handleStartNewChat = async () => {
    const chatName = prompt(
      "What would you like to name this chat?",
      "New Chat"
    );
    if (!chatName) return;

    const newSessionId = crypto.randomUUID();
    await supabase
      .from("chat_sessions")
      .insert([{ id: newSessionId, user_id: user.id, name: chatName }]);

    setCurrentSessionId(newSessionId);
    setMessages([]);
    setChatHistory([]);
    fetchSessions();
  };

  const handleRenameSession = async (
    id: string,
    currentName: string,
    e: React.MouseEvent
  ) => {
    e.stopPropagation();
    const newName = prompt("Rename this chat:", currentName);
    if (newName && newName !== currentName) {
      await supabase
        .from("chat_sessions")
        .update({ name: newName })
        .eq("id", id);
      fetchSessions();
    }
  };

  const handleDeleteSession = async (
    idToDelete: string,
    e: React.MouseEvent
  ) => {
    e.stopPropagation();
    await supabase.from("chat_sessions").delete().eq("id", idToDelete);
    if (currentSessionId === idToDelete) {
      setMessages([]);
      setChatHistory([]);
      setCurrentSessionId("");
    }
    fetchSessions();
  };

  const handleSignOut = async () => {
    if (typeof window !== "undefined") window.speechSynthesis.cancel();
    await supabase.auth.signOut();
    setMessages([]);
    setSessions([]);
    setCurrentSessionId("");
  };

  const handleToggleListening = () => {
    if (!currentSessionId) {
      alert("Please select or create a chat first!");
      return;
    }
    toggleListening();
  };

  if (!user) return <AuthScreen />;

  return (
    <div className="flex h-screen bg-slate-950 text-white font-sans">
      <Sidebar
        userEmail={user.email}
        sessions={sessions}
        currentSessionId={currentSessionId}
        onSelectSession={setCurrentSessionId}
        onStartNewChat={handleStartNewChat}
        onRenameSession={handleRenameSession}
        onDeleteSession={handleDeleteSession}
        onSignOut={handleSignOut}
      />
      <ChatArea
        messages={messages}
        isLoading={isLoading}
        isListening={isListening}
        isMuted={isMuted}
        onToggleListening={handleToggleListening}
        onToggleMute={handleToggleMute}
      />
    </div>
  );
}
