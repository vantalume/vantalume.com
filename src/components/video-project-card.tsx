import Image from "next/image";

type VideoProjectCardProps = {
  title: string;
  format: string;
  poster: string;
  description: string;
  videoSrc?: string;
};

export function VideoProjectCard({ title, format, poster, description, videoSrc }: VideoProjectCardProps) {
  return (
    <article className="video-project-card">
      <div className="video-project-media">
        {videoSrc ? (
          <video controls preload="none" poster={poster} aria-label={`${title} video preview`}>
            <source src={videoSrc} />
            Your browser does not support embedded video.
          </video>
        ) : (
          <Image src={poster} alt="" width={960} height={1200} loading="lazy" />
        )}
        <span>Concept Project</span>
      </div>
      <div className="video-project-copy">
        <p className="label">{format}</p>
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </article>
  );
}
