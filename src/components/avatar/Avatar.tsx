"use client";

/* ─────────────────────────────────────────────────────────────────────────
   Avatar
   
   A consistent initials-avatar used everywhere a person appears —
   team cards, testimonials, case study quotes. Color is deterministically
   derived from the name (not random), so the same person always gets
   the same color across every page they appear on.

   Usage:
     <Avatar name="Jane Doe" size="md" />
     <Avatar name="James Whitmore" size="sm" ring />
───────────────────────────────────────────────────────────────────────── */

const PALETTE = [
  { from: "#001a14", to: "#003326", ring: "#00e5b4" },
  { from: "#001218", to: "#002435", ring: "#00c4e5" },
  { from: "#160018", to: "#260030", ring: "#b000e5" },
  { from: "#181200", to: "#2a2000", ring: "#e5b400" },
  { from: "#001618", to: "#002830", ring: "#00d4e5" },
  { from: "#001a0e", to: "#00291a", ring: "#00e5b4" },
];

function hashName(name: string): number {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash << 5) - hash + name.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map(n => n[0])
    .join("")
    .toUpperCase();
}

const SIZE_MAP = {
  xs: { box: "w-7 h-7", text: "text-[10px]" },
  sm: { box: "w-9 h-9", text: "text-xs" },
  md: { box: "w-12 h-12", text: "text-sm" },
  lg: { box: "w-16 h-16", text: "text-lg" },
  xl: { box: "w-20 h-20", text: "text-2xl" },
};

interface Props {
  name: string;
  size?: keyof typeof SIZE_MAP;
  ring?: boolean;
  square?: boolean;
  className?: string;
}

export default function Avatar({ name, size = "md", ring = false, square = false, className = "" }: Props) {
  const colorSet = PALETTE[hashName(name) % PALETTE.length];
  const initials = getInitials(name);
  const dims = SIZE_MAP[size];

  return (
    <div
      title={name}
      className={`${dims.box} ${square ? "rounded-xl" : "rounded-full"} flex items-center justify-center
        font-black shrink-0 select-none transition-transform duration-300 hover:scale-105
        ${ring ? "border-[1.5px]" : ""} ${dims.text} ${className}`}
      style={{
        background: `linear-gradient(135deg, ${colorSet.from}, ${colorSet.to})`,
        borderColor: ring ? `${colorSet.ring}40` : undefined,
        color: colorSet.ring,
      }}
    >
      {initials}
    </div>
  );
}
