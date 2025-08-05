import { useState } from "react";
import { useAppointmentStore } from "~/store/store";
import type { FormData } from "~/types/types";
// @ts-ignore
import type { Route } from "./+types/home";
import { useFetcher } from "react-router";

export function meta({}: Route.MetaArgs) {
    return [
        { title: "Create Appointment" },
        { name: "description", content: "Welcome to React Router!" },
    ];
}

const CreateAppointment = () => {
    // const addAppointment = useAppointmentStore((state) => state.addAppointment);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState<FormData>({
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
            fetcher.submit(
                { ...formData },
                {
                    method: "post",
                    action: "/appointments/action",
                }
            );

            // addAppointment(formData);

            // Reset form
            setFormData({
                title: "",
                description: "",
                date: "",
                time: "",
                duration: 60,
                clientName: "",
                clientEmail: "",
                clientPhone: "",
            });

            // Show success message
            const successToast = document.createElement("div");
            successToast.className = "toast toast-top toast-center z-50";
            successToast.innerHTML = `
          <div class="alert alert-success">
            <span>✅ Appointment created successfully!</span>
          </div>
        `;
            document.body.appendChild(successToast);
            setTimeout(() => document.body.removeChild(successToast), 3000);
        } catch (error) {
            console.error("Error creating appointment:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                    <h2 className="card-title text-2xl mb-6">Create New Appointment</h2>

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
                                name="clientPhone"
                                value={formData.clientPhone}
                                onChange={handleInputChange}
                                placeholder="+1 (555) 123-4567"
                                className="input input-bordered w-full"
                            />
                        </div>

                        {/* Submit Button */}
                        <div className="form-control mt-8">
                            <button
                                type="submit"
                                className={`btn btn-primary btn-lg ${
                                    isSubmitting ? "loading" : ""
                                }`}
                                disabled={isSubmitting}>
                                {isSubmitting ? "Creating..." : "Create Appointment"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateAppointment;
