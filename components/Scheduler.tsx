import React, { useState, useMemo, useEffect } from 'react';
import { 
  Home, 
  AlertTriangle, 
  ShieldAlert, 
  Search, 
  Droplets, 
  Settings, 
  Check, 
  ChevronLeft, 
  ChevronRight, 
  Calendar, 
  Clock, 
  ArrowRight, 
  ArrowLeft,
  Printer,
  CalendarClock,
  Building2,
  User,
  Phone,
  Mail,
  MapPin,
  CheckCircle2
} from 'lucide-react';

interface SchedulerProps {
  showTitle?: boolean;
  onBookingConfirmed?: () => void;
}

const Scheduler: React.FC<SchedulerProps> = ({ showTitle = true, onBookingConfirmed }) => {
  const [step, setStep] = useState(0); // 0 = SERVICE, 1 = CONTACT (Personal + Timing), 2 = LOCATION
  const [selectedService, setSelectedService] = useState('Roof Inspection');
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date(Date.now() + 86400000)); // Default tomorrow
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState('10:00 AM');
  const [isBooked, setIsBooked] = useState(false);
  const [smsSent, setSmsSent] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    zip: '',
    propertyType: 'Residential', // Residential or Commercial
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Core values or tags for bottom bar
  const badges = [
    { text: 'Free', id: 'badge-free' },
    { text: 'No obligation', id: 'badge-no-obligation' },
    { text: '60 seconds', id: 'badge-60-sec' }
  ];

  const services = [
    { title: 'Roof Replacement', icon: Home, color: 'text-amber-400 border-amber-400' },
    { title: 'Emergency Repair', icon: AlertTriangle, color: 'text-orange-400 border-orange-400' },
    { title: 'Storm Damage', icon: ShieldAlert, color: 'text-blue-400 border-blue-400' },
    { title: 'Roof Inspection', icon: Search, color: 'text-purple-400 border-purple-400' },
    { title: 'Gutters & Siding', icon: Droplets, color: 'text-pink-400 border-pink-400' },
    { title: 'Maintenance', icon: Settings, color: 'text-emerald-400 border-emerald-400' },
  ];

  // Calendar logic
  const monthName = currentMonth.toLocaleString('default', { month: 'long' });
  const year = currentMonth.getFullYear();

  const daysInMonth = useMemo(() => {
    return new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  }, [currentMonth]);

  const startDay = useMemo(() => {
    return new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();
  }, [currentMonth]);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const handleDaySelect = (day: number) => {
    const selected = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    if (selected >= today) {
      setSelectedDate(selected);
    }
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const timeSlots = [
    '8:00 AM',
    '10:00 AM',
    '12:00 PM',
    '2:00 PM',
    '4:00 PM'
  ];

  // Custom regex fields validation
  const validateStep = () => {
    const newErrors: Record<string, string> = {};
    if (step === 1) {
      if (!formData.name.trim()) newErrors.name = 'Full Name is required';
      if (!formData.phone.trim()) {
        newErrors.phone = 'Phone number is required';
      } else {
        const phoneDigits = formData.phone.replace(/\D/g, '');
        if (phoneDigits.length < 10) {
          newErrors.phone = 'Please enter a valid 10-digit phone number';
        }
      }
      if (!formData.email.trim()) {
        newErrors.email = 'Email Address is required';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Invalid email address';
      }
    } else if (step === 2) {
      if (!formData.address.trim()) newErrors.address = 'Street Address is required';
      if (!formData.zip.trim()) {
        newErrors.zip = 'ZIP code is required';
      } else if (!/^\d{5}$/.test(formData.zip)) {
        newErrors.zip = 'ZIP code must be 5 digits';
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      setStep(prev => Math.min(prev + 1, 2));
    }
  };

  const handleBack = () => {
    setStep(prev => Math.max(prev - 1, 0));
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const digits = value.replace(/\D/g, '').slice(0, 10);
    let formatted = '';
    if (digits.length > 0) formatted = `(${digits.substring(0, 3)}`;
    if (digits.length > 3) formatted += `) ${digits.substring(3, 6)}`;
    if (digits.length > 6) formatted += `-${digits.substring(6, 10)}`;
    setFormData({ ...formData, phone: formatted || value });
    if (errors.phone) setErrors({ ...errors, phone: '' });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) setErrors({ ...errors, [field]: '' });
  };

  const handleConfirmBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateStep()) {
      setIsSubmitting(true);
      try {
        const payload = {
          ...formData,
          service: selectedService,
          appointmentDate: selectedDate ? selectedDate.toISOString() : null,
          appointmentTime: selectedTime,
        };
        const response = await fetch('/api/schedule', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (!response.ok) {
          const resData = await response.json();
          throw new Error(resData.error || 'Failed to submit appointment to backend');
        }
        setIsBooked(true);
        if (onBookingConfirmed) {
          onBookingConfirmed();
        }
      } catch (err: any) {
        setErrors(prev => ({ ...prev, submit: err.message || 'Appointment submission failed. Please try again.' }));
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const generateICSFile = () => {
    if (!selectedDate || !selectedTime) return;

    const parseTime = (timeStr: string) => {
      const [time, modifier] = timeStr.split(' ');
      let [hours, minutes] = time.split(':').map(Number);
      if (modifier === 'PM' && hours < 12) hours += 12;
      if (modifier === 'AM' && hours === 12) hours = 0;
      return { hours, minutes };
    };

    const { hours, minutes } = parseTime(selectedTime);
    const startDate = new Date(selectedDate);
    startDate.setHours(hours, minutes, 0, 0);

    const endDate = new Date(startDate);
    endDate.setHours(startDate.getHours() + 1);

    const toUTCString = (date: Date) => {
      return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//InnovativeRoofing//Appointment//EN',
      'BEGIN:VEVENT',
      `UID:${Date.now()}@innovativeroofusa.com`,
      `DTSTAMP:${toUTCString(new Date())}`,
      `DTSTART:${toUTCString(startDate)}`,
      `DTEND:${toUTCString(endDate)}`,
      `SUMMARY:${selectedService} - Innovative Roofing`,
      `DESCRIPTION:Your free no-pressure roof inspection is confirmed. Detail: ${selectedService} at ${formData.address}, ${formData.zip}. Hotline: (800) 555-ROOF.`,
      `LOCATION:${formData.address}, ${formData.zip}`,
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'innovative-roof-inspection.ics';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSendSms = () => {
    setSmsSent(true);
    setTimeout(() => setSmsSent(false), 4500);
  };

  const calendarDays = [];
  for (let i = 0; i < startDay; i++) {
    calendarDays.push(<div key={`empty-${i}`} className="p-1 sm:p-2"></div>);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const dayDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    const isToday = dayDate.toDateString() === today.toDateString();
    const isSelected = selectedDate?.toDateString() === dayDate.toDateString();
    const isPast = dayDate < today;

    calendarDays.push(
      <button
        key={`day-${day}`}
        type="button"
        disabled={isPast}
        onClick={() => handleDaySelect(day)}
        className={`p-1 sm:p-2 text-center rounded-lg text-xs sm:text-sm font-semibold transition-all duration-150 cursor-pointer
          ${isPast 
            ? 'text-white/20 cursor-not-allowed hover:bg-transparent' 
            : 'hover:bg-white/10 text-white'
          }
          ${isToday ? 'border border-amber-400 text-amber-400' : ''}
          ${isSelected ? 'bg-amber-400 text-slate-900 shadow-lg font-black hover:bg-amber-400' : ''}
        `}
      >
        {day}
      </button>
    );
  }

  if (isBooked) {
    return (
      <div className="bg-[#0B2545] p-6 sm:p-10 rounded-3xl border border-white/10 text-white shadow-2xl max-w-2xl mx-auto my-4 text-center">
        <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-500/30">
          <CheckCircle2 className="w-12 h-12 text-green-400" />
        </div>
        <h2 className="text-3xl font-extrabold text-white tracking-tight">Inspection Scheduled!</h2>
        <p className="mt-3 text-gray-300 max-w-md mx-auto">
          Thank you, <span className="font-bold text-amber-400">{formData.name}</span>. Your no-pressure <span className="lowercase font-bold text-amber-400">{selectedService}</span> is confirmed.
        </p>

        <div className="mt-8 bg-black/30 p-6 rounded-2xl border border-white/5 text-left max-w-sm mx-auto space-y-3 shadow-inner">
          <h3 className="text-sm uppercase font-black tracking-widest text-amber-400 border-b border-white/10 pb-2 mb-3">Appointment Brief</h3>
          <p className="text-sm text-gray-200">
            <strong className="text-gray-400 font-medium">Service:</strong> {selectedService}
          </p>
          <p className="text-sm text-gray-200">
            <strong className="text-gray-400 font-medium">Date:</strong> {selectedDate?.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
          <p className="text-sm text-gray-200">
            <strong className="text-gray-400 font-medium">Time Window:</strong> {selectedTime}
          </p>
          <p className="text-sm text-gray-200">
            <strong className="text-gray-400 font-medium">Address:</strong> {formData.address}, {formData.zip}
          </p>
          <p className="text-sm text-gray-200">
            <strong className="text-gray-400 font-medium">Phone:</strong> {formData.phone}
          </p>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
          <button 
            onClick={generateICSFile} 
            className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/15 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-md text-sm"
          >
            <CalendarClock className="w-4 h-4 text-amber-400" />
            Add to Calendar
          </button>
          
          <button 
            onClick={handleSendSms} 
            disabled={smsSent} 
            className="flex items-center justify-center gap-2 bg-amber-400 hover:bg-amber-300 disabled:bg-slate-700 text-slate-900 font-black py-3 px-6 rounded-xl transition-all shadow-md text-sm"
          >
            <Clock className="w-4 h-4" />
            {smsSent ? 'Reminder Sent!' : 'SMS Text Receipt'}
          </button>
        </div>

        <div className="mt-8 border-t border-white/5 pt-6 flex justify-between items-center max-w-sm mx-auto text-xs text-gray-400">
          <span>Need to reschedule?</span>
          <a href="tel:1-800-555-7663" className="text-amber-400 font-bold hover:underline">Call (800) 555-ROOF</a>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#0B2545] p-5 sm:p-8 md:p-10 rounded-3xl border border-white/10 text-white shadow-2xl max-w-2xl mx-auto my-4 flex flex-col transition-all duration-300">
      
      {/* Title & Gold Subheader */}
      <div className="text-center mb-6">
        <h2 id="scheduler-header-title" className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Schedule A Free No-Pressure
        </h2>
        <h3 id="scheduler-header-gold" className="text-2xl sm:text-3xl font-extrabold text-amber-400 tracking-tight mt-1">
          Roof Inspection Today!
        </h3>
      </div>

      {/* Progress Tabs/Indicator exactly as screenshot */}
      <div className="grid grid-cols-3 gap-3 text-center mb-8 relative border-b border-white/10 pb-4">
        {[
          { label: 'SERVICE', stepVal: 0 },
          { label: 'CONTACT', stepVal: 1 },
          { label: 'LOCATION', stepVal: 2 }
        ].map((tab) => {
          const isActive = step === tab.stepVal;
          return (
            <div key={tab.label} className="flex flex-col items-center">
              <span className={`text-[10px] sm:text-[11px] font-black tracking-widest transition-colors duration-200 ${isActive ? 'text-amber-400 font-extrabold' : 'text-white/40'}`}>
                {tab.label}
              </span>
              <div className={`h-[3px] w-full rounded-full mt-2 transition-all duration-300 ${isActive ? 'bg-amber-400 scale-100' : 'bg-transparent scale-0'}`}></div>
            </div>
          );
        })}
      </div>

      {/* Step Contents */}
      <div className="flex-1 min-h-[340px] flex flex-col justify-between">
        
        {/* STEP 0: SERVICE SELECT */}
        {step === 0 && (
          <div className="space-y-6 animate-fade-in">
            <h4 className="text-center font-bold text-lg sm:text-xl text-white">
              What do you need help with?
            </h4>
            
            <div className="grid grid-cols-2 gap-3" role="group" aria-label="Selecting service dropdown">
              {services.map((item) => {
                const IconComponent = item.icon;
                const isSelected = selectedService === item.title;
                return (
                  <button
                    key={item.title}
                    type="button"
                    onClick={() => setSelectedService(item.title)}
                    className={`p-4 rounded-2xl border text-left flex flex-col items-center justify-center gap-3 transition-all cursor-pointer group hover:scale-[1.02] active:scale-[0.98] ${
                      isSelected 
                        ? 'border-amber-400 bg-amber-400/10 text-amber-400 shadow-lg shadow-amber-400/5' 
                        : 'border-white/10 bg-white/5 text-white hover:border-white/20 hover:bg-white/10'
                    }`}
                  >
                    <IconComponent className={`w-8 h-8 transition-colors ${isSelected ? 'text-amber-400' : 'text-amber-400 group-hover:text-amber-300'}`} />
                    <span className="text-xs sm:text-sm font-bold block text-center mt-1">
                      {item.title}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 1: CONTACT INFO & TIMING */}
        {step === 1 && (
          <div className="space-y-6 animate-fade-in">
            <h4 className="text-center font-bold text-lg sm:text-xl text-white flex items-center justify-center gap-2">
              <Clock className="w-5 h-5 text-amber-400" />
              Pick date, time, and basic info
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-black/15 p-4 rounded-2xl border border-white/5">
              
              {/* Calendar column */}
              <div>
                <div className="flex items-center justify-between mb-3 text-xs sm:text-sm">
                  <button type="button" onClick={prevMonth} className="p-1 rounded-full text-white/70 hover:bg-white/10">
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="font-bold">{monthName} {year}</span>
                  <button type="button" onClick={nextMonth} className="p-1 rounded-full text-white/70 hover:bg-white/10">
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-7 gap-1 text-center font-bold text-[10px] text-white/40 uppercase mb-2">
                  <div>Su</div>
                  <div>Mo</div>
                  <div>Tu</div>
                  <div>We</div>
                  <div>Th</div>
                  <div>Fr</div>
                  <div>Sa</div>
                </div>

                <div className="grid grid-cols-7 gap-1">
                  {calendarDays}
                </div>
              </div>

              {/* Time Slots & Personal Info inputs */}
              <div className="space-y-4">
                <div>
                  <label className="block text-[11px] font-black uppercase tracking-wider text-white/50 mb-2">
                    Available times for {selectedDate?.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {timeSlots.map(time => {
                      const isTimeSel = selectedTime === time;
                      return (
                        <button
                          key={time}
                          type="button"
                          onClick={() => setSelectedTime(time)}
                          className={`py-1.5 rounded-lg border text-[11px] font-bold text-center cursor-pointer transition-all ${
                            isTimeSel 
                              ? 'bg-amber-400 text-slate-900 border-amber-400 font-extrabold shadow-md' 
                              : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
                          }`}
                        >
                          {time}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="h-[1px] bg-white/10 my-1"></div>

                <div className="space-y-3">
                  <div>
                    <label htmlFor="form-personal-name" className="block text-[10px] font-black uppercase tracking-wider text-white/60 mb-1">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-2.5 w-4 h-4 text-white/30" />
                      <input 
                        type="text" 
                        id="form-personal-name"
                        value={formData.name} 
                        onChange={(e) => handleInputChange('name', e.target.value)} 
                        placeholder="John Doe" 
                        className={`w-full pl-9 pr-3 py-2 bg-black/20 border rounded-xl text-xs text-white placeholder-white/20 focus:outline-none focus:border-amber-400 ${errors.name ? 'border-red-500' : 'border-white/10'}`} 
                      />
                    </div>
                    {errors.name && <span className="text-[10px] text-red-400 mt-1 block font-bold">{errors.name}</span>}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="form-personal-phone" className="block text-[10px] font-black uppercase tracking-wider text-white/60 mb-1">Phone *</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-2.5 w-4 h-4 text-white/30" />
                        <input 
                          type="tel" 
                          id="form-personal-phone"
                          value={formData.phone} 
                          onChange={handlePhoneChange} 
                          placeholder="(123) 456-7890" 
                          className={`w-full pl-9 pr-3 py-2 bg-black/20 border rounded-xl text-xs text-white placeholder-white/20 focus:outline-none focus:border-amber-400 ${errors.phone ? 'border-red-500' : 'border-white/10'}`} 
                        />
                      </div>
                      {errors.phone && <span className="text-[10px] text-red-400 mt-1 block font-bold">{errors.phone}</span>}
                    </div>

                    <div>
                      <label htmlFor="form-personal-email" className="block text-[10px] font-black uppercase tracking-wider text-white/60 mb-1">Email *</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-2.5 w-4 h-4 text-white/30" />
                        <input 
                          type="email" 
                          id="form-personal-email"
                          value={formData.email} 
                          onChange={(e) => handleInputChange('email', e.target.value)} 
                          placeholder="johndoe@gmail.com" 
                          className={`w-full pl-9 pr-3 py-2 bg-black/20 border rounded-xl text-xs text-white placeholder-white/20 focus:outline-none focus:border-amber-400 ${errors.email ? 'border-red-500' : 'border-white/10'}`} 
                        />
                      </div>
                      {errors.email && <span className="text-[10px] text-red-400 mt-1 block font-bold">{errors.email}</span>}
                    </div>
                  </div>
                </div>

              </div>

            </div>
          </div>
        )}

        {/* STEP 2: LOCATION DETAILS */}
        {step === 2 && (
          <form onSubmit={handleConfirmBooking} className="space-y-6 animate-fade-in">
            <h4 className="text-center font-bold text-lg sm:text-xl text-white flex items-center justify-center gap-2">
              <MapPin className="w-5 h-5 text-amber-400" />
              Where is the inspection local address?
            </h4>

            <div className="space-y-4 bg-black/15 p-5 rounded-2xl border border-white/5 max-w-md mx-auto">
              
              {/* Residential / Commercial button choice */}
              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-white/60 mb-2">Property Type</label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { type: 'Residential', label: 'Residential', icon: Home },
                    { type: 'Commercial', label: 'Commercial', icon: Building2 }
                  ].map((p) => {
                    const isTypeSel = formData.propertyType === p.type;
                    const TypeIcon = p.icon;
                    return (
                      <button
                        key={p.type}
                        type="button"
                        onClick={() => handleInputChange('propertyType', p.type)}
                        className={`p-3 rounded-xl border flex items-center justify-center gap-2 font-bold cursor-pointer transition-all text-xs ${
                          isTypeSel 
                            ? 'bg-amber-400 text-slate-900 border-amber-400 shadow-md' 
                            : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
                        }`}
                      >
                        <TypeIcon className="w-4 h-4" />
                        {p.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label htmlFor="form-location-address" className="block text-[10px] font-black uppercase tracking-wider text-white/60 mb-1">Street Address</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 w-4 h-4 text-white/30" />
                  <input 
                    type="text" 
                    id="form-location-address"
                    value={formData.address} 
                    onChange={(e) => handleInputChange('address', e.target.value)} 
                    placeholder="123 Main Street" 
                    className={`w-full pl-9 pr-3 py-2.5 bg-black/20 border rounded-xl text-xs text-white placeholder-white/20 focus:outline-none focus:border-amber-400 ${errors.address ? 'border-red-500' : 'border-white/10'}`} 
                  />
                </div>
                {errors.address && <span className="text-[10px] text-red-400 mt-1 block font-bold">{errors.address}</span>}
              </div>

              <div>
                <label htmlFor="form-location-zip" className="block text-[10px] font-black uppercase tracking-wider text-white/60 mb-1">5-Digit ZIP Code</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 w-4 h-4 text-white/30" />
                  <input 
                    type="text" 
                    id="form-location-zip"
                    maxLength={5}
                    value={formData.zip} 
                    onChange={(e) => handleInputChange('zip', e.target.value)} 
                    placeholder="64101" 
                    className={`w-full pl-9 pr-3 py-2.5 bg-black/20 border rounded-xl text-xs text-white placeholder-white/20 focus:outline-none focus:border-amber-400 ${errors.zip ? 'border-red-500' : 'border-white/10'}`} 
                  />
                </div>
                {errors.zip && <span className="text-[10px] text-red-400 mt-1 block font-bold">{errors.zip}</span>}
                <p className="text-[10px] text-white/40 mt-1">We service the complete Kansas City metropolitan area.</p>
              </div>

              {errors.submit && (
                <div className="bg-red-500/20 border border-red-500/30 p-3.5 rounded-xl text-red-300 text-xs text-center font-bold">
                  {errors.submit}
                </div>
              )}

            </div>
          </form>
        )}

        {/* Action Button board */}
        <div className="mt-8 flex items-center justify-between gap-4">
          {step > 0 ? (
            <button
              onClick={handleBack}
              type="button"
              className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold py-3 px-6 rounded-xl transition-all cursor-pointer text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
          ) : (
            <div className="w-1"></div>
          )}

          {step < 2 ? (
            <button
              onClick={handleNext}
              type="button"
              className="flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-slate-900 font-extrabold py-3.5 px-8 rounded-xl transition-all shadow-lg hover:shadow-amber-400/15 cursor-pointer ml-auto text-sm"
            >
              Continue
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleConfirmBooking}
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 bg-amber-400 hover:bg-amber-300 disabled:opacity-50 text-slate-900 font-black py-4 px-10 rounded-xl transition-all shadow-xl hover:shadow-amber-400/20 cursor-pointer ml-auto text-sm uppercase tracking-wider"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
                  Scheduling...
                </>
              ) : (
                <>
                  <Check className="w-5 h-5 font-black" />
                  Confirm Free Inspection
                </>
              )}
            </button>
          )}
        </div>

      </div>

      {/* Badges footer block: ✓ Free  ✓ No obligation  ✓ 60 seconds */}
      <div className="flex flex-row justify-center items-center gap-4 sm:gap-6 text-xs text-white/60 mt-8 pt-4 border-t border-white/5 select-none">
        {badges.map((b) => (
          <span key={b.id} className="flex items-center gap-1.5">
            <span className="text-amber-400 font-black">✓</span>
            {b.text}
          </span>
        ))}
      </div>

      {/* CEO Quote footer signature block */}
      <div className="mt-8 text-center border-t border-white/5 pt-4">
        <p className="text-white/60 italic text-sm tracking-wide font-serif">
          &ldquo;When you think Roofing, think Innov8v!&rdquo;
        </p>
        <p className="text-xs text-white/40 mt-1 flex items-center justify-center gap-2">
          {/* Cursive italic CEO signature visual */}
          <span className="text-amber-400 text-base font-semibold tracking-wider italic font-sans pr-1" style={{ fontFamily: 'Georgia, serif' }}>
            C. Lamont Patrick
          </span>
          <span className="text-white/20">|</span>
          <span className="font-bold uppercase tracking-widest text-[9px]">CEO</span>
        </p>
      </div>

      {/* Custom Key-frame animations */}
      <style>{`
        @keyframes fade-in {
          0% { opacity: 0; transform: translateY(4px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.25s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default Scheduler;
