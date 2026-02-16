'use client';

import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar, faUser, faClock } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';

interface Article {
  id: string;
  title: string;
  date: string;
  author: string;
  readingTime: string;
  category: string;
  excerpt: string;
  image: string;
  href: string;
}

const articles: Article[] = [
  {
    id: '1',
    title: 'How to Launch Your Digital Product with Confidence in 8 Weeks',
    date: 'July 12, 2025',
    author: 'Basqat Team',
    readingTime: '6 min read',
    category: 'Growth',
    excerpt:
      'We share a practical methodology to speed up digital product launches, from market testing to your first paying customer, with real examples and actionable tips.',
    image:
      'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80',
    href: '/blog/product-launch',
  },
  {
    id: '2',
    title: 'Customer Segment Testing in One Week',
    date: 'June 28, 2025',
    author: 'Growth Team',
    readingTime: '5 min read',
    category: 'Strategy',
    excerpt:
      'Learn how to validate your target customer segments quickly and efficiently without spending months on research.',
    image:
      'https://images.unsplash.com/photo-1557804506-669714d2e9d8?auto=format&fit=crop&w=800&q=80',
    href: '/blog/customer-testing',
  },
  {
    id: '3',
    title: 'Digital Transformation Best Practices',
    date: 'June 15, 2025',
    author: 'Tech Team',
    readingTime: '8 min read',
    category: 'Digital',
    excerpt:
      'Essential strategies and methodologies for successfully transforming your business in the digital age.',
    image:
      'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80',
    href: '/blog/digital-transformation',
  },
  {
    id: '4',
    title: 'Building High-Performance Teams',
    date: 'June 1, 2025',
    author: 'HR Team',
    readingTime: '7 min read',
    category: 'Management',
    excerpt:
      'Discover the key principles and practices for building and maintaining high-performance teams in your organization.',
    image:
      'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80',
    href: '/blog/team-building',
  },
  {
    id: '5',
    title: 'Accelerating Market Entry for Startups',
    date: 'May 18, 2025',
    author: 'Business Dev',
    readingTime: '6 min read',
    category: 'Startup',
    excerpt:
      'Proven strategies for startups to accelerate their market entry and achieve product-market fit faster.',
    image:
      'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80',
    href: '/blog/market-entry',
  },
  {
    id: '6',
    title: 'Data-Driven Decision Making in 2025',
    date: 'May 5, 2025',
    author: 'Analytics Team',
    readingTime: '7 min read',
    category: 'Analytics',
    excerpt:
      'How to leverage data analytics to make informed business decisions and drive growth in the modern era.',
    image:
      'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80',
    href: '/blog/data-analytics',
  },
];

export default function MediaArticles() {
  const { t } = useTranslation();

  return (
    <div className="space-y-8">
      {/* Grid of Articles */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {articles.map((article) => (
          <Link key={article.id} href={article.href}>
            <article className="group h-full flex flex-col bg-white dark:bg-slate-800 rounded-2xl shadow-md hover:shadow-lg dark:shadow-slate-900/50 overflow-hidden transition-all duration-300 hover:translate-y-[-4px]">
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute top-4 left-4">
                  <span className="inline-block bg-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                    {article.category}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 p-6 flex flex-col">
                {/* Metadata */}
                <div className="flex flex-col gap-2 text-sm text-gray-500 dark:text-gray-400 mb-3">
                  <div className="flex items-center gap-2">
                    <FontAwesomeIcon icon={faCalendar} className="w-3 h-3" />
                    <span>{article.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FontAwesomeIcon icon={faUser} className="w-3 h-3" />
                    <span>{article.author}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FontAwesomeIcon icon={faClock} className="w-3 h-3" />
                    <span>{article.readingTime}</span>
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3 line-clamp-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  {article.title}
                </h3>

                {/* Excerpt */}
                <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2 mb-4 flex-grow">
                  {article.excerpt}
                </p>

                {/* Read More Button */}
                <button className="text-emerald-600 dark:text-emerald-400 font-semibold text-sm hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors flex items-center gap-2 group/btn">
                  Read Article
                  <span className="group-hover/btn:translate-x-1 transition-transform">→</span>
                </button>
              </div>
            </article>
          </Link>
        ))}
      </div>
    </div>
  );
}
