"use client";

/**
 * MagneticButton — pointer-reactive CTA shell.
 *
 * Three variants:
 *   - "outline" (default) — transparent bg, cream border; gold radial fills
 *     from the cursor on hover.
 *   - "solid"             — gold bg, dark text; boxShadow glow on hover.
 *   - "ghost"             — muted cream border, smaller padding; for
 *                           secondary footer links and Tweak-style prompts.
 *
 * Rendering:
 *   - When `href` is passed, renders as <a>. Otherwise <button type="button"
 *     or="submit">.
 *   - Inner label + optional trailing arrow live inside `.mag-inner` so the
 *     magnetic hook can pull the label harder than the shell.
 *
 * Accessibility:
 *   - Focus-visible outline uses the site's gold token.
 *   - `aria-label` falls through to the DOM for icon-only usage.
 *   - Underlying button / link is keyboard-activatable; magnetic pull is
 *     purely decorative and gated by prefers-reduced-motion.
 */

import type React from "react";
import { useMagnetic } from "./useMagnetic";

type CommonProps = {
  variant?: "solid" | "outline" | "ghost";
  /** Show a trailing arrow glyph inside the label. Default true. */
  arrow?: boolean;
  /** Magnetic pull strength in px. Overrides variant default. */
  strength?: number;
  /** Extra classes merged onto the outer shell. */
  className?: string;
  children: React.ReactNode;
};

type ButtonOnly = {
  href?: undefined;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  "aria-label"?: string;
  form?: string;
  name?: string;
  value?: string;
};

type AnchorOnly = {
  href: string;
  target?: string;
  rel?: string;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
  "aria-label"?: string;
};

export type MagneticButtonProps = CommonProps & (ButtonOnly | AnchorOnly);

const VARIANT_STRENGTH = {
  solid: 14,
  outline: 10,
  ghost: 8,
} as const;

const VARIANT_CLASS = {
  solid: "magb--solid",
  outline: "magb--outline",
  ghost: "magb--ghost",
} as const;

export function MagneticButton(props: MagneticButtonProps) {
  const { variant = "outline", arrow = true, strength, className, children } =
    props;
  const pullStrength = strength ?? VARIANT_STRENGTH[variant];

  const { ref, innerRef } = useMagnetic<HTMLElement>({
    strength: pullStrength,
  });

  const classes = ["magb", VARIANT_CLASS[variant], className]
    .filter(Boolean)
    .join(" ");

  const content = (
    <>
      <span className="magb-fill" aria-hidden="true" />
      <span
        className="magb-inner"
        ref={(el) => {
          innerRef.current = el;
        }}
      >
        {children}
        {arrow && (
          <span className="magb-arr" aria-hidden="true">
            →
          </span>
        )}
      </span>
    </>
  );

  if ("href" in props && props.href !== undefined) {
    const { href, target, rel, onClick } = props;
    const ariaLabel = props["aria-label"];
    return (
      <a
        ref={(el) => {
          ref.current = el;
        }}
        href={href}
        target={target}
        rel={rel}
        onClick={onClick}
        aria-label={ariaLabel}
        className={classes}
        data-magnetic=""
        data-magnetic-variant={variant}
      >
        {content}
      </a>
    );
  }

  const {
    type = "button",
    disabled,
    onClick,
    form,
    name,
    value,
  } = props as ButtonOnly;
  const ariaLabel = props["aria-label"];
  return (
    <button
      ref={(el) => {
        ref.current = el;
      }}
      type={type}
      disabled={disabled}
      onClick={onClick}
      form={form}
      name={name}
      value={value}
      aria-label={ariaLabel}
      className={classes}
      data-magnetic=""
      data-magnetic-variant={variant}
    >
      {content}
    </button>
  );
}
