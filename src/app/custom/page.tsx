import { MainLayout } from '@/components/layout/main-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, Heart, Award, Clock } from 'lucide-react';

export default function CustomPage() {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">Custom Jewelry</h1>
            <p className="text-xl text-muted-foreground">
              Create a unique piece that tells your story - designed just for you
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-6 w-6 text-primary" />
                  Design Process
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-semibold">
                      1
                    </div>
                    <div>
                      <h4 className="font-semibold">Consultation</h4>
                      <p className="text-sm text-muted-foreground">Share your vision and ideas with our design team</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-semibold">
                      2
                    </div>
                    <div>
                      <h4 className="font-semibold">Design & Quote</h4>
                      <p className="text-sm text-muted-foreground">We create detailed designs and provide pricing</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-semibold">
                      3
                    </div>
                    <div>
                      <h4 className="font-semibold">Crafting</h4>
                      <p className="text-sm text-muted-foreground">Our artisans handcraft your unique piece</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-semibold">
                      4
                    </div>
                    <div>
                      <h4 className="font-semibold">Delivery</h4>
                      <p className="text-sm text-muted-foreground">Your custom jewelry is carefully packaged and delivered</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-6 w-6 text-primary" />
                  Why Choose Custom?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Unique to You</h4>
                    <p className="text-sm text-muted-foreground">
                      Create a one-of-a-kind piece that no one else will have
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2">Perfect Fit</h4>
                    <p className="text-sm text-muted-foreground">
                      Designed to your exact specifications and preferences
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2">Meaningful Stories</h4>
                    <p className="text-sm text-muted-foreground">
                      Incorporate personal elements and symbolism
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2">Quality Craftsmanship</h4>
                    <p className="text-sm text-muted-foreground">
                      Made with the same attention to detail as our collection pieces
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="text-center">
              <Clock className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Timeline</h3>
              <p className="text-sm text-muted-foreground">
                2-4 weeks from design approval to completion
              </p>
            </div>
            
            <div className="text-center">
              <Award className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Guarantee</h3>
              <p className="text-sm text-muted-foreground">
                Lifetime craftsmanship warranty on all custom pieces
              </p>
            </div>
            
            <div className="text-center">
              <Sparkles className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Materials</h3>
              <p className="text-sm text-muted-foreground">
                Choose from premium metals, gems, and pearls
              </p>
            </div>
          </div>

          <div className="text-center bg-muted/30 rounded-lg p-8">
            <h2 className="text-2xl font-bold mb-4">Ready to Start Your Custom Project?</h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Let's bring your vision to life! Our design team is excited to work with you 
              to create a piece that perfectly captures your style and story.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <a href="/contact">
                  Start Your Project
                </a>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <a href="/contact">
                  Schedule Consultation
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}