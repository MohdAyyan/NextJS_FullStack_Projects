"use client";
import axios from "axios";
import React, { useEffect, useRef, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { doctorAgent } from "../../_components/DoctorAgentCard";
import { Circle, PhoneCall, PhoneOff } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Vapi from "@vapi-ai/web";
import { toast } from "sonner";

export type SessionDetail = {
  id: number;
  sessionId: string;
  notes: string;
  report: JSON;
  selectedDoctor: doctorAgent;
  createdOn: string;
};

type message = {
  role: string;
  text: string;
};

interface VapiEventListeners {
  "call-start": () => void;
  "call-end": () => void;
  message: (message: any) => void;
  error: (error: Error) => void;
  "speech-start": () => void;
  "speech-end": () => void;
}

function MedicalVoiceAgent() {
  const { sessionId } = useParams();
  const [sessionDetails, setSessionDetails] = React.useState<SessionDetail>();
  const [callStarted, setCallStarted] = React.useState(false);
  const [currentRole, setCurrentRole] = React.useState<any | null>("");
  const [liveTranscript, setLiveTranscript] = React.useState("");
  const [messages, setMessages] = React.useState<message[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [vapiInstance, setVapiInstance] = React.useState<any>();
  const router = useRouter();
  const vapiRef = useRef<any>(null);
  const eventListenersRef = useRef<boolean>(false);

  useEffect(() => {
    sessionId && GetSessionDetails();
  }, [sessionId]);

  const GetSessionDetails = async () => {
    try {
      setIsLoading(true);
      const result = await axios.get(
        `/api/session-chat?sessionId=${sessionId}`
      );
      if (!result.data) {
        throw new Error("No session data found");
      }
      setSessionDetails(result.data);
    } catch (error) {
      console.error("Error fetching session details:", error);
      // Add toast notification here
    } finally {
      setIsLoading(false);
    }
  };


  const StartCall = async () => {
    try {
      if (!process.env.NEXT_PUBLIC_VAPI_API_KEY) {
        throw new Error("Missing Vapi API key");
      }

      const vapi = new Vapi(process.env.NEXT_PUBLIC_VAPI_API_KEY);
      vapiRef.current = vapi;
      setVapiInstance(vapi);

      const VapiAgentConfig = {
        name: "AI Medical Doctor Voice Agent",
        firstMessage:
          "Hi there, I'm an AI medical assistant. I'm here to help you with any health questions or concerns you might have. How are you feeling today?",
        transcriber: {
          provider: "AssemblyAI",
          language: "en",
        },
        voice: {
          provider: "Playht",
          voiceId: sessionDetails?.selectedDoctor?.voiceId || "Will",
        },
        model: {
          provider: "OpenAI",
          model: "GPT-4.1",
          messages: [
            {
              role: "system",
              content: sessionDetails?.selectedDoctor?.agentPrompt || "",
            },
          ],
        },
      };

      // Set up event listeners before starting
      if (!eventListenersRef.current) {
        // Add event listeners using stored references
        Object.entries(eventListeners.current).forEach(([event, listener]) => {
          vapiRef.current.on(event, listener);
        });
        eventListenersRef.current = true;
      }

      // Start the call
      //@ts-ignore
      await vapi.start(VapiAgentConfig);
    } catch (error) {
      console.error("Error starting call:", error);
      toast.error("Failed to start call");
      setCallStarted(false);
      if (vapiRef.current) {
        await endCall();
      }
    }
  };

  // Store event listeners in a ref to maintain references
  const eventListeners = useRef({
    "call-start": () => setCallStarted(true),
    "call-end": () => setCallStarted(false),
    error: (error: Error) => {
      console.error("Vapi error:", error);
      toast.error("Call error occurred");
      endCall();
    },
    message: (message: any) => {
      if (message.type === "transcript") {
        const { role, transcript, transcriptType } = message;
        if (transcriptType === "partial") {
          setLiveTranscript(transcript);
          setCurrentRole(role);
        } else if (transcriptType === "final") {
          setMessages((prev) => [...prev, { role, text: transcript }]);
          setLiveTranscript("");
          setCurrentRole(null);
        }
      }
    },
  });

  const removeEventListeners = useCallback(() => {
    if (vapiRef.current && eventListenersRef.current) {
      try {
        Object.entries(eventListeners.current).forEach(([event, listener]) => {
          vapiRef.current.off(event, listener);
        });
        eventListenersRef.current = false;
      } catch (error) {
        console.error("Error removing event listeners:", error);
      }
    }
  }, []);

  const endCall = useCallback(async () => {
    try {
      if (vapiRef.current) {
        await vapiRef.current.stop();
        removeEventListeners();
        setCallStarted(false);
        setVapiInstance(null);
        vapiRef.current = null;
        const result = await GenerateReport();
        if (result) {
          toast.success("Report generated successfully");
          router.replace("/dashboard");
        }
      }
    } catch (error) {
      console.error("Error ending call:", error);
      toast.error("Failed to end call");
    }
  }, [router, removeEventListeners]);

  const GenerateReport = async () => {
    try {
      setIsLoading(true);
      const result = await axios.post("/api/medical-report", {
        messages,
        sessionDetails,
        sessionId,
      });
      // toast.success("Report generated successfully");
      return result.data;
    } catch (error) {
      console.error("Error generating report:", error);
      // toast.error("Failed to generate report");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (vapiRef.current) {
        endCall();
      }
    };
  }, [endCall]);

  return (
    <div className="p-4 border rounded-3xl bg-secondary">
      <div className="flex justify-between items-center">
        <h2 className="p-1 px-2 border rounded-md flex gap-2 items-center">
          <Circle
            className={`rounded-full h-4 w-4 ${
              callStarted ? "text-green-500" : "text-gray-400"
            }`}
          />
          {callStarted ? "Connected..." : "Not Connected"}
        </h2>
        <h2 className="font-bold text-xl text-gray-400">00..00</h2>
      </div>
      {sessionDetails && (
        <div className="flex items-center flex-col mt-5">
          <Image
            src={sessionDetails?.selectedDoctor?.image}
            alt={sessionDetails?.selectedDoctor?.specialist}
            width={120}
            height={120}
            className="h-[100px] w-[100px] rounded-full object-cover"
          />
          <h2 className="text-xl font-bold mt-2">
            {sessionDetails?.selectedDoctor?.specialist}
          </h2>
          <p className="text-gray-400 text-sm mt-2">AI Medical Voice Agent</p>

          <div className="mt-20 overflow-y-auto max-h-60">
            {messages?.slice(-4).map((message, index) => (
              <h2 className="text-lg text-gray-400 p-3" key={index}>
                {message.role} : {message.text}
              </h2>
            ))}
            {liveTranscript?.length > 0 && (
              <h2 className="text-lg text-gray-400">
                {currentRole} : {liveTranscript}
              </h2>
            )}
          </div>

          {!callStarted ? (
            <Button
              className="mt-20 cursor-pointer"
              onClick={StartCall}
              disabled={isLoading}
            >
              <PhoneCall /> {isLoading ? "Starting..." : "Start Call"}
            </Button>
          ) : (
            <Button
              className="mt-20 cursor-pointer"
              variant="destructive"
              onClick={endCall}
            >
              <PhoneOff /> Disconnect
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

export default MedicalVoiceAgent;
