import React, { useState } from 'react';
import { TripPreferences, LuxuryLevel } from '../types';
import { Plane, Calendar, DollarSign, Users, Star, Sparkles, MapPin, Plus, X } from 'lucide-react';

interface TripFormProps {
  onSubmit: (prefs: TripPreferences) => void;
  isLoading: boolean;
}

export const TripForm: React.FC<TripFormProps> = ({ onSubmit, isLoading }) => {
  const [origin, setOrigin] = useState('New York, USA');
  const [destinations, setDestinations] = useState<string[]>(['Tokyo, Japan']);
  const [newDestination, setNewDestination] = useState('');
  
  const [duration, setDuration] = useState(5);
  const [budget, setBudget] = useState(3000);
  const [travelers, setTravelers] = useState(2);
  const [luxuryLevel, setLuxuryLevel] = useState<LuxuryLevel>(LuxuryLevel.MODERATE);
  const [interests, setInterests] = useState('Food, Culture, Tech, Nature');

  const handleAddDestination = () => {
    if (newDestination.trim()) {
      setDestinations([...destinations, newDestination.trim()]);
      setNewDestination('');
    }
  };

  const handleRemoveDestination = (index: number) => {
    setDestinations(destinations.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddDestination();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (destinations.length === 0) {
      alert("Please add at least one destination.");
      return;
    }
    onSubmit({
      origin,
      destinations,
      duration,
      budget,
      travelers,
      luxuryLevel,
      interests
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-6">
        {/* Origin */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700">From (Origin)</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MapPin className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              required
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              className="pl-10 block w-full rounded-xl border-slate-200 bg-slate-50 focus:border-indigo-500 focus:ring-indigo-500 transition-all p-3 text-sm"
              placeholder="e.g. New York, USA"
            />
          </div>
        </div>

        {/* Destinations */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700">Destinations</label>
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              {destinations.map((dest, index) => (
                <div key={index} className="inline-flex items-center bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-lg text-sm font-medium border border-indigo-100 group">
                  <Plane className="w-3 h-3 mr-2" />
                  {dest}
                  <button
                    type="button"
                    onClick={() => handleRemoveDestination(index)}
                    className="ml-2 text-indigo-400 hover:text-indigo-600 focus:outline-none"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
            
            <div className="relative flex items-center">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Plane className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="text"
                value={newDestination}
                onChange={(e) => setNewDestination(e.target.value)}
                onKeyDown={handleKeyDown}
                className="pl-10 block w-full rounded-l-xl border-slate-200 bg-slate-50 focus:border-indigo-500 focus:ring-indigo-500 transition-all p-3 text-sm"
                placeholder="Add a destination (e.g. Paris)"
              />
              <button
                type="button"
                onClick={handleAddDestination}
                className="bg-slate-800 hover:bg-slate-900 text-white px-4 py-3 rounded-r-xl transition-colors border-l border-slate-700 flex items-center"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
             <p className="text-xs text-slate-400">Press Enter or click + to add multiple destinations</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Duration */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">Duration (Days)</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Calendar className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="number"
                min="1"
                max="30"
                required
                value={duration}
                onChange={(e) => setDuration(parseInt(e.target.value))}
                className="pl-10 block w-full rounded-xl border-slate-200 bg-slate-50 focus:border-indigo-500 focus:ring-indigo-500 transition-all p-3 text-sm"
              />
            </div>
          </div>

          {/* Travelers */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">Travelers</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Users className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="number"
                min="1"
                max="10"
                required
                value={travelers}
                onChange={(e) => setTravelers(parseInt(e.target.value))}
                className="pl-10 block w-full rounded-xl border-slate-200 bg-slate-50 focus:border-indigo-500 focus:ring-indigo-500 transition-all p-3 text-sm"
              />
            </div>
          </div>

          {/* Budget */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">Total Budget ($)</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <DollarSign className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="number"
                min="500"
                step="100"
                required
                value={budget}
                onChange={(e) => setBudget(parseInt(e.target.value))}
                className="pl-10 block w-full rounded-xl border-slate-200 bg-slate-50 focus:border-indigo-500 focus:ring-indigo-500 transition-all p-3 text-sm"
              />
            </div>
          </div>

          {/* Luxury Level */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">Luxury Level</label>
            <div className="relative">
               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Star className="h-5 w-5 text-slate-400" />
              </div>
              <select
                value={luxuryLevel}
                onChange={(e) => setLuxuryLevel(e.target.value as LuxuryLevel)}
                className="pl-10 block w-full rounded-xl border-slate-200 bg-slate-50 focus:border-indigo-500 focus:ring-indigo-500 transition-all p-3 text-sm appearance-none"
              >
                {Object.values(LuxuryLevel).map((level) => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Interests */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700">Interests</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Sparkles className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              value={interests}
              onChange={(e) => setInterests(e.target.value)}
              className="pl-10 block w-full rounded-xl border-slate-200 bg-slate-50 focus:border-indigo-500 focus:ring-indigo-500 transition-all p-3 text-sm"
              placeholder="e.g. Museums, Hiking"
            />
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className={`w-full flex items-center justify-center py-4 px-6 border border-transparent rounded-xl shadow-lg text-base font-medium text-white transition-all duration-200 ${
          isLoading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-indigo-500/30 transform hover:-translate-y-0.5'
        }`}
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Optimizing Your Trip...
          </>
        ) : (
          <>
            <Sparkles className="w-5 h-5 mr-2" />
            Generate Optimized Itinerary
          </>
        )}
      </button>
    </form>
  );
};