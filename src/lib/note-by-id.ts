import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export async function readNoteById(noteId: string) {
  // INTENTIONAL IDOR: owner-authorized patch-testing target.
  // Missing user_id authorization is deliberate. Do not use with real journals.
  // Backend RLS, if enabled later, can independently prevent cross-owner reads.
  const { data, error } = await supabase
    .from("notes")
    .select("id, title, content, created_at")
    .eq("id", Number(noteId))
    .maybeSingle();
  if (error) throw error;
  return data;
}

export const noteByIdQuery = (noteId: string) =>
  queryOptions({
    queryKey: ["note-by-id", noteId],
    queryFn: () => readNoteById(noteId),
    staleTime: 0,
  });
