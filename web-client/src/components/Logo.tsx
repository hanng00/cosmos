import * as React from "react";
import styles from "./Logo.module.css";
import Link from "next/link";

const CosmosLogo: React.FC<{ className?: string; size?: number }> = ({
  className = "",
  size = 48,
}) => (
  <Link href="/">
    <span
      className={`inline-flex items-center gap-2 ${className} ${styles.logo}`}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: "block" }}
        className={styles.svg}
      >
        <circle
          cx="18"
          cy="24"
          r="10"
          stroke="currentColor"
          strokeWidth="1.5"
          fill="none"
          className={styles.orbitLeft}
        />
        <circle
          cx="30"
          cy="24"
          r="10"
          stroke="currentColor"
          strokeWidth="1.5"
          fill="none"
          className={styles.orbitRight}
        />
        <rect
          x="19"
          y="14"
          width="10"
          height="20"
          rx="5"
          stroke="currentColor"
          strokeWidth="1.2"
          fill="none"
          className={styles.capsule}
        />
        <circle
          cx="24"
          cy="24"
          r="2"
          fill="currentColor"
          className={styles.core}
        />
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
  </Link>
);

export default CosmosLogo;
