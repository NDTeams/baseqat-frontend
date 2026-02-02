import Article from '@/components/(site)/article';
import RelatedArticles from '@/components/(site)/related-articles';
export default function BlogDetailsPage() {
    return (
        <div className="flex flex-col px-28 justify-center items-center min-h-screen">
            <Article />
            <RelatedArticles />
        </div>
    );
}