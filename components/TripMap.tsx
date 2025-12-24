import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { TripPlan } from '../types';

interface TripMapProps {
  plan: TripPlan;
}

export const TripMap: React.FC<TripMapProps> = ({ plan }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layerGroupRef = useRef<L.LayerGroup | null>(null);

  // Custom marker icon to avoid 404s with default leaflet assets in some bundlers
  const customIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return; // Prevent double initialization

    const map = L.map(mapContainerRef.current).setView([20, 0], 2);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Create a LayerGroup to hold all markers/lines for easy clearing
    const layerGroup = L.layerGroup().addTo(map);
    
    mapInstanceRef.current = map;
    layerGroupRef.current = layerGroup;

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        layerGroupRef.current = null;
      }
    };
  }, []);

  // Update Map Content
  useEffect(() => {
    const map = mapInstanceRef.current;
    const layerGroup = layerGroupRef.current;

    if (!map || !layerGroup) return;

    // Clear previous markers and routes
    layerGroup.clearLayers();

    const points: L.LatLng[] = [];

    plan.days.forEach((day) => {
      day.activities.forEach((activity) => {
        if (activity.coordinates && activity.coordinates.lat && activity.coordinates.lng) {
          const lat = activity.coordinates.lat;
          const lng = activity.coordinates.lng;
          const latLng = L.latLng(lat, lng);
          points.push(latLng);

          const marker = L.marker(latLng, { icon: customIcon })
            .bindPopup(`
              <div class="min-w-[200px]">
                <strong class="block text-sm font-semibold mb-1">Day ${day.day}: ${activity.activity}</strong>
                <p class="text-xs text-slate-600 mb-2">${activity.location}</p>
                <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(activity.location)}" 
                   target="_blank" 
                   rel="noopener noreferrer" 
                   class="text-xs text-indigo-600 hover:text-indigo-800 font-medium flex items-center">
                   View on Google Maps &rarr;
                </a>
              </div>
            `);
          
          marker.addTo(layerGroup);
        }
      });
    });

    // Draw lines between points to show the route
    if (points.length > 1) {
      L.polyline(points, { color: '#4f46e5', weight: 3, opacity: 0.7, dashArray: '5, 10' }).addTo(layerGroup);
    }

    // Fit bounds to show all markers
    if (points.length > 0) {
      const bounds = L.latLngBounds(points);
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [plan]);

  return (
    <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 mb-8">
      <h3 className="text-lg font-semibold text-slate-800 mb-4">Trip Map Overview</h3>
      <div ref={mapContainerRef} className="h-96 w-full rounded-xl z-0" />
    </div>
  );
};