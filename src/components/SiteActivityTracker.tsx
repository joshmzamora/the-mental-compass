import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useUserProfile } from "../contexts/UserProfileContext";

const ACTIVE_TIME_INTERVAL_SECONDS = 30;

export function SiteActivityTracker() {
  const location = useLocation();
  const { user } = useAuth();
  const { profile, trackActiveTime, trackPageView } = useUserProfile();
  const lastTrackedPathRef = useRef<string | null>(null);

  useEffect(() => {
    if (!user || !profile) {
      lastTrackedPathRef.current = null;
      return;
    }

    const pathWithSearch = `${location.pathname}${location.search}`;
    if (lastTrackedPathRef.current === pathWithSearch) {
      return;
    }

    lastTrackedPathRef.current = pathWithSearch;
    void trackPageView(location.pathname);
  }, [location.pathname, location.search, profile, trackPageView, user]);

  useEffect(() => {
    if (!user || !profile) {
      return;
    }

    const intervalId = window.setInterval(() => {
      if (document.visibilityState !== "visible") {
        return;
      }

      void trackActiveTime(ACTIVE_TIME_INTERVAL_SECONDS);
    }, ACTIVE_TIME_INTERVAL_SECONDS * 1000);

    return () => window.clearInterval(intervalId);
  }, [profile, trackActiveTime, user]);

  return null;
}
