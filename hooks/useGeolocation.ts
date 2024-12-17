"use client";

import { useState, useEffect } from "react";
import { GeolocationData } from "@/lib/types";

// Add Milan's coordinates as default
const MILAN_COORDINATES: GeolocationData = {
  latitude: 45.4642,
  longitude: 9.19,
};

export function useGeolocation() {
  const [location, setLocation] = useState<GeolocationData>(MILAN_COORDINATES);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      () => {
        setError("Unable to retrieve your location, using Milan as default");
      }
    );
  }, []);

  return { location, error };
}
