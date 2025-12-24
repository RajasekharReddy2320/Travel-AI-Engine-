import { GoogleGenAI, Type, Schema } from "@google/genai";
import { TripPreferences, TripPlan } from "../types";

// The system instruction provided by the user in the prompt
const SYSTEM_INSTRUCTION_JSON = {
  "system_name": "AI Trip Planner & Budget Optimisation Engine",
  "system_role": "You are an intelligent AI Trip Planner designed to generate highly accurate, optimized, and real-world travel plans. You must continuously optimize trips based on budget, time, and luxury preferences while ensuring zero logical errors. RETURN JSON ONLY.",
  "core_objectives": [
    "Generate travel itineraries using real-time data logic.",
    "Optimize trips primarily for budget, time efficiency, and luxury preferences.",
    "Ensure maximum accuracy.",
    "Provide booking-ready details."
  ],
  "response_guidelines": {
    "tone": "clear, professional, and user-friendly",
    "constraints": [
      "Use only verified data logic",
      "No hallucinations",
      "No fake pricing or locations"
    ]
  }
};

const RESPONSE_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    tripName: { type: Type.STRING },
    destination: { type: Type.STRING },
    duration: { type: Type.INTEGER },
    summary: { type: Type.STRING },
    luxuryScore: { type: Type.NUMBER, description: "Score from 1 to 10" },
    timeEfficiencyScore: { type: Type.NUMBER, description: "Score from 1 to 10" },
    costBreakdown: {
      type: Type.OBJECT,
      properties: {
        transport: { type: Type.NUMBER },
        accommodation: { type: Type.NUMBER },
        food: { type: Type.NUMBER },
        activities: { type: Type.NUMBER },
        hiddenCosts: { type: Type.NUMBER },
        total: { type: Type.NUMBER }
      },
      required: ["transport", "accommodation", "food", "activities", "hiddenCosts", "total"]
    },
    days: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          day: { type: Type.INTEGER },
          theme: { type: Type.STRING },
          activities: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                time: { type: Type.STRING },
                activity: { type: Type.STRING },
                description: { type: Type.STRING },
                costEstimate: { type: Type.NUMBER },
                type: { type: Type.STRING, enum: ['food', 'transport', 'accommodation', 'activity', 'other'] },
                location: { type: Type.STRING },
                coordinates: {
                  type: Type.OBJECT,
                  properties: {
                    lat: { type: Type.NUMBER },
                    lng: { type: Type.NUMBER }
                  },
                  required: ["lat", "lng"]
                }
              },
              required: ["time", "activity", "description", "costEstimate", "type", "location", "coordinates"]
            }
          }
        },
        required: ["day", "theme", "activities"]
      }
    }
  },
  required: ["tripName", "destination", "duration", "summary", "days", "costBreakdown", "luxuryScore", "timeEfficiencyScore"]
};

export const generateTrip = async (prefs: TripPreferences): Promise<TripPlan> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const destString = prefs.destinations.join(', ');

  const userPrompt = `
    Plan a trip starting from origin: "${prefs.origin}" and visiting these destinations: "${destString}".
    Total Duration: ${prefs.duration} days.
    Travelers: ${prefs.travelers}.
    Budget Limit: $${prefs.budget} (Total including travel from origin).
    Luxury Level: ${prefs.luxuryLevel}.
    Interests: ${prefs.interests}.

    Please generate a detailed day-by-day itinerary with realistic costs, specific locations, and time optimization.
    Ensure the total cost is close to or under the budget limit of $${prefs.budget}.
    Include flight/transport costs from ${prefs.origin} to the first destination and between destinations in the transport cost breakdown.
    IMPORTANT: Provide estimated GPS coordinates (latitude, longitude) for every activity location to plot on a map.
    Use the 'googleSearch' tool to verify current prices and locations if needed, but return the final result in the specified JSON schema.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: userPrompt,
      config: {
        systemInstruction: JSON.stringify(SYSTEM_INSTRUCTION_JSON),
        responseMimeType: "application/json",
        responseSchema: RESPONSE_SCHEMA,
        tools: [{ googleSearch: {} }] // Enable Grounding
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response generated from AI");
    }

    return JSON.parse(text) as TripPlan;
  } catch (error) {
    console.error("Trip generation error:", error);
    throw error;
  }
};