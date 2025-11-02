// --- Shared Type Definitions for the Trip Planner Application ---

// Interface for a single packing list item
export interface PackingListItem {
  _id: string;
  item: string;
  packed: boolean;
}

// Your main Trip interface
export interface Trip {
  _id: string;
  name: string;
  description?: string;
  destination: {
    city: string;
    country: string;
  };
  startDate: string;
  endDate: string;
  budget: {
    total: number;
    currency: string;
    spent: number;
  };
  status: string;
  travelers: {
    name: string;
    email: string;
    role: string;
  }[];
  notes?: string;
  tags: string[];
  packingList: PackingListItem[];
}

// -----------------------------------------------------------
// --- Weather/Timezone Interfaces (Used by WeatherWidget) ---
// -----------------------------------------------------------

export interface DailyWeather {
  time: string[];
  weathercode: number[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
}

// 🚨 CRITICAL FIX: Made all properties optional to handle data lookup failures
export interface TimezoneData {
  datetime?: string;
  abbreviation?: string;
  timezone?: string;
  utc_offset?: string;
}

// 🚨 CRITICAL FIX: The core data structure returned by the /api/weather endpoint
// The 'timezone' property MUST allow 'null' to be compatible with the backend.
export interface ApiData {
  weather: DailyWeather;
  timezone: TimezoneData | null;
}
