
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
import Gallery from './components/Gallery';
import GalleryModal from './components/GalleryModal';
import ProjectVisualizerModal from './components/ProjectVisualizerModal';
import VeoStudioModal from './components/VeoStudioModal';
import PrivacyPolicyModal from './components/PrivacyPolicyModal';
import ServiceAreaValidator from './components/ServiceAreaValidator';
import RatingWidget from './components/RatingWidget';
import ReviewsModal from './components/ReviewsModal';
import FeedbackPlatformModal from './components/FeedbackPlatformModal';
import { GalleryImage } from './types';
import { VoiceAgentHandle } from './components/VoiceAgentOrb';
import { WEBSITE_AUDIT_HTML } from './constants';

const App: React.FC = () => {
  const [isFaqModalOpen, setIsFaqModalOpen] = useState(false);
  const [isSchedulerModalOpen, setIsSchedulerModalOpen] = useState(false);
  const [isDamageAssessorModalOpen, setIsDamageAssessorModalOpen] = useState(false);
  const [isEstimateModalOpen, setIsEstimateModalOpen] = useState(false);
  const [isVisualizerModalOpen, setIsVisualizerModalOpen] = useState(false);
  const [isDesignStudioModalOpen, setIsDesignStudioModalOpen] = useState(false);
  const [isLeadCaptureModalOpen, setIsLeadCaptureModalOpen] = useState(false);
  const [isAboutUsModalOpen, setIsAboutUsModalOpen] = useState(false);
  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);
  const [isPrivacyPolicyModalOpen, setIsPrivacyPolicyModalOpen] = useState(false);
  const [isReviewsModalOpen, setIsReviewsModalOpen] = useState(false);
  const [isFeedbackPlatformModalOpen, setIsFeedbackPlatformModalOpen] = useState(false);
  const [selectedGalleryItem, setSelectedGalleryItem] = useState<GalleryImage | null>(null);
  const voiceAgentRef = useRef<VoiceAgentHandle>(null);

  const handleScheduleFromModal = () => {
    setIsDamageAssessorModalOpen(false);
    setIsEstimateModalOpen(false);
    setIsVisualizerModalOpen(false);
    setIsDesignStudioModalOpen(false);
    setIsSchedulerModalOpen(true);
  };

  const handleOpenGalleryModal = (item: GalleryImage) => {
    setSelectedGalleryItem(item);
    setIsGalleryModalOpen(true);
  };
  
  const handleActivateVoiceAgent = () => {
    voiceAgentRef.current?.activate();
  };

  const handleOpenAudit = () => {
      const blob = new Blob([WEBSITE_AUDIT_HTML], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
      setTimeout(() => URL.revokeObjectURL(url), 10000);
  };

  return (
    <div className="relative font-sans text-gray-900 dark:text-gray-100">
      <Header
        onFaqClick={() => setIsFaqModalOpen(true)}
        onDamageAssessorClick={() => setIsDamageAssessorModalOpen(true)}
        onEstimateClick={() => setIsEstimateModalOpen(true)}
        onAboutUsClick={() => setIsAboutUsModalOpen(true)}
        onScheduleClick={() => setIsSchedulerModalOpen(true)}
        onContactClick={() => setIsLeadCaptureModalOpen(true)}
        onGalleryItemClick={handleOpenGalleryModal}
        onVoiceAgentClick={handleActivateVoiceAgent}
        onAuditClick={handleOpenAudit}
        onVeoStudioClick={() => setIsDesignStudioModalOpen(true)}
        onVisualizerClick={() => setIsVisualizerModalOpen(true)}
      />
      
      <main className="flex flex-col pt-20 md:pt-24">
        <Hero 
          onScheduleClick={() => setIsSchedulerModalOpen(true)} 
          onEstimateClick={() => setIsEstimateModalOpen(true)}
          voiceAgentRef={voiceAgentRef}
        />
        
        <Services />
        
        <AITools
          onDamageAssessorClick={() => setIsDamageAssessorModalOpen(true)}
          onEstimateClick={() => setIsEstimateModalOpen(true)}
          onVisualizerClick={() => setIsVisualizerModalOpen(true)}
          onVeoStudioClick={() => setIsDesignStudioModalOpen(true)}
        />
        
        <Gallery />
        
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
        onScheduleClick={() => setIsSchedulerModalOpen(true)} 
        onEstimateClick={() => setIsEstimateModalOpen(true)}
        onPrivacyPolicyClick={() => setIsPrivacyPolicyModalOpen(true)}
      />
      
      <AIHub 
        onOpenEstimate={() => setIsEstimateModalOpen(true)} 
        onOpenDamageAssessor={() => setIsDamageAssessorModalOpen(true)} 
        onOpenVisualizer={() => setIsVisualizerModalOpen(true)}
        onOpenDesignStudio={() => setIsDesignStudioModalOpen(true)}
      />

      <RatingWidget onClick={() => setIsReviewsModalOpen(true)} />
      
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
      <VeoStudioModal
        isOpen={isDesignStudioModalOpen}
        onClose={() => setIsDesignStudioModalOpen(false)}
      />
      <LeadCaptureModal isOpen={isLeadCaptureModalOpen} onClose={() => setIsLeadCaptureModalOpen(false)} />
      <AboutUsModal isOpen={isAboutUsModalOpen} onClose={() => setIsAboutUsModalOpen(false)} />
      <GalleryModal isOpen={isGalleryModalOpen} onClose={() => setIsGalleryModalOpen(false)} item={selectedGalleryItem} />
      <PrivacyPolicyModal isOpen={isPrivacyPolicyModalOpen} onClose={() => setIsPrivacyPolicyModalOpen(false)} />
      
      <ReviewsModal 
        isOpen={isReviewsModalOpen} 
        onClose={() => setIsReviewsModalOpen(false)} 
        onWriteReview={() => setIsFeedbackPlatformModalOpen(true)}
      />
      <FeedbackPlatformModal 
        isOpen={isFeedbackPlatformModalOpen} 
        onClose={() => setIsFeedbackPlatformModalOpen(false)} 
      />
    </div>
  );
};

export default App;
