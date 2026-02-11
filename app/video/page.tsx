import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Video",
  description: "Watch my introduction video",
};

export default function VideoPage() {
  // Replace this with your actual video URL when ready
  const videoUrl = "https://www.youtube.com/embed/dQw4w9WgXcQ";

  return (
    <div className="min-h-screen py-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Introduction Video</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Get to know me in under 3 minutes
          </p>
        </div>

        {/* Video Player */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="aspect-video">
            {/* Replace videoUrl above with your actual YouTube/Vimeo embed URL */}
            <iframe
              src={videoUrl}
              title="Introduction Video"
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>

        {/* Video Description */}
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold mb-4">About This Video</h2>
          <div className="prose dark:prose-invert">
            <p className="text-gray-600 dark:text-gray-300">
              In this video, I introduce myself and talk about my background in product management,
              UX research, and building tools that make complex systems more intuitive. You'll learn
              about my approach to user research, my experience at Anaconda, and what drives my passion
              for creating products that truly resonate with users.
            </p>
            <p className="text-gray-600 dark:text-gray-300 mt-4">
              Whether you're interested in working together, learning about my process, or just want
              to put a face to the name, this is a great place to start!
            </p>
          </div>
        </div>

        {/* Alternative: Local Video */}
        {/* If you want to host the video locally in the /public folder:
        <div className="aspect-video bg-black rounded-lg overflow-hidden">
          <video controls className="w-full h-full">
            <source src="/videos/my-video.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
        */}
      </div>
    </div>
  );
}
