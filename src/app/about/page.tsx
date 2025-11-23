
import { MainLayout } from '@/components/layout/main-layout';
import { SEO } from '@/constants';

export default function AboutPage() {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">About {SEO.SITE_NAME}</h1>
            <p className="text-xl text-muted-foreground">
              Crafting beautiful, unique jewelry pieces with passion and precision
            </p>
          </div>

          <div className="prose prose-lg max-w-none">
            <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
              <div>
                <h2 className="text-3xl font-bold mb-4">Our Story</h2>
                <p className="text-muted-foreground mb-4">
                  Founded with a passion for creating unique, handcrafted jewelry, {SEO.SITE_NAME} has been
                  bringing beautiful, personalized pieces to life for jewelry lovers everywhere.
                </p>
                <p className="text-muted-foreground mb-4">
                  Each piece in our collection is carefully handcrafted by skilled artisans who pour their
                  heart and soul into every creation. We believe that jewelry should tell a story - your story.
                </p>
                <p className="text-muted-foreground">
                  From delicate everyday pieces to statement jewelry for special occasions, we create
                  accessories that complement your unique style and personality.
                </p>
              </div>
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&h=400&fit=crop"
                  alt="Handcrafted jewelry making process"
                  className="rounded-lg shadow-lg"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-16">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">💎</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Premium Materials</h3>
                <p className="text-muted-foreground text-sm">
                  We use only the finest materials including genuine gems, pearls, and quality metals
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">✨</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Handcrafted Excellence</h3>
                <p className="text-muted-foreground text-sm">
                  Every piece is individually crafted by hand, ensuring unique character and quality
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">💖</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Made with Love</h3>
                <p className="text-muted-foreground text-sm">
                  Each creation is infused with passion and care, making every piece truly special
                </p>
              </div>
            </div>

            <div className="text-center bg-muted/30 rounded-lg p-8">
              <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                To create beautiful, meaningful jewelry that celebrates life&apos;s special moments and
                empowers individuals to express their unique style with confidence and elegance.
              </p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}