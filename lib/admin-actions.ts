"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

/** Verifica que el usuario actual sea admin; devuelve el cliente con su sesión. */
async function assertAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("No autenticado");
  const { data: p } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();
  if (p?.role !== "admin") throw new Error("No autorizado");
  return supabase;
}

/** Revalida las páginas públicas del catálogo tras un cambio. */
function revalidateCatalog() {
  revalidatePath("/");
  revalidatePath("/catalogo");
  revalidatePath("/categoria/[slug]", "page");
  revalidatePath("/referencia/[slug]", "page");
  revalidatePath("/producto/[slug]", "page");
}

export async function updateProduct(formData: FormData) {
  const supabase = await assertAdmin();
  const slug = String(formData.get("slug"));
  const name = String(formData.get("name") ?? "").trim();
  const priceRaw = String(formData.get("price") ?? "").trim();
  const weightRaw = String(formData.get("weight_kg") ?? "").trim();
  const active = formData.get("active") === "on";

  const price =
    priceRaw === "" ? null : Math.round(Number(priceRaw.replace(/[^\d]/g, "")));
  const weight_kg =
    weightRaw === "" ? null : Number(weightRaw.replace(",", ".")) || null;

  const { error } = await supabase
    .from("products")
    .update({ name, price, weight_kg, active })
    .eq("slug", slug);
  if (error) throw new Error(error.message);

  revalidateCatalog();
  redirect("/admin/productos?ok=1");
}

export async function setUserRole(formData: FormData) {
  const supabase = await assertAdmin();
  const id = String(formData.get("id"));
  const role = String(formData.get("role"));
  const discount = Number(String(formData.get("discount_pct") ?? "0")) || 0;

  const { error } = await supabase
    .from("profiles")
    .update({ role, discount_pct: discount })
    .eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/usuarios");
  redirect("/admin/usuarios?ok=1");
}

export async function setOrderStatus(formData: FormData) {
  const supabase = await assertAdmin();
  const id = String(formData.get("id"));
  const status = String(formData.get("status"));

  const { error } = await supabase
    .from("orders")
    .update({ status })
    .eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/pedidos");
  redirect("/admin/pedidos?ok=1");
}

export async function updateHeroSlides(formData: FormData) {
  const supabase = await assertAdmin();
  const count = Number(formData.get("count") ?? 0);

  const slides = [];
  for (let i = 0; i < count; i++) {
    const title = String(formData.get(`s${i}_title`) ?? "").trim();
    if (!title) continue; // saltar diapositivas vacías (permite borrar)
    slides.push({
      image: String(formData.get(`s${i}_image`) ?? ""),
      eyebrow: String(formData.get(`s${i}_eyebrow`) ?? "").trim(),
      title,
      subtitle: String(formData.get(`s${i}_subtitle`) ?? "").trim(),
      ctaLabel: String(formData.get(`s${i}_ctaLabel`) ?? "").trim(),
      ctaHref: String(formData.get(`s${i}_ctaHref`) ?? "").trim(),
    });
  }

  const { error } = await supabase
    .from("site_content")
    .upsert({ key: "hero_slides", value: slides }, { onConflict: "key" });
  if (error) throw new Error(error.message);

  revalidatePath("/");
  redirect("/admin/contenido?ok=1");
}
