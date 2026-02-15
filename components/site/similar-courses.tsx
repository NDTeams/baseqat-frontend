import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faBook, faUsers } from "@fortawesome/free-solid-svg-icons";

export default function SimilarCourses() {
  return (
    <section className="py-16 bg-neutral-50">
      <div className="container mx-auto px-6">
        <h2
          className="text-3xl md:text-4xl font-black text-neutral-900 mb-8 text-center"
          data-aos="fade-up"
        >
          دورات مشابهة
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* Card 1 */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden card-hover" data-aos="fade-up" data-aos-delay="100">
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&h=400&fit=crop&q=90"
                alt="دورة Angular"
                width={600}
                height={400}
                className="w-full h-48 object-cover"
              />
              <span className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                -10%
              </span>
            </div>

            <div className="p-6">
              <div className="flex items-center mb-2">
                <div className="flex text-sm text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <FontAwesomeIcon key={i} icon={faStar} />
                  ))}
                </div>
                <span className="text-sm text-neutral-600 mr-2">(5 تقييمات)</span>
              </div>

              <h3 className="text-xl font-bold text-neutral-900 mb-2">
                Angular من الصفر إلى الاحتراف
              </h3>

              <p className="text-neutral-600 text-sm mb-4">
                Angular Js حقيقة طويلة أن القارئ سوف يصرف من قبل قابل للقراءة.
              </p>

              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center text-sm text-neutral-600">
                  <FontAwesomeIcon icon={faBook} className="ml-2" />
                  <span>8 دروس</span>
                </div>
                <div className="flex items-center text-sm text-neutral-600">
                  <FontAwesomeIcon icon={faUsers} className="ml-2" />
                  <span>30 طالب</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <span className="text-2xl font-black text-primary">80</span>
                  <span className="text-neutral-600 mr-1">ر.س</span>
                </div>
                <span className="text-neutral-500 line-through">100 ر.س</span>
              </div>

              <a
                href="#"
                className="block mt-4 text-center bg-primary text-white py-3 rounded-xl font-bold hover:bg-accent transition"
              >
                تعرف على المزيد
              </a>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden card-hover" data-aos="fade-up" data-aos-delay="200">
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&h=400&fit=crop&q=90"
                alt="دورة Web"
                width={600}
                height={400}
                className="w-full h-48 object-cover"
              />
              <span className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                -40%
              </span>
            </div>

            <div className="p-6">
              <div className="flex items-center mb-2">
                <div className="flex text-sm text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <FontAwesomeIcon key={i} icon={faStar} />
                  ))}
                </div>
                <span className="text-sm text-neutral-600 mr-2">(15 تقييمات)</span>
              </div>

              <h3 className="text-xl font-bold text-neutral-900 mb-2">
                Web من الأمام إلى الخلف
              </h3>

              <p className="text-neutral-600 text-sm mb-4">
                Web Js حقيقة طويلة أن القارئ سوف يصرف من قبل قابل للقراءة.
              </p>

              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center text-sm text-neutral-600">
                  <FontAwesomeIcon icon={faBook} className="ml-2" />
                  <span>20 دروس</span>
                </div>
                <div className="flex items-center text-sm text-neutral-600">
                  <FontAwesomeIcon icon={faUsers} className="ml-2" />
                  <span>40 طالب</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <span className="text-2xl font-black text-primary">60</span>
                  <span className="text-neutral-600 mr-1">ر.س</span>
                </div>
                <span className="text-neutral-500 line-through">120 ر.س</span>
              </div>

              <a
                href="#"
                className="block mt-4 text-center bg-primary text-white py-3 rounded-xl font-bold hover:bg-accent transition"
              >
                تعرف على المزيد
              </a>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden card-hover" data-aos="fade-up" data-aos-delay="300">
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=600&h=400&fit=crop&q=90"
                alt="دورة SQL"
                width={600}
                height={400}
                className="w-full h-48 object-cover"
              />
              <span className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                -20%
              </span>
            </div>

            <div className="p-6">
              <div className="flex items-center mb-2">
                <div className="flex text-sm text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <FontAwesomeIcon key={i} icon={faStar} />
                  ))}
                </div>
                <span className="text-sm text-neutral-600 mr-2">(15 تقييمات)</span>
              </div>

              <h3 className="text-xl font-bold text-neutral-900 mb-2">
                SQL للمبتدئين والمتقدمين
              </h3>

              <p className="text-neutral-600 text-sm mb-4">
                حقيقة طويلة راسخة أن القارئ سوف يصرف من قبل قابل للقراءة.
              </p>

              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center text-sm text-neutral-600">
                  <FontAwesomeIcon icon={faBook} className="ml-2" />
                  <span>12 دروس</span>
                </div>
                <div className="flex items-center text-sm text-neutral-600">
                  <FontAwesomeIcon icon={faUsers} className="ml-2" />
                  <span>50 طالب</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <span className="text-2xl font-black text-primary">60</span>
                  <span className="text-neutral-600 mr-1">ر.س</span>
                </div>
                <span className="text-neutral-500 line-through">120 ر.س</span>
              </div>

              <a
                href="#"
                className="block mt-4 text-center bg-primary text-white py-3 rounded-xl font-bold hover:bg-accent transition"
              >
                تعرف على المزيد
              </a>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
