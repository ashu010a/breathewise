'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, User, Sparkles, BookOpen, CheckCircle, ShieldAlert, Globe, RotateCcw } from 'lucide-react';
import { useUserStore } from '@/lib/store/user-store';
import { ChatMessage } from '@/lib/types';

const PRESET_QUESTIONS = [
  'Is it safe for my children to play outside today?',
  'Should I open my windows right now?',
  'What should I do if the AQI suddenly reaches 400?',
  'How can I protect my elderly family members?',
  'Which is better for my daily commute today?',
  'How can I improve air quality in a small bedroom?',
  'What can I do with a limited budget?',
  'Explain PM2.5 like I am 10 years old.',
  'Why is pollution so severe in my city during winter?',
];

export default function ChatInterface() {
  const { profile } = useUserStore();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      content: `Hello! I am **BreatheWise AI**, your personal environmental intelligence companion.\n\nI have loaded the live air quality data for **${profile.location.city}** and your household profile (${profile.familyMembersCount} members, ${profile.childrenCount} children, ${profile.elderlyCount} seniors).\n\nHow can I help protect your family or assist with your daily commute and home ventilation today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      citations: ['CPCB NAQI System', 'WHO Air Quality Guidelines'],
      actionTips: [
        'Ask about safe exercise timing',
        'Check bedroom air filtration guidance',
        'Explore low-emission commute alternatives',
      ],
      disclaimer: 'BreatheWise provides educational guidance, not medical diagnosis.',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [language, setLanguage] = useState<'en' | 'hi' | 'es'>('en');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (questionText?: string) => {
    const textToSend = questionText || input.trim();
    if (!textToSend || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      content: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          profile,
          history: messages.slice(-4),
          language,
        }),
      });

      if (!res.ok) {
        throw new Error('Chat service encountered an issue');
      }

      const data = await res.json();

      const assistantMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        sender: 'assistant',
        content: data.answer || 'Thank you for your question.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        citations: data.citations || [],
        actionTips: data.actionTips || [],
        disclaimer: data.disclaimer || 'Educational decision-support tool. Not medical diagnosis.',
      };

      setMessages(prev => [...prev, assistantMsg]);
    } catch {
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'assistant',
        content: 'I apologize, but I could not reach the intelligence service right now. Please check your network connection or try again.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        disclaimer: 'System notification',
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: 'welcome-reset',
        sender: 'assistant',
        content: `Conversation refreshed. Ready for your questions regarding air pollution protection, safe ventilation windows, or sustainable lifestyle steps in **${profile.location.city}**.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  return (
    <div className="flex flex-col h-[700px] bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
      {/* Top Chat Header */}
      <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-sm">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                BreatheWise AI Companion
              </h3>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                Context-Aware
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Personalized for {profile.familyName} in {profile.location.city}
            </p>
          </div>
        </div>

        {/* Language selector & reset */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-white dark:bg-slate-900 rounded-lg p-0.5 border border-slate-200 dark:border-slate-700 text-xs">
            <Globe className="w-3.5 h-3.5 ml-2 text-slate-400" />
            <select
              aria-label="Language"
              value={language}
              onChange={e => setLanguage(e.target.value as 'en' | 'hi' | 'es')}
              className="bg-transparent text-xs py-1 px-2 font-medium text-slate-700 dark:text-slate-300 focus:outline-none"
            >
              <option value="en">English</option>
              <option value="hi">हिन्दी (Hindi)</option>
              <option value="es">Español</option>
            </select>
          </div>

          <button
            type="button"
            onClick={handleResetChat}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition"
            title="Reset conversation"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-5">
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`flex gap-3 max-w-3xl ${msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
          >
            {/* Avatar */}
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                msg.sender === 'user'
                  ? 'bg-slate-800 dark:bg-slate-700 text-white'
                  : 'bg-emerald-600 text-white'
              }`}
            >
              {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            {/* Bubble Content */}
            <div className={`space-y-2 max-w-[85%] ${msg.sender === 'user' ? 'text-right' : ''}`}>
              <div
                className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-emerald-600 text-white rounded-tr-none shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 rounded-tl-none border border-slate-200/60 dark:border-slate-700/60'
                }`}
              >
                {/* Content with markdown formatting */}
                <div className="whitespace-pre-line text-left">{msg.content}</div>

                {/* Immediate Action Tips if present */}
                {msg.actionTips && msg.actionTips.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-slate-200/60 dark:border-slate-700/60 text-left">
                    <span className="text-[11px] font-bold text-emerald-800 dark:text-emerald-400 block mb-1">
                      Immediate Action Steps:
                    </span>
                    <ul className="space-y-1 text-xs">
                      {msg.actionTips.map((tip, idx) => (
                        <li key={idx} className="flex items-start gap-1.5 text-slate-700 dark:text-slate-300">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Source Citations */}
                {msg.citations && msg.citations.length > 0 && (
                  <div className="mt-2.5 pt-2 border-t border-slate-200/40 dark:border-slate-700/40 flex flex-wrap items-center gap-1.5 text-left text-[10px] text-slate-500 dark:text-slate-400">
                    <BookOpen className="w-3 h-3 text-emerald-600 shrink-0" />
                    <span>Citations:</span>
                    {msg.citations.map((c, i) => (
                      <span key={i} className="px-1.5 py-0.5 rounded bg-white/70 dark:bg-slate-900/60 font-medium">
                        {c}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Timestamp & Medical Disclaimer */}
              <div className="flex items-center gap-2 text-[10px] text-slate-400 px-1">
                <span>{msg.timestamp}</span>
                {msg.disclaimer && (
                  <>
                    <span>•</span>
                    <span className="italic">{msg.disclaimer}</span>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-3 max-w-xl">
            <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4 animate-spin" />
            </div>
            <div className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 rounded-tl-none text-xs text-slate-500 flex items-center gap-2">
              <div className="flex space-x-1">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce"></div>
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce [animation-delay:0.2s]"></div>
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce [animation-delay:0.4s]"></div>
              </div>
              <span>Analyzing environmental sensors & household profile...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Prompt Chips */}
      <div className="px-6 py-2.5 border-t border-slate-200/60 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 overflow-x-auto flex items-center gap-2 no-scrollbar">
        <span className="text-[11px] font-semibold text-slate-400 shrink-0 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-emerald-600" /> Suggested:
        </span>
        {PRESET_QUESTIONS.map((q, i) => (
          <button
            key={i}
            type="button"
            onClick={() => handleSend(q)}
            className="text-xs px-2.5 py-1 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition whitespace-nowrap shrink-0"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <form
        onSubmit={e => {
          e.preventDefault();
          handleSend();
        }}
        className="p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder={`Ask about air quality, ventilation, commute, or health in ${profile.location.city}...`}
          disabled={isLoading}
          className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
        />
        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className="px-4 py-2.5 rounded-xl bg-emerald-600 text-white font-semibold text-sm hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 transition shadow-sm"
        >
          <span>Send</span>
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
