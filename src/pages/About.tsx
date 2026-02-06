import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Award, Target, Users, Heart } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import heroImage from '@/assets/hero-cars.jpg';

const About: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>About Us | MiniWheels - Premium Diecast Car Models</title>
        <meta name="description" content="Learn about MiniWheels - your trusted source for premium diecast scale model cars. Discover our passion for automotive artistry and commitment to collectors." />
        <meta name="keywords" content="about miniwheels, diecast car company, model car store, collector cars shop, automotive collectibles" />
      </Helmet>
      <Layout>
        {/* Hero */}
        <section className="relative py-32 overflow-hidden">
          <div className="absolute inset-0">
            <img src={heroImage} alt="Our collection" className="w-full h-full object-cover" />
            <div className="absolute inset-0 hero-gradient opacity-95" />
          </div>
          <div className="container mx-auto px-4 relative z-10 text-center">
            <p className="text-accent font-semibold mb-4">Est. 2018</p>
            <h1 className="section-title text-5xl md:text-7xl mb-6">ABOUT MINIWHEELS</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Where automotive passion meets artistry in miniature.
            </p>
          </div>
        </section>

        {/* Story */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <p className="text-accent font-semibold mb-2">Our Story</p>
                <h2 className="section-title text-4xl">PASSION FOR PERFECTION</h2>
              </div>
              <div className="prose prose-lg text-muted-foreground space-y-6">
                <p>
                  MiniWheels was born from a lifelong passion for automobiles and the art of 
                  miniature craftsmanship. Founded in 2018 by a group of automotive enthusiasts 
                  and collectors, we set out to create a destination where fellow collectors 
                  could find the finest diecast scale models in the world.
                </p>
                <p>
                  What started as a small online store has grown into a premier destination for 
                  collectors across the globe. We've built relationships with the world's best 
                  diecast manufacturers to bring you authentic, meticulously detailed replicas 
                  of the most iconic vehicles ever created.
                </p>
                <p>
                  Today, our collection spans legendary marques from Ferrari and Lamborghini to 
                  Porsche and McLaren. Each piece in our inventory is carefully selected to meet 
                  our exacting standards for quality, authenticity, and collectibility.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-20 bg-card">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <p className="text-accent font-semibold mb-2">What Drives Us</p>
              <h2 className="section-title text-4xl">OUR VALUES</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center p-6">
                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-heading text-xl mb-2">QUALITY FIRST</h3>
                <p className="text-muted-foreground text-sm">
                  We only stock models that meet our rigorous quality standards. Every detail matters.
                </p>
              </div>
              <div className="text-center p-6">
                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                  <Target className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-heading text-xl mb-2">AUTHENTICITY</h3>
                <p className="text-muted-foreground text-sm">
                  Our models are officially licensed replicas with accurate proportions and liveries.
                </p>
              </div>
              <div className="text-center p-6">
                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-heading text-xl mb-2">COMMUNITY</h3>
                <p className="text-muted-foreground text-sm">
                  We're collectors ourselves. We understand your passion and share your excitement.
                </p>
              </div>
              <div className="text-center p-6">
                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-heading text-xl mb-2">PASSION</h3>
                <p className="text-muted-foreground text-sm">
                  Every model tells a story. We're here to help you build your dream collection.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-20 hero-gradient">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <p className="text-4xl md:text-5xl font-heading text-primary mb-2">500+</p>
                <p className="text-muted-foreground">Unique Models</p>
              </div>
              <div>
                <p className="text-4xl md:text-5xl font-heading text-primary mb-2">15K+</p>
                <p className="text-muted-foreground">Happy Collectors</p>
              </div>
              <div>
                <p className="text-4xl md:text-5xl font-heading text-primary mb-2">45+</p>
                <p className="text-muted-foreground">Countries Served</p>
              </div>
              <div>
                <p className="text-4xl md:text-5xl font-heading text-primary mb-2">6</p>
                <p className="text-muted-foreground">Years of Excellence</p>
              </div>
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
};

export default About;
