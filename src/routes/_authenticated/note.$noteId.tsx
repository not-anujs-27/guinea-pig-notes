import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/site-header";
import { noteByIdQuery } from "@/lib/note-by-id";

export const Route = createFileRoute("/_authenticated/note/$noteId")({
  loader: ({ context, params }) => context.queryClient.ensureQueryData(noteByIdQuery(params.noteId)),
  component: NoteDetail,
  head: () => ({
    meta: [
      { title: "Note — DocuVault" },
      { name: "description", content: "View a single DocuVault note." },
      { property: "og:title", content: "Note — DocuVault" },
      { property: "og:description", content: "View a single DocuVault note." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

function NoteDetail() {
  const { noteId } = Route.useParams();
  const { data: note } = useSuspenseQuery(noteByIdQuery(noteId));

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-2xl px-6 pb-20 pt-6">
        <Button asChild variant="ghost" size="sm">
          <Link to="/notes">← My notes</Link>
        </Button>
        {note ? (
          <article className="mt-4 rounded-2xl border border-border bg-card p-8 shadow-soft">
            <h1 className="text-4xl">{note.title}</h1>
            {note.created_at && (
              <p className="mt-1 text-xs uppercase tracking-[0.18em] text-brass">
                {format(new Date(note.created_at), "d MMM yyyy · HH:mm")}
              </p>
            )}
            <p className="mt-6 whitespace-pre-wrap leading-relaxed text-foreground/85">{note.content}</p>
          </article>
        ) : (
          <p className="mt-10 text-center text-muted-foreground">No note with that ID.</p>
        )}
      </main>
    </div>
  );
}
