import { create } from "zustand";
import type { User } from "@/types/user";

const API_URL: string = import.meta.env.VITE_API_URL;

type Store = {
    user: User | null;
    loading: boolean;
    error: string | null;
    fetchUser: (force?: boolean) => Promise<void>;
};

// ตัวแปร global เพื่อ cache promise ของ fetchUser
let userPromise: Promise<void> | null = null;
let isInitialized = false;

export const usePage = create<Store>((set) => ({
    user: null,
    loading: true,
    error: null,

    fetchUser: async (force = false) => {
        // ถ้ามี promise อยู่แล้ว ให้ return promise เดิม
        if (userPromise && !force) {
            return userPromise;
        }

        // สร้าง promise ใหม่และ cache ไว้
        userPromise = (async () => {
            set({ loading: true, error: null });

            try {
                const res = await fetch(`${API_URL}/session`, {
                    credentials: "include"
                });

                if (!res.ok) {
                    throw new Error("Failed to fetch");
                }

                const data = await res.json();
                set({
                    user: data.data,
                    loading: false,
                    error: null
                });

            } catch (err) {
                set({
                    user: null,
                    loading: false,
                    error: (err as Error).message
                });
            }
        })();

        return userPromise;
    },
}));

// เรียก fetchUser ครั้งแรกครั้งเดียวเมื่อ module ถูก import
if (!isInitialized) {
    isInitialized = true;
    usePage.getState().fetchUser();
}