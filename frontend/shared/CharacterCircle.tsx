import React from 'react';

interface CircleProps {
  tweetContentLength: number;
  characterLimit: number;
}

const CharacterCircle: React.FC<CircleProps> = ({ tweetContentLength, characterLimit }) => {
  const radius = 10; // Radius of the circle
  const circumference = 2 * Math.PI * radius; // Circumference of the circle
  const percentage = Math.min(tweetContentLength / characterLimit, 1); // The percentage of the circle filled

  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - percentage * circumference;

  return (
    <div className="relative">
      <svg width="40" height="40">
        <circle
          cx="20"
          cy="20"
          r={radius}
          stroke="#a2a2a24f"
          strokeWidth="2"
          fill="transparent"
        />
        <circle
          cx="20"
          cy="20"
          r={radius}
          stroke="#1d9bf0"
          strokeWidth="2.2"
           strokeLinecap="round"
          fill="transparent"
            transform="rotate(-90 20 20)"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          style={{ transition: "stroke-dashoffset 0.3s ease" }}
        />
      </svg>
     
    </div>
  );
};

export default CharacterCircle;
