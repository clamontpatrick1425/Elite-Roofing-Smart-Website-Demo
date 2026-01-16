
import React, { useState, useRef } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Services from './components/Services';
import WhyChooseUs from './components/WhyChooseUs';
import Testimonials from './components/Testimonials';
import Footer from './components/Footer';
import AIHub from './components/AIHub';
import FAQModal from './components/FAQModal';
import SchedulerModal from './components/SchedulerModal';
import DamageAssessorModal from './components/DamageAssessorModal';
import EstimateModal from './components/EstimateModal';
import AITools from './components/AITools';
import LeadCaptureModal from './components/LeadCaptureModal';
import LeadCaptureForm from './components/LeadCaptureForm';
import AboutUsModal from './components/AboutUsModal';
import GalleryModal from './components/GalleryModal';
import ProjectVisualizerModal from './components/ProjectVisualizerModal';
import { GalleryImage } from './types';
import { VoiceAgentHandle } from './components/VoiceAgentOrb';
import PrivacyPolicyModal from './components/PrivacyPolicyModal';
import ServiceAreaValidator from './components/ServiceAreaValidator';

const App: React.FC = () => {
  const [isFaqModalOpen, setIsFaqModalOpen] = useState(false);
  const [isSchedulerModalOpen, setIsSchedulerModalOpen] = useState(false);
  const [isDamageAssessorModalOpen, setIsDamageAssessorModalOpen] = useState(false);
  const [isEstimateModalOpen, setIsEstimateModalOpen] = useState(false);
  const [isVisualizerModalOpen, setIsVisualizerModalOpen] = useState(false);
  const [isLeadCaptureModalOpen, setIsLeadCaptureModalOpen] = useState(false);
  const [isAboutUsModalOpen, setIsAboutUsModalOpen] = useState(false);
  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);
  const [isPrivacyPolicyModalOpen, setIsPrivacyPolicyModalOpen] = useState(false);
  const [selectedGalleryItem, setSelectedGalleryItem] = useState<GalleryImage | null>(null);
  const voiceAgentRef = useRef<VoiceAgentHandle>(null);

  const handleScheduleFromModal = () => {
    setIsDamageAssessorModalOpen(false);
    setIsEstimateModalOpen(false);
    setIsVisualizerModalOpen(false);
    setIsSchedulerModalOpen(true);
  };

  const openSchedulerModal = () => setIsSchedulerModalOpen(true);
  const openEstimateModal = () => setIsEstimateModalOpen(true);
  const openLeadCaptureModal = () => setIsLeadCaptureModalOpen(true);

  const handleOpenGalleryModal = (item: GalleryImage) => {
    setSelectedGalleryItem(item);
    setIsGalleryModalOpen(true);
  };
  
  const handleActivateVoiceAgent = () => {
    voiceAgentRef.current?.activate();
  };

  return (
    <div className="relative font-sans text-gray-900 dark:text-gray-100">
      <Header
        onFaqClick={() => setIsFaqModalOpen(true)}
        onDamageAssessorClick={() => setIsDamageAssessorModalOpen(true)}
        onEstimateClick={openEstimateModal}
        onAboutUsClick={() => setIsAboutUsModalOpen(true)}
        onScheduleClick={openSchedulerModal}
        onContactClick={openLeadCaptureModal}
        onGalleryItemClick={handleOpenGalleryModal}
        onVoiceAgentClick={handleActivateVoiceAgent}
      />
      
      <main className="flex flex-col">
        <Hero 
          onScheduleClick={openSchedulerModal} 
          onEstimateClick={openEstimateModal}
          voiceAgentRef={voiceAgentRef}
        />
        
        <Services />
        
        <AITools
          onDamageAssessorClick={() => setIsDamageAssessorModalOpen(true)}
          onEstimateClick={openEstimateModal}
          onVisualizerClick={() => setIsVisualizerModalOpen(true)}
        />
        
        <WhyChooseUs />

        <Testimonials />

        <section className="py-12 bg-white dark:bg-gray-900">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-5xl mx-auto transform hover:-translate-y-1 transition-transform duration-300">
                    <ServiceAreaValidator variant="card" />
                </div>
            </div>
        </section>

        <section className="py-20 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    <LeadCaptureForm />
                </div>
            </div>
        </section>
      </main>

      <Footer 
        onScheduleClick={openSchedulerModal} 
        onEstimateClick={openEstimateModal}
        onPrivacyPolicyClick={() => setIsPrivacyPolicyModalOpen(true)}
      />
      
      <AIHub 
        onOpenEstimate={openEstimateModal} 
        onOpenDamageAssessor={() => setIsDamageAssessorModalOpen(true)} 
      />
      
      {/* Modals */}
      <FAQModal isOpen={isFaqModalOpen} onClose={() => setIsFaqModalOpen(false)} />
      <SchedulerModal isOpen={isSchedulerModalOpen} onClose={() => setIsSchedulerModalOpen(false)} />
      <DamageAssessorModal
        isOpen={isDamageAssessorModalOpen}
        onClose={() => setIsDamageAssessorModalOpen(false)}
        onScheduleClick={handleScheduleFromModal}
      />
      <EstimateModal
        isOpen={isEstimateModalOpen}
        onClose={() => setIsEstimateModalOpen(false)}
        onScheduleClick={handleScheduleFromModal}
      />
      <ProjectVisualizerModal 
        isOpen={isVisualizerModalOpen} 
        onClose={() => setIsVisualizerModalOpen(false)} 
      />
      <LeadCaptureModal isOpen={isLeadCaptureModalOpen} onClose={() => setIsLeadCaptureModalOpen(false)} />
      <AboutUsModal isOpen={isAboutUsModalOpen} onClose={() => setIsAboutUsModalOpen(false)} />
      <GalleryModal isOpen={isGalleryModalOpen} onClose={() => setIsGalleryModalOpen(false)} item={selectedGalleryItem} />
      <PrivacyPolicyModal isOpen={isPrivacyPolicyModalOpen} onClose={() => setIsPrivacyPolicyModalOpen(false)} />
    </div>
  );
};

export default App;
