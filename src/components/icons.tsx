import type { SVGProps } from "react";

export function Arrow({ className }: { className?: string }) {
  return <svg className={className} width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true"><path d="M3 9h11M10 4l5 5-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>;
}

export function Mark(props: SVGProps<SVGSVGElement>) {
  return <svg viewBox="0 0 40 40" role="img" aria-label="Vantalume" {...props}><path d="M4 5h9l7 23L27 5h9L24 36h-8L4 5Z" fill="currentColor"/><path d="M20 6 24 18h-8l4-12Z" fill="var(--accent)"/></svg>;
}
