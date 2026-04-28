import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Compass, Navigation, User } from "lucide-react";
import { Show, UserButton, useUser } from "@clerk/react";
import { motion } from "motion/react";
import { Button } from "./ui/button";

function GuestActions({
  mobile = false,
  onNavigate,
}: {
  mobile?: boolean;
  onNavigate?: () => void;
}) {
  return (
    <div className={mobile ? "flex flex-col gap-2" : "flex items-center gap-2"}>
      <Button asChild variant="outline" className={mobile ? "w-full" : undefined}>
        <Link to="/login" onClick={onNavigate}>
          Log In
        </Link>
      </Button>
      <Button
        asChild
        className={`bg-teal-600 hover:bg-teal-700 ${mobile ? "w-full" : ""}`}
      >
        <Link to="/signup" onClick={onNavigate}>
          Sign Up
        </Link>
      </Button>
    </div>
  );
}

function MemberActions({
  mobile = false,
  onNavigate,
}: {
  mobile?: boolean;
  onNavigate?: () => void;
}) {
  return (
    <div className="flex items-center gap-3">
      <Button
        asChild
        variant="outline"
        className={`border-teal-600 text-teal-600 hover:bg-teal-50 ${mobile ? "flex-1" : ""}`}
      >
        <Link to="/dashboard" onClick={onNavigate}>
          <User className="mr-2 h-4 w-4" />
          Dashboard
        </Link>
      </Button>
      <UserButton />
    </div>
  );
}

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeIndicator, setActiveIndicator] = useState({ left: 0, width: 0, visible: false });
  const location = useLocation();
  const { isLoaded } = useUser();
  const desktopNavRef = useRef<HTMLElement | null>(null);
  const linkRefs = useRef<Record<string, HTMLAnchorElement | null>>({});

  const navItems = [
    { path: "/", label: "Home" },
    { path: "/disorders", label: "Mental Health Info" },
    { path: "/helplines", label: "Get Help" },
    { path: "/appointments", label: "Book Appointment" },
    { path: "/community", label: "Community" },
    { path: "/blog", label: "Blog" },
    { path: "/testimonials", label: "Stories" },
  ];

  const isActive = (path: string) => location.pathname === path;

  const navLinkClass = (path: string) => {
    return `text-sm transition-colors relative group ${
      isActive(path)
        ? "text-teal-600"
        : "text-gray-700 hover:text-teal-600"
    }`;
  };

  useLayoutEffect(() => {
    const navElement = desktopNavRef.current;
    const activeLink = linkRefs.current[location.pathname];

    if (!navElement || !activeLink) {
      setActiveIndicator((current) =>
        current.visible ? { ...current, visible: false } : current,
      );
      return;
    }

    const navBounds = navElement.getBoundingClientRect();
    const linkBounds = activeLink.getBoundingClientRect();

    setActiveIndicator({
      left: linkBounds.left - navBounds.left,
      width: linkBounds.width,
      visible: true,
    });
  }, [location.pathname]);

  useEffect(() => {
    const navElement = desktopNavRef.current;

    if (!navElement || typeof ResizeObserver === "undefined") {
      return;
    }

    const syncIndicator = () => {
      const activeLink = linkRefs.current[location.pathname];

      if (!activeLink) {
        return;
      }

      const navBounds = navElement.getBoundingClientRect();
      const linkBounds = activeLink.getBoundingClientRect();

      setActiveIndicator({
        left: linkBounds.left - navBounds.left,
        width: linkBounds.width,
        visible: true,
      });
    };

    const resizeObserver = new ResizeObserver(syncIndicator);
    resizeObserver.observe(navElement);

    const activeLink = linkRefs.current[location.pathname];
    if (activeLink) {
      resizeObserver.observe(activeLink);
    }

    window.addEventListener("resize", syncIndicator);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", syncIndicator);
    };
  }, [location.pathname]);

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 relative">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 opacity-5">
          <Compass className="h-40 w-40 text-teal-600" />
        </div>
        <div className="absolute -top-10 left-1/3 opacity-5">
          <Navigation className="h-20 w-20 text-blue-600" />
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex h-16 items-center justify-between gap-2">
          <Link to="/" className="flex items-center gap-2 group min-w-0 flex-shrink">
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="flex-shrink-0"
            >
              <Compass className="h-7 w-7 sm:h-8 sm:w-8 text-teal-600 group-hover:text-teal-700 transition-colors" />
            </motion.div>
            <div className="flex flex-col min-w-0">
              <span className="text-base sm:text-xl text-teal-900 group-hover:text-teal-700 transition-colors truncate">
                The Mental Compass
              </span>
              <span className="text-xs text-gray-500 hidden lg:block">
                Navigate Your Mental Wellness
              </span>
            </div>
          </Link>

          <nav ref={desktopNavRef} className="hidden md:flex items-center gap-6 flex-shrink-0 relative">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                ref={(node) => {
                  linkRefs.current[item.path] = node;
                }}
                className={navLinkClass(item.path)}
              >
                {item.label}
              </Link>
            ))}

            {activeIndicator.visible && (
              <motion.div
                aria-hidden="true"
                className="absolute bottom-0 h-0.5 rounded-full bg-teal-600"
                animate={{ x: activeIndicator.left, width: activeIndicator.width, opacity: 1 }}
                initial={false}
                transition={{ type: "spring", stiffness: 420, damping: 34 }}
              />
            )}

            {!isLoaded ? (
              <GuestActions />
            ) : (
              <>
                <Show when="signed-in">
                  <MemberActions />
                </Show>
                <Show when="signed-out">
                  <GuestActions />
                </Show>
              </>
            )}
          </nav>

          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {mobileMenuOpen && (
          <motion.nav
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden py-4 border-t"
          >
            <div className="flex flex-col gap-4">
              <Link to="/" onClick={closeMobileMenu} className={navLinkClass("/") + " text-left"}>
                Home
              </Link>
              <Link to="/disorders" onClick={closeMobileMenu} className={navLinkClass("/disorders") + " text-left"}>
                Mental Health Info
              </Link>
              <Link to="/helplines" onClick={closeMobileMenu} className={navLinkClass("/helplines") + " text-left"}>
                Get Help
              </Link>
              <Link to="/appointments" onClick={closeMobileMenu} className={navLinkClass("/appointments") + " text-left"}>
                Book Appointment
              </Link>
              <Link to="/community" onClick={closeMobileMenu} className={navLinkClass("/community") + " text-left"}>
                Community
              </Link>
              <Link to="/blog" onClick={closeMobileMenu} className={navLinkClass("/blog") + " text-left"}>
                Blog
              </Link>
              <Link to="/testimonials" onClick={closeMobileMenu} className={navLinkClass("/testimonials") + " text-left"}>
                Stories
              </Link>

              {!isLoaded ? (
                <GuestActions mobile onNavigate={closeMobileMenu} />
              ) : (
                <>
                  <Show when="signed-in">
                    <MemberActions mobile onNavigate={closeMobileMenu} />
                  </Show>
                  <Show when="signed-out">
                    <GuestActions mobile onNavigate={closeMobileMenu} />
                  </Show>
                </>
              )}
            </div>
          </motion.nav>
        )}
      </div>
    </header>
  );
}
