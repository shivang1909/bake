import React from 'react';

const videoNames = ['reel1', 'reel2', 'reel3', 'reel4', 'reel5'];

const VideoSection = () => {
  return (
    <div className="video-section px-4 py-8">
      <div className="video-container flex gap-6 overflow-x-auto scrollbar-hide md:justify-left md:items-center lg:justify-center">
        {videoNames.map((name, index) => (
          <div
            key={index}
            className="justify-center items-center rounded-xl overflow-hidden flex-shrink-0"
          >
            <video
              autoPlay
              loop
              muted
              playsInline
              preload="none"
              className="w-auto h-96 object-cover"
              poster={`/assets/images/Custom/${name}.webp`} // Optional poster for faster loading
            >
              <source src={`/assets/images/Custom/${name}.webm`} type="video/webm" />
              <source src={`/assets/images/Custom/${name}.mp4`} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VideoSection;
