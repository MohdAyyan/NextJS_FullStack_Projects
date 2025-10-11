"use client"

import { getAppointments } from "@/lib/actions/appointment";
import { useQuery } from "@tanstack/react-query";

export function useGetAppointments() {
    const result = useQuery({
      queryKey: ["getAppointments"],
      queryFn: getAppointments,
    });
    return result;
}