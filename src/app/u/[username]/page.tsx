'use client'

import React, { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import axios, { AxiosError } from 'axios'
import { toast } from 'sonner'
import { Loader2, Sparkles, UserPlus } from 'lucide-react' //
import { ApiResponse } from '@/src/types/ApiResponse'
import { Button } from '@/components/ui/button'

function Page() {
  const params = useParams<{ username: string }>()
  const router = useRouter()
  const username = params.username

  const [message, setMessage] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  
  // Initial default suggestions
  const [suggestions, setSuggestions] = useState<string[]>([
    "What's your favorite childhood memory?",
    "If you could have any superpower, what would it be?",
    "What's the best book you've read recently?"
  ])

  // Logic to send the anonymous message
  const sendMessage = async () => {
    if (!message.trim()) {
      toast.error('Write a message first')
      return
    }
    setIsSending(true)
    try {
      const res = await axios.post<ApiResponse>('/api/send-message', {
        username,
        content: message.trim(),
      })
      toast.success(res.data.message || 'Message sent')
      setMessage('')
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast.error(axiosError?.response?.data?.message || 'Failed to send')
    } finally {
      setIsSending(false)
    }
  }

  // YOUR REFRESH LOGIC: Fixed to handle AI Streams correctly
  const generateSuggestions = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/suggest-messages', { method: 'POST' });
      const data = await response.json();
      
      if (data.text) {
        const list = data.text.split('||').map((s: string) => s.trim());
        setSuggestions(list);
      }
    } catch (e) {
      console.error("Error refreshing:", e);
      toast.error("Failed to fetch AI suggestions");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white py-8 px-4 sm:px-6">
      <div className="mx-auto max-w-2xl space-y-8">
        
        {/* Header section */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl sm:text-4xl font-bold tracking-tight">Public Profile Link</h1>
          <p className="text-xs sm:text-sm text-slate-400">Send an anonymous message to @{username}</p>
        </div>

        {/* Message Card */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4 sm:p-6 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Send Anonymous Message</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write your secret message here..."
              className="w-full min-h-[120px] rounded-lg bg-slate-950 border border-slate-800 px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div className="flex justify-center">
            <Button onClick={sendMessage} disabled={isSending} className="w-full sm:w-auto px-10">
              {isSending ? 'Sending...' : 'Send It'}
            </Button>
          </div>
        </div>

        {/* AI Suggestions Grid with Gemini Integration */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <h2 className="font-semibold">AI Suggestions</h2>
            
            {/* UPDATED BUTTON WITH SPARKLES AND LOADER */}
            <Button 
              onClick={generateSuggestions} 
              disabled={isGenerating}
              className="w-full sm:w-auto bg-white text-black text-xs px-4 flex items-center gap-2"
            >
              {isGenerating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4" />
              )}
              {isGenerating ? 'Thinking...' : 'Suggest Messages'}
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {suggestions.map((s, idx) => (
              <button
                key={idx}
                onClick={() => setMessage(s)}
                className="text-left rounded-lg border border-slate-800 bg-slate-950/40 p-4 text-xs sm:text-sm hover:bg-slate-900 transition-colors break-words"
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Signup Link */}
        <div className="text-center pt-8 border-t border-slate-900 mt-12">
          <p className="text-sm text-slate-500 mb-4">Want your own anonymous inbox?</p>
          <Button
            variant="outline"
            onClick={() => router.push('/sign-up')}
            className="border-slate-800 text-slate-300 hover:bg-slate-900"
          >
            Create Your Account
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Page;