import { useState, useEffect } from "react";
import { SunriseSunsetData, GeolocationData } from "../lib/types";

export function useSunriseSunset(location: GeolocationData | null) {
  const [sunData, setSunData] = useState<SunriseSunsetData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!location) return;

    const fetchSunriseSunset = async () => {
      try {
        const response = await fetch(
          `https://api.sunrise-sunset.org/json?lat=${location.latitude}&lng=${location.longitude}&formatted=0`
        );
        const data = await response.json();

        if (data.status === "OK") {
          setSunData({
            sunrise: new Date(data.results.sunrise),
            sunset: new Date(data.results.sunset),
          });
        } else {
          setError("Failed to fetch sunrise/sunset data");
        }
      } catch (err) {
        setError("An error occurred while fetching sunrise/sunset data");
      }
    };

    fetchSunriseSunset();
  }, [location]);

  return { sunData, error };
}
