
import React from 'react';
import { ShieldCheckIcon } from './Icon';

const WhyChooseUs: React.FC = () => {
  const features = [
    { name: 'AI-Powered Convenience', description: 'Get instant estimates and book 24/7 with our smart tools.' },
    { name: 'Licensed & Insured', description: 'Complete peace of mind with fully certified professionals.' },
    { name: 'Premium Materials', description: 'We use only top-grade materials for durability and longevity.' },
    { name: '5-Star Customer Service', description: 'Our commitment to your satisfaction is our top priority.' },
  ];

  return (
    <section className="py-16 md:py-24 bg-gray-50 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-x-12 lg:items-center">
          <div className="relative">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
              The Elite Roofing Advantage
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              We blend cutting-edge technology with old-fashioned craftsmanship to deliver an unparalleled roofing experience. Your home deserves nothing less.
            </p>

            <dl className="mt-10 space-y-10">
              {features.map((item) => (
                <div key={item.name} className="flex">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-600 text-white">
                      <ShieldCheckIcon className="h-6 w-6" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <dt className="text-lg leading-6 font-medium text-gray-900">{item.name}</dt>
                    <dd className="mt-2 text-base text-gray-600">{item.description}</dd>
                  </div>
                </div>
              ))}
            </dl>
          </div>

          <div className="mt-10 lg:mt-0 relative">
             <img
                className="relative mx-auto rounded-2xl shadow-2xl w-full h-auto object-cover"
                width={490}
                src="https://picsum.photos/490/550?image=20"
                alt="Professional roofer working on a roof"
              />
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
