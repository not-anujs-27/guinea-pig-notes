import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { MailCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SiteHeader } from "@/components/site-header";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/lib/session";

export const Route = createFileRoute("/auth")({
  component: AuthPage,
  head: () => ({
    meta: [
      { title: "Sign in — DocuVault" },
      { name: "description", content: "Sign in or create a DocuVault account to keep your private notes." },
      { property: "og:title", content: "Sign in — DocuVault" },
      { property: "og:description", content: "Sign in or create a DocuVault account." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

function AuthPage() {
  const navigate = useNavigate();
  const { session } = useSession();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    if (mode === "signin") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      setBusy(false);
      if (error) return setError(error.message);
      navigate({ to: "/notes" });
    } else {
      // Sign-up signs the user in immediately; no confirmation email step.
      const { data, error } = await supabase.auth.signUp({ email, password });
      setBusy(false);
      if (error) return setError(error.message);
      if (data.session) return navigate({ to: "/notes" });
      setError(
        "Couldn't sign you in right away. Turn off \"Confirm email\" in your Supabase settings, then try again.",
      );
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-md px-6 pb-20 pt-10">
        <div className="animate-rise rounded-2xl border border-border bg-card p-8 shadow-soft">
          {session ? (
            <div className="text-center">
              <h1 className="text-4xl">You're signed in</h1>
              <p className="mt-2 text-sm text-muted-foreground">{session.user.email}</p>
              <Button asChild className="mt-6">
                <Link to="/notes">Go to my notes</Link>
              </Button>
            </div>
          ) : (
            <>
              <h1 className="text-4xl">{mode === "signin" ? "Welcome back" : "Open your vault"}</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                {mode === "signin" ? "Sign in to your notes." : "Create an account with your email."}
              </p>
              <div className="mt-6 grid grid-cols-2 gap-1 rounded-lg bg-muted p-1" role="tablist">
                {(["signin", "signup"] as const).map((m) => (
                  <Button
                    key={m}
                    type="button"
                    role="tab"
                    aria-selected={mode === m}
                    variant={mode === m ? "outline" : "ghost"}
                    size="sm"
                    onClick={() => {
                      setMode(m);
                      setError(null);
                    }}
                  >
                    {m === "signin" ? "Sign in" : "Create account"}
                  </Button>
                ))}
              </div>
              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    autoComplete={mode === "signin" ? "current-password" : "new-password"}
                    minLength={6}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                {error && <p className="text-sm text-destructive">{error}</p>}
                <Button type="submit" className="w-full" disabled={busy}>
                  {busy ? "Please wait…" : mode === "signin" ? "Sign in" : "Create account"}
                </Button>
              </form>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
