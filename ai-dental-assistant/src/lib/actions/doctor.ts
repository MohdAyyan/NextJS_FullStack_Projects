"use server";

import { prisma } from "@/lib/prisma";
import { Doctor, Gender } from "@prisma/client";
import { generateAvatar } from "../utils";
import { revalidatePath } from "next/cache";

export async function getDoctors() {
  try {
    const doctors = await prisma.doctor.findMany({
      include: {
        _count: {
          select: {
            appointments: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return doctors.map((doctor) => ({
      ...doctor,
      appointmentCount: doctor._count.appointments,
    }));
  } catch (error) {
    console.error("Error fetching doctors:", error);
    throw new Error("Failed to fetch doctors");
  }
}

interface CreateDoctorInput {
  name: string;
  email: string;
  phone: string;
  specialty: string; // Fixed typo from 'speciality'
  gender: Gender;
  isActive: boolean;
}

export async function createDoctor(input: CreateDoctorInput) {
  try {
    if (!input.name || !input.email) {
      throw new Error("Name and Email are required");
    }

    const existingDoctor = await prisma.doctor.findUnique({
      where: { email: input.email },
    });

    if (existingDoctor) {
      throw new Error("Doctor with this email already exists");
    }

    const newDoctor = await prisma.doctor.create({
      data: {
        ...input,
        //@ts-ignore
        imageUrl: generateAvatar(input.name, input.gender),
      },
    });

    revalidatePath("/admin");

    return newDoctor;
  } catch (error) {
    console.error("Error creating doctor:", error);
    throw new Error("Failed to create doctor");
  }
}

interface UpdateDoctorInput extends Partial<CreateDoctorInput> {
  id: string;
}


export async function updateDoctor(input: UpdateDoctorInput) {
  try {
    // validate
    if (!input.name || !input.email) throw new Error("Name and email are required");

    const currentDoctor = await prisma.doctor.findUnique({
      where: { id: input.id },
      select: { email: true },
    });

    if (!currentDoctor) throw new Error("Doctor not found");

    // if email is changing, check if the new email already exists
    if (input.email !== currentDoctor.email) {
      const existingDoctor = await prisma.doctor.findUnique({
        where: { email: input.email },
      });

      if (existingDoctor) {
        throw new Error("A doctor with this email already exists");
      }
    }

    const doctor = await prisma.doctor.update({
      where: { id: input.id },
      // ...input is going to trigger the unique constraint violation for email
      data: {
        name: input.name,
        email: input.email,
        phone: input.phone,
        specialty: input.specialty,
        gender: input.gender,
        isActive: input.isActive,
      },
    });

    return doctor;
  } catch (error) {
    console.error("Error updating doctor:", error);
    throw new Error("Failed to update doctor");
  }
}
export async function getAvailableDoctors() {
  try {
    const doctors = await prisma.doctor.findMany({
      where: {
        isActive: true,
      },
      include: {
        _count: {
          select: {
            appointments: true,
          },
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });
    return doctors.map((doctor) => ({
      ...doctor,
      appointmentCount: doctor._count.appointments,
    }));
  } catch (error) {
    console.error("Error fetching doctors:", error);
    throw new Error("Failed to fetch doctors");
  }
}