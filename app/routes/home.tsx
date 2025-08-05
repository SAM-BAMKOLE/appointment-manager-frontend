import Navbar from "~/components/Navbar";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
    return [
        { title: "New React Router App" },
        { name: "description", content: "Welcome to React Router!" },
    ];
}

export default function Layout() {
    return (
        <div className="min-h-screen bg-base-200">
            <Navbar />

            <main className="container mx-auto px-4 py-8"></main>
        </div>
    );
}
