

import React, { useState } from 'react';

const LeadCaptureForm: React.FC = () => {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        service: 'Roof Replacement',
        message: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        if (name === 'phone') {
            const digits = value.replace(/\D/g, '').slice(0, 10);
            const length = digits.length;
            let formattedValue = '';

            if (length > 0) {
                formattedValue = `(${digits.substring(0, 3)}`;
            }
            if (length > 3) {
                formattedValue += `) ${digits.substring(3, 6)}`;
            }
            if (length > 6) {
                formattedValue += `-${digits.substring(6, 10)}`;
            }
            
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

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setError('Please enter a valid email address.');
            setLoading(false);
            return;
        }
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        console.log('Lead Captured:', formData);
        setLoading(false);
        setSuccess(true);
    };

    const handleReset = () => {
        setFormData({
            name: '',
            phone: '',
            email: '',
            service: 'Roof Replacement',
            message: ''
        });
        setSuccess(false);
    };

    if (success) {
        return (
            <section id="contact" className="py-16 md:py-24 bg-gray-50">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-2xl">
                    <div className="text-center">
                        <h2 className="text-3xl md:text-4xl font-extrabold text-green-600 tracking-tight">
                            Thank You, {formData.name.split(' ')[0]}!
                        </h2>
                        <p className="mt-4 text-lg text-gray-600">
                            Your request has been successfully sent. Our team will contact you at your provided email or phone number within 24 hours.
                        </p>
                    </div>
                    
                    <div className="mt-8 bg-white p-6 rounded-lg shadow-md border border-gray-200 text-left">
                        <h3 className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-3 mb-4">Request Summary</h3>
                        <dl className="space-y-4">
                            <div className="flex flex-col sm:flex-row">
                                <dt className="sm:w-1/3 font-medium text-gray-500">Full Name</dt>
                                <dd className="sm:w-2/3 text-gray-900">{formData.name}</dd>
                            </div>
                            <div className="flex flex-col sm:flex-row">
                                <dt className="sm:w-1/3 font-medium text-gray-500">Phone</dt>
                                <dd className="sm:w-2/3 text-gray-900">{formData.phone}</dd>
                            </div>
                            <div className="flex flex-col sm:flex-row">
                                <dt className="sm:w-1/3 font-medium text-gray-500">Email</dt>
                                <dd className="sm:w-2/3 text-gray-900">{formData.email}</dd>
                            </div>
                            <div className="flex flex-col sm:flex-row">
                                <dt className="sm:w-1/3 font-medium text-gray-500">Service Needed</dt>
                                <dd className="sm:w-2/3 text-gray-900">{formData.service}</dd>
                            </div>
                            {formData.message && (
                                <div className="flex flex-col sm:flex-row">
                                    <dt className="sm:w-1/3 font-medium text-gray-500">Message</dt>
                                    <dd className="sm:w-2/3 text-gray-900 whitespace-pre-wrap">{formData.message}</dd>
                                </div>
                            )}
                        </dl>
                    </div>

                    <div className="text-center mt-8">
                        <button onClick={handleReset} className="bg-blue-600 text-white font-bold py-3 px-8 rounded-lg shadow-lg hover:bg-blue-700 transition-all">
                            Submit Another Request
                        </button>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section id="contact" className="py-16 md:py-24 bg-gray-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
                        Ready to Start Your Project?
                    </h2>
                    <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">
                        Fill out the form below for a free, no-obligation quote. Our roofing experts are ready to help.
                    </p>
                </div>
                <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-xl border border-gray-200">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
                                <input type="text" name="name" id="name" required value={formData.name} onChange={handleChange} className="mt-1 p-3 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"/>
                            </div>
                            <div>
                                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
                                <input type="tel" name="phone" id="phone" required value={formData.phone} onChange={handleChange} maxLength={14} placeholder="(123) 456-7890" className="mt-1 p-3 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"/>
                            </div>
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                            <input type="email" name="email" id="email" required value={formData.email} onChange={handleChange} className="mt-1 p-3 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"/>
                        </div>
                        <div>
                            <label htmlFor="service" className="block text-sm font-medium text-gray-700">Service Needed</label>
                            <select id="service" name="service" value={formData.service} onChange={handleChange} className="mt-1 block w-full pl-3 pr-10 py-3 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md">
                                <option>Roof Replacement</option>
                                <option>Roof Repair</option>
                                <option>Roof Inspection</option>
                                <option>Emergency Tarping</option>
                                <option>Other</option>
                            </select>
                        </div>
                        <div>
                             <label htmlFor="message" className="block text-sm font-medium text-gray-700">Brief Message (Optional)</label>
                             <textarea id="message" name="message" rows={4} value={formData.message} onChange={handleChange} className="mt-1 p-3 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"></textarea>
                        </div>
                        {error && <p className="text-sm text-red-600 bg-red-100 p-3 rounded-md">{error}</p>}
                        <div>
                            <button type="submit" disabled={loading} className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400">
                                {loading ? 'Sending...' : 'Send My Request'}
                                {loading && <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
};
export default LeadCaptureForm;