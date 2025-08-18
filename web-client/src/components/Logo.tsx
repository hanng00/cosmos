import * as React from "react";

const CosmosLogo: React.FC<{ className?: string; size?: number }> = ({
  className = "",
  size = 48,
}) => (
  <span className={`inline-flex items-center gap-2 ${className}`}>
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: "block" }}
    >
      <circle
        cx="18"
        cy="24"
        r="10"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
      />
      <circle
        cx="30"
        cy="24"
        r="10"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
      />
      <rect
        x="19"
        y="14"
        width="10"
        height="20"
        rx="5"
        transform="rotate(20 24 24)"
        stroke="currentColor"
        strokeWidth="1.2"
        fill="none"
      />
      <circle cx="24" cy="24" r="2" fill="currentColor" />
    </svg>
    <span
      style={{
        fontFamily: "var(--font-geist-sans)",
        fontWeight: 400,
        fontSize: size / 2.4,
        letterSpacing: -0.5,
        lineHeight: 1,
        display: "inline-block",
        color: "currentColor",
      }}
    >
      Cosmos
    </span>
  </span>
);

export default CosmosLogo;
