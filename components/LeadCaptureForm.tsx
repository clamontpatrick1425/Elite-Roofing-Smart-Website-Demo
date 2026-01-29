
import React, { useState, useEffect, useRef } from 'react';
// Added ShieldCheckIcon to the imports
import { ArrowPathIcon, ShieldCheckIcon } from './Icon';
import { SERVICES } from '../constants';

const LeadCaptureForm: React.FC = () => {
    const [formData, setFormData] = useState({
        name: '',
        company: '',
        phone: '',
        email: '',
        message: '',
        service: SERVICES[0].title,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [captcha, setCaptcha] = useState('');
    const [captchaInput, setCaptchaInput] = useState('');
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const errorRef = useRef<HTMLParagraphElement>(null);

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
        ctx.fillStyle = isDark ? '#374151' : '#f9fafb';
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
            ctx.fillStyle = isDark ? `rgba(255, 255, 255, 0.8)` : `rgba(0, 0, 0, 0.7)`;
            ctx.fillText(char, 0, 0);
            ctx.restore();
        }
    };

    useEffect(() => {
        generateCaptcha();
    }, []);

    const theme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';

    useEffect(() => {
        if (captcha) drawCaptcha(captcha);
    }, [captcha, theme]);

    useEffect(() => {
        if (error && errorRef.current) {
            errorRef.current.focus();
        }
    }, [error]);

    const handleReset = () => {
        setFormData({ name: '', company: '', phone: '', email: '', message: '', service: SERVICES[0].title });
        setSuccess(false);
        setLoading(false);
        setError('');
        generateCaptcha();
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
        if (captchaInput.toLowerCase() !== captcha.toLowerCase()) {
            setError('Security code check failed. Please try again.');
            setLoading(false);
            generateCaptcha();
            return;
        }
        await new Promise(resolve => setTimeout(resolve, 1500));
        setLoading(false);
        setSuccess(true);
    };

    return (
        <section id="lead-form" className="bg-white dark:bg-gray-800 rounded-[2.5rem] shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden" aria-labelledby="form-heading">
            <div className="p-10 md:p-16">
                <header className="text-center mb-12">
                    <h2 id="form-heading" className="text-3xl font-bold text-gray-900 dark:text-white">Request a Professional Inspection</h2>
                    <p className="text-gray-600 dark:text-gray-400 mt-4 max-w-2xl mx-auto leading-relaxed">Book your zero-obligation property assessment. Our local experts will provide a thorough inspection and detailed report.</p>
                </header>
                
                {success ? (
                    <div className="text-center py-12 animate-fade-in" role="alert">
                        <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                            <ShieldCheckIcon className="w-10 h-10 text-green-600" />
                        </div>
                        <h3 className="text-3xl font-bold text-green-700 dark:text-green-400">Request Sent Successfully!</h3>
                        <p className="mt-4 text-gray-600 dark:text-gray-300">Thank you, {formData.name}. Our Kansas City dispatcher will contact you within 24 hours.</p>
                        <button onClick={handleReset} className="mt-10 inline-block bg-blue-600 text-white font-bold py-4 px-10 rounded-2xl shadow-xl hover:bg-blue-700 focus-visible:ring-4 focus-visible:ring-blue-600/30">Book Another Property</button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl mx-auto">
                        {error && (
                            <div 
                                ref={errorRef}
                                tabIndex={-1}
                                role="alert" 
                                className="p-4 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-2xl text-red-700 dark:text-red-400 font-bold flex items-center gap-3 focus:outline-none"
                            >
                                <ArrowPathIcon className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
                                {error}
                            </div>
                        )}
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-1.5">
                                <label htmlFor="name-static" className="block text-sm font-black uppercase tracking-wider text-gray-500 dark:text-gray-400">Full Name *</label>
                                <input type="text" name="name" id="name-static" required value={formData.name} onChange={handleChange} autoComplete="name" className="w-full p-4 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-2xl focus:ring-4 focus:ring-blue-600/10 dark:text-white" aria-required="true"/>
                            </div>
                            <div className="space-y-1.5">
                                <label htmlFor="phone-static" className="block text-sm font-black uppercase tracking-wider text-gray-500 dark:text-gray-400">Phone Number *</label>
                                <input type="tel" name="phone" id="phone-static" required value={formData.phone} onChange={handleChange} autoComplete="tel" placeholder="(123) 456-7890" className="w-full p-4 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-2xl focus:ring-4 focus:ring-blue-600/10 dark:text-white" aria-required="true"/>
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label htmlFor="email-static" className="block text-sm font-black uppercase tracking-wider text-gray-500 dark:text-gray-400">Email Address *</label>
                            <input type="email" name="email" id="email-static" required value={formData.email} onChange={handleChange} autoComplete="email" className="w-full p-4 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-2xl focus:ring-4 focus:ring-blue-600/10 dark:text-white" aria-required="true"/>
                        </div>

                        <div className="space-y-1.5">
                            <label htmlFor="service-static" className="block text-sm font-black uppercase tracking-wider text-gray-500 dark:text-gray-400">Desired Service</label>
                            <select id="service-static" name="service" value={formData.service} onChange={handleChange} className="w-full p-4 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-2xl focus:ring-4 focus:ring-blue-600/10 dark:text-white">
                                {SERVICES.map(s => <option key={s.title} value={s.title}>{s.title}</option>)}
                                <option value="Other">Other (Custom Request)</option>
                            </select>
                        </div>

                        <div className="space-y-1.5">
                            <label htmlFor="message-static" className="block text-sm font-black uppercase tracking-wider text-gray-500 dark:text-gray-400">Project Details (Optional)</label>
                            <textarea id="message-static" name="message" rows={4} value={formData.message} onChange={handleChange} className="w-full p-4 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-2xl focus:ring-4 focus:ring-blue-600/10 dark:text-white" placeholder="Tell us more about your roofing needs..."></textarea>
                        </div>

                        <div className="space-y-3">
                            <label htmlFor="captcha-static" className="block text-sm font-black uppercase tracking-wider text-gray-500 dark:text-gray-400">Security Check *</label>
                            <div className="flex items-center gap-4 flex-wrap">
                                <canvas ref={canvasRef} width="180" height="54" className="border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 shadow-inner" aria-hidden="true" />
                                <button type="button" onClick={generateCaptcha} className="p-3 rounded-xl text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all focus-visible:ring-4 focus-visible:ring-blue-600/20" aria-label="Refresh security code">
                                    <ArrowPathIcon className="w-6 h-6" />
                                </button>
                            </div>
                            <input type="text" name="captcha" id="captcha-static" required value={captchaInput} onChange={e => setCaptchaInput(e.target.value)} placeholder="Type the code from the image" className="w-full p-4 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-2xl focus:ring-4 focus:ring-blue-600/10 dark:text-white" aria-required="true" autoComplete="off"/>
                        </div>

                        <div className="pt-6">
                            <button 
                                type="submit" 
                                disabled={loading} 
                                className="w-full py-5 px-10 bg-blue-600 text-white font-black text-lg uppercase tracking-widest rounded-3xl shadow-2xl hover:bg-blue-700 hover:-translate-y-1 transition-all disabled:opacity-50 active:scale-[0.98]"
                            >
                                {loading ? 'Processing Request...' : 'Book Free Inspection'}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </section>
    );
};

export default LeadCaptureForm;
