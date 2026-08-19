import Image from "next/image";
import { cn } from "@/lib/utils";
import type { ProjectMediaItem } from "@/types/cms";

export interface CaseStudyMediaProps {
  /** List of media items for the project */
  media: ProjectMediaItem[] | null;
  /** Additional CSS class names */
  className?: string;
}

/**
 * `<CaseStudyMedia>` component rendering project screenshots/media with captions using next/image.
 */
export function CaseStudyMedia({ media, className = "" }: CaseStudyMediaProps) {
  if (!media || media.length === 0) {
    return null;
  }

  return (
    <section
      className={cn("flex flex-col gap-8 w-full", className)}
      aria-label="Project media gallery"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        {media.map((item, index) => (
          <figure
            key={`${item.url}-${index}`}
            className="flex flex-col gap-3 group w-full"
          >
            <div className="relative w-full aspect-16/10 bg-bg-base-2 border border-stroke rounded-xl overflow-hidden shadow-xs">
              <Image
                src={item.url}
                alt={item.caption || `Project screenshot ${index + 1}`}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
              />
            </div>
            {item.caption && (
              <figcaption className="text-caption text-text-secondary italic text-center">
                {item.caption}
              </figcaption>
            )}
          </figure>
        ))}
      </div>
    </section>
  );
}

export default CaseStudyMedia;
