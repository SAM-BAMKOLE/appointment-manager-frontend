import type { Route } from "./+types/list";
import { useAppointmentStore } from "~/store/store";
import { useEffect, useMemo, useState } from "react";
import type { Appointment } from "~/types/types";
import { Link, useFetcher } from "react-router";
import { LoadingSpinner } from "~/utils/helpers";
import axiosInstance from "~/utils/axios";
import { useAuthStore } from "~/store/auth";

export function meta({}: Route.MetaArgs) {
    return [
        { title: "All Appointments" },
        { name: "description", content: "Welcome to React Router!" },
    ];
}

export async function clientLoader() {
    const response = await axiosInstance.get("appointments/");
    const appointments = response.data.data;
    return appointments;
}

const Appointments = ({ loaderData }: Route.ComponentProps) => {
    // const { isLoading, setAppointments, deleteAppointment, updateAppointment } =
    //     useAppointmentStore();
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<
        "all" | "scheduled" | "completed" | "cancelled"
    >("all");
    const [sortBy, setSortBy] = useState<"date" | "client" | "title">("date");
    const fetcher = useFetcher();

    const appointments: Appointment[] = loaderData;

    // Filter and sort appointments
    const filteredAppointments = useMemo(() => {
        let filtered = appointments.filter((appointment) => {
            const matchesSearch =
                appointment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                appointment.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                appointment.clientEmail?.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesStatus = statusFilter === "all" || appointment.status === statusFilter;

            return matchesSearch && matchesStatus;
        });

        // Sort appointments
        filtered.sort((a, b) => {
            switch (sortBy) {
                case "date":
                    return (
                        new Date(a.date + " " + a.time).getTime() -
                        new Date(b.date + " " + b.time).getTime()
                    );
                case "client":
                    return a.clientName.localeCompare(b.clientName);
                case "title":
                    return a.title.localeCompare(b.title);
                default:
                    return 0;
            }
        });

        return filtered;
    }, [appointments, searchTerm, statusFilter, sortBy]);

    const handleStatusUpdate = (id: string, newStatus: Appointment["status"]) => {
        // fetcher.submit({ id, newStatus }, { method: "patch", action: "/appointments/update" });
        fetcher.submit(
            { id, status: newStatus },
            { method: "patch", action: "/appointments/action" }
        );
        // updateAppointment(id, { status: newStatus });
    };

    const handleDelete = (id: string) => {
        if (window.confirm("Are you sure you want to delete this appointment?")) {
            fetcher.submit({ id }, { method: "delete", action: "/appointments/action" });
            // deleteAppointment(id);
        }
    };

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString("en-US", {
            weekday: "short",
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    const formatTime = (time: string) => {
        return new Date(`2000-01-01T${time}`).toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
        });
    };

    const getStatusBadge = (status: Appointment["status"]) => {
        const baseClasses = "badge badge-sm";
        switch (status) {
            case "scheduled":
                return `${baseClasses} badge-primary`;
            case "completed":
                return `${baseClasses} badge-success`;
            case "cancelled":
                return `${baseClasses} badge-error`;
            default:
                return baseClasses;
        }
    };

    // if (isLoading) {
    //     return <LoadingSpinner />;
    // }

    // useEffect(() => {
    //     setAppointments(loaderData);
    //     return;
    // }, [setAppointments]);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-3xl font-bold">My Appointments</h1>
                <div className="stats shadow">
                    <div className="stat">
                        <div className="stat-title">Total</div>
                        <div className="stat-value text-primary">{appointments.length}</div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="card bg-base-100 shadow-lg">
                <div className="card-body">
                    <div className="flex flex-col lg:flex-row gap-4">
                        <div className="form-control flex-1">
                            <input
                                type="text"
                                placeholder="Search appointments..."
                                className="input input-bordered w-full"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <div className="form-control">
                            <select
                                className="select select-bordered"
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value as any)}>
                                <option value="all">All Status</option>
                                <option value="scheduled">Scheduled</option>
                                <option value="completed">Completed</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                        </div>

                        <div className="form-control">
                            <select
                                className="select select-bordered"
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value as any)}>
                                <option value="date">Sort by Date</option>
                                <option value="client">Sort by Client</option>
                                <option value="title">Sort by Title</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Appointments List */}
            {filteredAppointments.length === 0 ? (
                <div className="text-center py-12">
                    <div className="text-6xl mb-4">📅</div>
                    <h3 className="text-2xl font-bold mb-2">No appointments found</h3>
                    <p className="text-base-content/70">
                        {appointments.length === 0
                            ? "You haven't created any appointments yet."
                            : "No appointments match your current filters."}
                    </p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {filteredAppointments.map((appointment) => (
                        <div key={appointment.id} className="card bg-base-100 shadow-lg">
                            <div className="card-body">
                                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-xl font-bold">
                                                {appointment.title}
                                            </h3>
                                            <span className={getStatusBadge(appointment.status)}>
                                                {appointment.status}
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-sm">
                                            <div className="flex items-center gap-2">
                                                <span className="text-base-content/70">📅</span>
                                                <span>{formatDate(appointment.date)}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-base-content/70">🕒</span>
                                                <span>
                                                    {formatTime(appointment.time)} (
                                                    {appointment.duration}min)
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-base-content/70">👤</span>
                                                <span>{appointment.clientName}</span>
                                            </div>
                                        </div>

                                        {appointment.description && (
                                            <p className="text-base-content/70 mt-2">
                                                {appointment.description}
                                            </p>
                                        )}
                                    </div>

                                    <div className="flex flex-col sm:flex-row gap-2">
                                        <Link
                                            to={`/appointments/view/${appointment.id}`}
                                            className="btn btn-sm btn-outline">
                                            View Details
                                        </Link>

                                        <Link
                                            to={`/appointments/edit/${appointment.id}`}
                                            className="btn btn-sm btn-outline btn-primary">
                                            Edit
                                        </Link>

                                        <div className="dropdown dropdown-end">
                                            <div
                                                tabIndex={0}
                                                role="button"
                                                className="btn btn-sm btn-outline">
                                                Update Status
                                            </div>
                                            <ul
                                                tabIndex={0}
                                                className="dropdown-content menu bg-base-100 rounded-box z-[1] w-40 p-2 shadow">
                                                <li>
                                                    <button
                                                        onClick={() =>
                                                            handleStatusUpdate(
                                                                appointment.id,
                                                                "scheduled"
                                                            )
                                                        }>
                                                        Scheduled
                                                    </button>
                                                </li>
                                                <li>
                                                    <button
                                                        onClick={() =>
                                                            handleStatusUpdate(
                                                                appointment.id,
                                                                "completed"
                                                            )
                                                        }>
                                                        Completed
                                                    </button>
                                                </li>
                                                <li>
                                                    <button
                                                        onClick={() =>
                                                            handleStatusUpdate(
                                                                appointment.id,
                                                                "cancelled"
                                                            )
                                                        }>
                                                        Cancelled
                                                    </button>
                                                </li>
                                            </ul>
                                        </div>

                                        <button
                                            className="btn btn-sm btn-outline btn-error"
                                            onClick={() => handleDelete(appointment.id)}>
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Appointments;
