"use client";

import gsap from "gsap";
import Image from "next/image";
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";

export interface ProjectTransitionState {
  slug: string;
  logoUrl?: string | null;
  currentImageSrc?: string | null;
  initialRect: {
    top: number;
    left: number;
    width: number;
    height: number;
    borderRadius: string;
  };
  projectType?: string | null;
  name?: string;
}

interface ProjectFlipContextType {
  activeTransition: ProjectTransitionState | null;
  isFlipping: boolean;
  triggerTransition: (
    slug: string,
    sourceElement: HTMLElement,
    meta?: {
      logoUrl?: string | null;
      projectType?: string | null;
      name?: string;
    },
  ) => void;
  registerTarget: (
    slug: string,
    targetElement: HTMLElement,
    onComplete?: () => void,
  ) => () => void;
  clearTransition: () => void;
}

const ProjectFlipContext = createContext<ProjectFlipContextType | null>(null);

export function useProjectFlip() {
  const context = useContext(ProjectFlipContext);
  if (!context) {
    throw new Error("useProjectFlip must be used within a ProjectFlipProvider");
  }
  return context;
}

export function ProjectFlipProvider({ children }: { children: ReactNode }) {
  const [activeTransition, setActiveTransition] =
    useState<ProjectTransitionState | null>(null);
  const [isFlipping, setIsFlipping] = useState(false);
  const [mounted, setMounted] = useState(false);

  const overlayRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const activeTimelineRef = useRef<gsap.core.Timeline | null>(null);
  const targetCompletedRef = useRef(false);

  useEffect(() => {
    setMounted(true);
    return () => {
      if (activeTimelineRef.current) {
        activeTimelineRef.current.kill();
      }
    };
  }, []);

  const clearTransition = useCallback(() => {
    if (activeTimelineRef.current) {
      activeTimelineRef.current.kill();
      activeTimelineRef.current = null;
    }
    setActiveTransition(null);
    setIsFlipping(false);
    targetCompletedRef.current = false;
  }, []);

  // Safety fallback: auto-clear after 2s if target route fails to mount
  useEffect(() => {
    if (!isFlipping) return;
    const timeout = setTimeout(() => {
      if (!targetCompletedRef.current) {
        clearTransition();
      }
    }, 2000);
    return () => clearTimeout(timeout);
  }, [isFlipping, clearTransition]);

  const triggerTransition = useCallback(
    (
      slug: string,
      sourceElement: HTMLElement,
      meta?: {
        logoUrl?: string | null;
        projectType?: string | null;
        name?: string;
      },
    ) => {
      const prefersReducedMotion =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (prefersReducedMotion || !sourceElement) {
        return;
      }

      // Find the visual card element to get precise dimensions and border-radius
      const cardEl =
        (sourceElement.classList.contains("card")
          ? sourceElement
          : (sourceElement.querySelector(".card") as HTMLElement)) ||
        sourceElement;

      // Extract the EXACT already-decoded and cached image src currently displayed on screen
      const imgEl = sourceElement.querySelector("img");
      const currentImageSrc = imgEl?.currentSrc || imgEl?.src || meta?.logoUrl;

      const rect = cardEl.getBoundingClientRect();
      const style = window.getComputedStyle(cardEl);
      const borderRadius = style.borderRadius || "16px";

      const transitionState: ProjectTransitionState = {
        slug,
        logoUrl: meta?.logoUrl,
        currentImageSrc,
        initialRect: {
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height,
          borderRadius,
        },
        projectType: meta?.projectType,
        name: meta?.name,
      };

      targetCompletedRef.current = false;
      setActiveTransition(transitionState);
      setIsFlipping(true);
    },
    [],
  );

  const registerTarget = useCallback(
    (slug: string, targetElement: HTMLElement, onComplete?: () => void) => {
      if (
        !activeTransition ||
        activeTransition.slug !== slug ||
        !overlayRef.current ||
        !targetElement
      ) {
        onComplete?.();
        return () => {};
      }

      const overlayEl = overlayRef.current;
      const initial = activeTransition.initialRect;

      // Force target element to be hidden immediately to avoid any ghosting
      targetElement.style.opacity = "0";

      // Measure target rect immediately
      const targetRect = targetElement.getBoundingClientRect();
      const targetStyle = window.getComputedStyle(targetElement);
      const targetBorderRadius = targetStyle.borderRadius || "16px";

      // Place overlay at initial exact position and size
      gsap.set(overlayEl, {
        position: "fixed",
        top: initial.top,
        left: initial.left,
        width: initial.width,
        height: initial.height,
        borderRadius: initial.borderRadius,
        opacity: 1,
        zIndex: 9999,
        pointerEvents: "none",
      });

      // Create animation timeline tweening top, left, width, height & borderRadius
      // This preserves object-fit: cover on the inner image without non-uniform scaling distortion
      const tl = gsap.timeline({
        onComplete: () => {
          targetCompletedRef.current = true;
          // Seamless handoff: reveal target element, clear overlay in exact same frame
          targetElement.style.opacity = "1";
          clearTransition();
          onComplete?.();
        },
      });

      activeTimelineRef.current = tl;

      // 1. Morph overlay container dimensions to match target hero geometry
      tl.to(
        overlayEl,
        {
          top: targetRect.top,
          left: targetRect.left,
          width: targetRect.width,
          height: targetRect.height,
          borderRadius: targetBorderRadius,
          duration: 0.55,
          ease: "power3.inOut",
        },
        0,
      );

      // 2. Fade out floating card badge smoothly during transit
      if (badgeRef.current) {
        tl.to(
          badgeRef.current,
          {
            opacity: 0,
            y: -8,
            duration: 0.2,
            ease: "power2.out",
          },
          0,
        );
      }

      return () => {
        if (activeTimelineRef.current) {
          activeTimelineRef.current.kill();
        }
      };
    },
    [activeTransition, clearTransition],
  );

  return (
    <ProjectFlipContext.Provider
      value={{
        activeTransition,
        isFlipping,
        triggerTransition,
        registerTarget,
        clearTransition,
      }}
    >
      {children}

      {/* Shared Element FLIP Portal Overlay */}
      {mounted &&
        activeTransition &&
        createPortal(
          <div
            ref={overlayRef}
            className="fixed pointer-events-none overflow-hidden bg-bg-base-2 border border-stroke/70 shadow-md"
            style={{
              top: activeTransition.initialRect.top,
              left: activeTransition.initialRect.left,
              width: activeTransition.initialRect.width,
              height: activeTransition.initialRect.height,
              borderRadius: activeTransition.initialRect.borderRadius,
              zIndex: 99999,
            }}
          >
            {/* Project Cover Image reusing the source image bitmap directly */}
            {activeTransition.currentImageSrc || activeTransition.logoUrl ? (
              <div className="relative w-full h-full overflow-hidden">
                <Image
                  src={
                    activeTransition.currentImageSrc ||
                    activeTransition.logoUrl ||
                    ""
                  }
                  alt={activeTransition.name || "Project Transition"}
                  fill
                  unoptimized
                  priority
                  className="object-cover w-full h-full"
                />
              </div>
            ) : (
              <div className="w-full h-full bg-bg-base-2" />
            )}

            {/* Floating pill badge matching card */}
            {activeTransition.projectType && (
              <div
                ref={badgeRef}
                className="absolute top-3 left-3 z-10 border border-stroke/50 bg-bg-base-1/85 backdrop-blur-md text-text-primary text-body-s-medium px-2.5 py-1 rounded-md shadow-xs"
              >
                {activeTransition.projectType}
              </div>
            )}
          </div>,
          document.body,
        )}
    </ProjectFlipContext.Provider>
  );
}

export default ProjectFlipProvider;
