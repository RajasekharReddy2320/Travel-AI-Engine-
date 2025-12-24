import React, { useState } from 'react';
import { TripForm } from './components/TripForm';
import { Itinerary } from './components/Itinerary';
import { BudgetCharts } from './components/BudgetCharts';
import { TripMap } from './components/TripMap';
import { generateTrip } from './services/geminiService';
import { TripPreferences, TripPlan } from './types';
import { Map, Zap, DollarSign, ShieldCheck, CheckCircle, ArrowRight } from 'lucide-react';

export default function App() {
  const [plan, setPlan] = useState<TripPlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check if API key is present on mount (safely)
  React.useEffect(() => {
    try {
      if (!process.env.API_KEY) {
         console.warn("API_KEY environment variable is not set.");
      }
    } catch (e) {
      // Ignore reference error if process is not defined in the browser
      console.warn("Could not check process.env.API_KEY");
    }
  }, []);

  const handleTripGeneration = async (prefs: TripPreferences) => {
    setLoading(true);
    setError(null);
    setPlan(null);
    
    try {
      const generatedPlan = await generateTrip(prefs);
      setPlan(generatedPlan);
    } catch (err: any) {
      setError("Failed to generate trip plan. Please ensure your API key is valid and try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <Map className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900 tracking-tight">AI Trip Planner</span>
          </div>
          <div className="flex items-center space-x-6 text-sm font-medium text-slate-500">
             <div className="hidden md:flex items-center space-x-1">
               <Zap className="w-4 h-4 text-amber-500" />
               <span>Real-time Optimization</span>
             </div>
             <div className="hidden md:flex items-center space-x-1">
               <ShieldCheck className="w-4 h-4 text-emerald-500" />
               <span>Verified Data</span>
             </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Intro / Form Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          <div className="lg:col-span-4 space-y-8">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
               <h2 className="text-xl font-bold text-slate-900 mb-2">Create Your Journey</h2>
               <p className="text-slate-500 mb-6 text-sm">Our AI engine optimizes for budget, time, and luxury preferences instantly.</p>
               <TripForm onSubmit={handleTripGeneration} isLoading={loading} />
            </div>

            {/* Feature Highlights */}
            <div className="grid grid-cols-2 gap-4">
               <div className="bg-indigo-50 p-4 rounded-xl">
                 <DollarSign className="w-6 h-6 text-indigo-600 mb-2" />
                 <h4 className="font-semibold text-slate-900 text-sm">Budget Smart</h4>
                 <p className="text-xs text-slate-600 mt-1">Real-time cost tracking & minimization</p>
               </div>
               <div className="bg-emerald-50 p-4 rounded-xl">
                 <CheckCircle className="w-6 h-6 text-emerald-600 mb-2" />
                 <h4 className="font-semibold text-slate-900 text-sm">Zero Errors</h4>
                 <p className="text-xs text-slate-600 mt-1">Logically verified itineraries</p>
               </div>
            </div>
          </div>

          <div className="lg:col-span-8">
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8 rounded-r-lg">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {!plan && !loading && !error && (
              <div className="h-full flex flex-col items-center justify-center text-center p-12 bg-white rounded-3xl border-2 border-dashed border-slate-200 min-h-[500px]">
                <div className="bg-indigo-50 p-4 rounded-full mb-6">
                  <Map className="w-12 h-12 text-indigo-400" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Ready to Explore?</h3>
                <p className="text-slate-500 max-w-md mx-auto">
                  Enter your preferences on the left to generate a fully optimized, booking-ready travel plan in seconds.
                </p>
              </div>
            )}

            {loading && (
               <div className="h-full flex flex-col items-center justify-center text-center p-12 min-h-[500px]">
                  <div className="relative">
                    <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      <Map className="w-6 h-6 text-indigo-600" />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 mt-8">Designing your perfect trip...</h3>
                  <p className="text-slate-500 mt-2">Consulting live maps, checking prices, and optimizing routes.</p>
               </div>
            )}

            {plan && (
              <div className="space-y-8 animate-fade-in">
                {/* Trip Header */}
                <div className="bg-indigo-900 text-white p-8 rounded-3xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-indigo-800 rounded-full opacity-50 blur-3xl"></div>
                  <div className="relative z-10">
                    <div className="flex justify-between items-start">
                      <div>
                        <h1 className="text-3xl font-bold mb-2">{plan.tripName}</h1>
                        <div className="flex items-center space-x-4 text-indigo-200">
                          <span className="bg-indigo-800/50 px-3 py-1 rounded-full text-sm backdrop-blur-sm">
                            {plan.duration} Days
                          </span>
                          <span className="flex items-center">
                            <span className="mr-2">Luxury Score:</span>
                            {[...Array(5)].map((_, i) => (
                               <StarIcon key={i} filled={i < Math.round(plan.luxuryScore / 2)} />
                            ))}
                          </span>
                        </div>
                      </div>
                      <div className="text-right hidden sm:block">
                        <p className="text-sm text-indigo-300">Total Estimate</p>
                        <p className="text-3xl font-bold">${plan.costBreakdown.total.toLocaleString()}</p>
                      </div>
                    </div>
                    <p className="mt-6 text-indigo-100 max-w-2xl leading-relaxed">
                      {plan.summary}
                    </p>
                  </div>
                </div>

                {/* Map */}
                <TripMap plan={plan} />

                {/* Metrics */}
                <BudgetCharts costs={plan.costBreakdown} />

                {/* Itinerary */}
                <Itinerary plan={plan} />

                {/* Booking CTA */}
                <div className="fixed bottom-6 right-6 z-40 sm:absolute sm:bottom-auto sm:right-auto sm:relative sm:mt-12">
                   <button className="bg-emerald-600 hover:bg-emerald-700 text-white text-lg font-bold py-4 px-8 rounded-2xl shadow-xl hover:shadow-2xl shadow-emerald-500/20 transition-all transform hover:-translate-y-1 flex items-center w-full sm:w-auto justify-center">
                     Book Entire Trip
                     <ArrowRight className="ml-2 w-5 h-5" />
                   </button>
                   <p className="text-center sm:text-left text-xs text-slate-400 mt-2 sm:ml-1">
                     *One-click booking via integrated partners
                   </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

const StarIcon: React.FC<{ filled: boolean }> = ({ filled }) => {
  return (
    <svg className={`w-4 h-4 ${filled ? 'text-yellow-400 fill-current' : 'text-indigo-800'}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
    </svg>
  )
};