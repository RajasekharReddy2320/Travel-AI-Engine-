import React, { useState } from 'react';
import { TripPlan, Activity } from '../types';
import { MapPin, Clock, DollarSign, Hotel, Car, Utensils, Camera, Info, ExternalLink } from 'lucide-react';

interface ItineraryProps {
  plan: TripPlan;
}

const ActivityIcon = ({ type }: { type: Activity['type'] }) => {
  switch (type) {
    case 'accommodation': return <Hotel className="w-5 h-5 text-blue-500" />;
    case 'transport': return <Car className="w-5 h-5 text-orange-500" />;
    case 'food': return <Utensils className="w-5 h-5 text-red-500" />;
    case 'activity': return <Camera className="w-5 h-5 text-green-500" />;
    default: return <Info className="w-5 h-5 text-slate-500" />;
  }
};

export const Itinerary: React.FC<ItineraryProps> = ({ plan }) => {
  const [activeDay, setActiveDay] = useState<number>(1);

  return (
    <div className="space-y-6">
      <div className="flex overflow-x-auto space-x-2 pb-2 scrollbar-hide">
        {plan.days.map((day) => (
          <button
            key={day.day}
            onClick={() => setActiveDay(day.day)}
            className={`flex-shrink-0 px-6 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
              activeDay === day.day
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            Day {day.day}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        {plan.days.filter(d => d.day === activeDay).map((day) => (
          <div key={day.day} className="space-y-8">
            <div className="border-b border-slate-100 pb-4">
              <h3 className="text-2xl font-bold text-slate-900">Day {day.day}: {day.theme}</h3>
            </div>

            <div className="relative border-l-2 border-indigo-100 ml-3 space-y-8">
              {day.activities.map((activity, idx) => (
                <div key={idx} className="ml-6 relative">
                  <div className="absolute -left-[31px] top-0 bg-white border-2 border-indigo-100 rounded-full p-1.5">
                    <ActivityIcon type={activity.type} />
                  </div>
                  
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between group">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                          {activity.time}
                        </span>
                        <h4 className="font-semibold text-slate-900">{activity.activity}</h4>
                      </div>
                      <p className="text-slate-600 text-sm mb-3 leading-relaxed">{activity.description}</p>
                      
                      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                        <div className="flex items-center">
                           <a 
                             href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(activity.location)}`}
                             target="_blank"
                             rel="noopener noreferrer"
                             className="flex items-center hover:text-indigo-600 transition-colors"
                             title="View on Google Maps"
                           >
                              <MapPin className="w-3 h-3 mr-1" />
                              <span className="underline decoration-dotted">{activity.location}</span>
                              <ExternalLink className="w-3 h-3 ml-1 opacity-50" />
                           </a>
                        </div>
                        <div className="flex items-center font-medium text-slate-700">
                          <DollarSign className="w-3 h-3 mr-0.5" />
                          {activity.costEstimate}
                        </div>
                      </div>
                    </div>

                    <button className="mt-4 sm:mt-0 sm:ml-4 opacity-0 group-hover:opacity-100 transition-opacity bg-indigo-50 text-indigo-700 text-xs font-semibold px-4 py-2 rounded-lg hover:bg-indigo-100">
                      Book Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};