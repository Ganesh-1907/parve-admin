import { useRef, useState } from "react";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";

export function VideoSection() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <section className="py-16 md:py-16 bg-background">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4 text-foreground">
            Experience Natural Beauty
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Watch how our pure, plant-based products transform your skincare routine
          </p>
        </div>

        <div className="relative max-w-5xl mx-auto rounded-2xl overflow-hidden shadow-medium animate-fade-in">
          <video
            ref={videoRef}
            className="w-full aspect-video object-cover"
            loop
            muted={isMuted}
            playsInline
            poster="https://images.unsplash.com/photo-1556228720-195a672e8a03?w=1920&q=80"
          >
            <source
              src="https://videos.pexels.com/video-files/5069522/5069522-uhd_2560_1440_25fps.mp4"
              type="video/mp4"
            />
            Your browser does not support the video tag.
          </video>

          {/* Play/Pause Overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-foreground/10 transition-opacity hover:bg-foreground/20">
            <button
              onClick={togglePlay}
              className="w-20 h-20 rounded-full bg-card/90 backdrop-blur-sm flex items-center justify-center shadow-lg hover:bg-card transition-all hover:scale-110"
            >
              {isPlaying ? (
                <Pause className="w-8 h-8 text-foreground" />
              ) : (
                <Play className="w-8 h-8 text-foreground ml-1" />
              )}
            </button>
          </div>

          {/* Mute Button */}
          <button
            onClick={toggleMute}
            className="absolute bottom-4 right-4 w-10 h-10 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center shadow-lg hover:bg-card transition-all"
          >
            {isMuted ? (
              <VolumeX className="w-5 h-5 text-foreground" />
            ) : (
              <Volume2 className="w-5 h-5 text-foreground" />
            )}
          </button>
        </div>
      </div>
    </section>
  );
}
