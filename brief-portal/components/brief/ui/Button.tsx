"use client";

import { motion } from "motion/react";
import { CircleNotch } from "@phosphor-icons/react";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type NativeButtonProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "onDrag" | "onDragStart" | "onDragEnd" | "onAnimationStart" | "onAnimationEnd"
>;

interface ButtonProps extends NativeButtonProps {
  variant?: "primary" | "secondary" | "ghost";
  loading?: boolean;
  icon?: ReactNode;
  iconPosition?: "left" | "right";
}

export function Button({
  variant = "primary",
  loading = false,
  disabled,
  icon,
  iconPosition = "right",
  className,
  children,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;

  const base =
    "inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-6 text-[15px] font-medium transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-bg-base disabled:cursor-not-allowed disabled:opacity-50";

  const variants: Record<string, string> = {
    primary: "bg-accent text-white hover:bg-accent-strong",
    secondary:
      "border border-border bg-surface-2 text-ink hover:border-ink-soft/50",
    ghost: "text-ink-soft hover:text-ink",
  };

  return (
    <motion.button
      type="button"
      whileTap={isDisabled ? undefined : { scale: 0.98 }}
      disabled={isDisabled}
      className={`${base} ${variants[variant]} ${className ?? ""}`}
      {...props}
    >
      {loading ? (
        <>
          <CircleNotch weight="bold" size={18} className="animate-spin" />
          <span>Envoi en cours…</span>
        </>
      ) : (
        <>
          {icon && iconPosition === "left" && icon}
          {children}
          {icon && iconPosition === "right" && icon}
        </>
      )}
    </motion.button>
  );
}
