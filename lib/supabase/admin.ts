import "server-only";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/database.types";

/**
 * Cliente con la llave SECRETA — solo servidor. Omite RLS.
 * Úsalo en Server Actions/Route Handlers del panel admin tras verificar el rol.
 * trim() protege de espacios/BOM invisibles que rompen los headers HTTP.
 */
export function createAdminClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!.trim(),
    process.env.SUPABASE_SERVICE_ROLE_KEY!.trim(),
    { auth: { persistSession: false, autoRefreshToken: false } }
  );
}
