"use client";

import { useCallback, useState } from "react";
import { STATUSES, type BoardIdea, type Platform } from "@/lib/ideas";
import { BoardColumn } from "./board-column";
import { BoardCta } from "./board-cta";
import { BoardFilters, matchesFilter, type PlatformFilter } from "./board-filters";
import { BoardHero } from "./board-hero";
import { BoardStats } from "./board-stats";
import { EmptyState } from "./empty-state";
import { IdeaForm } from "./idea-form";

export function Board({
  ideas,
  defaultPlatform,
  remaining,
  nicheName,
}: {
  ideas: BoardIdea[];
  defaultPlatform: Platform;
  remaining: number | null;
  nicheName: string;
}) {
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState<PlatformFilter>("all");
  const closeForm = useCallback(() => setShowForm(false), []);

  const visible = ideas.filter((i) => matchesFilter(filter, i.platform));
  const count = (status: string) => ideas.filter((i) => i.status === status).length;

  return (
    <div className="flex flex-col gap-8">
      <div className="grid items-stretch gap-4 lg:grid-cols-12">
        <BoardHero defaultPlatform={defaultPlatform} nicheName={nicheName} />
        <BoardStats
          published={count("published")}
          filming={count("filming")}
          remaining={remaining}
        />
      </div>

      <BoardFilters
        ideas={ideas}
        value={filter}
        onChange={setFilter}
        onAddFull={() => setShowForm(true)}
      />

      {showForm && (
        <div className="max-w-xl">
          <IdeaForm onDone={closeForm} onCancel={closeForm} />
        </div>
      )}

      {ideas.length === 0 && !showForm ? (
        <EmptyState onStart={() => setShowForm(true)} />
      ) : (
        <div className="grid items-start gap-4 md:grid-cols-2 xl:grid-cols-4">
          {STATUSES.map((s) => (
            <BoardColumn
              key={s.value}
              status={s.value}
              label={s.label}
              ideas={visible.filter((i) => i.status === s.value)}
            />
          ))}
        </div>
      )}

      <BoardCta />
    </div>
  );
}