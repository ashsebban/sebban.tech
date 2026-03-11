import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Video",
  description: "Watch my introduction video",
};

export default function VideoPage() {
  const videoUrl = "https://www.youtube.com/embed/dQw4w9WgXcQ";

  return (
    <div className="px-6 py-24">
      <div className="max-w-4xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Introduction</h1>
          <p className="text-lg text-muted">
            Get to know me in under 3 minutes.
          </p>
        </div>

        <div className="rounded-xl overflow-hidden border border-border">
          <div className="aspect-video">
            <iframe
              src={videoUrl}
              title="Introduction Video"
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>

        <div className="mt-8 p-8 rounded-xl border border-border bg-card">
          <h2 className="text-xl font-semibold mb-4">About This Video</h2>
          <p className="text-muted leading-relaxed">
            In this video, I introduce myself and talk about my background in
            product management, UX research, and building tools that make complex
            systems more intuitive.
          </p>
          <p className="text-muted leading-relaxed mt-4">
            Whether you&apos;re interested in working together, learning about my
            process, or just want to put a face to the name, this is a great
            place to start.
          </p>
        </div>
      </div>
    </div>
  );
}
