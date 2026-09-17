import type { Locale } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/dictionary';
import { BOOKS, BEYOND_WORDS, needsReview } from '@/content/seed';
import { CourseCta } from '@/components/public/LiveStatus';
import { BookCard } from '@/components/public/Cards';
import { ReviewBanner } from '@/components/public/ReviewBanner';

export default async function HomePage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const dict = await getDictionary(locale);
  const featured = BOOKS[0];

  return (
    <>
      <ReviewBanner show={needsReview([featured])} label={dict.review.banner} />

      <section className="hero container">
        <h1 className="hero__title">{dict.brand.tagline}</h1>
        <p className="hero__lede prose">{dict.home.lede}</p>
      </section>

      <hr className="decor-rule" />

      <section className="container stack">
        <h2>{dict.home.featuredCourse}</h2>
        <p className="eyebrow">{BEYOND_WORDS.level} · {BEYOND_WORDS.lessonCount} {dict.course.lessons}</p>
        <h3><a href={`/${locale}/courses/${BEYOND_WORDS.slug}`}>{BEYOND_WORDS.title}</a></h3>
        <p className="course-hook">{BEYOND_WORDS.hook}</p>
        <p className="prose">{BEYOND_WORDS.lede}</p>
        <CourseCta courseId={BEYOND_WORDS.slug}
          href={`/${locale}/courses/${BEYOND_WORDS.slug}`} dict={dict.flat} />
      </section>

      <section className="container stack">
        <h2>{dict.home.featuredBook}</h2>
        <div className="card-grid">
          <BookCard book={featured} locale={locale} dict={dict} />
        </div>
      </section>
    </>
  );
}
