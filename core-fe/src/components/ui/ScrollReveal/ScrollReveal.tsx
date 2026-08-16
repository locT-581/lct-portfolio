"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { type HTMLAttributes, type ReactNode, useRef } from "react";
import { cn } from "@/lib/utils";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export interface ScrollRevealProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
  animation?: "fade-up" | "fade-in" | "scale";
  delay?: number;
  duration?: number;
  stagger?: number;
  selector?: string;
}

export function ScrollReveal({
  children,
  className = "",
  animation = "fade-up",
  delay = 0,
  duration = 0.8,
  stagger = 0,
  selector,
  ...props
}: ScrollRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!containerRef.current) return;

      const prefersReducedMotion =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (prefersReducedMotion) {
        return;
      }

      const targets = selector
        ? containerRef.current.querySelectorAll(selector)
        : [containerRef.current];

      if (targets.length === 0) return;

      gsap.fromTo(
        targets,
        {
          opacity: 0,
          y: animation === "fade-up" ? 30 : 0,
          scale: animation === "scale" ? 0.95 : 1,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration,
          delay,
          stagger: stagger > 0 ? stagger : undefined,
          ease: "power2.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 95%",
            toggleActions: "play none none none",
            once: true,
          },
        },
      );
    },
    {
      scope: containerRef,
      dependencies: [animation, delay, duration, stagger, selector],
    },
  );

  return (
    <div ref={containerRef} className={cn(className)} {...props}>
      {children}
    </div>
  );
}
