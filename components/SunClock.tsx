"use client";

import { useState, useEffect } from "react";
import { useGeolocation } from "@/hooks/useGeolocation";
import { useSunriseSunset } from "@/hooks/useSunriseSunset";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function SunClock() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const { location, error: locationError } = useGeolocation();
  const { sunData, error: sunDataError } = useSunriseSunset(location);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimeDifference = (date: Date) => {
    const diff = Math.abs(currentTime.getTime() - date.getTime());
    const hours = Math.floor(diff / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  const getNextEvent = () => {
    if (!sunData) return null;
    const now = currentTime.getTime();
    const sunrise = sunData.sunrise.getTime();
    const sunset = sunData.sunset.getTime();

    if (now < sunrise) {
      return { type: "Sunrise", time: sunData.sunrise };
    } else if (now < sunset) {
      return { type: "Sunset", time: sunData.sunset };
    } else {
      // Next sunrise is tomorrow
      const nextSunrise = new Date(sunData.sunrise);
      nextSunrise.setDate(nextSunrise.getDate() + 1);
      return { type: "Sunrise", time: nextSunrise };
    }
  };

  const getLastEvent = () => {
    if (!sunData) return null;
    const now = currentTime.getTime();
    const sunrise = sunData.sunrise.getTime();
    const sunset = sunData.sunset.getTime();

    if (now < sunrise) {
      // Last sunset was yesterday
      const lastSunset = new Date(sunData.sunset);
      lastSunset.setDate(lastSunset.getDate() - 1);
      return { type: "Sunset", time: lastSunset };
    } else if (now < sunset) {
      return { type: "Sunrise", time: sunData.sunrise };
    } else {
      return { type: "Sunset", time: sunData.sunset };
    }
  };

  const nextEvent = getNextEvent();
  const lastEvent = getLastEvent();

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center">Sun Clock</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center space-y-4">
          <p className="text-4xl font-bold font-mono">
            {currentTime.toLocaleTimeString("en-US", { hour12: false })}
          </p>
          {locationError && (
            <p className="text-yellow-500" role="alert">
              {locationError}
            </p>
          )}
          {sunDataError ? (
            <p className="text-red-500" role="alert">
              {sunDataError}
            </p>
          ) : sunData ? (
            <>
              <div>
                <p>Time since last {lastEvent?.type}:</p>
                <p className="text-2xl font-semibold font-mono">
                  {lastEvent ? formatTimeDifference(lastEvent.time) : "N/A"}
                </p>
              </div>
              <div>
                <p>Time until next {nextEvent?.type}:</p>
                <p className="text-2xl font-semibold font-mono">
                  {nextEvent ? formatTimeDifference(nextEvent.time) : "N/A"}
                </p>
              </div>
            </>
          ) : (
            <>
              <Skeleton className="h-4 w-[250px] mx-auto" />
              <Skeleton className="h-8 w-[200px] mx-auto" />
              <Skeleton className="h-4 w-[250px] mx-auto" />
              <Skeleton className="h-8 w-[200px] mx-auto" />
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
