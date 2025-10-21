"use client";
import DoctorSelectionStep from "@/components/appointments/DoctorSelectionStep";
import ProgressSteps from "@/components/appointments/ProgressSteps";
import Navbar from "@/components/Navbar";
import React, { useState } from "react";

function AppointmentPage() {
  const [selectedDentistId, setSelectedDentistId] = useState<string | null>(
    null
  );
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [currentStep, setCurrentStep] = useState(1); // 1: select dentist, 2: select time, 3: confirm
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [bookedAppointment, setBookedAppointment] = useState<any>(null);


  const handleSelectionDentist = (dentistId: string) => {
      setSelectedDentistId(dentistId);

    // reset the state when dentist changes
    setSelectedDate("");
    setSelectedTime("");
    setSelectedType("");
  }



  return <>
   <Navbar />
   <div className="max-w-7xl mx-auto px-6 py-8 pt-24">
        {/* header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Book an Appointment</h1>
          <p className="text-muted-foreground">Find and book with verified dentists in your area</p>
        </div>
                
        <ProgressSteps currentStep={currentStep} />

    {
        currentStep === 1 && (
            <DoctorSelectionStep selectedDentistId={selectedDentistId} onContinue={()=> setCurrentStep(2) } 
            onSelectDentist={handleSelectionDentist}
            />
        )
    }

        </div>

  </>
}

export default AppointmentPage;
