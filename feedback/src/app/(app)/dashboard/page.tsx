"use client"
import MessageCard from '@/components/MessageCard';
import { Message } from '@/model/user.model';
import { acceptMessageSchema } from '@/schemas/acceptMessage';
import { ApiResponse } from '@/types/ApiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import { Separator } from '@/components/ui/separator';
import axios, { AxiosError } from 'axios';
import { Loader2, RefreshCcw } from 'lucide-react';
import { useSession } from 'next-auth/react';
import React,{ useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { User } from 'next-auth';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';

function page() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isSwitchLoading, setIsSwitchLoading] = useState<boolean>(false);

    const handleDeleteMessage = async (messageId: string) => {
        setMessages(messages.filter(message => message._id !== messageId));
        
    }

    const { data: session} =useSession();

    const form = useForm({
        resolver: zodResolver(acceptMessageSchema),
        
    })

    const { register, watch, setValue } = form;
    const acceptMessage = watch('acceptMessage');
    
    const fetchAcceptMessage = useCallback(async()=>{
        setIsSwitchLoading(true);
        try {
            const response = await axios.get(`/api/accept-message`);
            setValue("acceptMessage", response.data.isAcceptingMessages);
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            if (axiosError.response) {
                toast.error(axiosError.response.data.message);
            } else {
                toast.error("An error occurred while fetching the accept message status");
            }
        }
        finally {
            setIsSwitchLoading(false);
        }
    },[setValue])

    const fetchMessages = useCallback(async (refresh: boolean = false) => {
        setIsLoading(true);
        setIsSwitchLoading(false);
        try {
            const response = await axios.get<ApiResponse>("/api/get-messages");
            setMessages(response.data.messages || []);
            if (refresh) {
                toast.success("Messages fetched successfully");
            } 
        } catch (error) {
             const axiosError = error as AxiosError<ApiResponse>;
            if (axiosError.response) {
                toast.error(axiosError.response.data.message);
        }
    } finally {
            setIsLoading(false);
            setIsSwitchLoading(false);
        }
    
    },[setIsLoading,toast,setMessages])


     useEffect(() => {
    if (!session || !session.user) return;

    fetchMessages();

    fetchMessages();
  }, [session, setValue, toast, fetchMessages, fetchMessages]);


    const handleSwitchChange = async () => {
    try {
      const response = await axios.post<ApiResponse>('/api/accept-messages', {
        acceptMessages: !acceptMessage,
      });
      setValue('acceptMessage', !acceptMessage);
      toast.success(response.data.message);
    }
    catch (error) {
         const axiosError = error as AxiosError<ApiResponse>;
        if (axiosError.response) {
            toast.error(axiosError.response.data.message);
        }
    else {
            toast.error("An error occurred while updating the accept message status");
        }
    }
}

    if (!session || !session.user) {
    return <div></div>;
  }

  const { username } = session.user as User;

  const baseUrl = `${window.location.protocol}//${window.location.host}`;
  const profileUrl = `${baseUrl}/u/${username}`;
   const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    toast.success("Profile URL copied to clipboard");
}

     return (
    <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
      <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>

      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>{' '}
        <div className="flex items-center">
          <input
            type="text"
            value={profileUrl}
            disabled
            className="input input-bordered w-full p-2 mr-2"
          />
          <Button onClick={copyToClipboard}>Copy</Button>
        </div>
      </div>

      <div className="mb-4">
        <Switch
          {...register('acceptMessage')}
          checked={acceptMessage}
          onCheckedChange={handleSwitchChange}
          disabled={isSwitchLoading}
        />
        <span className="ml-2">
          Accept Messages: {acceptMessage ? 'On' : 'Off'}
        </span>
      </div>
      <Separator />

      <Button
        className="mt-4"
        variant="outline"
        onClick={(e : any) => {
          e.preventDefault();
          fetchMessages(true);
        }}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <RefreshCcw className="h-4 w-4" />
        )}
      </Button>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        {messages.length > 0 ? (
          messages.map((message, index) => (
            <MessageCard
              key={message._id}
              message={message}
              onMessageDelete={handleDeleteMessage}
            />
          ))
        ) : (
          <p>No messages to display.</p>
        )}
      </div>
    </div>
  );
}

export default page