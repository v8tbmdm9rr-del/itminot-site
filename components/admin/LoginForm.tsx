"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function LoginForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(data?.error || "Не удалось войти");
        return;
      }
      router.replace("/admin");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="mx-auto flex w-full max-w-sm flex-col gap-5 rounded-3xl border border-cream/10 bg-charcoal-soft p-8"
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gold/10 text-gold">
          <Lock size={20} aria-hidden />
        </div>
        <h1 className="font-display text-2xl text-cream">Вход в админ-панель</h1>
        <p className="text-sm text-cream/55">ITMINOT — управление меню и бронированием</p>
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-cream/60" htmlFor="password">
          Пароль
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoFocus
          className="w-full rounded-xl border border-cream/15 bg-charcoal px-4 py-3 text-sm text-cream focus:border-gold"
        />
      </div>

      {error && <p className="text-sm text-ember">{error}</p>}

      <Button type="submit" size="lg" disabled={loading || password.length === 0}>
        {loading ? "Входим…" : "Войти"}
      </Button>
    </form>
  );
}
