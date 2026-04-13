import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import { Button } from "./ui/button"
import { InfoIcon, X } from "lucide-react"
import { Message } from "@/src/model/User"
import { toast } from "sonner"
import axios from "axios"
import { ApiResponse } from "@/src/types/ApiResponse"



type MessageCardProps={
  message: Message;
 onMessageDelete:(messageId: string)=>void
}
function MessageCard({message ,onMessageDelete}:MessageCardProps) {

  const handleDeleteConfirm = async()=>{

   try {
    const id = message._id?.toString?.() ?? String(message._id)
    const response = await axios.delete<ApiResponse>(`/api/delete-message/${id}`)
    toast.success(response.data.message)
    onMessageDelete(id)
    
   } catch (e: any) {
    toast.error(e?.response?.data?.message || "Failed to delete message")
   }
  }
  return (
 <Card>
  <CardHeader>
    <CardTitle>Message</CardTitle>
    <Alert>
  <InfoIcon />
  <AlertTitle>Anonymous message</AlertTitle>
  <AlertDescription>
    {message.content}
  </AlertDescription>
  <AlertAction>
    <Button variant="destructive" onClick={handleDeleteConfirm}>
      <X className="w-5 h-5"/>
    </Button>
  </AlertAction>
</Alert>
    <CardDescription>{new Date(message.createdAt).toLocaleString()}</CardDescription>
  </CardHeader>
  <CardContent>
  
  </CardContent>
 
</Card>
  )
}

export default MessageCard