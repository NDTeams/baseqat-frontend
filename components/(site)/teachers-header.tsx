"use client";

import React from "react";

interface TeachersHeaderProps {
  expertsNetwork: string;
  specializedMentors: string;
  teamDescription: string;
}

export default function TeachersHeader({
  expertsNetwork,
  specializedMentors,
  teamDescription,
}: TeachersHeaderProps) {
  return (
    <div className="text-center mb-12">
      <span className="text-sm font-semibold text-primary">{expertsNetwork}</span>
      <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2">
        {specializedMentors}
      </h2>
      <p className="text-slate-500 mt-3 text-base">{teamDescription}</p>
    </div>
  );
}
