import { create } from "zustand";
import type { AppointmentStore, Appointment } from "~/types/types";
import axiosInstance from "~/utils/axios";

const initialAppointment: Appointment = {
    id: "1",
    title: "Home service at Mokola",
    description:
        "Home service barbing for Henry Wales. Location - Plot 13 MS way Mokola Ibadan. Note to self - Dress Corporately.",
    date: "2025-07-07",
    time: "15:00:00",
    duration: 60, // in minutes
    clientName: "Henry Wales",
    clientEmail: "",
    clientPhone: "09023456789",
    status: "scheduled",
    createdAt: String(new Date()),
    updatedAt: String(new Date()),
};

export const useAppointmentStore = create<AppointmentStore>((set, get) => ({
    // appointments: [initialAppointment],
    appointments: [],
    isLoading: false,
    error: null,

    addAppointment: (appointmentData) => {
        const newAppointment: Appointment = {
            id: Date.now().toString(),
            ...appointmentData,
            status: "scheduled",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        set((state) => ({
            appointments: [...state.appointments, newAppointment],
        }));
    },

    updateAppointment: async (id, updatedData) => {
        try {
            set((state) => ({
                appointments: state.appointments.map((appointment) =>
                    appointment.id === id
                        ? { ...appointment, ...updatedData, updatedAt: new Date().toISOString() }
                        : appointment
                ),
            }));
        } catch (error) {
            console.log(error);
        }
    },

    deleteAppointment: async (id: string) => {
        try {
            set((state) => ({
                appointments: state.appointments.filter(
                    (appointment: Appointment) => appointment.id !== id
                ),
            }));
        } catch (error) {
            console.log(error);
        }
    },

    setAppointments: (appointments: Appointment[]) => {
        set({ appointments });
    },
    setLoading: (isLoading: boolean) => set({ isLoading }),
    setError: (error) => set({ error }),
}));
