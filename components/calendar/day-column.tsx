import { Icon } from "@/components/primitives/icon";
import { IdeaSlot } from "@/components/calendar/idea-slot";
import { dayInfo } from "@/lib/dates";
import type { CalendarIdea } from "@/lib/calendar";

export function DayColumn({
  dateKey,
  isToday,
  ideas,
  backlog,
  dragging,
  pickerOpen,
  onTogglePicker,
  onPick,
  onDrop,
  onDragStart,
  onDragEnd,
  onUnschedule,
}: {
  dateKey: string;
  isToday: boolean;
  ideas: CalendarIdea[];
  backlog: CalendarIdea[];
  dragging: boolean;
  pickerOpen: boolean;
  onTogglePicker: () => void;
  onPick: (id: string) => void;
  onDrop: (id: string) => void;
  onDragStart: (id: string) => void;
  onDragEnd: () => void;
  onUnschedule: (id: string) => void;
}) {
  const { day, dayName, month } = dayInfo(dateKey);

  return (
    <section
      data-today={isToday || undefined}
      aria-label={`${dayName} ${day} ${month}`}
      onDragOver={(e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
      }}
      onDrop={(e) => {
        e.preventDefault();
        const id = e.dataTransfer.getData("text/plain");
        if (id) onDrop(id);
      }}
      className={`relative flex min-h-[26rem] snap-start flex-col rounded-3xl p-4 transition ${
        isToday ? "bg-brand-bg ring-2 ring-inset ring-brand-lime" : "bg-brand-bg/70"
      } ${dragging ? "outline-dashed outline-2 -outline-offset-4 outline-brand-purple/40" : ""}`}
    >
      <header className="flex items-start justify-between gap-2 px-1 pb-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-brand-muted">{dayName}</p>
          <p className="mt-1 text-3xl font-extrabold leading-none">{day}</p>
          <p className="mt-1 text-xs font-semibold text-brand-muted">{month}</p>
        </div>
        <div className="flex flex-col items-end gap-2">
          {isToday && (
            <span className="rounded-full bg-brand-lime px-3 py-1 text-xs font-bold">Hari Ini</span>
          )}
          <span className="text-xs font-semibold text-brand-muted">{ideas.length} slot</span>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-3">
        {ideas.map((idea) => (
          <IdeaSlot
            key={idea.id}
            idea={idea}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            onUnschedule={onUnschedule}
          />
        ))}

        {ideas.length === 0 && (
          <div className="flex flex-1 items-center justify-center rounded-2xl border-2 border-dashed border-brand-border px-4 py-8 text-center text-xs font-semibold text-brand-muted">
            Tarik ide ke sini
          </div>
        )}
      </div>

      <div className="relative mt-4">
        <button
          type="button"
          onClick={onTogglePicker}
          aria-expanded={pickerOpen}
          className="flex h-11 w-full items-center justify-center gap-1.5 rounded-full bg-white text-sm font-bold shadow-card transition hover:brightness-95"
        >
          <Icon name="plus" className="h-4 w-4" />
          Tambah
        </button>

        {pickerOpen && (
          <div className="absolute bottom-14 left-0 z-20 w-64 rounded-2xl bg-white p-2 shadow-[0_12px_32px_-4px_rgba(20,20,26,0.2)]">
            <p className="px-3 pb-1 pt-2 text-xs font-bold uppercase tracking-wider text-brand-muted">
              Dari backlog
            </p>
            {backlog.length === 0 ? (
              <p className="px-3 py-3 text-sm text-brand-muted">
                Backlog kosong. Tambah ide dulu di Papan.
              </p>
            ) : (
              <ul className="max-h-60 overflow-y-auto">
                {backlog.map((idea) => (
                  <li key={idea.id}>
                    <button
                      type="button"
                      onClick={() => onPick(idea.id)}
                      className="w-full rounded-xl px-3 py-2.5 text-left text-sm font-semibold leading-snug transition hover:bg-brand-bg"
                    >
                      <span className="line-clamp-2">{idea.title}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </section>
  );
}