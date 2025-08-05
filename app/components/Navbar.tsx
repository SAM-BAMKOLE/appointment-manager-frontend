import { Link, NavLink, useNavigate } from "react-router";
import { useAuthStore } from "../store/auth";
import axiosInstance from "~/utils/axios";

const Navbar = () => {
    // const location = useLocation();

    const { isAuthenticated, logout: clearAuth, user } = useAuthStore();
    const navigate = useNavigate();

    const logout = () => axiosInstance.post("/auth/signout");

    const handleLogout = async () => {
        try {
            await logout();
            clearAuth();
            navigate("/login");
        } catch (err) {
            console.error("Logout failed", err);
        }
    };

    return (
        <div className="navbar bg-base-100 shadow-lg">
            <div className="navbar-start">
                <Link to="/" className="btn btn-ghost text-xl">
                    📅 AppointmentApp
                </Link>
            </div>
            {isAuthenticated ? (
                <>
                    <div className="navbar-center">
                        <div className="tabs tabs-boxed">
                            <NavLink
                                to="/appointments"
                                className={({ isActive }) => (isActive ? "tab tab-active" : "tab")}>
                                View Appointments
                            </NavLink>
                            <NavLink
                                to="/appointments/create"
                                className={({ isActive }) => (isActive ? "tab tab-active" : "tab")}>
                                Create Appointment
                            </NavLink>
                        </div>
                    </div>
                    <div className="navbar-end">
                        <div className="dropdown dropdown-end">
                            <div
                                tabIndex={0}
                                role="button"
                                className="btn btn-ghost btn-circle avatar">
                                <div className="w-10 rounded-full bg-primary text-center py-2">
                                    {user ? user.firstName[0] + user.lastName[0] : "U"}
                                </div>
                                {/* <div className="w-10 rounded-full bg-primary text-primary-content flex items-center justify-center">
                            <div className="text-sm font-bold">U</div>
                        </div> */}
                            </div>
                            <ul
                                tabIndex={0}
                                className="menu dropdown-content bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
                                <li>
                                    <Link to="/profile">Profile</Link>
                                </li>
                                <li>
                                    <button onClick={handleLogout}>Logout</button>
                                </li>
                            </ul>
                        </div>
                    </div>
                </>
            ) : (
                <>
                    <div className="navbar-end space-x-3">
                        <Link to="/login">Login</Link>
                        <Link to="/register">Register</Link>
                    </div>
                </>
            )}
        </div>
    );
};

export default Navbar;
