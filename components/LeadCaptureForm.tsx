import React, { useState, useEffect, useRef } from 'react';
import { ArrowPathIcon } from './Icon';
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
        ctx.fillStyle = isDark ? '#374151' : '#f9fafb'; // gray-700 or gray-50
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
        generateCaptcha();
    }, []);

    // FIX: Moved the `theme` variable declaration before the `useEffect` hook that uses it.
    const theme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';

    useEffect(() => {
        if (captcha) {
            drawCaptcha(captcha);
        }
    }, [captcha, theme]);

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

    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border dark:border-gray-700">
            <div className="p-8">
                <header className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Ready for a Professional Opinion?</h2>
                    <p className="text-gray-600 dark:text-gray-300 mt-2">Book your free, no-obligation roof inspection today. Our experts are ready to provide a thorough assessment and answer all your questions.</p>
                </header>
                <main>
                    {success ? (
                        <div className="text-center py-8">
                            <h3 className="text-2xl font-bold text-green-600">Thank You, {formData.name.split(' ')[0]}!</h3>
                            <p className="mt-3 text-gray-600 dark:text-gray-300">Your inspection request has been sent. Our team will contact you within 24 hours to confirm.</p>
                            <button onClick={handleReset} className="mt-6 w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg shadow-lg hover:bg-blue-700">Book Another Inspection</button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="name-static" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
                                    <input type="text" name="name" id="name-static" required value={formData.name} onChange={handleChange} className="mt-1 p-2 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"/>
                                </div>
                                <div>
                                    <label htmlFor="company-static" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Company (Optional)</label>
                                    <input type="text" name="company" id="company-static" value={formData.company} onChange={handleChange} className="mt-1 p-2 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"/>
                                </div>
                            </div>
                            <div>
                                <label htmlFor="email-static" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</label>
                                <input type="email" name="email" id="email-static" required value={formData.email} onChange={handleChange} className="mt-1 p-2 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"/>
                            </div>
                            <div>
                                <label htmlFor="phone-static" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Phone Number</label>
                                <input type="tel" name="phone" id="phone-static" required value={formData.phone} onChange={handleChange} maxLength={14} placeholder="(123) 456-7890" className="mt-1 p-2 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"/>
                            </div>
                            <div>
                                <label htmlFor="service-static" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Service of Interest</label>
                                <select
                                    id="service-static"
                                    name="service"
                                    value={formData.service}
                                    onChange={handleChange}
                                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                >
                                    {SERVICES.map((service) => (
                                        <option key={service.title} value={service.title}>
                                            {service.title}
                                        </option>
                                    ))}
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="message-static" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Message (Optional)</label>
                                <textarea id="message-static" name="message" rows={3} value={formData.message} onChange={handleChange} className="mt-1 p-2 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"></textarea>
                            </div>
                            <div>
                                <label htmlFor="captcha-static" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Security Check</label>
                                <div className="mt-2 flex items-center gap-4 flex-wrap">
                                    <canvas ref={canvasRef} width="180" height="50" className="border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700" />
                                    <button type="button" onClick={generateCaptcha} title="Refresh CAPTCHA" className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"><ArrowPathIcon className="w-6 h-6" /></button>
                                </div>
                                <input type="text" name="captcha" id="captcha-static" required value={captchaInput} onChange={(e) => setCaptchaInput(e.target.value)} placeholder="Enter text from image" className="mt-2 p-2 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" maxLength={6} autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck="false"/>
                            </div>
                            {error && <p className="text-sm text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-300 p-3 rounded-md">{error}</p>}
                            <div><button type="submit" disabled={loading} className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 dark:disabled:bg-gray-500">{loading ? 'Sending...' : 'Book Free Inspection'}{loading && <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}</button></div>
                        </form>
                    )}
                </main>
            </div>
        </div>
    );
};

export default LeadCaptureForm;
