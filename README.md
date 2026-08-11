# 🎙️ Sam — AI Voice Assistant

An interactive, web-based AI voice assistant powered by Next.js, Gemini API, Supabase, and the Web Speech API. "Sam" listens to your voice commands, processes responses using Google's Gemini, speaks the answer back using speech synthesis, and saves conversation logs across user sessions.

---

## ✨ Features

- **🗣️ Voice-to-Voice Interaction**: Tap to speak using the Web Speech API and receive spoken responses via Web Speech Synthesis.
- **🔇 Audio Controls**: Quick-toggle button to mute/unmute AI voice output on demand.
- **🔒 Authentication**: Secure user login and signup powered by Supabase Auth.
- **📂 Chat Management**: Create, rename, delete, and easily switch between multiple chat sessions.
- **💾 Session Persistence**: Chat histories and transcripts are saved in Supabase PostgreSQL tables.
- **🎨 Modern Dark UI**: Built with Tailwind CSS, Lucide icons, and a clean, modular component layout.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router, React, TypeScript)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Database & Auth**: [Supabase](https://supabase.com/)
- **AI Model**: [Google Gemini API](https://ai.google.dev/)
- **Voice Capabilities**: Native Browser Web Speech API (`SpeechRecognition` & `SpeechSynthesis`)

---

## 📂 Project Structure

```text
├── app/
│   ├── api/
│   │   └── chat/
│   │       └── route.ts              # Gemini API route handler
│   ├── components/
│   │   ├── AuthScreen.tsx            # Supabase Login & Sign-up interface
│   │   ├── Sidebar.tsx               # Session history & user profile navigation
│   │   └── ChatArea.tsx              # Conversation display, audio controls, & mic button
│   ├── hooks/
│   │   └── useSpeechRecognition.ts   # Custom hook managing Web Speech API
│   ├── layout.tsx                    # Root layout
│   └── page.tsx                      # Main app state orchestrator
├── lib/
│   └── supabase.ts                   # Supabase client configuration
├── .env.local                        # Local environment variables
└── README.md