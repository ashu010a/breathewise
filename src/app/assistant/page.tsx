'use client';

import React from 'react';
import ChatInterface from '@/components/ai/ChatInterface';
import { Bot, ShieldCheck, HeartPulse, HelpCircle } from 'lucide-react';

export default function AssistantPage() {
  return (
    <div className="space-y-6 py-2">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <Bot className="w-3.5 h-3.5" />
            <span>GenAI Air Quality Companion</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100">
            Ask BreatheWise Anything
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Multilingual generative assistant combining live meteorological measurements, household constraints, and official environmental standards
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs text-slate-500 self-start sm:self-auto">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>WHO & CPCB Grounded</span>
          </span>
          <span className="flex items-center gap-1">
            <HeartPulse className="w-4 h-4 text-amber-500" />
            <span>Non-Diagnostic</span>
          </span>
        </div>
      </div>

      <ChatInterface />
    </div>
  );
}
