"use client";

interface ContactHeaderProps {
  subtitle: string;
  title: string;
  description: string;
}

export default function ContactHeader({
  subtitle,
  title,
  description,
}: ContactHeaderProps) {
  return (
    <header className="space-y-3">
      <p className="text-sm font-semibold text-emerald-700">
        {subtitle}
      </p>

      <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
        {title}
      </h1>

      <p className="text-slate-600 max-w-3xl">
        {description}
      </p>
    </header>
  );
}
