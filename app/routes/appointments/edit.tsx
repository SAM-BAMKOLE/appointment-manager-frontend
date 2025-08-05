// @ts-ignore
import type { Route } from "./+types/home";
import { Link, useNavigate, useParams, useFetcher } from "react-router";
import { useAppointmentStore } from "~/store/store";
import { useEffect, useState } from "react";
import type { CreateAppointmentData } from "~/types/types";
import axiosInstance from "~/utils/axios";
import type { ClientLoaderFunctionArgs } from "react-router";

export function meta({}: Route.MetaArgs) {
    return [
        { title: "Edit Appointment" },
        { name: "description", content: "Welcome to React Router!" },
    ];
}

export async function clientAction({ request, params }: Route.ClientActionArgs) {
    const method = request.method;
    let formData = await request.formData();

    switch (method) {
        case "PATCH":
            try {
                const { id, ...data } = Object.fromEntries(formData);
                data.duration = Number.parseInt(data.duration);
                const response = await axiosInstance.patch(`appointments/${id}`, data);
                return { success: response.data.success };
            } catch (error: any) {
                console.log(error);
            }
            break;
    }
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

const EditAppointment = ({ loaderData }: Route.ComponentProps) => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    // const { appointments, updateAppointment } = useAppointmentStore();

    // let appointment = appointments.find((apt) => apt.id === id);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState<CreateAppointmentData>({
        title: "",
        description: "",
        date: "",
        time: "",
        duration: 60,
        clientName: "",
        clientEmail: "",
        clientPhone: "",
    });

    const fetcher = useFetcher();

    const appointment = loaderData;

    // if (!appointment) {
    //     appointment = loaderData;
    // }

    useEffect(() => {
        if (appointment) {
            setFormData({
                title: appointment.title,
                description: appointment.description || "",
                date: appointment.date,
                time: appointment.time,
                duration: appointment.duration,
                clientName: appointment.clientName,
                clientEmail: appointment.clientEmail,
                clientPhone: appointment.clientPhone || "",
            });
        }
    }, [appointment]);

    if (!appointment) {
        return (
            <div className="text-center py-12">
                <div className="text-6xl mb-4">❌</div>
                <h3 className="text-2xl font-bold mb-2">Appointment Not Found</h3>
                <p className="text-base-content/70 mb-4">
                    The appointment you're trying to edit doesn't exist.
                </p>
                <Link to="/appointments" className="btn btn-primary">
                    Back to Appointments
                </Link>
            </div>
        );
    }

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === "duration" ? parseInt(value) : value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // Simulate API call delay
            // await new Promise((resolve) => setTimeout(resolve, 1000));

            fetcher.submit({ id: String(id), ...formData }, { method: "PATCH" });

            // updateAppointment(appointment.id, formData);

            // Show success message
            const successToast = document.createElement("div");
            successToast.className = "toast toast-top toast-center z-50";
            successToast.innerHTML = `
          <div class="alert alert-success">
            <span>✅ Appointment updated successfully!</span>
          </div>
        `;
            document.body.appendChild(successToast);
            setTimeout(() => {
                document.body.removeChild(successToast);
                navigate(`/appointments/view/${appointment.id}`);
            }, 1500);
        } catch (error) {
            console.error("Error updating appointment:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            {/* Header */}
            <div className="mb-6">
                <div className="breadcrumbs text-sm">
                    <ul>
                        <li>
                            <Link to="/appointments">Appointments</Link>
                        </li>
                        <li>
                            <Link to={`/appointments/${appointment.id}`}>Appointment Details</Link>
                        </li>
                        <li>Edit</li>
                    </ul>
                </div>
            </div>

            <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                    <h2 className="card-title text-2xl mb-6">Edit Appointment</h2>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Basic Information */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-medium">Title*</span>
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    placeholder="e.g., Haircut, Consultation"
                                    className="input input-bordered w-full"
                                    required
                                />
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-medium">Duration</span>
                                </label>
                                <select
                                    name="duration"
                                    value={formData.duration}
                                    onChange={handleInputChange}
                                    className="select select-bordered w-full">
                                    <option value={30}>30 minutes</option>
                                    <option value={45}>45 minutes</option>
                                    <option value={60}>1 hour</option>
                                    <option value={90}>1.5 hours</option>
                                    <option value={120}>2 hours</option>
                                </select>
                            </div>
                        </div>

                        <div className="form-control">
                            <label className="label block mb-1">
                                <span className="label-text font-medium">Description</span>
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                placeholder="Additional notes or details..."
                                className="textarea textarea-bordered h-24 w-full"
                            />
                        </div>

                        {/* Date & Time */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-medium">Date*</span>
                                </label>
                                <input
                                    type="date"
                                    name="date"
                                    value={formData.date}
                                    onChange={handleInputChange}
                                    className="input input-bordered w-full"
                                    required
                                />
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-medium">Time*</span>
                                </label>
                                <input
                                    type="time"
                                    name="time"
                                    value={formData.time}
                                    onChange={handleInputChange}
                                    className="input input-bordered w-full"
                                    required
                                />
                            </div>
                        </div>

                        {/* Client Information */}
                        <div className="divider">Client Information</div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-medium">Client Name*</span>
                                </label>
                                <input
                                    type="text"
                                    name="clientName"
                                    value={formData.clientName}
                                    onChange={handleInputChange}
                                    placeholder="Full name"
                                    className="input input-bordered w-full"
                                    required
                                />
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-medium">Client Email</span>
                                </label>
                                <input
                                    type="email"
                                    name="clientEmail"
                                    value={formData.clientEmail}
                                    onChange={handleInputChange}
                                    placeholder="email@example.com"
                                    className="input input-bordered w-full"
                                />
                            </div>
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-medium">Client Phone</span>
                            </label>
                            <input
                                type="tel"
                                inputMode="numeric"
                                pattern="[0-9]*"
                                name="clientPhone"
                                value={formData.clientPhone}
                                onChange={handleInputChange}
                                placeholder="+1 (555) 123-4567"
                                className="input input-bordered w-full"
                            />
                        </div>

                        {/* Submit Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 mt-8">
                            <button
                                type="submit"
                                className={`btn btn-primary flex-1 ${
                                    isSubmitting ? "loading" : ""
                                }`}
                                disabled={isSubmitting}>
                                {isSubmitting ? "Updating..." : "Update Appointment"}
                            </button>

                            <Link
                                to={`/appointments/view/${appointment.id}`}
                                className="btn btn-outline flex-1">
                                Cancel
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditAppointment;
