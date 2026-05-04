import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const CHANNEL_NAME = "mental-compass-presentation-sync";
const MODE_PARAM = "sync";
const MODE_STORAGE_KEY = "mental-compass-sync-mode";

type SyncMode = "host" | "follow" | null;

type SyncMessage = {
  type: "presentation-sync";
  sourceId: string;
  pathname: string;
  search: string;
  hash: string;
  scrollRatio: number;
};

function getSyncMode(): SyncMode {
  if (typeof window === "undefined") {
    return null;
  }

  const params = new URLSearchParams(window.location.search);
  const queryMode = params.get(MODE_PARAM);

  if (queryMode === "host" || queryMode === "follow") {
    window.sessionStorage.setItem(MODE_STORAGE_KEY, queryMode);
    return queryMode;
  }

  if (queryMode === "off") {
    window.sessionStorage.removeItem(MODE_STORAGE_KEY);
    return null;
  }

  const storedMode = window.sessionStorage.getItem(MODE_STORAGE_KEY);
  return storedMode === "host" || storedMode === "follow" ? storedMode : null;
}

function getCleanSearch(search: string) {
  const params = new URLSearchParams(search);
  params.delete(MODE_PARAM);
  const cleanSearch = params.toString();
  return cleanSearch ? `?${cleanSearch}` : "";
}

function getScrollRatio() {
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;

  if (maxScroll <= 0) {
    return 0;
  }

  return Math.min(1, Math.max(0, window.scrollY / maxScroll));
}

function scrollToRatio(scrollRatio: number) {
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;

  window.scrollTo({
    top: Math.max(0, maxScroll * scrollRatio),
    left: 0,
    behavior: "smooth",
  });
}

export function PresentationSync() {
  const location = useLocation();
  const navigate = useNavigate();
  const channelRef = useRef<BroadcastChannel | null>(null);
  const frameRef = useRef<number | null>(null);
  const latestLocationRef = useRef(location);
  const modeRef = useRef<SyncMode>(null);
  const sourceIdRef = useRef(
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random()}`,
  );

  useEffect(() => {
    latestLocationRef.current = location;
  }, [location]);

  useEffect(() => {
    if (typeof BroadcastChannel === "undefined") {
      return;
    }

    const mode = getSyncMode();
    modeRef.current = mode;

    if (!mode) {
      return;
    }

    const channel = new BroadcastChannel(CHANNEL_NAME);
    channelRef.current = channel;

    channel.onmessage = (event: MessageEvent<SyncMessage>) => {
      const message = event.data;

      if (
        modeRef.current !== "follow" ||
        !message ||
        message.type !== "presentation-sync" ||
        message.sourceId === sourceIdRef.current
      ) {
        return;
      }

      const currentLocation = latestLocationRef.current;
      const currentTarget = `${currentLocation.pathname}${getCleanSearch(currentLocation.search)}${currentLocation.hash}`;
      const nextTarget = `${message.pathname}${message.search}${message.hash}`;

      if (currentTarget !== nextTarget) {
        navigate(nextTarget, { replace: true });
        window.setTimeout(() => scrollToRatio(message.scrollRatio), 120);
        return;
      }

      scrollToRatio(message.scrollRatio);
    };

    return () => {
      channel.close();
      channelRef.current = null;

      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
      }
    };
  }, [navigate]);

  useEffect(() => {
    if (modeRef.current !== "host") {
      return;
    }

    const sendState = () => {
      frameRef.current = null;
      const currentLocation = latestLocationRef.current;

      channelRef.current?.postMessage({
        type: "presentation-sync",
        sourceId: sourceIdRef.current,
        pathname: currentLocation.pathname,
        search: getCleanSearch(currentLocation.search),
        hash: currentLocation.hash,
        scrollRatio: getScrollRatio(),
      } satisfies SyncMessage);
    };

    const scheduleSend = () => {
      if (frameRef.current !== null) {
        return;
      }

      frameRef.current = window.requestAnimationFrame(sendState);
    };

    scheduleSend();
    window.addEventListener("scroll", scheduleSend, { passive: true });
    window.addEventListener("resize", scheduleSend);

    return () => {
      window.removeEventListener("scroll", scheduleSend);
      window.removeEventListener("resize", scheduleSend);

      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
    };
  }, [location]);

  return null;
}
