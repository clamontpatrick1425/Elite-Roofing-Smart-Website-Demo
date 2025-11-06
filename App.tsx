
import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Services from './components/Services';
import WhyChooseUs from './components/WhyChooseUs';
import DamageAssessor from './components/DamageAssessor';
import EstimateCalculator from './components/EstimateCalculator';
import Scheduler from './components/Scheduler';
import Testimonials from './components/Testimonials';
import Footer from './components/Footer';
import Chatbot from './components/Chatbot';
import Gallery from './components/Gallery';
import LeadCaptureForm from './components/LeadCaptureForm';

const App: React.FC = () => {
  return (
    <div className="relative">
      <Header />
      <main>
        <Hero />
        <Services />
        <WhyChooseUs />
        <DamageAssessor />
        <EstimateCalculator />
        <Scheduler />
        <LeadCaptureForm />
        <Testimonials />
        <Gallery />
      </main>
      <Footer />
      <Chatbot />
    </div>
  );
};

export default App;