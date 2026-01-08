
import React from 'react';
import { XMarkIcon, ShieldCheckIcon } from './Icon';

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PrivacyPolicyModal: React.FC<PrivacyPolicyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col animate-fade-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="p-5 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center flex-shrink-0">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <ShieldCheckIcon className="w-7 h-7 text-blue-600" />
              Privacy Policy
            </h2>
            <p className="text-gray-600 dark:text-gray-300">Your privacy is important to us.</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-800 dark:hover:text-gray-200 transition-colors">
            <XMarkIcon className="w-7 h-7" />
          </button>
        </header>

        <main className="flex-1 overflow-y-auto p-8 text-gray-700 dark:text-gray-300 space-y-6">
          <p className="text-sm text-gray-500 dark:text-gray-400">Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

          <section>
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">1. Introduction</h3>
            <p>Welcome to Elite Roofing Solutions. We are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website, use our services, or interact with our AI-powered tools. Please read this policy carefully.</p>
          </section>

          <section>
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">2. Information We Collect</h3>
            <p>We may collect information about you in a variety of ways. The information we may collect on the Site includes:</p>
            <ul className="list-disc list-inside mt-2 space-y-1 pl-4">
              <li><strong>Personal Data:</strong> Personally identifiable information, such as your name, address, email address, and telephone number, that you voluntarily give to us when you request an estimate, schedule an inspection, or contact us.</li>
              <li><strong>Derivative Data:</strong> Information our servers automatically collect, such as your IP address, browser type, operating system, and access times.</li>
              <li><strong>Media Data:</strong> Images and videos of your property that you voluntarily upload for analysis through our AI Roof Condition Checker.</li>
              <li><strong>Audio Data:</strong> Voice recordings when you interact with our AI Voice Agent. This data is processed in real-time to facilitate the conversation and is not stored long-term unless required for quality assurance or with your explicit consent.</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">3. How We Use Your Information</h3>
            <p>Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you to:</p>
            <ul className="list-disc list-inside mt-2 space-y-1 pl-4">
              <li>Provide our services, such as roofing inspections, repairs, and replacements.</li>
              <li>Generate AI-powered estimates and roof condition analyses.</li>
              <li>Email you regarding your account or appointments.</li>
              <li>Fulfill and manage transactions related to our services.</li>
              <li>Respond to customer service requests and support needs.</li>
              <li>Improve our website and service offerings.</li>
              <li>Comply with legal and regulatory requirements.</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">4. Use of AI and Automated Tools</h3>
            <p>Our website utilizes artificial intelligence (AI) from Google's Gemini models for several features. The data you provide to these tools is processed to generate a response. The analysis and recommendations provided by our AI tools are preliminary and do not constitute a formal, binding quote or professional diagnosis. An on-site inspection by a qualified professional is required for a definitive assessment.</p>
          </section>

          <section>
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">5. Disclosure of Your Information</h3>
            <p>We do not sell, trade, or otherwise transfer your Personally Identifiable Information to outside parties. This does not include trusted third parties who assist us in operating our website, conducting our business, or servicing you, so long as those parties agree to keep this information confidential. We may also release your information to comply with the law or protect our or others' rights, property, or safety.</p>
          </section>

          <section>
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">6. Security of Your Information</h3>
            <p>We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that no security measures are perfect or impenetrable.</p>
          </section>

          <section>
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">7. Your Data Protection Rights</h3>
            <p>You have the right to access, rectify, or erase your personal data, subject to legal and contractual restrictions. To exercise these rights, please contact us using the contact information below.</p>
          </section>

          <section>
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">8. Children's Privacy</h3>
            <p>Our services are not intended for use by children under the age of 13. We do not knowingly collect personal information from children under 13.</p>
          </section>

          <section>
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">9. Changes to This Privacy Policy</h3>
            <p>We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.</p>
          </section>

          <section>
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">10. Contact Us</h3>
            <p>If you have questions or comments about this Privacy Policy, please contact us at:</p>
            <address className="not-italic mt-2 pl-4 border-l-2 border-gray-300 dark:border-gray-600">
              Elite Roofing Solutions<br />
              1546 Roofing Ave, Kansas City, MO 64082<br />
              Email: privacy@eliteroof.ai<br />
              Phone: (800) 555-ROOF
            </address>
          </section>
        </main>
      </div>
      <style>{`
        @keyframes fade-in-up {
            0% { opacity: 0; transform: translateY(20px) scale(0.98); }
            100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-fade-in-up {
            animation: fade-in-up 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default PrivacyPolicyModal;
