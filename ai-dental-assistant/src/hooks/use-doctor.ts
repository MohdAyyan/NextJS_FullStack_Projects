"use client"

;
import { createDoctor, getAvailableDoctors, getDoctors, updateDoctor } from "@/lib/actions/doctor";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";


export function useGetDoctors() {
  const result = useQuery({
    queryKey: ["getDoctors"],
    queryFn: getDoctors,
  });

  return result;
}

export function userCreateDoctor() {

  const queryClient = useQueryClient();


  const result = useMutation({
    mutationKey: ["createDoctor"],
    mutationFn: createDoctor,
    onSuccess: () => {
      console.log("Doctor created successfully")
      queryClient.invalidateQueries({ queryKey: ["getDoctors"] }); // Invalidate and refetch
    },
    onError: (error) => console.error("Error creating doctor:", error),
  })


  return result;
}


export function useUpdateDoctor() {
  const queryClient = useQueryClient();
  const result = useMutation({
    mutationKey: ["updateDoctor"],
    mutationFn: updateDoctor,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getDoctors"] }); // Invalidate and refetch
    },
    onError: (error) => console.error("Error updating doctor:", error),
  });

  return result;
}


export function useAvailableDoctors() {
  const result = useQuery({
    queryKey: ["availableDoctors"],
    queryFn: getAvailableDoctors,
  });

  return result;
}