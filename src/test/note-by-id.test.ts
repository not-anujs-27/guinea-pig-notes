import { beforeEach, describe, expect, it, vi } from "vitest";

const calls: Array<[string, unknown]> = [];
const builder: Record<string, unknown> = {
  select: () => builder,
  eq: (col: string, val: unknown) => {
    calls.push([col, val]);
    return builder;
  },
  maybeSingle: async () => ({ data: { id: 7, title: "x", content: "y", created_at: null }, error: null }),
};
vi.mock("@/integrations/supabase/client", () => ({ supabase: { from: () => builder } }));

import { readNoteById } from "@/lib/note-by-id";

describe("intentional IDOR test target", () => {
  beforeEach(() => {
    calls.length = 0;
  });

  it("looks a note up by id alone, with no owner check", async () => {
    await readNoteById("7");
    expect(calls).toEqual([["id", "7"]]);
  });
});
