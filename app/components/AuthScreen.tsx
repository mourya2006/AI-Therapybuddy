"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export function AuthScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) setAuthError(error.message);
    else setAuthError("Success! You are logged in.");
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) setAuthError(error.message);
  };

  return (
    <div className="flex h-screen bg-slate-950 items-center justify-center text-white">
      <div className="bg-slate-900 p-8 rounded-xl shadow-2xl w-96 border border-slate-800">
        <h2 className="text-2xl font-bold mb-6 text-center">Log In to Sam</h2>
        {authError && (
          <p className="text-red-400 text-sm mb-4 text-center bg-red-900/20 p-2 rounded">
            {authError}
          </p>
        )}
        <form className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-slate-800 p-3 rounded outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-slate-800 p-3 rounded outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="flex gap-2 mt-2">
            <button
              onClick={handleSignIn}
              className="flex-1 bg-blue-600 hover:bg-blue-700 p-3 rounded font-bold transition-colors"
            >
              Log In
            </button>
            <button
              onClick={handleSignUp}
              className="flex-1 bg-slate-700 hover:bg-slate-600 p-3 rounded font-bold transition-colors"
            >
              Sign Up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
