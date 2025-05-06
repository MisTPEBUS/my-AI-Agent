import { create } from "zustand";

type LatLng = { Lat: number; Lng: number };
type LocationState = {
  loading: boolean;
  location: LatLng | null;
  error: string | null;
  setLoading: (loading: boolean) => void;
  setLocation: (location: LatLng | null) => void;
  setError: (error: string | null) => void;
};

export const useLatLng = create<LocationState>((set) => ({
  loading: false,
  location: null,
  error: null,
  setLoading: (loading: boolean) => set({ loading }),
  setLocation: (location: LatLng | null) => set({ location }),
  setError: (error: string | null) => set({ error }),
}));
