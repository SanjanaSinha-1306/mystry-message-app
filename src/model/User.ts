import mongoose, { Schema, Document } from "mongoose";


export interface Message extends Document{
  content: string;
  createdAt:Date

}
const MessageSchema:Schema<Message> = new Schema({
  content:{type:String,required:true},
  createdAt:{type:Date,default:Date.now}
})
export interface User extends Document{
  username: string;
  email:string
  password:string;
  varifyCode:string;
  varifyCodeExpiry:Date;
  isVarified:boolean;
  isAcceptingMessages:boolean;
  messages: Message[];

}
const UserSchema:Schema<User> = new Schema({
  username:{type:String,required:[  true,"Username is required"],unique:true,trim:true},
  email:{type:String,required:[  true,"Email is required"],unique:true,match:[/.+@.+\..+/,'please provide a valid email address']},
  password:{type:String,required:[  true,"Password is required"]},
  varifyCode:{type:String, required:[ true,"Varify code is required"]},
  varifyCodeExpiry:{type:Date,required:[ true,"Varify code Expiry is required"]},
  isVarified:{type:Boolean,default:false},
  isAcceptingMessages:{type:Boolean,default:true},
  messages:[MessageSchema]
})
const UserModel =(mongoose.models.User as  mongoose.Model<User> )|| mongoose.model<User>("User",UserSchema);

export default UserModel;