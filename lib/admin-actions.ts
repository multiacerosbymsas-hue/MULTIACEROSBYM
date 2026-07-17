"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { slugify } from "@/lib/data/catalog";
import { safeHref } from "@/lib/data/content";

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

export async function createProduct(formData: FormData) {
  const supabase = await assertAdmin();

  const name = String(formData.get("name") ?? "").trim();
  const code = String(formData.get("code") ?? "").trim();
  const family = String(formData.get("family") ?? "").trim();
  const section = String(formData.get("section") ?? "").trim().toUpperCase();
  const priceRaw = String(formData.get("price") ?? "").trim();
  const weightRaw = String(formData.get("weight_kg") ?? "").trim();
  const active = formData.get("active") === "on";

  const err = (msg: string) =>
    redirect(`/admin/productos/nuevo?error=${encodeURIComponent(msg)}`);
  if (!name) err("El nombre es obligatorio.");
  if (!family) err("Elige una familia.");
  if (!section) err("La sección (referencia) es obligatoria.");

  const price =
    priceRaw === "" ? null : Math.round(Number(priceRaw.replace(/[^\d]/g, "")));
  const weight_kg =
    weightRaw === "" ? null : Number(weightRaw.replace(",", ".")) || null;

  // slug único a partir del nombre
  const base = slugify(name);
  let slug = base;
  let n = 1;
  for (;;) {
    const { data } = await supabase
      .from("products")
      .select("slug")
      .eq("slug", slug)
      .maybeSingle();
    if (!data) break;
    n += 1;
    slug = `${base}-${n}`;
    if (n > 50) {
      slug = `${base}-${Date.now()}`;
      break;
    }
  }

  // colócalo al final del orden
  const { data: maxRow } = await supabase
    .from("products")
    .select("sort")
    .order("sort", { ascending: false })
    .limit(1)
    .maybeSingle();
  const sort = (maxRow?.sort ?? 0) + 1;

  const { error } = await supabase
    .from("products")
    .insert({ code, name, slug, price, weight_kg, section, family, active, sort });
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

/**
 * Elimina un pedido y sus líneas de forma permanente.
 * Usa la llave de servicio (omite RLS) tras confirmar que quien llama es admin;
 * borra primero order_items por si la FK no tiene ON DELETE CASCADE.
 */
export async function deleteOrder(formData: FormData) {
  await assertAdmin();
  const id = String(formData.get("id"));
  if (!id) throw new Error("Falta el id del pedido");

  const admin = createAdminClient();

  const { error: itemsErr } = await admin
    .from("order_items")
    .delete()
    .eq("order_id", id);
  if (itemsErr) throw new Error(itemsErr.message);

  const { error } = await admin.from("orders").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/pedidos");
  revalidatePath("/admin");
  redirect("/admin/pedidos?borrado=1");
}

/**
 * Sube una imagen del panel al bucket público "site" y devuelve su URL pública.
 * Solo se llama tras assertAdmin(); usa la llave de servicio para el storage.
 */
async function uploadSiteImage(file: File, folder: string): Promise<string> {
  if (!file.type.startsWith("image/")) throw new Error("El archivo debe ser una imagen");
  if (file.size > 8 * 1024 * 1024) throw new Error("La imagen no puede superar 8 MB");

  const ext = (file.name.split(".").pop() || "jpg").toLowerCase().slice(0, 5);
  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  const admin = createAdminClient();
  const { error } = await admin.storage
    .from("site")
    .upload(path, file, { contentType: file.type, upsert: false });
  if (error) throw new Error("No se pudo subir la imagen: " + error.message);

  return admin.storage.from("site").getPublicUrl(path).data.publicUrl;
}

/** Guarda la promoción del mes (popup de entrada), con foto opcional nueva. */
export async function updatePromo(formData: FormData) {
  const supabase = await assertAdmin();

  let image = String(formData.get("current_image") ?? "");
  const file = formData.get("image");
  if (file instanceof File && file.size > 0) {
    image = await uploadSiteImage(file, "promo");
  }

  const promo = {
    enabled: formData.get("enabled") === "on" && image !== "",
    image,
    eyebrow: String(formData.get("eyebrow") ?? "").trim() || "Promoción del mes",
    title: String(formData.get("title") ?? "").trim(),
    text: String(formData.get("text") ?? "").trim(),
    ctaLabel: String(formData.get("ctaLabel") ?? "").trim(),
    ctaHref: safeHref(String(formData.get("ctaHref") ?? "").trim()),
  };

  const { error } = await supabase
    .from("site_content")
    .upsert({ key: "promo_month", value: promo }, { onConflict: "key" });
  if (error) throw new Error(error.message);

  revalidatePath("/");
  redirect("/admin/promocion?ok=1");
}

/** Sube/cambia la foto de una familia del catálogo. */
export async function updateFamilyImage(formData: FormData) {
  const supabase = await assertAdmin();
  const slug = String(formData.get("slug") ?? "");
  if (!slug) throw new Error("Falta la familia");

  const file = formData.get("image");
  if (!(file instanceof File) || file.size === 0) {
    redirect("/admin/familias?error=" + encodeURIComponent("Elige una foto primero."));
  }
  const url = await uploadSiteImage(file as File, "familias");

  const { data } = await supabase
    .from("site_content")
    .select("value")
    .eq("key", "family_images")
    .maybeSingle();
  const current = (data?.value as Record<string, string> | null) ?? {};

  const { error } = await supabase
    .from("site_content")
    .upsert(
      { key: "family_images", value: { ...current, [slug]: url } },
      { onConflict: "key" }
    );
  if (error) throw new Error(error.message);

  revalidateCatalog();
  redirect("/admin/familias?ok=1");
}

/** Quita la foto personalizada de una familia (vuelve a la imagen por defecto). */
export async function resetFamilyImage(formData: FormData) {
  const supabase = await assertAdmin();
  const slug = String(formData.get("slug") ?? "");

  const { data } = await supabase
    .from("site_content")
    .select("value")
    .eq("key", "family_images")
    .maybeSingle();
  const current = (data?.value as Record<string, string> | null) ?? {};
  delete current[slug];

  const { error } = await supabase
    .from("site_content")
    .upsert({ key: "family_images", value: current }, { onConflict: "key" });
  if (error) throw new Error(error.message);

  revalidateCatalog();
  redirect("/admin/familias?ok=1");
}

/** Activa o suspende la pasarela de pago del checkout. */
export async function setPaymentsEnabled(formData: FormData) {
  const supabase = await assertAdmin();
  const enabled = String(formData.get("enabled")) === "1";

  const { error } = await supabase
    .from("site_content")
    .upsert({ key: "payments_gateway", value: { enabled } }, { onConflict: "key" });
  if (error) throw new Error(error.message);

  revalidatePath("/checkout");
  redirect("/admin/pagos?ok=1");
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
      ctaHref: safeHref(String(formData.get(`s${i}_ctaHref`) ?? "").trim()),
    });
  }

  const { error } = await supabase
    .from("site_content")
    .upsert({ key: "hero_slides", value: slides }, { onConflict: "key" });
  if (error) throw new Error(error.message);

  revalidatePath("/");
  redirect("/admin/contenido?ok=1");
}
