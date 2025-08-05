import React, { useState } from "react";
import { useNavigate } from "react-router";
import { useAuthStore } from "../../store/auth";
import axiosInstance from "../../utils/axios";

// interface SignInProps {
//     axiosInstance: AxiosInstance;
// }

const SignIn: React.FC = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const setAccessToken = useAuthStore((state) => state.setAccessToken);
    const setUser = useAuthStore((state) => state.setUser);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await axiosInstance.post("auth/signin", {
                email,
                password,
            });
            
            setAccessToken(response.data.data.accessToken);
            setUser(response.data.data.user);
            navigate("/");
        } catch (err: any) {
            console.log(err);
            if (err.response?.data?.message && typeof err.response?.data?.message == "string") {
                setError(err.response?.data?.message || "An error has occurred");
            } else setError("An error occurred");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-base-100">
            <div className="card w-full max-w-md shadow-xl bg-white">
                <div className="card-body">
                    <h2 className="card-title text-3xl font-bold text-center text-gray-800">
                        Sign In
                    </h2>
                    {error && <div className="alert alert-error">{error}</div>}
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
                            Sign In
                        </button>
                    </div>
                    <p className="text-center mt-4 text-gray-600">
                        Don't have an account?{" "}
                        <a href="/register" className="text-primary hover:underline">
                            Sign Up
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SignIn;
