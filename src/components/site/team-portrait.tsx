"use client";

import Image from "next/image";
import { useState } from "react";

export function TeamPortrait({
  src,
  name,
  role,
  number,
  preload = false,
}: {
  src: string | null;
  name: string;
  role: string;
  number: string;
  preload?: boolean;
}) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div
        aria-label={`Portrait pending for ${role} profile`}
        className="team-portrait-placeholder"
        role="img"
      >
        <span aria-hidden="true">{number}</span>
        <span>Portrait pending</span>
      </div>
    );
  }

  return (
    <Image
      alt={`${name}, ${role}`}
      className="team-profile-image"
      fill
      preload={preload}
      sizes="(max-width: 760px) 100vw, (max-width: 1080px) 50vw, 33vw"
      src={src}
      onError={() => setFailed(true)}
    />
  );
}
