"use client";

import { Plus, MessageSquare, Edit2, Trash2, LogOut, User } from "lucide-react";

interface SidebarProps {
  userEmail: string;
  sessions: { id: string; name: string }[];
  currentSessionId: string;
  onSelectSession: (id: string) => void;
  onStartNewChat: () => void;
  onRenameSession: (id: string, name: string, e: React.MouseEvent) => void;
  onDeleteSession: (id: string, e: React.MouseEvent) => void;
  onSignOut: () => void;
}

export function Sidebar({
  userEmail,
  sessions,
  currentSessionId,
  onSelectSession,
  onStartNewChat,
  onRenameSession,
  onDeleteSession,
  onSignOut,
}: SidebarProps) {
  // Extract handle/username from email (e.g. "alex" from "alex@gmail.com")
  const displayName = userEmail ? userEmail.split("@")[0] : "Account";

  return (
    <div className="w-72 bg-slate-900 border-r border-slate-800 p-4 flex flex-col justify-between h-full">
      {/* TOP SECTION: Chat Actions & History */}
      <div className="flex flex-col gap-6 overflow-y-auto flex-1 pr-1">
        <button
          onClick={onStartNewChat}
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 py-3 rounded-xl font-semibold transition-colors shadow-lg shadow-blue-900/20"
        >
          <Plus size={18} /> New Chat
        </button>

        <div className="flex flex-col gap-2">
          <h3 className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-2 px-2">
            Your Chats
          </h3>
          {sessions.length === 0 && (
            <p className="text-slate-500 text-sm italic px-2">No chats yet.</p>
          )}

          {sessions.map((session) => (
            <div
              key={session.id}
              onClick={() => onSelectSession(session.id)}
              className={`flex justify-between items-center p-3 rounded-xl cursor-pointer transition-colors group ${
                currentSessionId === session.id
                  ? "bg-slate-800 text-white"
                  : "text-slate-400 hover:bg-slate-800/50 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-3 truncate">
                <MessageSquare
                  size={16}
                  className={
                    currentSessionId === session.id
                      ? "text-blue-400"
                      : "text-slate-500"
                  }
                />
                <span className="truncate text-sm w-full font-medium">
                  {session.name}
                </span>
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => onRenameSession(session.id, session.name, e)}
                  className="text-slate-500 hover:text-blue-400 p-1"
                  title="Rename"
                >
                  <Edit2 size={14} />
                </button>
                <button
                  onClick={(e) => onDeleteSession(session.id, e)}
                  className="text-slate-500 hover:text-red-400 p-1"
                  title="Delete"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* BOTTOM SECTION: User Profile & Prominent Sign Out */}
      <div className="pt-4 border-t border-slate-800 flex flex-col gap-3 mt-auto">
        {/* User Account Card */}
        <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
          <div className="w-9 h-9 rounded-full bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center shrink-0">
            <User size={18} />
          </div>
          <div className="flex flex-col truncate">
            <span className="text-sm font-semibold text-slate-100 capitalize truncate">
              {displayName}
            </span>
            <span className="text-xs text-slate-500 truncate">{userEmail}</span>
          </div>
        </div>

        {/* Large Sign Out Button */}
        <button
          onClick={onSignOut}
          className="w-full flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-600/20 text-red-400 border border-red-500/20 hover:border-red-500/40 py-2.5 px-4 rounded-xl font-medium text-sm transition-all duration-200 active:scale-[0.98]"
        >
          <LogOut size={16} /> Sign Out
        </button>
      </div>
    </div>
  );
}
