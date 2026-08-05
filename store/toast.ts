"use client";

import { create } from "zustand";

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
}

interface ToastState {
  toasts: ToastMessage[];
  show: (title: string, description?: string) => void;
  dismiss: (id: string) => void;
}

export const useToastStore = create<ToastState>((set, get) => ({
  toasts: [],
  show: (title, description) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    set({ toasts: [...get().toasts, { id, title, description }] });
    setTimeout(() => get().dismiss(id), 4000);
  },
  dismiss: (id) => set({ toasts: get().toasts.filter((t) => t.id !== id) }),
}));
