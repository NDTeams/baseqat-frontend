
import CourseHero from "@/components/site/course-hero";
import CourseSection from "@/components/site/course-section"
import SimilarCourses from "@/components/site/similar-courses";
export default function BlogDetailsPage() {
    return (
        <div className="flex flex-col justify-center items-center ">
            <CourseHero />
            <CourseSection />
            <SimilarCourses />

           
        </div>
    );
}