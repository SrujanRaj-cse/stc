import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback, // Import useCallback
  useMemo, // Import useMemo
} from "react";
import axios from "../services/api";
import { Trip } from "../types/trip";

interface TripContextType {
  trips: Trip[];
  currentTrip: Trip | null;
  loading: boolean;
  fetchTrips: () => Promise<void>;
  fetchTrip: (id: string) => Promise<void>;
  createTrip: (tripData: Partial<Trip>) => Promise<Trip>;
  updateTrip: (id: string, tripData: Partial<Trip>) => Promise<Trip>;
  deleteTrip: (id: string) => Promise<void>;
  setCurrentTrip: (trip: Trip | null) => void;
}

const TripContext = createContext<TripContextType | undefined>(undefined);

export const useTrip = () => {
  const context = useContext(TripContext);
  if (!context) throw new Error("useTrip must be used within TripProvider");
  return context;
};

interface TripProviderProps {
  children: ReactNode;
}

export const TripProvider: React.FC<TripProviderProps> = ({ children }) => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [currentTrip, setCurrentTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(false);

  // --- FIX 1: Wrap all async functions in useCallback ---

  const fetchTrips = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/trips");
      setTrips(res.data.trips);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []); // Empty dependency array means this function is created once

  const fetchTrip = useCallback(async (id: string) => {
    try {
      setLoading(true);
      const res = await axios.get(`/api/trips/${id}`);
      setCurrentTrip(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []); // Empty dependency array

  const createTrip = useCallback(
    async (tripData: Partial<Trip>): Promise<Trip> => {
      const res = await axios.post("/api/trips", tripData);
      const newTrip: Trip = res.data;
      setTrips((prev) => [newTrip, ...prev]);
      return newTrip;
    },
    []
  ); // Empty dependency array

  const updateTrip = useCallback(
    async (id: string, tripData: Partial<Trip>): Promise<Trip> => {
      const res = await axios.put(`/api/trips/${id}`, tripData);
      const updatedTrip: Trip = res.data;
      setTrips((prev) => prev.map((t) => (t._id === id ? updatedTrip : t)));
      // Use functional update to avoid dependency on currentTrip
      setCurrentTrip((prev) => (prev?._id === id ? updatedTrip : prev));
      return updatedTrip;
    },
    [] // Empty dependency array
  );

  const deleteTrip = useCallback(async (id: string) => {
    await axios.delete(`/api/trips/${id}`);
    setTrips((prev) => prev.filter((t) => t._id !== id));
    // Use functional update to avoid dependency on currentTrip
    setCurrentTrip((prev) => (prev?._id === id ? null : prev));
  }, []); // Empty dependency array

  // --- FIX 2: Memoize the context value object ---
  const value = useMemo(
    () => ({
      trips,
      currentTrip,
      loading,
      fetchTrips,
      fetchTrip,
      createTrip,
      updateTrip,
      deleteTrip,
      setCurrentTrip, // This is a state setter, it's already stable
    }),
    [
      trips,
      currentTrip,
      loading,
      fetchTrips,
      fetchTrip,
      createTrip,
      updateTrip,
      deleteTrip,
    ]
  );

  return <TripContext.Provider value={value}>{children}</TripContext.Provider>;
};
