"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { IconArrowRight } from "@tabler/icons-react";
import axios from "axios";
import React from "react";
import  { doctorAgent } from "./DoctorAgentCard";
import SuggestDoctorCard from "./SuggestDoctorCard";
import { useRouter } from "next/navigation";
function AddNewSessionDialog() {
  const [note, setNote] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [suggestedDoctors, setSuggestedDoctors] =
    React.useState<doctorAgent[]>();
  const[selectedDoctor, setSelectedDoctor] = React.useState<doctorAgent>();
  const router = useRouter();


  const onStartConsultation = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await axios.post("/api/session-chat", { notes: note, selectedDoctor });
      console.log("Session Chat: ", result.data);
      // Optionally handle dialog close here if needed
      if(result.data?.sessionId){
        console.log("Session started with ID: ", result.data.sessionId);
        router.push(`/dashboard/medical-agent/${result.data.sessionId}`); // Navigate to the session page  
      }

      
    } catch (err: any) {
      setError(err?.response?.data?.error || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  const onClickNext = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await axios.post("/api/suggest-doctors", { notes: note });
      console.log("Suggested Doctors: ", result.data);
      setSuggestedDoctors(result.data);
      // Optionally handle dialog close here if needed
      
    }
    
    catch (err: any) {
      setError(err?.response?.data?.error || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger>
        <Button className="mt-3.5">+ Start a Consultation</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Basic Details</DialogTitle>
          <DialogDescription asChild>
            {!suggestedDoctors ? (
              <div>
                <h2>Add Symptoms or Any Other Details</h2>
                <div className="mt-4">
                  <Textarea
                    placeholder="Add Details Here"
                    className="h-[200px] border-2 mt-2 border-gray-300 rounded-lg p-2"
                    onChange={(e) => setNote(e.target.value)}
                    value={note}
                  />
                  {error && <div className="text-red-500 mt-2">{error}</div>}
                </div>
              </div>
            ) : (
                <div>
                <h2>Select the doctor</h2> 
              <div className="grid grid-cols-3 gap-5">
                {suggestedDoctors.map((doctorAgent, index) => (
                 <SuggestDoctorCard
  doctorAgent={doctorAgent}
  key={index}
  setSelectDoctor={setSelectedDoctor}
  selectedDoctor={selectedDoctor}
/>
                ))}
              </div>
              </div>
            )}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose>
            <Button variant={"outline"} type="button">
              Cancel
            </Button>
          </DialogClose>
          {!suggestedDoctors ? (
            <Button
              onClick={onClickNext}
              disabled={!note || loading}
              type="button"
            >
              {loading ? (
                "Loading..."
              ) : (
                <>
                  Next <IconArrowRight />
                </>
              )}
            </Button>
          ) : (
            <Button onClick={onStartConsultation}>Start Consultation</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default AddNewSessionDialog;
