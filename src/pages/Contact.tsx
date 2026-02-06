import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Message sent! We\'ll get back to you soon.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <>
      <Helmet>
        <title>Contact Us | MiniWheels - Premium Diecast Car Models</title>
        <meta name="description" content="Get in touch with MiniWheels. We're here to help with your diecast model car questions, orders, and collector inquiries." />
        <meta name="keywords" content="contact miniwheels, diecast car support, model car help, collector support" />
      </Helmet>
      <Layout>
        {/* Hero */}
        <section className="py-20 hero-gradient">
          <div className="container mx-auto px-4 text-center">
            <p className="text-accent font-semibold mb-4">Get In Touch</p>
            <h1 className="section-title text-5xl md:text-6xl mb-4">CONTACT US</h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Have questions about our products or your order? We're here to help.
            </p>
          </div>
        </section>

        {/* Contact Info & Form */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Contact Info */}
              <div className="space-y-8">
                <div>
                  <h2 className="section-title text-3xl mb-6">GET IN TOUCH</h2>
                  <p className="text-muted-foreground">
                    Our team is dedicated to providing the best customer experience. 
                    Reach out to us through any of the channels below.
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                      <MapPin className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Address</h3>
                      <p className="text-muted-foreground">
                        123 Collector's Lane<br />
                        New York, NY 10001<br />
                        United States
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                      <Phone className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Phone</h3>
                      <p className="text-muted-foreground">
                        +1 (555) 123-4567<br />
                        Mon - Fri, 9am - 6pm EST
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                      <Mail className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Email</h3>
                      <p className="text-muted-foreground">
                        info@miniwheels.com<br />
                        support@miniwheels.com
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                      <Clock className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Business Hours</h3>
                      <p className="text-muted-foreground">
                        Monday - Friday: 9:00 AM - 6:00 PM EST<br />
                        Saturday: 10:00 AM - 4:00 PM EST<br />
                        Sunday: Closed
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div className="card-gradient rounded-xl p-8">
                <h2 className="section-title text-2xl mb-6">SEND US A MESSAGE</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Your Name</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="input-styled"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Your Email</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="input-styled"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Subject</label>
                    <input
                      type="text"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="input-styled"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Message</label>
                    <textarea
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="input-styled min-h-[150px] resize-none"
                      required
                    />
                  </div>

                  <Button variant="hero" size="xl" className="w-full" type="submit">
                    Send Message
                    <Send className="w-5 h-5" />
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Preview */}
        <section className="py-16 bg-card">
          <div className="container mx-auto px-4 text-center">
            <p className="text-accent font-semibold mb-2">Need Quick Answers?</p>
            <h2 className="section-title text-3xl mb-4">FREQUENTLY ASKED QUESTIONS</h2>
            <div className="max-w-2xl mx-auto space-y-4 mt-8">
              <div className="card-gradient p-4 rounded-lg text-left">
                <h3 className="font-semibold mb-2">How long does shipping take?</h3>
                <p className="text-sm text-muted-foreground">
                  Domestic orders typically arrive within 3-5 business days. International shipping takes 7-14 business days.
                </p>
              </div>
              <div className="card-gradient p-4 rounded-lg text-left">
                <h3 className="font-semibold mb-2">What is your return policy?</h3>
                <p className="text-sm text-muted-foreground">
                  We offer a 30-day return policy for unopened items in original packaging. Damaged items are replaced at no cost.
                </p>
              </div>
              <div className="card-gradient p-4 rounded-lg text-left">
                <h3 className="font-semibold mb-2">Are your models officially licensed?</h3>
                <p className="text-sm text-muted-foreground">
                  Yes, all our models are officially licensed authentic replicas from authorized manufacturers.
                </p>
              </div>
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
};

export default Contact;
