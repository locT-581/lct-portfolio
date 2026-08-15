"use client";

import gsap from "gsap";
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
import { cn } from "@/lib/utils";

export interface LinkMetadata {
  title: string;
  description: string;
  image: string | null;
  siteName: string;
  hostname: string;
  url: string;
}

export interface ShowPreviewPayload {
  href: string;
  targetElement: HTMLElement;
  target?: string;
  rel?: string;
  previewData?: Partial<LinkMetadata>;
}

interface LinkPreviewContextType {
  showPreview: (payload: ShowPreviewPayload) => void;
  hidePreview: () => void;
}

const LinkPreviewContext = createContext<LinkPreviewContextType | null>(null);

// In-memory cache for fetched metadata
const clientMetadataCache = new Map<string, LinkMetadata>();

export function useLinkPreview() {
  const context = useContext(LinkPreviewContext);
  return context;
}

export function LinkPreviewProvider({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activePayload, setActivePayload] = useState<ShowPreviewPayload | null>(
    null,
  );
  const [metadata, setMetadata] = useState<LinkMetadata | null>(null);
  const [isTopPosition, setIsTopPosition] = useState(true);

  const tooltipRef = useRef<HTMLDivElement>(null);
  const arrowRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLAnchorElement>(null);
  const closeTimerRef = useRef<NodeJS.Timeout | null>(null);
  const openTimerRef = useRef<NodeJS.Timeout | null>(null);
  const hasEnteredRef = useRef(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const calculateTargetCoordinates = useCallback((element: HTMLElement) => {
    const targetRect = element.getBoundingClientRect();
    const tooltipWidth = Math.min(380, window.innerWidth - 32);
    const margin = 16;

    // Horizontal alignment centered on target link
    const triggerCenter = targetRect.left + targetRect.width / 2;
    const clampedLeft = Math.max(
      margin,
      Math.min(
        window.innerWidth - tooltipWidth - margin,
        triggerCenter - tooltipWidth / 2,
      ),
    );

    const rawArrowLeft = triggerCenter - clampedLeft;
    const arrowLeft = Math.max(20, Math.min(tooltipWidth - 20, rawArrowLeft));

    // Vertical placement: If space above trigger is less than 160px, flip to bottom
    const spaceAbove = targetRect.top;
    const isTop = spaceAbove >= 160;

    // When isTop: top sits above the trigger (yPercent -100)
    // When bottom: top sits below the trigger (yPercent 0)
    const y = isTop ? targetRect.top - 10 : targetRect.bottom + 10;

    return {
      x: clampedLeft,
      y,
      arrowLeft,
      isTop,
      targetRect,
    };
  }, []);

  const fetchMetadata = useCallback(async (href: string) => {
    if (clientMetadataCache.has(href)) {
      setMetadata(clientMetadataCache.get(href) || null);
      setLoading(false);
      return;
    }

    if (!href.startsWith("http")) return;

    try {
      setLoading(true);
      const res = await fetch(
        `/api/link-preview?url=${encodeURIComponent(href)}`,
      );
      if (res.ok) {
        const data = (await res.json()) as LinkMetadata;
        clientMetadataCache.set(href, data);
        setMetadata(data);
      }
    } catch {
      // Graceful fallback
    } finally {
      setLoading(false);
    }
  }, []);

  const showPreview = useCallback(
    (payload: ShowPreviewPayload) => {
      if (!payload.href.startsWith("http")) return;

      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current);
        closeTimerRef.current = null;
      }

      if (isOpen) {
        // Tooltip is already open -> glide immediately
        if (openTimerRef.current) {
          clearTimeout(openTimerRef.current);
          openTimerRef.current = null;
        }
        setActivePayload(payload);
        setMetadata(
          (payload.previewData as LinkMetadata) ||
            clientMetadataCache.get(payload.href) ||
            null,
        );
        fetchMetadata(payload.href);
      } else {
        // Tooltip is not open -> open after short delay
        if (openTimerRef.current) clearTimeout(openTimerRef.current);

        openTimerRef.current = setTimeout(() => {
          setActivePayload(payload);
          setMetadata(
            (payload.previewData as LinkMetadata) ||
              clientMetadataCache.get(payload.href) ||
              null,
          );
          setIsOpen(true);
          fetchMetadata(payload.href);
        }, 80);
      }
    },
    [isOpen, fetchMetadata],
  );

  const hidePreview = useCallback(() => {
    if (openTimerRef.current) {
      clearTimeout(openTimerRef.current);
      openTimerRef.current = null;
    }

    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
    }

    closeTimerRef.current = setTimeout(() => {
      if (tooltipRef.current) {
        gsap.to(tooltipRef.current, {
          opacity: 0,
          scale: 0.8,
          duration: 0.16,
          ease: "power2.in",
          overwrite: "auto",
          onComplete: () => {
            hasEnteredRef.current = false;
            setIsOpen(false);
            setActivePayload(null);
            setMetadata(null);
          },
        });
      } else {
        hasEnteredRef.current = false;
        setIsOpen(false);
        setActivePayload(null);
        setMetadata(null);
      }
    }, 150);
  }, []);

  // GSAP animation orchestrator on activePayload change
  useEffect(() => {
    if (!isOpen || !activePayload?.targetElement || !tooltipRef.current) return;

    const coords = calculateTargetCoordinates(activePayload.targetElement);
    setIsTopPosition(coords.isTop);

    if (!hasEnteredRef.current) {
      hasEnteredRef.current = true;

      // Initial Entrance Animation scaling up from the arrow pointer
      gsap.set(tooltipRef.current, {
        x: coords.x,
        y: coords.y,
        yPercent: coords.isTop ? -100 : 0,
        transformOrigin: `${coords.arrowLeft}px ${coords.isTop ? "bottom" : "top"}`,
        scale: 0.78,
        opacity: 0,
      });

      if (arrowRef.current) {
        gsap.set(arrowRef.current, {
          left: coords.arrowLeft,
        });
      }

      gsap.to(tooltipRef.current, {
        scale: 1,
        opacity: 1,
        duration: 0.28,
        ease: "back.out(1.4)",
        overwrite: "auto",
      });
    } else {
      // Gliding to New Link Position
      gsap.to(tooltipRef.current, {
        x: coords.x,
        y: coords.y,
        yPercent: coords.isTop ? -100 : 0,
        transformOrigin: `${coords.arrowLeft}px ${coords.isTop ? "bottom" : "top"}`,
        duration: 0.28,
        ease: "power2.out",
        overwrite: "auto",
      });

      if (arrowRef.current) {
        gsap.to(arrowRef.current, {
          left: coords.arrowLeft,
          duration: 0.28,
          ease: "power2.out",
          overwrite: "auto",
        });
      }

      if (contentRef.current) {
        gsap.fromTo(
          contentRef.current,
          { opacity: 0.25, scale: 0.98 },
          { opacity: 1, scale: 1, duration: 0.22, ease: "power2.out" },
        );
      }
    }
  }, [isOpen, activePayload, calculateTargetCoordinates]);

  // Real-time position tracking on page scroll and window resize
  useEffect(() => {
    if (!isOpen || !activePayload?.targetElement) return;

    const handleScrollOrResize = () => {
      if (!activePayload?.targetElement) return;

      const coords = calculateTargetCoordinates(activePayload.targetElement);
      const rect = coords.targetRect;

      // If target element is scrolled completely out of viewport, hide gracefully
      if (rect.bottom < 0 || rect.top > window.innerHeight) {
        hidePreview();
        return;
      }

      setIsTopPosition(coords.isTop);
      if (tooltipRef.current) {
        gsap.set(tooltipRef.current, {
          x: coords.x,
          y: coords.y,
          yPercent: coords.isTop ? -100 : 0,
        });
      }
      if (arrowRef.current) {
        gsap.set(arrowRef.current, {
          left: coords.arrowLeft,
        });
      }
    };

    window.addEventListener("scroll", handleScrollOrResize, { passive: true });
    window.addEventListener("resize", handleScrollOrResize, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScrollOrResize);
      window.removeEventListener("resize", handleScrollOrResize);
    };
  }, [isOpen, activePayload, calculateTargetCoordinates, hidePreview]);

  let parsedHostname = "";
  try {
    if (activePayload?.href) {
      parsedHostname = new URL(activePayload.href).hostname.replace(
        /^www\./,
        "",
      );
    }
  } catch {
    parsedHostname = activePayload?.href || "";
  }

  const faviconUrl = parsedHostname
    ? `https://www.google.com/s2/favicons?domain=${parsedHostname}&sz=64`
    : null;

  return (
    <LinkPreviewContext.Provider value={{ showPreview, hidePreview }}>
      {children}

      {/* SINGLE GLOBAL FLOATING TOOLTIP ELEMENT */}
      {mounted &&
        isOpen &&
        activePayload &&
        createPortal(
          <div
            ref={tooltipRef}
            role="tooltip"
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "min(380px, calc(100vw - 32px))",
              zIndex: 9999,
              willChange: "transform, opacity",
            }}
            className="p-3.5 rounded-2xl border border-stroke/90 dark:border-white/10 bg-bg-base-1/95 dark:bg-[#161618]/95 backdrop-blur-xl shadow-[0_16px_40px_-6px_rgba(0,0,0,0.2),0_0_0_1px_rgba(0,0,0,0.04)] dark:shadow-[0_24px_50px_-10px_rgba(0,0,0,0.7),0_0_0_1px_rgba(255,255,255,0.08)] text-left pointer-events-auto select-none hover:border-brand-orange/40 transition-colors"
            onMouseEnter={() => {
              if (closeTimerRef.current) {
                clearTimeout(closeTimerRef.current);
                closeTimerRef.current = null;
              }
            }}
            onMouseLeave={hidePreview}
          >
            {/* Tooltip Beak Pointer */}
            <div
              ref={arrowRef}
              className={cn(
                "absolute -translate-x-1/2 w-2.5 h-2.5 rotate-45 bg-bg-base-1 dark:bg-[#161618] pointer-events-none",
                isTopPosition
                  ? "-bottom-1.5 border-r border-b border-stroke/90 dark:border-white/10"
                  : "-top-1.5 border-l border-t border-stroke/90 dark:border-white/10",
              )}
            />

            {loading && !metadata ? (
              /* Skeleton Loading State */
              <div className="flex gap-3 items-center">
                <div className="w-16 h-16 shrink-0 rounded-xl bg-bg-base-2 animate-pulse border border-stroke" />
                <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                  <div className="w-4/5 h-3.5 rounded bg-bg-base-2 animate-pulse" />
                  <div className="w-full h-2.5 rounded bg-bg-base-2 animate-pulse" />
                  <div className="w-2/3 h-2.5 rounded bg-bg-base-2 animate-pulse" />
                </div>
              </div>
            ) : metadata ? (
              /* Rich Metadata Card State - Clickable Link */
              <a
                ref={contentRef}
                href={activePayload.href}
                target={activePayload.target || "_blank"}
                rel={activePayload.rel || "noopener noreferrer"}
                className="flex flex-col cursor-pointer group/card no-underline focus:outline-none"
              >
                {/* Content Body */}
                <div className="flex gap-3 items-start">
                  {metadata.image ? (
                    <div className="relative w-16 h-16 sm:w-17 sm:h-17 shrink-0 rounded-xl overflow-hidden border border-stroke bg-bg-base-2 shadow-inner group-hover/card:border-brand-orange/40 transition-colors">
                      {/* biome-ignore lint/performance/noImgElement: OpenGraph preview image */}
                      <img
                        src={metadata.image}
                        alt={metadata.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover/card:scale-105"
                        onError={(e) => {
                          const target = e.currentTarget;
                          if (faviconUrl && target.src !== faviconUrl) {
                            target.src = faviconUrl;
                          }
                        }}
                      />
                    </div>
                  ) : null}

                  <div className="flex flex-col min-w-0 flex-1">
                    <h4 className="text-[13px] sm:text-[13.5px] font-semibold text-text-primary line-clamp-2 leading-snug tracking-tight group-hover/card:text-brand-orange transition-colors">
                      {metadata.title}
                    </h4>

                    {metadata.description && (
                      <p className="text-[11.5px] text-text-secondary line-clamp-2 mt-1 leading-relaxed">
                        {metadata.description}
                      </p>
                    )}

                    <p className="text-[11px] text-blue-500 dark:text-blue-400 mt-1 line-clamp-1 truncate font-medium">
                      {parsedHostname.startsWith("www.")
                        ? parsedHostname
                        : `www.${parsedHostname}`}
                    </p>
                  </div>
                </div>
              </a>
            ) : (
              /* Plain URL Fallback */
              <a
                ref={contentRef}
                href={activePayload.href}
                target={activePayload.target || "_blank"}
                rel={activePayload.rel || "noopener noreferrer"}
                className="text-caption text-text-secondary hover:text-brand-orange transition-colors block"
              >
                {activePayload.href.replace(/^https?:\/\//, "")}
              </a>
            )}
          </div>,
          document.body,
        )}
    </LinkPreviewContext.Provider>
  );
}
