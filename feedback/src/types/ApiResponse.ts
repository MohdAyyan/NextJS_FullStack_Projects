import { Message } from "@/model/user.model";
export interface ApiResponse{
    success: boolean;
    status: number;
    message: string;
    isAcceptingMessage?:boolean;
    messages?: Array<Message>;
}