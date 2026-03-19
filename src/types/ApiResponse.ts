import { Message } from "../model/User";

export interface ApiResponse {
  success: boolean;
  message: string;
  isAcceptingMessage?: boolean;
  isAcceptingMessages?: boolean;
  messages?:Array<Message>;
}