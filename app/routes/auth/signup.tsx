import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuthStore } from "../../store/auth";
import axiosInstance from "../../utils/axios";

// interface SignUpProps {
//     axiosInstance: AxiosInstance;
// }

const SignUp: React.FC = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [error, setError] = useState("");
    const setUser = useAuthStore((state) => state.setUser);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await axiosInstance.post("auth/signup", { email, password, name });
            setUser(response.data.user);
            navigate("/login");
        } catch (err: any) {
            setError(err.response?.data?.message || "An error occurred");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-base-100">
            <div className="card w-full max-w-md shadow-xl bg-white">
                <div className="card-body">
                    <h2 className="card-title text-3xl font-bold text-center text-gray-800">
                        Sign Up
                    </h2>
                    {error && <div className="alert alert-error">{error}</div>}
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text text-gray-600">Name</span>
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="input input-bordered w-full bg-gray-50 text-gray-800 focus:ring-2 focus:ring-primary"
                            placeholder="Enter your name"
                        />
                    </div>
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text text-gray-600">Email</span>
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="input input-bordered w-full bg-gray-50 text-gray-800 focus:ring-2 focus:ring-primary"
                            placeholder="Enter your email"
                        />
                    </div>
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text text-gray-600">Password</span>
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="input input-bordered w-full bg-gray-50 text-gray-800 focus:ring-2 focus:ring-primary"
                            placeholder="Enter your password"
                        />
                    </div>
                    <div className="card-actions justify-center mt-6">
                        <button onClick={handleSubmit} className="btn btn-primary w-full">
                            Sign Up
                        </button>
                    </div>
                    <p className="text-center mt-4 text-gray-600">
                        Already have an account?{" "}
                        <Link to="/login" className="text-primary hover:underline">
                            Sign In
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SignUp;
