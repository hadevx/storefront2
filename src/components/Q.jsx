import React from "react";
import { MoreHorizontal } from "lucide-react";

/**
 * NotesBoard (clone-style UI)
 * - Pure React + Tailwind (JS)
 * - Responsive grid
 * - Mimics the reference: 2 columns, mixed card sizes, colored "folders" with papers, white note cards
 *
 * Drop it anywhere on your landing/dashboard page.
 */

const FolderCard = ({ title, count, colorClass }) => {
  return (
    <div
      className={[
        "relative overflow-hidden rounded-[26px]",
        "shadow-[0_18px_45px_rgba(0,0,0,0.10)]",
        "min-h-[150px] sm:min-h-[170px]",
        colorClass,
      ].join(" ")}>
      {/* top tab */}
      <div className="absolute left-6 top-0 h-10 w-28 rounded-b-[18px] bg-white/22 backdrop-blur-sm" />

      {/* papers */}
      <div className="absolute right-6 top-6">
        <div className="relative h-16 w-24">
          <div className="absolute right-0 top-0 h-14 w-20 rotate-[10deg] rounded-xl bg-white/85 shadow-sm" />
          <div className="absolute right-3 top-2 h-14 w-20 rotate-[3deg] rounded-xl bg-white/92 shadow-sm" />
          <div className="absolute right-6 top-4 h-14 w-20 -rotate-[5deg] rounded-xl bg-white shadow-sm" />
        </div>
      </div>

      {/* content */}
      <div className="relative h-full p-6 flex flex-col justify-end">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-white text-xl font-extrabold tracking-tight">{title}</div>
            <div className="mt-1 text-white/85 text-sm">{count}</div>
          </div>

          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/14 hover:bg-white/18 transition"
            aria-label="More">
            <MoreHorizontal className="h-5 w-5 text-white/90" />
          </button>
        </div>
      </div>
    </div>
  );
};

const NoteCard = ({ heading, metaTop, metaBottom, body }) => {
  return (
    <div className="relative rounded-[26px] bg-white shadow-[0_18px_45px_rgba(0,0,0,0.10)] ring-1 ring-black/5 overflow-hidden">
      <div className="p-6">
        <div className="text-[22px] font-extrabold tracking-tight text-neutral-900">{heading}</div>

        {metaTop ? (
          <div className="mt-3 text-xs text-neutral-500 space-y-1">
            {metaTop.map((line, idx) => (
              <div key={idx}>{line}</div>
            ))}
          </div>
        ) : null}

        {body ? (
          <div className="mt-4 text-[12px] leading-relaxed text-neutral-500">
            {body.split("\n").map((l, i) => (
              <p key={i} className={i ? "mt-3" : ""}>
                {l}
              </p>
            ))}
          </div>
        ) : null}
      </div>

      <div className="px-6 pb-5 flex items-center justify-between">
        <div className="text-[11px] font-semibold tracking-wide text-neutral-400 uppercase">
          {metaBottom}
        </div>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full hover:bg-neutral-100 transition"
          aria-label="More">
          <MoreHorizontal className="h-5 w-5 text-neutral-500" />
        </button>
      </div>
    </div>
  );
};

export default function NotesBoard() {
  return (
    <section className="w-full bg-[#f3f3f3] py-10 sm:py-14">
      <div className="mx-auto max-w-5xl px-4">
        {/* Layout: 2 columns like the reference */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* LEFT COLUMN */}
          <div className="space-y-6">
            <NoteCard
              heading="Build Review"
              metaTop={["Title: Build", "Author: Tony Fadell", "Review:"]}
              body={`"Build" by Tony Fadell is an exceptional book that dives into the world of innovation, entrepreneurship, and the art of creating transformative products.
As the creator of the iPod and one of the key figures behind the iPhone, Tony brings a wealth of real-world insights to the table.`}
              metaBottom="WED, 26 APR 23"
            />

            <FolderCard title="Personal" count="123" colorClass="bg-[#a855f7]" />
            <FolderCard title="Work" count="1" colorClass="bg-[#f59e0b]" />
          </div>

          {/* RIGHT COLUMN */}
          <div className="space-y-6">
            <FolderCard title="Shared" count="12" colorClass="bg-[#ff3b5c]" />

            <NoteCard heading="Untitled" metaBottom="TODAY" />

            <NoteCard
              heading="Back Routine"
              body={`1. Warm-up:
- Start with 5–10 minutes of light cardio, such as brisk walking or cycling.
- Perform dynamic stretches for the upper body.

2. Lat Pulldowns:
- Sit at the lat pulldown machine and grip the bar slightly wider than shoulder-width.
- Engage your back muscles and pull the bar down towards your chest.`}
              metaBottom="FRI, 28 APR 23"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
