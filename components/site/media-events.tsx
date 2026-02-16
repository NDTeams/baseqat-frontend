'use client';

import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar, faMapMarkerAlt, faClock, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  category: string;
  description: string;
  image: string;
  status: 'upcoming' | 'past';
  href: string;
}

const events: Event[] = [
  {
    id: '1',
    title: 'Digital Transformation Workshop 2025',
    date: 'January 15, 2025',
    time: '10:00 AM - 2:00 PM',
    location: 'Riyadh Conference Center',
    category: 'Workshop',
    description: 'Join us for an intensive workshop on digital transformation strategies and best practices.',
    image:
      'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80',
    status: 'upcoming',
    href: '/events/digital-transformation-2025',
  },
  {
    id: '2',
    title: 'Startup Acceleration Program Launch',
    date: 'January 22, 2025',
    time: '3:00 PM - 5:00 PM',
    location: 'Innovation Hub',
    category: 'Launch Event',
    description:
      'Discover opportunities to accelerate your startup journey with our new program launch.',
    image:
      'https://images.unsplash.com/photo-1557804506-669714d2e9d8?auto=format&fit=crop&w=800&q=80',
    status: 'upcoming',
    href: '/events/startup-program-launch',
  },
  {
    id: '3',
    title: 'Networking Breakfast for Entrepreneurs',
    date: 'February 5, 2025',
    time: '8:00 AM - 10:00 AM',
    location: 'Downtown Venue',
    category: 'Networking',
    description:
      'Connect with fellow entrepreneurs and industry leaders over breakfast and meaningful conversations.',
    image:
      'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80',
    status: 'upcoming',
    href: '/events/networking-breakfast',
  },
  {
    id: '4',
    title: 'AI and Machine Learning for Business Growth',
    date: 'December 10, 2024',
    time: '9:00 AM - 12:00 PM',
    location: 'Tech Hub',
    category: 'Seminar',
    description:
      'Learn how to leverage AI and machine learning to drive business growth and competitive advantage.',
    image:
      'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80',
    status: 'past',
    href: '/events/ai-machine-learning',
  },
  {
    id: '5',
    title: 'Annual Basqat Summit 2024',
    date: 'November 28, 2024',
    time: '9:00 AM - 5:00 PM',
    location: 'Grand Ballroom',
    category: 'Summit',
    description: 'Our flagship annual event brings together industry leaders, innovators, and entrepreneurs.',
    image:
      'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80',
    status: 'past',
    href: '/events/basqat-summit-2024',
  },
  {
    id: '6',
    title: 'Product Development Masterclass',
    date: 'November 15, 2024',
    time: '2:00 PM - 5:00 PM',
    location: 'Training Center',
    category: 'Masterclass',
    description:
      'Master the fundamentals of product development from ideation to launch with industry experts.',
    image:
      'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80',
    status: 'past',
    href: '/events/product-masterclass',
  },
];

// Separate events by status
const upcomingEvents = events.filter((e) => e.status === 'upcoming');
const pastEvents = events.filter((e) => e.status === 'past');

export default function MediaEvents() {
  const { t } = useTranslation();

  return (
    <div className="space-y-12">
      {/* Upcoming Events Section */}
      {upcomingEvents.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b-2 border-emerald-600 dark:border-emerald-500">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Upcoming Events</h3>
            <span className="bg-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full">
              {upcomingEvents.length}
            </span>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {upcomingEvents.map((event) => (
              <Link key={event.id} href={event.href}>
                <div className="group h-full flex flex-col bg-white dark:bg-slate-800 rounded-2xl shadow-md hover:shadow-lg dark:shadow-slate-900/50 overflow-hidden transition-all duration-300 hover:translate-y-[-4px] border-2 border-transparent hover:border-emerald-500/20">
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden bg-gray-200 dark:bg-slate-700">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute top-4 right-4">
                      <span className="inline-block bg-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                        {event.category}
                      </span>
                    </div>
                    {/* Status Badge */}
                    <div className="absolute top-4 left-4">
                      <span className="inline-block bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                        Upcoming
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-6 flex flex-col">
                    {/* Title */}
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 line-clamp-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                      {event.title}
                    </h3>

                    {/* Details */}
                    <div className="space-y-3 mb-4 flex-grow">
                      <div className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-300">
                        <FontAwesomeIcon icon={faCalendar} className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <span>{event.date}</span>
                      </div>
                      <div className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-300">
                        <FontAwesomeIcon icon={faClock} className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-300">
                        <FontAwesomeIcon
                          icon={faMapMarkerAlt}
                          className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5"
                        />
                        <span>{event.location}</span>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2 mb-4">
                      {event.description}
                    </p>

                    {/* CTA Button */}
                    <button className="text-emerald-600 dark:text-emerald-400 font-semibold text-sm hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors flex items-center gap-2 group/btn">
                      Learn More
                      <FontAwesomeIcon
                        icon={faArrowRight}
                        className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform"
                      />
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Past Events Section */}
      {pastEvents.length > 0 && (
        <div className="space-y-6 pt-6 border-t border-gray-200 dark:border-slate-700">
          <div className="flex items-center gap-3 pb-4 border-b-2 border-gray-400 dark:border-gray-600">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Past Events</h3>
            <span className="bg-gray-400 dark:bg-gray-600 text-white text-xs font-bold px-3 py-1 rounded-full">
              {pastEvents.length}
            </span>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {pastEvents.map((event) => (
              <Link key={event.id} href={event.href}>
                <div className="group h-full flex flex-col bg-white dark:bg-slate-800 rounded-2xl shadow-md hover:shadow-lg dark:shadow-slate-900/50 overflow-hidden transition-all duration-300 opacity-90 hover:opacity-100">
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden bg-gray-200 dark:bg-slate-700">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-75"
                    />
                    <div className="absolute top-4 right-4">
                      <span className="inline-block bg-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                        {event.category}
                      </span>
                    </div>
                    {/* Status Badge */}
                    <div className="absolute top-4 left-4">
                      <span className="inline-block bg-gray-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                        Past
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-6 flex flex-col">
                    {/* Title */}
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 line-clamp-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                      {event.title}
                    </h3>

                    {/* Details */}
                    <div className="space-y-3 mb-4 flex-grow text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-start gap-3">
                        <FontAwesomeIcon icon={faCalendar} className="w-4 h-4 flex-shrink-0 mt-0.5" />
                        <span>{event.date}</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <FontAwesomeIcon icon={faMapMarkerAlt} className="w-4 h-4 flex-shrink-0 mt-0.5" />
                        <span>{event.location}</span>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2 mb-4">
                      {event.description}
                    </p>

                    {/* CTA Button */}
                    <button className="text-emerald-600 dark:text-emerald-400 font-semibold text-sm hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors flex items-center gap-2 group/btn">
                      View Details
                      <FontAwesomeIcon
                        icon={faArrowRight}
                        className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform"
                      />
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
