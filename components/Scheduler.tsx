
import React, { useState, useMemo } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from './Icon';

const Scheduler: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [selectedTime, setSelectedTime] = useState('');
  const [isBooked, setIsBooked] = useState(false);

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
  };

  const timeSlots = ["9:00 AM", "11:00 AM", "1:00 PM", "3:00 PM"];

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
          <section id="schedule" className="py-16 md:py-24 bg-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-2xl">
                <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
                    Appointment Confirmed!
                </h2>
                <p className="mt-4 text-lg text-gray-600">
                    Thank you! Your free inspection is booked for <span className="font-bold text-blue-600">{selectedDate?.toLocaleDateString()} at {selectedTime}</span>. You'll receive a confirmation email shortly.
                </p>
                <button onClick={() => {setIsBooked(false); setSelectedTime('');}} className="mt-8 bg-blue-600 text-white font-bold py-3 px-8 rounded-lg shadow-lg hover:bg-blue-700 transition-all">
                    Schedule Another
                </button>
            </div>
          </section>
      );
  }

  return (
    <section id="schedule" className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
            Book Your Free Inspection
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">
            No waiting, no phone calls. Pick a time that works for you, and we'll be there.
          </p>
        </div>

        <div className="max-w-4xl mx-auto bg-gray-50 p-4 sm:p-8 rounded-2xl shadow-xl border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Calendar */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <button onClick={prevMonth} className="p-2 rounded-full hover:bg-gray-200"><ChevronLeftIcon className="w-6 h-6" /></button>
                <h3 className="text-lg font-semibold">{monthName} {year}</h3>
                <button onClick={nextMonth} className="p-2 rounded-full hover:bg-gray-200"><ChevronRightIcon className="w-6 h-6" /></button>
              </div>
              <div className="grid grid-cols-7 gap-2 text-sm">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => <div key={day} className="font-bold text-center text-gray-500">{day}</div>)}
                {calendarDays}
              </div>
            </div>

            {/* Time Slots & Form */}
            <div>
              <h3 className="text-lg font-semibold mb-4">
                Available Times for <span className="text-blue-600">{selectedDate?.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
              </h3>
              {selectedDate ? (
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-2 gap-4 mb-6">
                    {timeSlots.map(time => (
                        <button
                        key={time}
                        type="button"
                        onClick={() => setSelectedTime(time)}
                        className={`p-3 text-center rounded-lg border-2 transition-colors ${
                            selectedTime === time 
                            ? 'bg-blue-600 text-white border-blue-600' 
                            : 'bg-white border-gray-300 hover:border-blue-500'
                        }`}
                        >
                        {time}
                        </button>
                    ))}
                    </div>
                    {selectedTime && (
                         <div className="space-y-4 animate-fade-in">
                            <input type="text" placeholder="Full Name" required className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                            <input type="email" placeholder="Email Address" required className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                            <input type="tel" placeholder="Phone Number" required className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                            <button type="submit" className="w-full bg-green-600 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:bg-green-700 transition-colors">
                                Confirm Appointment
                            </button>
                        </div>
                    )}
                </form>
              ) : (
                <p className="text-gray-500">Please select a date from the calendar.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Scheduler;
