// @ts-ignore
import type { ClientLoaderFunctionArgs } from "react-router";
import type { Route } from "./+types/view";
import { Link, useFetcher, useParams } from "react-router";
import { useNavigate } from "react-router";
import { useAppointmentStore } from "~/store/store";
import axiosInstance from "~/utils/axios";

export function meta({}: Route.MetaArgs) {
    return [
        { title: "Details about appointment" },
        { name: "description", content: "Welcome to React Router!" },
    ];
}

export async function clientLoader({ params }: ClientLoaderFunctionArgs) {
    try {
        const requestParam = params.id;
        const response = await axiosInstance.get(`appointments/${requestParam}`);
        return response.data.data;
    } catch (error: any) {
        console.log(error);
    }
}

const AppointmentDetails = ({ loaderData }: Route.ComponentProps) => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    // const { appointments, deleteAppointment, updateAppointment } = useAppointmentStore();
    const fetcher = useFetcher();

    // let appointment = appointments.find((apt) => apt.id === id);
    const appointment = loaderData;

    // if (!appointment) {
    //     appointment = loaderData;
    // }

    if (!appointment) {
        return (
            <div className="text-center py-12">
                <div className="text-6xl mb-4">❌</div>
                <h3 className="text-2xl font-bold mb-2">Appointment Not Found</h3>
                <p className="text-base-content/70 mb-4">
                    The appointment you're looking for doesn't exist.
                </p>
                <Link to="/appointments" className="btn btn-primary">
                    Back to Appointments
                </Link>
            </div>
        );
    }

    const handleDelete = () => {
        if (window.confirm("Are you sure you want to delete this appointment?")) {
            fetcher.submit(
                { id: String(id) },
                { method: "delete", action: "/appointments/action" }
            );
            // deleteAppointment(appointment.id);
            navigate("/appointments");
        }
    };

    const handleStatusUpdate = (newStatus: typeof appointment.status) => {
        fetcher.submit(
            { id: String(id), status: newStatus },
            { method: "patch", action: "/appointments/action" }
        );
        // updateAppointment(appointment.id, { status: newStatus });
    };

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
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

    const getStatusBadge = (status: typeof appointment.status) => {
        const baseClasses = "badge badge-lg";
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

    const formatDateTime = (dateTime: string) => {
        return new Date(dateTime).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
        });
    };

    return (
        <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-6">
                <div className="breadcrumbs text-sm">
                    <ul>
                        <li>
                            <Link to="/appointments">Appointments</Link>
                        </li>
                        <li>Appointment Details</li>
                    </ul>
                </div>
            </div>

            {/* Main Content */}
            <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                    <div className="flex flex-col lg:flex-row justify-between items-start gap-4 mb-6">
                        <div>
                            <h1 className="text-3xl font-bold mb-2">{appointment.title}</h1>
                            <span className={getStatusBadge(appointment.status)}>
                                {appointment.status}
                            </span>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-2">
                            <Link
                                to={`/appointments/edit/${appointment.id}`}
                                className="btn btn-primary">
                                Edit Appointment
                            </Link>

                            <div className="dropdown dropdown-end">
                                <div tabIndex={0} role="button" className="btn btn-outline">
                                    Update Status
                                </div>
                                <ul
                                    tabIndex={0}
                                    className="dropdown-content menu bg-base-100 rounded-box z-[1] w-40 p-2 shadow">
                                    <li>
                                        <button onClick={() => handleStatusUpdate("scheduled")}>
                                            Scheduled
                                        </button>
                                    </li>
                                    <li>
                                        <button onClick={() => handleStatusUpdate("completed")}>
                                            Completed
                                        </button>
                                    </li>
                                    <li>
                                        <button onClick={() => handleStatusUpdate("cancelled")}>
                                            Cancelled
                                        </button>
                                    </li>
                                </ul>
                            </div>

                            <button className="btn btn-outline btn-error" onClick={handleDelete}>
                                Delete
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Appointment Information */}
                        <div className="space-y-6">
                            <div>
                                <h2 className="text-xl font-semibold mb-4">
                                    Appointment Information
                                </h2>

                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <span className="text-2xl">📅</span>
                                        <div>
                                            <p className="font-medium">Date</p>
                                            <p className="text-base-content/70">
                                                {formatDate(appointment.date)}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <span className="text-2xl">🕒</span>
                                        <div>
                                            <p className="font-medium">Time</p>
                                            <p className="text-base-content/70">
                                                {formatTime(appointment.time)}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <span className="text-2xl">⏱️</span>
                                        <div>
                                            <p className="font-medium">Duration</p>
                                            <p className="text-base-content/70">
                                                {appointment.duration} minutes
                                            </p>
                                        </div>
                                    </div>

                                    {appointment.description && (
                                        <div className="flex items-start gap-3">
                                            <span className="text-2xl">📝</span>
                                            <div>
                                                <p className="font-medium">Description</p>
                                                <p className="text-base-content/70">
                                                    {appointment.description}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Client Information */}
                        <div className="space-y-6">
                            <div>
                                <h2 className="text-xl font-semibold mb-4">Client Information</h2>

                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <span className="text-2xl">👤</span>
                                        <div>
                                            <p className="font-medium">Name</p>
                                            <p className="text-base-content/70">
                                                {appointment.clientName}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <span className="text-2xl">📧</span>
                                        <div>
                                            <p className="font-medium">Email</p>
                                            <a
                                                href={`mailto:${appointment.clientEmail}`}
                                                className="text-primary hover:underline">
                                                {appointment.clientEmail}
                                            </a>
                                        </div>
                                    </div>

                                    {appointment.clientPhone && (
                                        <div className="flex items-center gap-3">
                                            <span className="text-2xl">📞</span>
                                            <div>
                                                <p className="font-medium">Phone</p>
                                                <a
                                                    href={`tel:${appointment.clientPhone}`}
                                                    className="text-primary hover:underline">
                                                    {appointment.clientPhone}
                                                </a>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Metadata */}
                    <div className="divider"></div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-base-content/70">
                        <div>
                            <p className="font-medium">Created</p>
                            <p>{formatDateTime(appointment.createdAt)}</p>
                        </div>
                        <div>
                            <p className="font-medium">Last Updated</p>
                            <p>{formatDateTime(appointment.updatedAt)}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AppointmentDetails;
