import { createFileRoute, Link } from "@tanstack/react-router";
import { queryOptions, useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useState, type FormEvent } from "react";
import { format } from "date-fns";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SiteHeader } from "@/components/site-header";
import { supabase } from "@/integrations/supabase/client";

const notesQuery = (userId: string) =>
  queryOptions({
    queryKey: ["notes", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("notes")
        .select("id, title, content, created_at")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

export const Route = createFileRoute("/_authenticated/notes")({
  loader: ({ context }) => context.queryClient.ensureQueryData(notesQuery(context.user.id)),
  component: NotesPage,
  head: () => ({
    meta: [
      { title: "My notes — DocuVault" },
      { name: "description", content: "Your private DocuVault notes." },
      { property: "og:title", content: "My notes — DocuVault" },
      { property: "og:description", content: "Your private DocuVault notes." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

function NotesPage() {
  const { user } = Route.useRouteContext();
  const queryClient = useQueryClient();
  const { data: notes } = useSuspenseQuery(notesQuery(user.id));
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const addNote = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("notes")
        .insert({ title: title.trim(), content: content.trim(), user_id: user.id });
      if (error) throw error;
    },
    onSuccess: () => {
      setTitle("");
      setContent("");
      toast.success("Note saved");
      queryClient.invalidateQueries({ queryKey: ["notes", user.id] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const deleteNote = useMutation({
    mutationFn: async (id: number) => {
      const { error } = await supabase.from("notes").delete().eq("id", id).eq("user_id", user.id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notes", user.id] }),
    onError: (e: Error) => toast.error(e.message),
  });

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    addNote.mutate();
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto grid max-w-6xl gap-10 px-6 pb-20 pt-6 lg:grid-cols-[380px_1fr]">
        <section className="animate-rise">
          <h1 className="text-5xl">My notes</h1>
          <p className="mt-1 text-sm text-muted-foreground">Write something down.</p>
          <form
            onSubmit={handleSubmit}
            className="mt-6 space-y-3 rounded-2xl border border-border bg-card p-5 shadow-soft"
          >
            <Input
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              aria-label="Note title"
              required
            />
            <Textarea
              placeholder="What's on your mind?"
              rows={7}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              aria-label="Note text"
            />
            <Button type="submit" className="w-full" disabled={addNote.isPending || !title.trim()}>
              {addNote.isPending ? "Saving…" : "Save note"}
            </Button>
          </form>
        </section>

        <section className="space-y-4">
          {notes.length === 0 ? (
            <div className="grid min-h-60 place-items-center rounded-2xl border border-dashed border-border p-10 text-center">
              <div>
                <p className="font-display text-3xl">An empty page</p>
                <p className="mt-1 text-sm text-muted-foreground">Your first note will appear here.</p>
              </div>
            </div>
          ) : (
            notes.map((note) => (
              <article
                key={note.id}
                className="group animate-rise rounded-2xl border border-border bg-card p-6 shadow-soft"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-3xl leading-tight">{note.title}</h2>
                    {note.created_at && (
                      <p className="mt-1 text-xs uppercase tracking-[0.18em] text-brass">
                        {format(new Date(note.created_at), "d MMM yyyy · HH:mm")}
                      </p>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label={`Delete ${note.title}`}
                    onClick={() => deleteNote.mutate(note.id)}
                    disabled={deleteNote.isPending}
                  >
                    <Trash2 />
                  </Button>
                </div>
                {note.content && (
                  <p className="mt-4 whitespace-pre-wrap leading-relaxed text-foreground/85">
                    {note.content}
                  </p>
                )}
              </article>
            ))
          )}
        </section>
      </main>
    </div>
  );
}
