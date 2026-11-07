import React from 'react';

export const GaneshaIcon: React.FC<{ className?: string }> = ({ className = 'w-12 h-14' }) => {
  return (
    <svg
      viewBox="0 0 100 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Lord Ganesha illustration"
    >
      {/* Crown / Mukut */}
      <path
        d="M50 10 L54 22 L65 24 L56 31 L58 42 L50 36 L42 42 L44 31 L35 24 L46 22 Z"
        stroke="#C9AE82"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="50" cy="18" r="1.5" fill="#C9AE82" />
      
      {/* Halo / Aura accent */}
      <path
        d="M34 26 C28 34 26 44 26 55"
        stroke="#D8C5A5"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeDasharray="2 3"
      />
      <path
        d="M66 26 C72 34 74 44 74 55"
        stroke="#D8C5A5"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeDasharray="2 3"
      />

      {/* Head & Ears */}
      {/* Left ear */}
      <path
        d="M36 38 C24 38 18 46 19 60 C20 70 28 73 34 68"
        stroke="#C9AE82"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      {/* Right ear */}
      <path
        d="M64 38 C76 38 82 46 81 60 C80 70 72 73 66 68"
        stroke="#C9AE82"
        strokeWidth="1.6"
        strokeLinecap="round"
      />

      {/* Forehead / Tilak (Trishul shape) */}
      <path
        d="M50 38 V50"
        stroke="#C9AE82"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M45 42 C48 45 52 45 55 42"
        stroke="#C9AE82"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <circle cx="50" cy="35" r="1.5" fill="#C9AE82" />

      {/* Eyes */}
      <path
        d="M41 48 C43 47 45 48 46 50"
        stroke="#C9AE82"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <path
        d="M59 48 C57 47 55 48 54 50"
        stroke="#C9AE82"
        strokeWidth="1.4"
        strokeLinecap="round"
      />

      {/* Trunk (flowing down and turning to the left) */}
      <path
        d="M50 50 C50 62 48 76 56 86 C64 94 72 88 70 80 C68 74 61 74 58 78"
        stroke="#C9AE82"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Modak in trunk end */}
      <circle cx="60" cy="77" r="2.2" stroke="#C9AE82" strokeWidth="1.2" fill="#D8C5A5" />

      {/* Tusk */}
      <path
        d="M44 60 L38 62"
        stroke="#C9AE82"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      
      {/* Base lotus lines */}
      <path
        d="M32 104 C40 98 60 98 68 104"
        stroke="#D8C5A5"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <path
        d="M38 109 C44 105 56 105 62 109"
        stroke="#C9AE82"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
};

