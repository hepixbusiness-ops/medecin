"use client";

import { motion, AnimatePresence } from "motion/react";
import { Plus, X } from "@phosphor-icons/react";
import type { BrandColor } from "@/lib/types";
import { MAX_BRAND_COLORS } from "@/lib/config";

interface ColorPickerProps {
  colors: BrandColor[];
  onAdd: (hex: string) => void;
  onChange: (id: string, hex: string) => void;
  onRemove: (id: string) => void;
}

export function ColorPicker({ colors, onAdd, onChange, onRemove }: ColorPickerProps) {
  const canAddMore = colors.length < MAX_BRAND_COLORS;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between gap-3">
        <span className="label-mono text-[11px] font-bold text-ink-soft">
          Couleurs de marque
        </span>
        <span className="label-mono text-[10px] text-ink-soft/70">
          {colors.length}/{MAX_BRAND_COLORS}
        </span>
      </div>

      {colors.length === 0 ? (
        <p className="text-sm text-ink-soft/70">
          Pas encore de couleur — ajoutez celles de votre logo ou de votre charte.
        </p>
      ) : null}

      <div className="flex flex-wrap items-center gap-3">
        <AnimatePresence initial={false}>
          {colors.map((color) => (
            <motion.div
              key={color.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
              className="group relative"
            >
              <label
                className="block h-12 w-12 cursor-pointer rounded-full border-2 border-surface-2 shadow-[0_0_0_1px_var(--border)] transition-transform duration-150 hover:scale-105 active:scale-95"
                style={{ backgroundColor: color.hex }}
              >
                <span className="sr-only">Modifier la couleur {color.hex}</span>
                <input
                  type="color"
                  value={color.hex}
                  onChange={(event) => onChange(color.id, event.target.value)}
                  className="h-0 w-0 opacity-0"
                />
              </label>
              <button
                type="button"
                onClick={() => onRemove(color.id)}
                aria-label={`Retirer la couleur ${color.hex}`}
                className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-ink text-white opacity-0 transition-opacity duration-150 group-hover:opacity-100 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-accent"
              >
                <X weight="bold" size={11} />
              </button>
              <span className="label-mono mt-1 block text-center text-[9px] text-ink-soft/70">
                {color.hex.toUpperCase()}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>

        {canAddMore && (
          <label className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border border-dashed border-border text-ink-soft transition-colors duration-150 hover:border-accent hover:text-accent focus-within:ring-2 focus-within:ring-accent">
            <Plus weight="bold" size={18} />
            <input
              type="color"
              defaultValue="#0f6b57"
              onChange={(event) => onAdd(event.target.value)}
              className="h-0 w-0 opacity-0"
              aria-label="Ajouter une couleur de marque"
            />
          </label>
        )}
      </div>
    </div>
  );
}
