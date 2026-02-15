"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/free-solid-svg-icons";

interface ProgressOverviewHeaderProps {
  title: string;
  description: string;
  periodLabel: string;
  filterLabel: string;
  periodIcon: IconDefinition;
  filterIcon: IconDefinition;
}

export default function ProgressOverviewHeader({
  title,
  description,
  periodLabel,
  filterLabel,
  periodIcon,
  filterIcon,
}: ProgressOverviewHeaderProps) {
  return (
    <div className="mb-8" data-aos="fade-up">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        
        <div>
          <h2 className="text-2xl md:text-3xl font-black text-neutral-900 mb-2">
            {title}
          </h2>
          <p className="text-lg text-neutral-600">
            {description}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* زر الأول كما هو */}
          <button className="px-4 py-2 border border-neutral-300 rounded-xl text-sm font-semibold text-neutral-700 hover:bg-neutral-50 transition flex items-center gap-2">
            <FontAwesomeIcon icon={periodIcon} />
            {periodLabel}
          </button>

          {/* زر الثاني مع الأيقونة بعد النص */}
          <button className="px-4 py-2 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-accent transition flex items-center gap-2">
            {filterLabel}
            <FontAwesomeIcon icon={filterIcon} />
          </button>
        </div>

      </div>
    </div>
  );
}
