"use client"
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation"; // Fixed router import
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod";
import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { useDebounceValue } from 'usehooks-ts'
import { signUpSchema } from "@/schemas/signUpSchema";
import { ApiResponse } from "@/types/ApiResponse";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

function SignUpPage() {
  const [username, setUsername] = useState("");
  const [usernameMessage, setUsernameMessage] = useState("");
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const debounceUsername = useDebounceValue(username, 500);
  const router = useRouter();
     
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    const checkUsername = async () => {
      if (debounceUsername) {
        setIsCheckingUsername(true);
        setUsernameMessage("");
        try {
          const response = await axios.post(`/api/check-username-unique?username=${debounceUsername}`);
          setUsernameMessage(response.data.message);
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>;
          if (axiosError.response) {
            setUsernameMessage(axiosError.response.data.message);
          } else {
            setUsernameMessage("An error occurred while checking the username");
          }
        } finally {
          setIsCheckingUsername(false);
        }
      }
    };
    checkUsername();
  }, [debounceUsername]);

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post<ApiResponse>("/api/sign-up", data);
      toast.success(response.data.message);
      router.push(`/verify/${data.username}`);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      if (axiosError.response) {
        toast.error(axiosError.response.data.message);
      } else {
        toast.error("An error occurred during registration");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Create Account
          </h1>
          <p className="mb-4">Join True Feedback to start giving feedback</p>
        </div>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              name="username"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <Input 
                    {...field} 
                    onChange={(e) => {
                      field.onChange(e);
                      setUsername(e.target.value);
                    }}
                    disabled={isSubmitting}
                  />
                  {usernameMessage && (
                    <FormMessage>{usernameMessage}</FormMessage>
                  )}
                </FormItem>
              )}
            />
            
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <Input {...field} type="email" disabled={isSubmitting} />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <Input {...field} type="password" disabled={isSubmitting} />
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button 
              className="w-full" 
              type="submit" 
              disabled={isSubmitting || isCheckingUsername}
            >
              {isSubmitting ? "Creating account..." : "Sign Up"}
            </Button>
          </form>
        </Form>

        <div className="text-center mt-4">
          <p>
            Already have an account?{' '}
            <Link href="/sign-in" className="text-blue-600 hover:text-blue-800">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignUpPage;