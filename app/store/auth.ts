import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import Cookies from "js-cookie";
import type { User } from "~/types/types";

interface AuthState {
    isAuthenticated: boolean;
    accessToken: string | null;
    user: User | null;
    setUser: (user: object) => void;
    setAccessToken: (accessToken: string) => void;
    logout: () => void;
    checkAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            isAuthenticated: Cookies.get("accessToken") ? true : false,
            accessToken: Cookies.get("accessToken") ? (Cookies.get("accessToken") as string) : null,
            user: null,
            setAccessToken: (accessToken) => {
                Cookies.set("accessToken", accessToken, {
                    expires: 1 / 24,
                    secure: true,
                    sameSite: "strict",
                });
                set({ isAuthenticated: true, accessToken });
            },
            setUser: (user: any) => set({ user, isAuthenticated: !!user }),
            logout: () => {
                Cookies.remove("accessToken");
                set({ isAuthenticated: false, accessToken: null });
            },
            checkAuth: () => {
                const accessToken = Cookies.get("accessToken");
                if (accessToken) {
                    set({ isAuthenticated: true, accessToken });
                } else {
                    set({ isAuthenticated: false, accessToken: null });
                }
            },
        }),
        {
            name: "auth-storage",
            storage: createJSONStorage(() => ({
                getItem: (name) => Cookies.get(name) || null,
                setItem: (name, value) =>
                    Cookies.set(name, value, { expires: 7, secure: true, sameSite: "strict" }),
                removeItem: (name) => Cookies.remove(name),
            })),
        }
    )
);
