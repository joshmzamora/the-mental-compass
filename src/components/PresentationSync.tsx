import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const CHANNEL_NAME = "mental-compass-presentation-sync";
const MODE_PARAM = "sync";
const MODE_STORAGE_KEY = "mental-compass-sync-mode";

type SyncMode = "host" | "follow" | null;

type PageStateMessage = {
  type: "presentation-sync";
  sourceId: string;
  pathname: string;
  search: string;
  hash: string;
  scrollRatio: number;
  anchorSelector?: string;
  anchorRatio?: number;
};

type ClickMessage = {
  type: "presentation-click";
  sourceId: string;
  selector: string;
};

type InputMessage = {
  type: "presentation-input";
  sourceId: string;
  selector: string;
  value: string;
  checked?: boolean;
  selectedIndex?: number;
};

type ElementScrollMessage = {
  type: "presentation-element-scroll";
  sourceId: string;
  selector: string;
  scrollRatio: number;
};

type SyncMessage = PageStateMessage | ClickMessage | InputMessage | ElementScrollMessage;

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
    behavior: "auto",
  });
}

function getElementPageTop(element: Element) {
  return element.getBoundingClientRect().top + window.scrollY;
}

function escapeSelector(value: string) {
  if (typeof CSS !== "undefined" && "escape" in CSS) {
    return CSS.escape(value);
  }

  return value.replace(/["\\#.:,[\]>+~*'=]/g, "\\$&");
}

function getElementSelector(element: Element) {
  if (element.id) {
    return `#${escapeSelector(element.id)}`;
  }

  const selectorParts: string[] = [];
  let currentElement: Element | null = element;

  while (currentElement && currentElement !== document.body) {
    const tagName = currentElement.tagName.toLowerCase();
    const stableAttribute =
      currentElement.getAttribute("name") ||
      currentElement.getAttribute("aria-label") ||
      currentElement.getAttribute("value") ||
      currentElement.getAttribute("data-value") ||
      currentElement.getAttribute("data-sync-section") ||
      currentElement.getAttribute("data-slot") ||
      currentElement.getAttribute("href") ||
      currentElement.getAttribute("data-sync-target");

    let selector = tagName;

    if (stableAttribute) {
      const attributeName = currentElement.hasAttribute("name")
        ? "name"
        : currentElement.hasAttribute("aria-label")
          ? "aria-label"
          : currentElement.hasAttribute("value")
            ? "value"
            : currentElement.hasAttribute("data-value")
              ? "data-value"
              : currentElement.hasAttribute("data-sync-section")
                ? "data-sync-section"
                : currentElement.hasAttribute("data-slot")
                  ? "data-slot"
                  : currentElement.hasAttribute("href")
                    ? "href"
                    : "data-sync-target";

      selector += `[${attributeName}="${escapeSelector(stableAttribute)}"]`;
    } else if (currentElement.parentElement) {
      const siblings = Array.from(currentElement.parentElement.children).filter(
        (sibling) => sibling.tagName === currentElement?.tagName,
      );

      if (siblings.length > 1) {
        selector += `:nth-of-type(${siblings.indexOf(currentElement) + 1})`;
      }
    }

    selectorParts.unshift(selector);
    currentElement = currentElement.parentElement;
  }

  return selectorParts.length ? selectorParts.join(" > ") : null;
}

function getActiveScrollAnchor() {
  const anchorElements = Array.from(
    document.querySelectorAll<HTMLElement>(
      "[data-sync-section], main > section, main > div, section[id]",
    ),
  ).filter((element) => {
    const rect = element.getBoundingClientRect();
    return rect.height > 80 && rect.bottom > 0 && rect.top < window.innerHeight;
  });

  if (!anchorElements.length) {
    return null;
  }

  const targetLine = window.innerHeight * 0.38;
  const activeElement =
    anchorElements.find((element) => {
      const rect = element.getBoundingClientRect();
      return rect.top <= targetLine && rect.bottom >= targetLine;
    }) ??
    anchorElements.reduce((closest, element) => {
      const closestDistance = Math.abs(
        closest.getBoundingClientRect().top - targetLine,
      );
      const elementDistance = Math.abs(
        element.getBoundingClientRect().top - targetLine,
      );
      return elementDistance < closestDistance ? element : closest;
    });

  const selector = getElementSelector(activeElement);

  if (!selector) {
    return null;
  }

  const rect = activeElement.getBoundingClientRect();
  const anchorRatio = Math.min(
    1,
    Math.max(0, (targetLine - rect.top) / Math.max(1, rect.height)),
  );

  return { selector, anchorRatio };
}

function scrollToAnchor(message: PageStateMessage) {
  if (!message.anchorSelector || message.anchorRatio === undefined) {
    scrollToRatio(message.scrollRatio);
    return;
  }

  const element = document.querySelector(message.anchorSelector);

  if (!element) {
    window.setTimeout(() => scrollToAnchor(message), 60);
    return;
  }

  const targetLine = window.innerHeight * 0.38;
  const top =
    getElementPageTop(element) +
    element.getBoundingClientRect().height * message.anchorRatio -
    targetLine;

  window.scrollTo({
    top: Math.max(0, top),
    left: 0,
    behavior: "auto",
  });
}

function getInteractiveElement(target: EventTarget | null) {
  if (!(target instanceof Element)) {
    return null;
  }

  return target.closest(
    [
      "[data-sync-target]",
      "a[href]",
      "button",
      "summary",
      "select",
      "label",
      "input[type='checkbox']",
      "input[type='radio']",
      "[role='button']",
      "[role='tab']",
      ".cursor-pointer",
    ].join(","),
  );
}

function getEditableElement(target: EventTarget | null) {
  if (!(target instanceof Element)) {
    return null;
  }

  const editableElement = target.closest("input, textarea, select, [contenteditable='true']");

  if (
    editableElement instanceof HTMLInputElement &&
    editableElement.type === "password"
  ) {
    return null;
  }

  return editableElement;
}

function setNativeValue(element: HTMLInputElement | HTMLTextAreaElement, value: string) {
  const prototype = Object.getPrototypeOf(element);
  const valueSetter = Object.getOwnPropertyDescriptor(prototype, "value")?.set;
  valueSetter?.call(element, value);
}

function applyInputMessage(message: InputMessage) {
  const element = document.querySelector(message.selector);

  if (!element) {
    window.setTimeout(() => applyInputMessage(message), 60);
    return;
  }

  if (element instanceof HTMLInputElement) {
    if (element.type === "checkbox" || element.type === "radio") {
      element.checked = Boolean(message.checked);
    } else {
      setNativeValue(element, message.value);
    }
  } else if (element instanceof HTMLTextAreaElement) {
    setNativeValue(element, message.value);
  } else if (element instanceof HTMLSelectElement) {
    element.selectedIndex = message.selectedIndex ?? element.selectedIndex;
    element.value = message.value;
  } else if (element instanceof HTMLElement && element.isContentEditable) {
    element.textContent = message.value;
  }

  element.dispatchEvent(new Event("input", { bubbles: true }));
  element.dispatchEvent(new Event("change", { bubbles: true }));
}

function getElementScrollRatio(element: Element) {
  const maxScroll = element.scrollHeight - element.clientHeight;

  if (maxScroll <= 0) {
    return 0;
  }

  return Math.min(1, Math.max(0, element.scrollTop / maxScroll));
}

function scrollElementToRatio(message: ElementScrollMessage) {
  const element = document.querySelector(message.selector);

  if (!element) {
    window.setTimeout(() => scrollElementToRatio(message), 60);
    return;
  }

  const maxScroll = element.scrollHeight - element.clientHeight;
  element.scrollTop = Math.max(0, maxScroll * message.scrollRatio);
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
        message.sourceId === sourceIdRef.current
      ) {
        return;
      }

      if (message.type === "presentation-click") {
        const element = document.querySelector<HTMLElement>(message.selector);

        if (element) {
          element.click();
        } else {
          window.setTimeout(() => {
            document.querySelector<HTMLElement>(message.selector)?.click();
          }, 60);
        }

        return;
      }

      if (message.type === "presentation-input") {
        applyInputMessage(message);
        return;
      }

      if (message.type === "presentation-element-scroll") {
        scrollElementToRatio(message);
        return;
      }

      const currentLocation = latestLocationRef.current;
      const currentTarget = `${currentLocation.pathname}${getCleanSearch(currentLocation.search)}${currentLocation.hash}`;
      const nextTarget = `${message.pathname}${message.search}${message.hash}`;

      if (currentTarget !== nextTarget) {
        navigate(nextTarget, { replace: true });
        window.setTimeout(() => scrollToAnchor(message), 40);
        return;
      }

      scrollToAnchor(message);
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
      const activeAnchor = getActiveScrollAnchor();

      channelRef.current?.postMessage({
        type: "presentation-sync",
        sourceId: sourceIdRef.current,
        pathname: currentLocation.pathname,
        search: getCleanSearch(currentLocation.search),
        hash: currentLocation.hash,
        scrollRatio: getScrollRatio(),
        anchorSelector: activeAnchor?.selector,
        anchorRatio: activeAnchor?.anchorRatio,
      } satisfies PageStateMessage);
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

  useEffect(() => {
    if (modeRef.current !== "host") {
      return;
    }

    const sendClick = (event: MouseEvent) => {
      const element = getInteractiveElement(event.target);

      if (!element) {
        return;
      }

      const selector = getElementSelector(element);

      if (!selector) {
        return;
      }

      channelRef.current?.postMessage({
        type: "presentation-click",
        sourceId: sourceIdRef.current,
        selector,
      } satisfies ClickMessage);
    };

    const sendInput = (event: Event) => {
      const element = getEditableElement(event.target);

      if (!element) {
        return;
      }

      const selector = getElementSelector(element);

      if (!selector) {
        return;
      }

      let value = "";
      let checked: boolean | undefined;
      let selectedIndex: number | undefined;

      if (element instanceof HTMLInputElement) {
        value = element.value;
        checked = element.checked;
      } else if (element instanceof HTMLTextAreaElement) {
        value = element.value;
      } else if (element instanceof HTMLSelectElement) {
        value = element.value;
        selectedIndex = element.selectedIndex;
      } else if (element instanceof HTMLElement && element.isContentEditable) {
        value = element.textContent ?? "";
      }

      channelRef.current?.postMessage({
        type: "presentation-input",
        sourceId: sourceIdRef.current,
        selector,
        value,
        checked,
        selectedIndex,
      } satisfies InputMessage);
    };

    document.addEventListener("click", sendClick, true);
    document.addEventListener("input", sendInput, true);
    document.addEventListener("change", sendInput, true);

    return () => {
      document.removeEventListener("click", sendClick, true);
      document.removeEventListener("input", sendInput, true);
      document.removeEventListener("change", sendInput, true);
    };
  }, []);

  useEffect(() => {
    if (modeRef.current !== "host") {
      return;
    }

    const sendElementScroll = (event: Event) => {
      if (
        event.target === document ||
        event.target === document.documentElement ||
        event.target === document.body ||
        event.target === window ||
        !(event.target instanceof Element)
      ) {
        return;
      }

      const element = event.target;

      if (element.scrollHeight <= element.clientHeight) {
        return;
      }

      const selector = getElementSelector(element);

      if (!selector) {
        return;
      }

      channelRef.current?.postMessage({
        type: "presentation-element-scroll",
        sourceId: sourceIdRef.current,
        selector,
        scrollRatio: getElementScrollRatio(element),
      } satisfies ElementScrollMessage);
    };

    document.addEventListener("scroll", sendElementScroll, true);

    return () => {
      document.removeEventListener("scroll", sendElementScroll, true);
    };
  }, []);

  return null;
}
