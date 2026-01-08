

import React, { useState, useMemo } from 'react';
import { ChevronLeftIcon, ChevronRightIcon, CalendarDaysIcon, ChatBubbleOvalLeftEllipsisIcon, PrinterIcon } from './Icon';

interface SchedulerProps {
  showTitle?: boolean;
  onBookingConfirmed?: () => void;
}

const Scheduler: React.FC<SchedulerProps> = ({ showTitle = true, onBookingConfirmed }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [selectedTime, setSelectedTime] = useState('');
  const [isBooked, setIsBooked] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
  const [smsSent, setSmsSent] = useState(false);

  const monthName = currentDate.toLocaleString('default', { month: 'long' });
  const year = currentDate.getFullYear();

  const daysInMonth = useMemo(() => {
    const d = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    return d.getDate();
  }, [currentDate]);
  
  const startDay = useMemo(() => {
    const d = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    return d.getDay();
  }, [currentDate]);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const handleDayClick = (day: number) => {
    const newSelectedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    if (newSelectedDate >= today) {
      setSelectedDate(newSelectedDate);
      setSelectedTime('');
    }
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      setIsBooked(true);
      setSmsSent(false); // Reset SMS status for new booking
      if (onBookingConfirmed) {
        // The modal will be closed by the user using the 'X' button.
        // No automatic close to allow user to interact with confirmation options.
      }
  };

  const generateICSFile = () => {
    if (!selectedDate || !selectedTime) return;

    const parseTime = (timeStr: string) => {
        const [time, modifier] = timeStr.split(' ');
        let [hours, minutes] = time.split(':').map(Number);
        if (modifier === 'PM' && hours < 12) {
            hours += 12;
        }
        if (modifier === 'AM' && hours === 12) {
            hours = 0;
        }
        return { hours, minutes };
    };

    const { hours, minutes } = parseTime(selectedTime);
    const startDate = new Date(selectedDate);
    startDate.setHours(hours, minutes, 0, 0);

    const endDate = new Date(startDate);
    endDate.setHours(startDate.getHours() + 1); // 1-hour duration

    const toUTCString = (date: Date) => {
        return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };

    const icsContent = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//EliteRoofing//Appointment//EN',
        'BEGIN:VEVENT',
        `UID:${Date.now()}@eliteroofing.ai`,
        `DTSTAMP:${toUTCString(new Date())}`,
        `DTSTART:${toUTCString(startDate)}`,
        `DTEND:${toUTCString(endDate)}`,
        'SUMMARY:Roof Inspection with Elite Roofing Solutions',
        'DESCRIPTION:Your free roof inspection appointment is confirmed. Please ensure our team has access to the property. Contact us at (800) 555-ROOF with any questions.',
        'LOCATION:Your Property Address',
        'END:VEVENT',
        'END:VCALENDAR'
    ].join('\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'elite-roofing-inspection.ics';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const handleSendSms = () => {
      setSmsSent(true);
      setTimeout(() => setSmsSent(false), 4000); // Re-enable button after 4s
  };

  const generateTimeSlots = () => {
      const slots = [];
      const startTime = 8; // 8:00 AM
      const endTime = 17; // 5:00 PM is the last possible start time, so loop until 16:00
      for (let hour = startTime; hour < endTime; hour++) {
          const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
          const ampm = hour >= 12 ? 'PM' : 'AM';
          slots.push(`${displayHour}:00 ${ampm}`);
      }
      return slots;
  };

  const timeSlots = generateTimeSlots();

  const calendarDays = [];
  for (let i = 0; i < startDay; i++) {
    calendarDays.push(<div key={`empty-${i}`} className="p-2 border border-transparent"></div>);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    const dayDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    const isToday = dayDate.toDateString() === new Date().toDateString();
    const isSelected = selectedDate?.toDateString() === dayDate.toDateString();
    const isPast = dayDate < today;

    calendarDays.push(
      <div
        key={day}
        onClick={() => !isPast && handleDayClick(day)}
        className={`p-2 text-center border rounded-lg transition-colors duration-200 
          ${isPast ? 'text-gray-400 cursor-not-allowed' : 'cursor-pointer hover:bg-blue-100'}
          ${isToday ? 'font-bold text-blue-600' : ''}
          ${isSelected ? 'bg-blue-600 text-white font-bold' : 'border-gray-200'}
        `}
      >
        {day}
      </div>
    );
  }

  if (isBooked) {
    return (
        <div className="py-16 md:py-24 bg-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h2 className="text-3xl font-extrabold text-green-600">Booking Confirmed!</h2>
                <p className="mt-4 text-lg text-gray-600">
                    Your free inspection is scheduled, {formData.name}.
                </p>
                <div className="mt-8 bg-gray-50 p-6 rounded-lg shadow-md inline-block max-w-lg text-left border">
                    <h3 className="text-xl font-bold text-gray-900 border-b pb-3 mb-4">Appointment Details</h3>
                    <div className="space-y-3">
                        <p><strong className="font-medium text-gray-600">Date:</strong> {selectedDate?.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                        <p><strong className="font-medium text-gray-600">Time:</strong> {selectedTime}</p>
                        <p><strong className="font-medium text-gray-600">Email:</strong> {formData.email}</p>
                        <p><strong className="font-medium text-gray-600">Phone:</strong> {formData.phone}</p>
                    </div>
                </div>
                <div className="mt-8 flex justify-center gap-4 flex-wrap">
                    <button onClick={generateICSFile} className="flex items-center gap-2 bg-gray-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:bg-gray-800 transition-colors">
                        <CalendarDaysIcon className="w-5 h-5" />
                        Add to Calendar
                    </button>
                    <button onClick={handleSendSms} disabled={smsSent} className="flex items-center gap-2 bg-blue-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400">
                        <ChatBubbleOvalLeftEllipsisIcon className="w-5 h-5" />
                        {smsSent ? 'Reminder Sent!' : 'Send SMS Reminder'}
                    </button>
                    <button onClick={() => window.print()} className="flex items-center gap-2 bg-gray-200 text-gray-800 font-bold py-3 px-6 rounded-lg shadow-lg hover:bg-gray-300 transition-colors">
                        <PrinterIcon className="w-5 h-5" />
                        Print Details
                    </button>
                </div>
            </div>
        </div>
    );
  }

  return (
    <section id="schedule" className={`bg-white ${showTitle ? 'py-16 md:py-24' : 'p-4 sm:p-6'}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {showTitle && (
            <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
                    Schedule Your Free Inspection
                </h2>
                <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">
                    Pick a date and time that works for you. Our expert will provide a comprehensive, no-obligation assessment.
                </p>
            </div>
        )}
        <div className="max-w-4xl mx-auto bg-gray-50 p-4 sm:p-8 rounded-2xl shadow-xl border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Calendar */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <button onClick={prevMonth} title="Previous month" className="p-2 rounded-full hover:bg-gray-200 transition-colors">
                  <ChevronLeftIcon className="w-6 h-6 text-gray-600" />
                </button>
                <h3 className="text-xl font-semibold text-gray-800">{monthName} {year}</h3>
                <button onClick={nextMonth} title="Next month" className="p-2 rounded-full hover:bg-gray-200 transition-colors">
                  <ChevronRightIcon className="w-6 h-6 text-gray-600" />
                </button>
              </div>
              <div className="grid grid-cols-7 gap-1 text-center font-semibold text-gray-500 text-sm mb-2">
                <div>Sun</div>
                <div>Mon</div>
                <div>Tue</div>
                <div>Wed</div>
                <div>Thu</div>
                <div>Fri</div>
                <div>Sat</div>
              </div>
              <div className="grid grid-cols-7 gap-1">
                {calendarDays}
              </div>
            </div>
            
            {/* Time Slots & Form */}
            <div className="flex flex-col">
              {selectedDate ? (
                <>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center md:text-left">
                    Available times for {selectedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-6">
                    {timeSlots.map(time => (
                      <button
                        key={time}
                        onClick={() => setSelectedTime(time)}
                        className={`p-3 rounded-lg border text-sm font-medium transition-colors ${
                          selectedTime === time 
                          ? 'bg-blue-600 text-white border-blue-600' 
                          : 'bg-white hover:bg-blue-50 border-gray-300'
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                  {selectedTime && (
                    <form onSubmit={handleSubmit} className="space-y-4 animate-fade-in-up">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
                            <input type="text" id="name" name="name" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="mt-1 p-2 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"/>
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                            <input type="email" id="email" name="email" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="mt-1 p-2 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"/>
                        </div>
                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
                            <input type="tel" id="phone" name="phone" required value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="mt-1 p-2 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"/>
                        </div>
                        <button type="submit" className="w-full bg-green-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-700 transition-colors">
                            Confirm Booking
                        </button>
                    </form>
                  )}
                </>
              ) : (
                <div className="flex items-center justify-center h-full bg-gray-100 rounded-lg text-center p-4">
                  <p className="text-gray-600">Please select a date from the calendar to see available times.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <style>{`
          @keyframes fade-in-up {
              0% { opacity: 0; transform: translateY(10px); }
              100% { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in-up {
              animation: fade-in-up 0.4s ease-out forwards;
          }
      `}</style>
    </section>
  );
};

// FIX: Add default export to the component.
export default Scheduler;
