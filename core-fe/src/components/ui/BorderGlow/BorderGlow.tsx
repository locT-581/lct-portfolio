"use client";

import {
  type CSSProperties,
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { cn } from "@/lib/utils";

export interface BorderGlowProps {
  /** Content rendered inside the card */
  children?: ReactNode;
  /** Additional CSS classes for the outer wrapper */
  className?: string;
  /** How close the pointer must be to the edge for the glow to appear (0-100) */
  edgeSensitivity?: number;
  /** HSL values for the glow color, as "H S L" (e.g. "40 80 80") */
  glowColor?: string;
  /** Background color of the card */
  backgroundColor?: string;
  /** Corner radius of the card in pixels */
  borderRadius?: number;
  /** How far the outer glow extends beyond the card in pixels */
  glowRadius?: number;
  /** Multiplier for glow opacity (0.1-3.0) */
  glowIntensity?: number;
  /** Width of the directional cone mask as a percentage (5-45) */
  coneSpread?: number;
  /** Play an intro sweep animation on mount */
  animated?: boolean;
  /** Array of 3 hex colors for the mesh gradient border */
  colors?: string[];
  /** Opacity multiplier for the inner mesh fill */
  fillOpacity?: number;
  /** Additional inline styles */
  style?: CSSProperties;
}

const DEFAULT_COLORS = ["#c084fc", "#f472b6", "#38bdf8"];
const GRADIENT_POSITIONS = [
  "80% 55%",
  "69% 34%",
  "8% 6%",
  "41% 38%",
  "86% 85%",
  "82% 18%",
  "51% 4%",
];
const COLOR_MAP = [0, 1, 2, 0, 1, 2, 1];

function parseHSL(hslStr: string): { h: number; s: number; l: number } {
  const match = hslStr.match(/([\d.]+)\s*([\d.]+)%?\s*([\d.]+)%?/);
  if (!match) return { h: 40, s: 80, l: 80 };
  return {
    h: Number.parseFloat(match[1]),
    s: Number.parseFloat(match[2]),
    l: Number.parseFloat(match[3]),
  };
}

function buildBoxShadow(glowColor: string, intensity: number): string {
  const { h, s, l } = parseHSL(glowColor);
  const base = `${h}deg ${s}% ${l}%`;
  const layers: [number, number, number, number, number, boolean][] = [
    [0, 0, 0, 1, 100, true],
    [0, 0, 1, 0, 60, true],
    [0, 0, 3, 0, 50, true],
    [0, 0, 6, 0, 40, true],
    [0, 0, 15, 0, 30, true],
    [0, 0, 25, 2, 20, true],
    [0, 0, 50, 2, 10, true],
    [0, 0, 1, 0, 60, false],
    [0, 0, 3, 0, 50, false],
    [0, 0, 6, 0, 40, false],
    [0, 0, 15, 0, 30, false],
    [0, 0, 25, 2, 20, false],
    [0, 0, 50, 2, 10, false],
  ];
  return layers
    .map(([x, y, blur, spread, alpha, inset]) => {
      const a = Math.min(alpha * intensity, 100);
      return `${inset ? "inset " : ""}${x}px ${y}px ${blur}px ${spread}px hsl(${base} / ${a}%)`;
    })
    .join(", ");
}

function easeOutCubic(x: number) {
  return 1 - (1 - x) ** 3;
}

function easeInCubic(x: number) {
  return x * x * x;
}

interface AnimateOpts {
  start?: number;
  end?: number;
  duration?: number;
  delay?: number;
  ease?: (t: number) => number;
  onUpdate: (v: number) => void;
  onEnd?: () => void;
}

function animateValue({
  start = 0,
  end = 100,
  duration = 1000,
  delay = 0,
  ease = easeOutCubic,
  onUpdate,
  onEnd,
}: AnimateOpts): () => void {
  let timerId: ReturnType<typeof setTimeout> | null = null;
  let rafId: number | null = null;
  const t0 = performance.now() + delay;

  function tick() {
    const elapsed = Math.max(0, performance.now() - t0);
    const t = Math.min(elapsed / duration, 1);
    onUpdate(start + (end - start) * ease(t));
    if (t < 1) {
      rafId = requestAnimationFrame(tick);
    } else if (onEnd) {
      onEnd();
    }
  }

  timerId = setTimeout(() => {
    rafId = requestAnimationFrame(tick);
  }, delay);

  return () => {
    if (timerId) clearTimeout(timerId);
    if (rafId) cancelAnimationFrame(rafId);
  };
}

function buildMeshGradients(colors: string[]): string[] {
  const gradients: string[] = [];
  for (let i = 0; i < 7; i++) {
    const c = colors[Math.min(COLOR_MAP[i], colors.length - 1)];
    gradients.push(
      `radial-gradient(at ${GRADIENT_POSITIONS[i]}, ${c} 0px, transparent 50%)`,
    );
  }
  gradients.push(`linear-gradient(${colors[0]} 0 100%)`);
  return gradients;
}

export function BorderGlow({
  children,
  className = "",
  edgeSensitivity = 30,
  glowColor = "40 80 80",
  backgroundColor = "#120F17",
  borderRadius = 28,
  glowRadius = 40,
  glowIntensity = 1.0,
  coneSpread = 25,
  animated = false,
  colors = DEFAULT_COLORS,
  fillOpacity = 0.5,
  style,
}: BorderGlowProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [cursorAngle, setCursorAngle] = useState(45);
  const [edgeProximity, setEdgeProximity] = useState(0);
  const [sweepActive, setSweepActive] = useState(false);

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      const card = cardRef.current;
      if (!card) return;
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const dx = x - cx;
      const dy = y - cy;

      let kx = Number.POSITIVE_INFINITY;
      let ky = Number.POSITIVE_INFINITY;
      if (dx !== 0) kx = cx / Math.abs(dx);
      if (dy !== 0) ky = cy / Math.abs(dy);
      const proximity = Math.min(Math.max(1 / Math.min(kx, ky), 0), 1);
      setEdgeProximity(proximity);

      if (dx === 0 && dy === 0) {
        setCursorAngle(0);
      } else {
        const radians = Math.atan2(dy, dx);
        let degrees = radians * (180 / Math.PI) + 90;
        if (degrees < 0) degrees += 360;
        setCursorAngle(degrees);
      }
    },
    [],
  );

  useEffect(() => {
    if (!animated) return;
    const angleStart = 110;
    const angleEnd = 465;
    setSweepActive(true);
    setCursorAngle(angleStart);

    const cancel1 = animateValue({
      duration: 500,
      onUpdate: (v) => setEdgeProximity(v / 100),
    });
    const cancel2 = animateValue({
      ease: easeInCubic,
      duration: 1500,
      end: 50,
      onUpdate: (v) => {
        setCursorAngle((angleEnd - angleStart) * (v / 100) + angleStart);
      },
    });
    const cancel3 = animateValue({
      ease: easeOutCubic,
      delay: 1500,
      duration: 2250,
      start: 50,
      end: 100,
      onUpdate: (v) => {
        setCursorAngle((angleEnd - angleStart) * (v / 100) + angleStart);
      },
    });
    const cancel4 = animateValue({
      ease: easeInCubic,
      delay: 2500,
      duration: 1500,
      start: 100,
      end: 0,
      onUpdate: (v) => setEdgeProximity(v / 100),
      onEnd: () => setSweepActive(false),
    });

    return () => {
      cancel1();
      cancel2();
      cancel3();
      cancel4();
    };
  }, [animated]);

  const colorSensitivity = edgeSensitivity + 20;
  const isVisible = isHovered || sweepActive;
  const borderOpacity = isVisible
    ? Math.max(
        0,
        (edgeProximity * 100 - colorSensitivity) / (100 - colorSensitivity),
      )
    : 0;
  const glowOpacity = isVisible
    ? Math.max(
        0,
        (edgeProximity * 100 - edgeSensitivity) / (100 - edgeSensitivity),
      )
    : 0;

  const meshGradients = useMemo(() => buildMeshGradients(colors), [colors]);
  const borderBg = useMemo(
    () => meshGradients.map((g) => `${g} border-box`),
    [meshGradients],
  );
  const fillBg = useMemo(
    () => meshGradients.map((g) => `${g} padding-box`),
    [meshGradients],
  );
  const angleDeg = `${cursorAngle.toFixed(3)}deg`;

  const calculatedBoxShadow = useMemo(
    () => buildBoxShadow(glowColor, glowIntensity),
    [glowColor, glowIntensity],
  );

  return (
    <div
      ref={cardRef}
      onPointerMove={handlePointerMove}
      onPointerEnter={() => setIsHovered(true)}
      onPointerLeave={() => setIsHovered(false)}
      className={cn("relative grid isolate border border-white/15", className)}
      style={{
        background: backgroundColor,
        borderRadius: `${borderRadius}px`,
        transform: "translate3d(0, 0, 0.01px)",
        boxShadow:
          "rgba(0,0,0,0.1) 0 1px 2px, rgba(0,0,0,0.1) 0 2px 4px, rgba(0,0,0,0.1) 0 4px 8px, rgba(0,0,0,0.1) 0 8px 16px, rgba(0,0,0,0.1) 0 16px 32px, rgba(0,0,0,0.1) 0 32px 64px",
        ...style,
      }}
    >
      {/* mesh gradient border */}
      <div
        className="absolute inset-0 rounded-[inherit] z-[-1] pointer-events-none"
        style={{
          border: "1px solid transparent",
          background: [
            `linear-gradient(${backgroundColor} 0 100%) padding-box`,
            "linear-gradient(rgb(255 255 255 / 0%) 0% 100%) border-box",
            ...borderBg,
          ].join(", "),
          opacity: borderOpacity,
          maskImage: `conic-gradient(from ${angleDeg} at center, black ${coneSpread}%, transparent ${coneSpread + 15}%, transparent ${100 - coneSpread - 15}%, black ${100 - coneSpread}%)`,
          WebkitMaskImage: `conic-gradient(from ${angleDeg} at center, black ${coneSpread}%, transparent ${coneSpread + 15}%, transparent ${100 - coneSpread - 15}%, black ${100 - coneSpread}%)`,
          transition: isVisible
            ? "opacity 0.25s ease-out"
            : "opacity 0.75s ease-in-out",
        }}
      />

      {/* mesh gradient fill near edges */}
      <div
        className="absolute inset-0 rounded-[inherit] z-[-1] pointer-events-none"
        style={
          {
            border: "1px solid transparent",
            background: fillBg.join(", "),
            maskImage: [
              "linear-gradient(to bottom, black, black)",
              "radial-gradient(ellipse at 50% 50%, black 40%, transparent 65%)",
              "radial-gradient(ellipse at 66% 66%, black 5%, transparent 40%)",
              "radial-gradient(ellipse at 33% 33%, black 5%, transparent 40%)",
              "radial-gradient(ellipse at 66% 33%, black 5%, transparent 40%)",
              "radial-gradient(ellipse at 33% 66%, black 5%, transparent 40%)",
              `conic-gradient(from ${angleDeg} at center, transparent 5%, black 15%, black 85%, transparent 95%)`,
            ].join(", "),
            WebkitMaskImage: [
              "linear-gradient(to bottom, black, black)",
              "radial-gradient(ellipse at 50% 50%, black 40%, transparent 65%)",
              "radial-gradient(ellipse at 66% 66%, black 5%, transparent 40%)",
              "radial-gradient(ellipse at 33% 33%, black 5%, transparent 40%)",
              "radial-gradient(ellipse at 66% 33%, black 5%, transparent 40%)",
              "radial-gradient(ellipse at 33% 66%, black 5%, transparent 40%)",
              `conic-gradient(from ${angleDeg} at center, transparent 5%, black 15%, black 85%, transparent 95%)`,
            ].join(", "),
            maskComposite: "subtract, add, add, add, add, add",
            WebkitMaskComposite:
              "source-out, source-over, source-over, source-over, source-over, source-over",
            opacity: borderOpacity * fillOpacity,
            mixBlendMode: "soft-light",
            transition: isVisible
              ? "opacity 0.25s ease-out"
              : "opacity 0.75s ease-in-out",
          } as CSSProperties
        }
      />

      {/* outer glow */}
      <span
        className="absolute pointer-events-none z-1 rounded-[inherit]"
        style={
          {
            inset: `${-glowRadius}px`,
            maskImage: `conic-gradient(from ${angleDeg} at center, black 2.5%, transparent 10%, transparent 90%, black 97.5%)`,
            WebkitMaskImage: `conic-gradient(from ${angleDeg} at center, black 2.5%, transparent 10%, transparent 90%, black 97.5%)`,
            opacity: glowOpacity,
            mixBlendMode: "plus-lighter",
            transition: isVisible
              ? "opacity 0.25s ease-out"
              : "opacity 0.75s ease-in-out",
          } as CSSProperties
        }
      >
        <span
          className="absolute rounded-[inherit]"
          style={{
            inset: `${glowRadius}px`,
            boxShadow: calculatedBoxShadow,
          }}
        />
      </span>

      <div className="flex flex-col relative z-1 h-full">{children}</div>
    </div>
  );
}

export default BorderGlow;
