/**
 * PracticeMap.tsx
 *
 * Displays a Google Maps embed for a given address string.
 * Uses the free iframe embed — no API key required.
 */

import React, { useMemo } from "react";

interface Props {
  /** Full address string to geocode and display */
  address: string;
}

const PracticeMap: React.FC<Props> = ({ address }) => {
  const src = useMemo(() => {
    if (!address.trim()) return "";
    const encoded = encodeURIComponent(address);
    return `https://maps.google.com/maps?q=${encoded}&output=embed&z=15`;
  }, [address]);

  if (!src) {
    return (
      <div style={styles.placeholder}>
        <svg width="38" height="38" viewBox="0 0 24 24" fill="none"
          stroke="#ccc" strokeWidth="1.5">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
        <p style={styles.placeholderText}>
          Select a pickup address<br />to view the map
        </p>
      </div>
    );
  }

  return (
    <iframe
      title="Pickup location map"
      width="100%"
      height="100%"
      style={{ border: 0, display: "block" }}
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
      src={src}
    />
  );
};

const styles: Record<string, React.CSSProperties> = {
  placeholder: {
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    background: "#f8f9fb",
    color: "#aaa",
  },
  placeholderText: {
    fontSize: "0.82rem",
    textAlign: "center",
    lineHeight: 1.5,
    margin: 0,
  },
};

export default PracticeMap;