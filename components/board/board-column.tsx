"use client";

import { useDroppable } from "@dnd-kit/core";
import { useCallback, useState } from "react";
import { Icon } from "@/components/primitives/icon";
import type { BoardIdea, Platform, Status } from "@/lib/ideas";
import { ColumnAddForm } from "./column-add-form";
import { IdeaCard } from "./idea-card";

const DOT: Record<Status, string> = {
  idea: "bg-brand-sky",
  filming: "bg-brand-purple",
  editing: "bg-brand-ink",
  published: "bg-brand-lime",
};

export function BoardColumn({
  status,
  label,
  ideas,
  defaultPlatform,
  activeOnMobile,
}: {
  status: Status;
  label: string;
  ideas: BoardIdea[];
  defaultPlatform: Platform;
  // Di HP hanya satu kolom tampil sekaligus (dipilih lewat tab).
  activeOnMobile: boolean;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: status });
  const [adding, setAdding] = useState(false);
  const closeAdd = useCallback(() => setAdding(false), []);

  return (
    <section
      ref={setNodeRef}
      className={`flex-col gap-4 rounded-[24px] transition-colors md:flex md:min-h-40 ${
        activeOnMobile ? "flex" : "hidden"
      } ${isOver ? "bg-brand-lime/25 outline-2 outline-dashed outline-brand-lime" : ""}`}
    >
      <header className="hidden items-center gap-2 px-1 md:flex">
        <span className={`h-3 w-3 rounded-full ${DOT[status]}`} />
        <h2 className="text-lg font-bold tracking-tight">{label}</h2>
        <span className="rounded-full bg-white px-2 py-0.5 text-xs font-semibold text-brand-muted shadow-card">
          {ideas.length}
        </span>
        <button
          type="button"
          onClick={() => setAdding((v) => !v)}
          aria-label={`Tambah ide ke ${label}`}
          aria-expanded={adding}
          className="ml-auto flex h-8 w-8 items-center justify-center rounded-full bg-white text-brand-ink shadow-card transition-colors hover:bg-brand-lime"
        >
          <Icon name="plus" className="h-4 w-4" />
        </button>
      </header>

      {adding && (
        <ColumnAddForm
          status={status}
          statusLabel={label}
          defaultPlatform={defaultPlatform}
          onDone={closeAdd}
          onCancel={closeAdd}
        />
      )}

      {ideas.length === 0 ? (
        <p className="rounded-[20px] bg-white/60 px-4 py-8 text-center text-sm font-medium text-brand-muted shadow-card">
          Belum ada
        </p>
      ) : (
        ideas.map((idea) => <IdeaCard key={idea.id} idea={idea} />)
      )}
    </section>
  );
}