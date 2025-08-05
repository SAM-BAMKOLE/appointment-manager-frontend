export interface Appointment {
    id: string;
    title: string;
    description?: string;
    date: string;
    time: string;
    duration: number; // in minutes
    clientName: string;
    clientEmail?: string;
    clientPhone?: string;
    status: "scheduled" | "completed" | "cancelled";
    createdAt: string;
    updatedAt: string;
}

export interface CreateAppointmentData {
    title: string;
    description?: string;
    date: string;
    time: string;
    duration: number;
    clientName: string;
    clientEmail?: string;
    clientPhone?: string;
}

export interface AppointmentStore {
    appointments: Appointment[];
    isLoading: boolean;
    error: string | null;
    addAppointment: (appointment: CreateAppointmentData) => void;
    updateAppointment: (id: string, appointment: Partial<Appointment>) => void;
    deleteAppointment: (id: string) => void;
    setAppointments: (appointments: Appointment[]) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
}

export interface FormData extends CreateAppointmentData {
    date: string;
    time: string;
}

export interface User {
    email: string;
    firstName: string;
    id: string;
    lastName: string;
    role: string;
}
