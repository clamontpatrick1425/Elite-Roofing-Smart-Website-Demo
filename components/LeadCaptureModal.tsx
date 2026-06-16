
import React, { useState, useEffect, useRef } from 'react';
import { ArrowPathIcon, XMarkIcon } from './Icon';

interface LeadCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LeadCaptureModal: React.FC<LeadCaptureModalProps> = ({ isOpen, onClose }) => {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        service: 'Roof Replacement',
        materialType: 'Asphalt Shingles',
        message: '',
        askAboutFinancing: false
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [captcha, setCaptcha] = useState('');
    const [captchaInput, setCaptchaInput] = useState('');
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const generateCaptcha = () => {
        const chars = 'AbCdEfGhIjKlMnOpQrStUvWxYz0123456789';
        let result = '';
        for (let i = 0; i < 6; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        setCaptcha(result);
        setCaptchaInput('');
    };

    const drawCaptcha = (text: string) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        const isDark = document.documentElement.classList.contains('dark');
        ctx.fillStyle = isDark ? '#374151' : '#f3f4f6'; // gray-700 or gray-100
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < text.length; i++) {
            const char = text[i];
            const x = 25 + i * 25;
            const y = canvas.height / 2 + (Math.random() - 0.5) * 10;
            const angle = (Math.random() - 0.5) * 0.4;
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(angle);
            ctx.font = `${28 + Math.random() * 8}px Arial`;
            ctx.fillStyle = isDark ? `rgba(255, 255, 255, ${0.7 + Math.random() * 0.2})` : `rgba(0, 0, 0, ${0.6 + Math.random() * 0.2})`;
            ctx.fillText(char, 0, 0);
            ctx.restore();
        }
        for (let i = 0; i < 4; i++) {
            ctx.beginPath();
            ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
            ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
            ctx.strokeStyle = isDark ? '#4b5563' : '#d1d5db'; // gray-600 or gray-300
            ctx.stroke();
        }
    };

    useEffect(() => {
        if (captcha) {
            drawCaptcha(captcha);
        }
    }, [captcha]);

    const handleReset = () => {
        setFormData({ name: '', phone: '', email: '', service: 'Roof Replacement', materialType: 'Asphalt Shingles', message: '', askAboutFinancing: false });
        setSuccess(false);
        setLoading(false);
        setError('');
        generateCaptcha();
    };

    useEffect(() => {
        if (isOpen) {
            handleReset();
        }
    }, [isOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        if (name === 'phone') {
            const digits = value.replace(/\D/g, '').slice(0, 10);
            let formattedValue = '';
            if (digits.length > 0) formattedValue = `(${digits.substring(0, 3)}`;
            if (digits.length > 3) formattedValue += `) ${digits.substring(3, 6)}`;
            if (digits.length > 6) formattedValue += `-${digits.substring(6, 10)}`;
            setFormData({ ...formData, phone: formattedValue });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        if (!formData.name || !formData.phone || !formData.email) {
            setError('Please fill out all required fields.');
            setLoading(false);
            return;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            setError('Please enter a valid email address.');
            setLoading(false);
            return;
        }
        if (captchaInput.toLowerCase() !== captcha.toLowerCase()) {
            setError('Incorrect CAPTCHA. Please try again.');
            setLoading(false);
            generateCaptcha();
            return;
        }
        await new Promise(resolve => setTimeout(resolve, 1500));
        console.log('Lead Captured:', formData);
        setLoading(false);
        setSuccess(true);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col animate-fade-in-up" onClick={(e) => e.stopPropagation()}>
                <header className="p-5 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center flex-shrink-0">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Ready for a Professional Opinion?</h2>
                        <p className="text-gray-600 dark:text-gray-300">Book your free, no-obligation roof inspection today. Our experts are ready to provide a thorough assessment and answer all your questions.</p>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-800 dark:hover:text-gray-200 transition-colors">
                        <XMarkIcon className="w-7 h-7" />
                    </button>
                </header>
                <main className="flex-1 overflow-y-auto p-8">
                    {success ? (
                        <div className="text-center">
                            <h3 className="text-3xl md:text-4xl font-extrabold text-green-600 tracking-tight">Thank You, {formData.name.split(' ')[0]}!</h3>
                            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">Your request has been sent. Our team will contact you within 24 hours.</p>
                            <div className="mt-8 bg-gray-50 dark:bg-gray-700/50 p-6 rounded-lg shadow-inner border dark:border-gray-600 text-left">
                                <h4 className="text-xl font-bold text-gray-900 dark:text-white border-b dark:border-gray-600 pb-3 mb-4">Request Summary</h4>
                                <dl className="space-y-4 text-sm">
                                    <div className="flex"><dt className="w-1/3 font-medium text-gray-500 dark:text-gray-400">Name</dt><dd className="w-2/3 text-gray-900 dark:text-gray-100">{formData.name}</dd></div>
                                    <div className="flex"><dt className="w-1/3 font-medium text-gray-500 dark:text-gray-400">Phone</dt><dd className="w-2/3 text-gray-900 dark:text-gray-100">{formData.phone}</dd></div>
                                    <div className="flex"><dt className="w-1/3 font-medium text-gray-500 dark:text-gray-400">Email</dt><dd className="w-2/3 text-gray-900 dark:text-gray-100">{formData.email}</dd></div>
                                    <div className="flex"><dt className="w-1/3 font-medium text-gray-500 dark:text-gray-400">Service</dt><dd className="w-2/3 text-gray-900 dark:text-gray-100">{formData.service}</dd></div>
                                    {formData.service === 'Roof Replacement' && (<div className="flex"><dt className="w-1/3 font-medium text-gray-500 dark:text-gray-400">Material</dt><dd className="w-2/3 text-gray-900 dark:text-gray-100">{formData.materialType}</dd></div>)}
                                    {formData.message && (<div className="flex"><dt className="w-1/3 font-medium text-gray-500 dark:text-gray-400">Message</dt><dd className="w-2/3 text-gray-900 dark:text-gray-100 whitespace-pre-wrap">{formData.message}</dd></div>)}
                                </dl>
                            </div>
                            <div className="mt-8"><button onClick={handleReset} className="bg-blue-600 text-white font-bold py-3 px-8 rounded-lg shadow-lg hover:bg-blue-700">Submit Another Request</button></div>
                        </div>
                    ) : (
                        <>
                            <p className="text-center text-lg text-gray-600 dark:text-gray-300 mb-8">
                                Fill out the form below for a free, no-obligation quote. Our roofing experts are ready to help.
                            </p>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="name-modal" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
                                        <input type="text" name="name" id="name-modal" required value={formData.name} onChange={handleChange} className="mt-1 p-3 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"/>
                                    </div>
                                    <div>
                                        <label htmlFor="phone-modal" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Phone Number</label>
                                        <input type="tel" name="phone" id="phone-modal" required value={formData.phone} onChange={handleChange} maxLength={14} placeholder="(123) 456-7890" className="mt-1 p-3 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"/>
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="email-modal" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</label>
                                    <input type="email" name="email" id="email-modal" required value={formData.email} onChange={handleChange} className="mt-1 p-3 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"/>
                                </div>
                                <div>
                                    <label htmlFor="service-modal" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Service Needed</label>
                                    <select id="service-modal" name="service" value={formData.service} onChange={handleChange} className="mt-1 block w-full pl-3 pr-10 py-3 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                                        <option>Roof Replacement</option>
                                        <option>Roof Repair</option>
                                        <option>Roof Inspection</option>
                                        <option>Emergency Tarping</option>
                                        <option>Other</option>
                                    </select>
                                </div>
                                {formData.service === 'Roof Replacement' && (
                                    <div>
                                        <label htmlFor="materialType-modal" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Material Preference</label>
                                        <select id="materialType-modal" name="materialType" value={formData.materialType} onChange={handleChange} className="mt-1 block w-full pl-3 pr-10 py-3 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                                            <option>Asphalt Shingles</option>
                                            <option>Metal</option>
                                            <option>Tile (Clay/Concrete)</option>
                                            <option>Wood Shake</option>
                                            <option>Unsure / Other</option>
                                        </select>
                                    </div>
                                )}
                                <div>
                                    <label htmlFor="message-modal" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Brief Message (Optional)</label>
                                    <textarea id="message-modal" name="message" rows={3} value={formData.message} onChange={handleChange} className="mt-1 p-3 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"></textarea>
                                </div>
                                <div>
                                    <label htmlFor="captcha-modal" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Security Check</label>
                                    <div className="mt-2 flex items-center gap-4 flex-wrap"><canvas ref={canvasRef} width="180" height="50" className="border border-gray-300 dark:border-gray-600 rounded-md bg-gray-100 dark:bg-gray-700" /><button type="button" onClick={generateCaptcha} title="Refresh CAPTCHA" className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"><ArrowPathIcon className="w-6 h-6" /></button></div>
                                    <input type="text" name="captcha" id="captcha-modal" required value={captchaInput} onChange={(e) => setCaptchaInput(e.target.value)} placeholder="Enter text from image" className="mt-2 p-3 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" maxLength={6} autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck="false"/>
                                </div>

                                {/* Financing Integration Option */}
                                <div>
                                    <div className="flex items-start gap-3 p-4 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 rounded-xl">
                                        <input
                                            type="checkbox"
                                            name="askAboutFinancing"
                                            id="askAboutFinancing-modal"
                                            checked={formData.askAboutFinancing}
                                            onChange={(e) => setFormData({ ...formData, askAboutFinancing: e.target.checked })}
                                            className="w-5 h-5 mt-0.5 rounded text-emerald-600 accent-emerald-500 border-gray-300 dark:border-gray-600 focus:ring-emerald-500 cursor-pointer"
                                        />
                                        <div className="flex flex-col">
                                            <label htmlFor="askAboutFinancing-modal" className="text-sm font-extrabold text-slate-800 dark:text-slate-100 cursor-pointer select-none">
                                                Ask about contractor financing solutions
                                            </label>
                                            <p className="text-[11px] text-emerald-800 dark:text-emerald-400 font-semibold">
                                                Payments from <strong className="font-mono">$189/mo</strong> via our Hearth & GreenSky programs. No obligation!
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {error && <p className="text-sm text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-300 p-3 rounded-md">{error}</p>}
                                <div><button type="submit" disabled={loading} className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 dark:disabled:bg-gray-500">{loading ? 'Sending...' : 'Send My Request'}{loading && <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}</button></div>
                            </form>
                        </>
                    )}
                </main>
            </div>
            <style>{`.animate-fade-in-up { animation: fade-in-up 0.3s ease-out forwards; } @keyframes fade-in-up { 0% { opacity: 0; transform: translateY(20px) scale(0.98); } 100% { opacity: 1; transform: translateY(0) scale(1); } }`}</style>
        </div>
    );
};

export default LeadCaptureModal;
