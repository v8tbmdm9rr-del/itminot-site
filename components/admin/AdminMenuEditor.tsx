"use client";

import { useMemo, useRef, useState } from "react";
import { ImagePlus, Pencil, Plus, Trash2, Upload, X } from "lucide-react";
import type { CategoryId, MenuItem, MenuTag } from "@/types/menu";
import { CATEGORIES } from "@/data/categories";
import { DishImage } from "@/components/menu/DishImage";
import { Button } from "@/components/ui/Button";
import { formatPrice } from "@/utils/format";
import { cn } from "@/utils/cn";

const TAG_OPTIONS: { id: MenuTag; label: string }[] = [
  { id: "hit", label: "Хит" },
  { id: "spicy", label: "Острое" },
  { id: "new", label: "Новинка" },
  { id: "vegetarian", label: "Вегетарианское" },
];

const inputClasses =
  "w-full rounded-xl border border-cream/15 bg-charcoal px-4 py-2.5 text-sm text-cream placeholder:text-cream/35 focus:border-gold";
const labelClasses = "mb-1.5 block text-xs font-semibold uppercase tracking-wide text-cream/60";

interface FormState {
  name: string;
  category: CategoryId;
  shortDescription: string;
  composition: string;
  weight: string;
  price: string;
  hasSizes: boolean;
  smallPrice: string;
  tags: MenuTag[];
  image: string;
}

function itemToForm(item?: MenuItem): FormState {
  if (!item) {
    return {
      name: "",
      category: "pizza",
      shortDescription: "",
      composition: "",
      weight: "",
      price: "",
      hasSizes: false,
      smallPrice: "",
      tags: [],
      image: "",
    };
  }
  return {
    name: item.name,
    category: item.category,
    shortDescription: item.shortDescription,
    composition: item.composition.join(", "),
    weight: item.weight,
    price: String(item.sizes ? item.sizes[item.sizes.length - 1].price : item.price),
    hasSizes: Boolean(item.sizes),
    smallPrice: item.sizes ? String(item.sizes[0].price) : "",
    tags: item.tags ?? [],
    image: item.image ?? "",
  };
}

export function AdminMenuEditor({ initialItems }: { initialItems: MenuItem[] }) {
  const [items, setItems] = useState<MenuItem[]>(initialItems);
  const [categoryFilter, setCategoryFilter] = useState<CategoryId | "all">("all");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState<FormState>(itemToForm());
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filtered = useMemo(
    () => (categoryFilter === "all" ? items : items.filter((i) => i.category === categoryFilter)),
    [items, categoryFilter],
  );

  function startCreate() {
    setForm(itemToForm());
    setCreating(true);
    setEditingId(null);
    setError(null);
  }

  function startEdit(item: MenuItem) {
    setForm(itemToForm(item));
    setEditingId(item.id);
    setCreating(false);
    setError(null);
  }

  function closeForm() {
    setCreating(false);
    setEditingId(null);
    setError(null);
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setUploading(true);
    setUploadError(null);
    try {
      const body = new FormData();
      body.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body });
      const data = await res.json();
      if (!res.ok) {
        setUploadError(data?.error || "Не удалось загрузить фото");
        return;
      }
      setForm((p) => ({ ...p, image: data.path }));
    } catch {
      setUploadError("Не удалось загрузить фото. Проверьте соединение и попробуйте снова.");
    } finally {
      setUploading(false);
    }
  }

  function toggleTag(tag: MenuTag) {
    setForm((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag) ? prev.tags.filter((t) => t !== tag) : [...prev.tags, tag],
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const payload = {
      name: form.name,
      category: form.category,
      shortDescription: form.shortDescription,
      composition: form.composition,
      weight: form.weight,
      price: Number(form.price),
      hasSizes: form.hasSizes,
      smallPrice: form.smallPrice ? Number(form.smallPrice) : undefined,
      tags: form.tags,
      image: form.image,
    };

    try {
      const url = editingId ? `/api/admin/menu/${editingId}` : "/api/admin/menu";
      const method = editingId ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setError("Проверьте поля формы — не удалось сохранить блюдо.");
        return;
      }
      if (editingId) {
        setItems((prev) => prev.map((i) => (i.id === editingId ? data.item : i)));
      } else {
        setItems((prev) => [...prev, data.item]);
      }
      closeForm();
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Удалить это блюдо из меню?")) return;
    const res = await fetch(`/api/admin/menu/${id}`, { method: "DELETE" });
    if (res.ok) {
      setItems((prev) => prev.filter((i) => i.id !== id));
    }
  }

  const showForm = creating || editingId !== null;
  const canHaveSizes = form.category !== "drinks";

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setCategoryFilter("all")}
            className={cn(
              "rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-wide",
              categoryFilter === "all" ? "border-gold bg-gold text-charcoal" : "border-cream/15 text-cream/70",
            )}
          >
            Все
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategoryFilter(cat.id)}
              className={cn(
                "rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-wide",
                categoryFilter === cat.id ? "border-gold bg-gold text-charcoal" : "border-cream/15 text-cream/70",
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>
        <Button onClick={startCreate} className="gap-2">
          <Plus size={16} aria-hidden /> Добавить блюдо
        </Button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="space-y-5 rounded-2xl border border-gold/30 bg-charcoal-soft p-6"
        >
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl text-cream">
              {editingId ? "Редактировать блюдо" : "Новое блюдо"}
            </h2>
            <button type="button" onClick={closeForm} aria-label="Закрыть форму" className="text-cream/50 hover:text-cream">
              <X size={18} />
            </button>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className={labelClasses} htmlFor="f-name">Название</label>
              <input
                id="f-name"
                className={inputClasses}
                value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                required
              />
            </div>
            <div>
              <label className={labelClasses} htmlFor="f-category">Категория</label>
              <select
                id="f-category"
                className={inputClasses}
                value={form.category}
                onChange={(e) =>
                  setForm((p) => ({
                    ...p,
                    category: e.target.value as CategoryId,
                    hasSizes: e.target.value === "drinks" ? false : p.hasSizes,
                  }))
                }
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className={labelClasses} htmlFor="f-desc">Краткое описание</label>
            <input
              id="f-desc"
              className={inputClasses}
              value={form.shortDescription}
              onChange={(e) => setForm((p) => ({ ...p, shortDescription: e.target.value }))}
              required
            />
          </div>

          <div>
            <label className={labelClasses} htmlFor="f-composition">Состав (через запятую)</label>
            <input
              id="f-composition"
              className={inputClasses}
              placeholder="Томатный соус, Моцарелла, Базилик"
              value={form.composition}
              onChange={(e) => setForm((p) => ({ ...p, composition: e.target.value }))}
              required
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-3">
            <div>
              <label className={labelClasses} htmlFor="f-weight">Вес / объём</label>
              <input
                id="f-weight"
                className={inputClasses}
                placeholder="480 г"
                value={form.weight}
                onChange={(e) => setForm((p) => ({ ...p, weight: e.target.value }))}
                required
              />
            </div>
            <div>
              <label className={labelClasses} htmlFor="f-price">
                {form.hasSizes ? "Цена (большой размер)" : "Цена"}
              </label>
              <input
                id="f-price"
                type="number"
                min={1}
                className={inputClasses}
                value={form.price}
                onChange={(e) => setForm((p) => ({ ...p, price: e.target.value }))}
                required
              />
            </div>
            {form.hasSizes && (
              <div>
                <label className={labelClasses} htmlFor="f-small-price">Цена (маленький размер)</label>
                <input
                  id="f-small-price"
                  type="number"
                  min={1}
                  className={inputClasses}
                  value={form.smallPrice}
                  onChange={(e) => setForm((p) => ({ ...p, smallPrice: e.target.value }))}
                />
              </div>
            )}
          </div>

          {canHaveSizes && (
            <label className="flex items-center gap-2 text-sm text-cream/70">
              <input
                type="checkbox"
                className="accent-[var(--color-gold)]"
                checked={form.hasSizes}
                onChange={(e) => setForm((p) => ({ ...p, hasSizes: e.target.checked }))}
              />
              Два размера ({form.category === "pizza" ? "25 см / 32 см" : "20 см / 30 см"})
            </label>
          )}

          <div>
            <p className={labelClasses}>Отметки</p>
            <div className="flex flex-wrap gap-3">
              {TAG_OPTIONS.map((tag) => (
                <label key={tag.id} className="flex items-center gap-2 text-sm text-cream/70">
                  <input
                    type="checkbox"
                    className="accent-[var(--color-gold)]"
                    checked={form.tags.includes(tag.id)}
                    onChange={() => toggleTag(tag.id)}
                  />
                  {tag.label}
                </label>
              ))}
            </div>
          </div>

          <div>
            <p className={labelClasses}>Фото блюда</p>
            <div className="flex items-center gap-4">
              <div className="relative flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-cream/15 bg-charcoal">
                {form.image ? (
                  // eslint-disable-next-line @next/next/no-img-element -- маленькое превью в форме админки, next/image здесь избыточен
                  <img src={form.image} alt="" className="h-full w-full object-cover" />
                ) : (
                  <ImagePlus size={22} className="text-cream/25" aria-hidden />
                )}
              </div>
              <div className="flex-1">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={uploading}
                  onClick={() => fileInputRef.current?.click()}
                  className="gap-2"
                >
                  <Upload size={14} aria-hidden />
                  {uploading ? "Загружаем…" : "Загрузить фото с телефона или ПК"}
                </Button>
                {uploadError && <p className="mt-1.5 text-xs text-ember">{uploadError}</p>}
                <input
                  id="f-image"
                  className={cn(inputClasses, "mt-2")}
                  placeholder="/images/menu/novoe-blyudo.webp"
                  value={form.image}
                  onChange={(e) => setForm((p) => ({ ...p, image: e.target.value }))}
                />
                <p className="mt-1.5 text-xs text-cream/45">
                  Загрузите фото, и путь заполнится сам. Если оставить поле пустым, вместо фото покажется аккуратная
                  плашка с иконкой.
                </p>
              </div>
            </div>
          </div>

          {error && <p className="text-sm text-ember">{error}</p>}

          <div className="flex gap-3">
            <Button type="submit" disabled={saving}>
              {saving ? "Сохраняем…" : "Сохранить"}
            </Button>
            <Button type="button" variant="outline" onClick={closeForm}>
              Отмена
            </Button>
          </div>
        </form>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((item) => (
          <div key={item.id} className="overflow-hidden rounded-2xl border border-cream/10 bg-charcoal-soft">
            <div className="relative aspect-[4/3]">
              <DishImage image={item.image} name={item.name} category={item.category} sizes="360px" />
            </div>
            <div className="p-4">
              <div className="flex items-start justify-between gap-2">
                <p className="font-display text-lg text-cream">{item.name}</p>
                <div className="flex shrink-0 gap-1">
                  <button
                    onClick={() => startEdit(item)}
                    aria-label={`Редактировать ${item.name}`}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-cream/10 text-cream hover:bg-gold hover:text-charcoal"
                  >
                    <Pencil size={14} aria-hidden />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    aria-label={`Удалить ${item.name}`}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-cream/10 text-cream hover:bg-ember"
                  >
                    <Trash2 size={14} aria-hidden />
                  </button>
                </div>
              </div>
              <p className="mt-1 text-xs uppercase tracking-wide text-cream/40">
                {CATEGORIES.find((c) => c.id === item.category)?.label}
              </p>
              <p className="mt-2 font-display text-gold">
                {item.sizes
                  ? `${formatPrice(item.sizes[0].price)} – ${formatPrice(item.sizes[item.sizes.length - 1].price)}`
                  : formatPrice(item.price)}
              </p>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="col-span-full py-12 text-center text-cream/50">В этой категории пока нет блюд.</p>
        )}
      </div>
    </div>
  );
}
