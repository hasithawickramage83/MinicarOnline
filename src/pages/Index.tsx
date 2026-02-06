import React from 'react';
import { Helmet } from 'react-helmet-async';
import Layout from '@/components/layout/Layout';
import HeroSection from '@/components/home/HeroSection';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import BrandShowcase from '@/components/home/BrandShowcase';
import Newsletter from '@/components/home/Newsletter';

const Index: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>MiniWheels - Premium Diecast Scale Model Cars | Collector's Choice</title>
        <meta name="description" content="Discover premium 1:18 scale diecast model cars from Ferrari, Lamborghini, Porsche, and more. Authentic replicas for serious collectors. Free shipping on orders over $100." />
        <meta name="keywords" content="diecast cars, scale model cars, 1:18 scale, Ferrari model, Lamborghini model, Porsche model, collector cars, miniature cars, die-cast models, toy cars, premium diecast, car replicas, automotive collectibles" />
        <meta property="og:title" content="MiniWheels - Premium Diecast Scale Model Cars" />
        <meta property="og:description" content="Premium 1:18 scale diecast model cars for collectors. Ferrari, Lamborghini, Porsche and more." />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://miniwheels.com" />
      </Helmet>
      <Layout>
        <HeroSection />
        <FeaturedProducts />
        <BrandShowcase />
        <Newsletter />
      </Layout>
    </>
  );
};

export default Index;
