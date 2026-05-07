import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const SITE_URL = "https://mentalcompass.org";
const SITE_NAME = "The Mental Compass";
const DEFAULT_TITLE = `${SITE_NAME} | Mental Health Resources and Support`;
const DEFAULT_DESCRIPTION =
  "The Mental Compass helps people find mental health information, crisis resources, guided wellness journeys, appointments, and supportive community tools.";

type PageSEO = {
  title: string;
  description: string;
  noindex?: boolean;
};

const pageSEO: Record<string, PageSEO> = {
  "/": {
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
  },
  "/disorders": {
    title: `Mental Health Information | ${SITE_NAME}`,
    description:
      "Learn about common mental health conditions, symptoms, support options, and next steps for finding care.",
  },
  "/helplines": {
    title: `Crisis and Mental Health Helplines | ${SITE_NAME}`,
    description:
      "Find 24/7 crisis lines, mental health hotlines, and support resources for urgent or ongoing help.",
  },
  "/appointments": {
    title: `Book a Mental Health Appointment | ${SITE_NAME}`,
    description:
      "Connect with mental health navigators and book supportive appointments that fit your needs.",
  },
  "/community": {
    title: `Mental Health Community | ${SITE_NAME}`,
    description:
      "Join supportive mental health conversations, read shared experiences, and connect with others.",
  },
  "/community-guidelines": {
    title: `Community Guidelines | ${SITE_NAME}`,
    description:
      "Review the community standards that keep The Mental Compass supportive, respectful, and safe.",
  },
  "/privacy-policy": {
    title: `Privacy Policy | ${SITE_NAME}`,
    description:
      "Read how The Mental Compass handles privacy, account information, and mental health support data.",
  },
  "/terms-of-service": {
    title: `Terms of Service | ${SITE_NAME}`,
    description:
      "Review the terms that apply when using The Mental Compass mental health resources and tools.",
  },
  "/accessibility": {
    title: `Accessibility | ${SITE_NAME}`,
    description:
      "Learn about accessibility features and inclusive design practices used by The Mental Compass.",
  },
  "/team": {
    title: `Our Team | ${SITE_NAME}`,
    description:
      "Meet the team building compassionate mental health education, resources, and support tools.",
  },
  "/contact": {
    title: `Contact | ${SITE_NAME}`,
    description:
      "Contact The Mental Compass team with questions about resources, support, accessibility, or privacy.",
  },
  "/blog": {
    title: `Mental Health Blog | ${SITE_NAME}`,
    description:
      "Read practical articles about anxiety, depression, sleep, workplace stress, stigma, and daily wellness.",
  },
  "/journeys": {
    title: `Guided Mental Health Journeys | ${SITE_NAME}`,
    description:
      "Explore guided learning paths for anxiety, depression, sleep, stigma, and daily wellness habits.",
  },
  "/testimonials": {
    title: `Mental Health Recovery Stories | ${SITE_NAME}`,
    description:
      "Read hopeful stories from people navigating mental health challenges and finding support.",
  },
  "/login": {
    title: `Log In | ${SITE_NAME}`,
    description: "Log in to your private Mental Compass dashboard.",
    noindex: true,
  },
  "/signup": {
    title: `Create Account | ${SITE_NAME}`,
    description: "Create a private Mental Compass account.",
    noindex: true,
  },
  "/onboarding": {
    title: `Set Your Compass Bearing | ${SITE_NAME}`,
    description: "Complete your private Mental Compass onboarding assessment.",
    noindex: true,
  },
  "/dashboard": {
    title: `Dashboard | ${SITE_NAME}`,
    description: "Your private Mental Compass wellness dashboard.",
    noindex: true,
  },
  "/presentation": {
    title: `Presentation | ${SITE_NAME}`,
    description: "The Mental Compass presentation view.",
    noindex: true,
  },
};

function setMetaAttribute(
  selector: string,
  attributeName: string,
  attributeValue: string,
  createAttributes: Record<string, string>,
) {
  let element = document.head.querySelector<HTMLMetaElement>(selector);

  if (!element) {
    element = document.createElement("meta");
    Object.entries(createAttributes).forEach(([key, value]) => {
      element?.setAttribute(key, value);
    });
    document.head.appendChild(element);
  }

  element.setAttribute(attributeName, attributeValue);
}

function setLink(rel: string, href: string) {
  let element = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);

  if (!element) {
    element = document.createElement("link");
    element.rel = rel;
    document.head.appendChild(element);
  }

  element.href = href;
}

function getSEO(pathname: string) {
  if (pathname.startsWith("/user/")) {
    return {
      title: `User Profile | ${SITE_NAME}`,
      description: "A private Mental Compass community profile.",
      noindex: true,
    };
  }

  return pageSEO[pathname] ?? {
    title: `Page Not Found | ${SITE_NAME}`,
    description: "This Mental Compass page could not be found.",
    noindex: true,
  };
}

export function SEO() {
  const location = useLocation();

  useEffect(() => {
    const seo = getSEO(location.pathname);
    const canonicalUrl = `${SITE_URL}${location.pathname === "/" ? "/" : location.pathname}`;
    const robots = seo.noindex ? "noindex, nofollow" : "index, follow";

    document.title = seo.title;

    setMetaAttribute('meta[name="description"]', "content", seo.description, {
      name: "description",
    });
    setMetaAttribute('meta[name="robots"]', "content", robots, {
      name: "robots",
    });
    setMetaAttribute('meta[property="og:title"]', "content", seo.title, {
      property: "og:title",
    });
    setMetaAttribute('meta[property="og:description"]', "content", seo.description, {
      property: "og:description",
    });
    setMetaAttribute('meta[property="og:url"]', "content", canonicalUrl, {
      property: "og:url",
    });
    setMetaAttribute('meta[name="twitter:title"]', "content", seo.title, {
      name: "twitter:title",
    });
    setMetaAttribute('meta[name="twitter:description"]', "content", seo.description, {
      name: "twitter:description",
    });
    setLink("canonical", canonicalUrl);
  }, [location.pathname]);

  return null;
}
