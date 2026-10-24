<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Project rules
- Backend is the owner's external Supabase project (connected in Settings), not Lovable Cloud — why: the owner's existing `notes` and `feed` tables and data live there.
- The `feed` table is read-only from the app; why: announcements are authored directly in the backend, so the app needs no posting UI or admin roles.
- Keep by-ID note reads in `src/lib/note-by-id.ts`, separate from owner-scoped list/create/delete operations; why: the owner requested a narrowly identifiable, intentional read-only IDOR patch-testing path without broadening other app operations.
