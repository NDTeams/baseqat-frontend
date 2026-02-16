"use client";

interface CoursesHeaderProps {
  subtitle: string;
  title: string;
  description: string;
}

export default function CoursesHeader({
  subtitle,
  title,
  description,
}: CoursesHeaderProps) {
  return (
    <section className="relative pt-32 pb-16 px-5 sm:px-8 bg-gradient-to-br from-emerald-700 via-emerald-800 to-emerald-600 dark:from-emerald-900 dark:via-emerald-950 dark:to-emerald-800 text-white overflow-hidden">
      {/* Background Blur Effects */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 right-10 w-72 h-72 bg-white rounded-full mix-blend-multiply filter blur-3xl"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl"></div>
      </div>

      {/* Content */}
      <div className="relative max-w-6xl mx-auto text-center space-y-6">
        <p className="text-emerald-100 text-sm md:text-base font-semibold uppercase tracking-wider">
          {subtitle}
        </p>
        
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight tracking-tight">
          {title}
        </h1>
        
        <p className="text-lg md:text-xl text-emerald-100 max-w-3xl mx-auto leading-relaxed">
          {description}
        </p>
      </div>
    </section>
  );
}
