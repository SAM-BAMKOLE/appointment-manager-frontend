import { Link, Outlet } from "react-router";
import Navbar from "~/components/Navbar";

const Layout = () => {
    return (
        <div className="min-h-screen bg-base-200">
            <Navbar />

            <main className="container mx-auto px-4 py-8">
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;
