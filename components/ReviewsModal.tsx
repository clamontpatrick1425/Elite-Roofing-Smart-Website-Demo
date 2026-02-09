
import React from 'react';
import { XMarkIcon } from './Icon';

interface ReviewsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onWriteReview: () => void;
}

const DUMMY_REVIEWS = [
    { id: 1, author: "Renee", platform: "Google", date: "11 days ago", content: "Justin and his team did an excellent job and communicated very well through the process.", rating: 5 },
    { id: 2, author: "Ben Runtz", platform: "Google", date: "14 days ago", content: "Midwest Roofing did a great job on my roof replacement. Very efficient and professional.", rating: 5 },
    { id: 3, author: "Jessica M.", platform: "Facebook", date: "3 weeks ago", content: "Honest and reliable. Highly recommended for any roofing repairs.", rating: 5 },
    { id: 4, author: "David K.", platform: "Yelp", date: "1 month ago", content: "Fast scheduling and transparent pricing. The crew cleaned up perfectly.", rating: 5 },
];

const ReviewsModal: React.FC<ReviewsModalProps> = ({ isOpen, onClose, onWriteReview }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-start p-4 bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div 
        className="bg-gray-900 text-white w-full max-w-sm h-full max-h-[90vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-slide-in-left"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="p-6 border-b border-white/10 flex flex-col">
            <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-black">What our customers say</h2>
                <button onClick={onClose} className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-all">
                    <XMarkIcon className="w-5 h-5" />
                </button>
            </div>
            
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                <button className="flex-shrink-0 px-4 py-2 bg-white/10 rounded-full text-xs font-bold border-b-2 border-blue-500">All Reviews <span className="opacity-50 ml-1">4.8</span></button>
                <button className="flex-shrink-0 px-4 py-2 bg-white/5 rounded-full text-xs font-bold opacity-70 hover:opacity-100">Google <span className="opacity-50 ml-1">4.9</span></button>
                <button className="flex-shrink-0 px-4 py-2 bg-white/5 rounded-full text-xs font-bold opacity-70 hover:opacity-100">Yelp <span className="opacity-50 ml-1">4.7</span></button>
            </div>

            <div className="mt-6 flex flex-col items-center gap-2">
                <p className="text-xs uppercase font-black opacity-40">Overall Rating</p>
                <div className="flex items-center gap-2">
                    <span className="text-4xl font-black">4.8</span>
                    <div className="flex flex-col">
                        <div className="flex text-yellow-400">
                             {[1,2,3,4,5].map(s => <svg key={s} className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>)}
                        </div>
                        <span className="text-[10px] opacity-40">(993)</span>
                    </div>
                </div>
                <button 
                    onClick={onWriteReview}
                    className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-black py-3 rounded-2xl shadow-xl shadow-blue-600/20 transition-all"
                >
                    Write a Review
                </button>
            </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 space-y-4">
            {DUMMY_REVIEWS.map(review => (
                <div key={review.id} className="bg-white/5 p-4 rounded-2xl border border-white/5">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center font-bold">
                            {review.author[0]}
                        </div>
                        <div>
                            <p className="font-bold text-sm">{review.author}</p>
                            <p className="text-[10px] opacity-50">{review.date}</p>
                        </div>
                    </div>
                    <div className="flex text-yellow-400 mb-2">
                        {[1,2,3,4,5].map(s => <svg key={s} className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>)}
                    </div>
                    <p className="text-sm text-gray-300 leading-relaxed">
                        {review.content}
                    </p>
                    <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            {review.platform === "Google" && (
                                <svg className="w-3 h-3" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-1 .67-2.28 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" /></svg>
                            )}
                            {review.platform === "Facebook" && (
                                <svg className="w-3 h-3 text-blue-500" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" /></svg>
                            )}
                            {review.platform === "Yelp" && (
                                <svg className="w-3 h-3 text-red-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12.927 12.001L15.93 7.82C16.155 7.509 16.034 7.071 15.666 6.945L12.032 5.719C11.666 5.594 11.258 5.776 11.132 6.139L10.36 8.356L12.927 12.001ZM8.971 12.593L5.05 10.76C4.707 10.598 4.301 10.766 4.195 11.13L3.633 13.065C3.528 13.428 3.738 13.805 4.09 13.911L10.05 15.71L8.971 12.593ZM13.415 12.928L17.22 14.93C17.57 15.115 18.001 14.975 18.136 14.617L18.85 12.72C18.985 12.362 18.802 11.97 18.44 11.835L12.42 9.58L13.415 12.928ZM11.455 13.195L11.85 16.73C11.89 17.115 11.62 17.45 11.235 17.49L9.22 17.695C8.835 17.735 8.5 17.465 8.46 17.08L8.06 13.54L11.455 13.195ZM11.99 2.015L11.53 5.42L15.22 6.66L15.5 4.59C15.55 4.21 15.3 3.86 14.92 3.81L12.35 3.47C11.97 3.42 11.63 3.69 11.58 4.07L11.99 2.015Z" /></svg>
                            )}
                            <span className="text-[10px] font-bold opacity-40">Posted on {review.platform}</span>
                        </div>
                    </div>
                </div>
            ))}
        </main>
      </div>
      <style>{`
        @keyframes slide-in-left {
            0% { transform: translateX(-100%); opacity: 0; }
            100% { transform: translateX(0); opacity: 1; }
        }
        .animate-slide-in-left {
            animation: slide-in-left 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
};

export default ReviewsModal;
