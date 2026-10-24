import { createFileRoute } from "@tanstack/react-router";
import { Lock, Megaphone, PenLine } from "lucide-react";
import heroImage from "@/assets/journal-hero.jpg";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "DocuVault — Your private journal" },
      {
        name: "description",
        content: "DocuVault is a quiet, private place to write. Keep personal notes locked to you and stay in the loop with announcements.",
      },
      { property: "og:title", content: "DocuVault — Your private journal" },
      {
        property: "og:description",
        content: "A quiet, private place to write. Personal notes locked to you, plus public announcements.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const features = [
  {
    icon: Lock,
    title: "Private by default",
    body: "Every note belongs to you alone. Nobody else can read it.",
  },
  {
    icon: PenLine,
    title: "Write without friction",
    body: "A calm page, a title, your thoughts. Nothing in the way.",
  },
  {
    icon: Megaphone,
    title: "Announcements",
    body: "Public updates in one feed, separate from your own writing.",
  },
];

function Index() {
  return (
    <div className="min-h-screen bg-background">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-2">
          <span className="grid size-8 place-items-center rounded-md bg-primary text-primary-foreground">
            <Lock className="size-4" />
          </span>
          <span className="font-display text-2xl">DocuVault</span>
        </div>
      </header>

      <main>
        <section className="mx-auto grid max-w-6xl items-center gap-12 px-6 pb-20 pt-8 lg:grid-cols-[1.05fr_1fr] lg:pt-16">
          <div className="animate-rise">
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.22em] text-brass">
              A private journal
            </p>
            <h1 className="text-6xl leading-[0.95] text-foreground sm:text-7xl">
              Somewhere safe
              <br />
              <em className="text-primary">to think out loud.</em>
            </h1>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-muted-foreground">
              DocuVault keeps your notes locked to you, with a quiet feed for the updates that
              matter.
            </p>
          </div>

          <div className="animate-rise overflow-hidden rounded-2xl shadow-lift [animation-delay:120ms]">
            <img
              src={heroImage}
              alt="A green leather journal with a brass clasp and a fountain pen on linen"
              width={1600}
              height={1072}
              className="h-full w-full object-cover"
            />
          </div>
        </section>

        <section className="border-t border-border bg-card">
          <div className="mx-auto grid max-w-6xl gap-10 px-6 py-16 sm:grid-cols-3">
            {features.map(({ icon: Icon, title, body }) => (
              <div key={title}>
                <Icon className="mb-4 size-5 text-brass" />
                <h2 className="text-2xl text-foreground">{title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="mx-auto max-w-6xl px-6 py-8 text-xs text-muted-foreground">
        © {new Date().getFullYear()} DocuVault
      </footer>
    </div>
  );
}
