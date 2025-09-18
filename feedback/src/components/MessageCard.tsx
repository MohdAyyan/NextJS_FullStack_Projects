"use client"
import React from 'react'
import { X } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Message } from '@/model/user.model';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import axios, { AxiosError } from 'axios';
import { ApiResponse } from '@/types/ApiResponse';

type MessageCardProps = {
    message: Message;
    onMessageDelete: (messageId: string) => void;
    
  }

function MessageCard({message, onMessageDelete}: MessageCardProps) {

  const handleDelete = async() => {
    try {
      const response =await axios.delete(`/api/delete-message/${message._id}`)
      toast.info(response.data.message)
      onMessageDelete(message._id );
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      if (axiosError.response) {
        toast.error(axiosError.response.data.message)
      } else {
        toast.error("An error occurred while deleting the message")
      }
    }
  }

  return (
   <Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline"> <X className="w-5 h-5" /></Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
    <CardDescription>Card Description</CardDescription>
  </CardHeader>
  <CardContent>
    
  </CardContent>
  
</Card>

  )
}

export default MessageCard