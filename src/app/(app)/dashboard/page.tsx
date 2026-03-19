'use client'

import { Message } from '@/src/model/User'
import { AcceptMessageSchema } from '@/src/schemas/acceptMessageSchema'
import { ApiResponse } from '@/src/types/ApiResponse'
import { zodResolver } from '@hookform/resolvers/zod'
import axios, { AxiosError } from 'axios'
import { User } from 'next-auth'
import { useSession } from 'next-auth/react'
import React, { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import MessageCard from '@/components/MessageCard'
import { Card } from '@/components/ui/card'
import { Copy, RefreshCcw } from 'lucide-react'

function Page() {

const [messages, setMessages] = useState<Message[]>([])
const [isLoading, setIsLoading] = useState(false)
const [isSwitchLoading, setIsSwitchLoading] = useState(false)
const [profileUrl, setProfileUrl] = useState<string>("")

const handleDeleteMessage =(messageId : string)=>{
  setMessages(messages.filter((message) => message._id.toString() !== messageId ))
}
const {data:session} = useSession()
const form = useForm({
  resolver: zodResolver(AcceptMessageSchema)
})
const { register , watch, setValue } = form;
const acceptMessage = watch('acceptMessages')

const fetchAcceptMessage = useCallback(async()=>{
  setIsSwitchLoading(true)
  try {
   const response = await axios.get<ApiResponse>('/api/accept-messages')
   setValue('acceptMessages', !!response.data.isAcceptingMessages)
    
  } catch (error) {
    const axiosError = error as AxiosError<ApiResponse>
    toast.error("Failed to fetch msessage setting")
  } finally{
    setIsSwitchLoading(false)
  }
},[setValue])
const fetchMessage = useCallback( async(refresh: boolean= false)=>{
    setIsLoading(true)
    try {
     const response = await axios.get<ApiResponse>('/api/get-messages')
      setMessages(response.data.messages ||[])
      if(refresh){
        toast.success("Showing latest messages")
      }
    } catch (error) {
       const axiosError = error as AxiosError<ApiResponse>
    toast.error("Failed to fetch messages")
    }finally{
      setIsLoading(false)
    }
},[setIsLoading,setMessages])

useEffect(()=>{
  if(!session|| !session.user)return
  fetchMessage()
  fetchAcceptMessage()
},[session,setValue,fetchAcceptMessage,fetchMessage])

useEffect(() => {
  const { username } = (session?.user ?? {}) as User
  if (!username) return
  const baseUrl = `${window.location.protocol}//${window.location.host}`
  setProfileUrl(`${baseUrl}/u/${username}`)
}, [session])

const handleSwitchChange = async()=>{
  setIsSwitchLoading(true)
  try {
   await axios.post<ApiResponse>('/api/accept-messages',{
      acceptMessages: !acceptMessage
    })
    setValue('acceptMessages', !acceptMessage)
    toast.success("Updated")
  } catch (error) {
       const axiosError = error as AxiosError<ApiResponse>
    toast.error("Failed to update setting")
  } finally {
    setIsSwitchLoading(false)
  }
}

const copyToClipboard = async () => {
  if (!profileUrl) return
  await navigator.clipboard.writeText(profileUrl)
  toast.success("Copied")
}

if(!session || !session.user){
  return <div className="p-6">Please Login</div>
}
  return (
    <div className="min-h-[calc(100vh-56px)] bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      <div className="mx-auto max-w-5xl px-4 py-8 space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-1">
            <div className="text-2xl font-bold tracking-tight">Dashboard</div>
            <div className="text-sm text-slate-300">
              Your anonymous inbox. Toggle when you want to receive messages.
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="secondary" onClick={copyToClipboard} disabled={!profileUrl}>
              <Copy className="mr-2 h-4 w-4" />
              Copy link
            </Button>
            <Button onClick={() => fetchMessage(true)} disabled={isLoading}>
              <RefreshCcw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <Card className="border-slate-800 bg-slate-900/40 p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <Switch
                  checked={!!acceptMessage}
                  onCheckedChange={handleSwitchChange}
                  disabled={isSwitchLoading}
                />
                <div className="text-sm text-slate-200">
                  {acceptMessage ? "Accepting messages" : "Not accepting messages"}
                </div>
              </div>
              <div className="text-xs text-slate-400">
                {acceptMessage ? "ON" : "OFF"}
              </div>
            </div>
          </Card>

          <Card className="border-slate-800 bg-slate-900/40 p-4">
            {/* Link card: show only the link (no extra text) */}
            <div className="rounded-lg border border-slate-800 bg-slate-950/40 px-3 py-2 text-sm text-slate-200 break-all">
              {profileUrl || "—"}
            </div>
          </Card>
        </div>

        <div className="space-y-3">
          {messages.length === 0 ? (
            <Card className="border-slate-800 bg-slate-900/40 p-6">
              <div className="text-sm text-slate-300">No messages yet.</div>
              <div className="text-xs text-slate-500 mt-1">
                Share your link and check back later.
              </div>
            </Card>
          ) : (
            <div className="space-y-3">
              {messages.map((m) => (
                <MessageCard
                  key={m._id.toString()}
                  message={m}
                  onMessageDelete={handleDeleteMessage}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Page