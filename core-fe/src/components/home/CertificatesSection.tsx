import { BorderGlow } from "@/components/ui/BorderGlow";
import { LinkPreview } from "@/components/ui/LinkPreview";
import { PortableText } from "@/components/ui/PortableText";
import { SectionTag } from "@/components/ui/SectionTag/SectionTag";
import { cn } from "@/lib/utils";
import type { CertificationEntry } from "@/types/cms";
import { PeriodLabel } from "../ui/PeriodLabel";

export interface CertificatesSectionProps {
  /**
   * Array of certification entries from Em-dash CMS.
   */
  entries: CertificationEntry[];
  /**
   * Optional section tag label string. Defaults to "Certifications".
   */
  sectionLabel?: string;
  /**
   * Optional label for verify credential button.
   */
  verifyLabel?: string;
  /**
   * Additional CSS class names.
   */
  className?: string;
}

function CertificateIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      width="18"
      height="18"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <g>
        <path d="M337.26,179.222h-54.814l-16.935-52.13c-1.339-4.12-5.179-6.91-9.511-6.91s-8.172,2.79-9.511,6.91l-16.935,52.13H174.74 c-4.332,0-8.172,2.79-9.511,6.91c-1.339,4.12,0.128,8.634,3.634,11.181l44.341,32.21l-16.935,52.13 c-1.339,4.12,0.128,8.634,3.633,11.181c3.506,2.545,8.252,2.546,11.756-0.001L256,260.614l44.342,32.219 c1.752,1.273,3.815,1.91,5.878,1.91c6.76,0,11.617-6.609,9.511-13.09l-16.935-52.13l44.341-32.21 c3.506-2.547,4.973-7.061,3.634-11.181S341.592,179.222,337.26,179.222z M281.163,217.612c-3.506,2.546-4.973,7.061-3.634,11.181 l9.671,29.77l-25.322-18.399c-3.504-2.547-8.252-2.547-11.756,0L224.8,258.562l9.671-29.77c1.339-4.12-0.128-8.635-3.634-11.181 l-25.315-18.39h31.299c4.332,0,8.172-2.79,9.511-6.91L256,162.549l9.669,29.764c1.339,4.12,5.179,6.91,9.511,6.91h31.299 L281.163,217.612z" />
        <path d="M443.851,157.13c-3.999-14.959,0.849-35.848-9.027-52.93c-9.927-17.136-30.723-23.621-41.332-34.228 c-10.567-10.57-17.134-31.431-34.232-41.335c-17.062-9.872-37.976-5.028-52.922-9.024C292.123,15.805,276.166,1.003,256,1.003 c-20.151,0-36.203,14.823-50.333,18.609c-14.959,3.999-35.848-0.849-52.93,9.027c-10.696,6.196-17.324,16.76-23.173,26.079 c-9.401,14.985-11.295,16.89-26.309,26.309c-9.319,5.848-19.883,12.477-26.081,23.177c-9.871,17.06-5.029,37.982-9.024,52.922 c-3.808,14.214-18.61,30.171-18.61,50.337c0,20.151,14.825,36.204,18.609,50.335c3.987,14.897-0.835,35.838,9.027,52.928 c10.21,17.625,31.908,23.936,42.373,35.315L77.374,472.54c-2.601,7.801,4.84,15.254,12.648,12.649l40.314-13.439l24.191,34.944 c4.674,6.75,15.101,5.294,17.708-2.529l36.018-108.036c13.663,4.786,28.833,17.793,47.746,17.793 c18.887,0,34.144-13.029,47.743-17.793l36.021,108.036c2.598,7.797,13.021,9.298,17.708,2.529l24.191-34.944l40.314,13.439 c7.798,2.602,15.253-4.839,12.648-12.649L392.45,346.04c10.53-11.464,32.121-17.618,42.374-35.317 c9.843-17.002,5.049-38.039,9.025-52.924c3.809-14.214,18.61-30.171,18.61-50.337C462.46,187.311,447.637,171.26,443.851,157.13z M159.589,478.867L142.512,454.2c-2.539-3.667-7.188-5.197-11.384-3.794l-28.454,9.484l31.063-93.167 c15.287,23.09,27.79,25.544,54.36,26.633L159.589,478.867z M380.872,450.406c-4.214-1.408-8.854,0.141-11.384,3.794 l-17.077,24.668l-28.505-85.494c26.423-1.043,39.068-3.557,54.358-26.649l31.062,93.166L380.872,450.406z M433.685,231.69 c-9.446,17.805-11,23.145-11.838,44.345c-0.966,24.496-2.752,27.756-23.734,40.922c-10.896,6.836-17.622,11.29-24.902,21.027 c-8.817,11.792-14.38,25.356-23.97,30.993c-11.225,6.496-30.98,2.459-48.078,7.017c-7.436,1.991-14.298,5.633-20.936,9.154 c-22.028,11.691-26.395,11.708-48.455,0c-10.416-5.526-17.556-9.163-28.771-10.703c-0.008-0.001-0.017-0.001-0.025-0.002 c-14.703-2.03-30.454,0.008-40.005-5.345c-7.637-4.75-11.97-12.398-16.398-19.439c-11.078-17.625-14.921-21.556-32.686-32.702 c-8.068-5.063-15.689-9.845-19.396-16.243c-6.507-11.272-2.409-30.85-7.022-48.088c-4.53-16.914-17.929-31.478-17.929-45.163 c0-13.661,13.411-28.294,17.93-45.167c2.073-7.753,2.384-15.729,2.683-23.441c0.947-24.367,2.721-27.701,23.734-40.886 c17.581-11.031,21.58-15.025,32.619-32.619c5.063-8.068,9.844-15.689,16.25-19.399c11.24-6.501,30.831-2.406,48.081-7.019 c16.914-4.529,31.479-17.929,45.163-17.929c7.692,0,15.725,4.262,24.228,8.774c17.789,9.437,23.181,11.016,44.381,11.838 c24.367,0.947,27.701,2.721,40.886,23.734c11.033,17.585,15.025,21.58,32.619,32.619c20.956,13.149,22.785,16.444,23.734,40.889 c0.821,21.187,2.398,26.585,11.838,44.378c4.513,8.503,8.775,16.535,8.775,24.228C442.46,215.155,438.198,223.187,433.685,231.69z" />
        <path d="M256,62.463c-79.953,0-145,65.047-145,145c0,81.221,65.975,145.016,144.998,145.016 c79.776,0,145.002-64.632,145.002-145.016C401,127.51,335.953,62.463,256,62.463z M256.246,332.483 C187.759,332.617,131,277.263,131,207.463c0-68.925,56.075-125,125-125s125,56.075,125,125 C381,276.423,325.123,332.348,256.246,332.483z" />
      </g>
    </svg>
  );
}

function ExternalArrowIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="transition-transform duration-200 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5"
    >
      <path d="M7 17 17 7" />
      <path d="M7 7h10v10" />
    </svg>
  );
}

/**
 * `<CertificatesSection>` React Server Component displaying professional certifications and credentials.
 * Placed after `<SkillsSection>` on the portfolio homepage.
 */
export function CertificatesSection({
  entries,
  sectionLabel = "Certifications",
  verifyLabel = "Verify credential",
  className = "",
}: CertificatesSectionProps) {
  if (!entries || entries.length === 0) {
    return null;
  }

  return (
    <section
      aria-label={sectionLabel}
      className={cn("w-full flex flex-col gap-8 items-start", className)}
    >
      <SectionTag label={sectionLabel} />
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
        {entries.map((cert) => (
          <BorderGlow
            key={cert.id || cert.title}
            className="cert-card group border-stroke transition-all duration-200 shadow-xs hover:border-stroke-orange/40 h-full"
            backgroundColor="var(--bg-base-1)"
            borderRadius={12}
            glowRadius={28}
            glowIntensity={0.8}
            glowColor="21 90 48"
            colors={["#e85a0c", "#ff9838", "#f43f5e"]}
            edgeSensitivity={30}
          >
            <div className="p-5 flex flex-col justify-between gap-4 h-full">
              <div className="flex flex-col gap-3">
                {/* Header: Icon badge & Year */}
                <div className="flex items-center justify-between gap-2">
                  <CertificateIcon className="text-brand-orange size-6.5" />
                  {cert.issueDate && <PeriodLabel period={cert.issueDate} />}
                </div>

                {/* Title & Issuer */}
                <div className="flex flex-col gap-1">
                  <h3 className="text-text-primary text-body-m-medium font-semibold group-hover:text-brand-orange transition-colors">
                    {cert.title}
                  </h3>
                  <p className="text-text-secondary text-body-s-medium">
                    {cert.issuer}
                  </p>
                </div>

                {/* Description */}
                {(cert.descriptionRaw || cert.description) && (
                  <div className="text-text-secondary text-body-s-regular leading-relaxed">
                    {cert.descriptionRaw ? (
                      <PortableText value={cert.descriptionRaw} />
                    ) : (
                      <p className="whitespace-pre-line">{cert.description}</p>
                    )}
                  </div>
                )}
              </div>

              {/* Footer / Credential Link */}
              {cert.credentialUrl && (
                <div className="pt-2 border-t border-stroke/60 flex items-center justify-between">
                  <LinkPreview
                    href={cert.credentialUrl}
                    className="group/link inline-flex items-center gap-1 text-body-s-medium text-brand-orange hover:text-brand-orange/80 transition-colors"
                  >
                    <span>{verifyLabel}</span>
                    <ExternalArrowIcon />
                  </LinkPreview>
                </div>
              )}
            </div>
          </BorderGlow>
        ))}
      </div>
    </section>
  );
}

export default CertificatesSection;
