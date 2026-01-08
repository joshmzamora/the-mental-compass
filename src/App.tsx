import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { ScrollToTop } from "./components/ScrollToTop";
import { Toaster } from "./components/ui/sonner";
import { AuthProvider } from "./contexts/AuthContext";
import { UserProfileProvider } from "./contexts/UserProfileContext";
import { Home } from "./pages/Home";
import { Disorders } from "./pages/Disorders";
import { Helplines } from "./pages/Helplines";
import { Appointments } from "./pages/Appointments";
import { Community } from "./pages/Community";
import { Blog } from "./pages/Blog";
import { GuidedJourneys } from "./pages/GuidedJourneys";
import { Testimonials } from "./pages/Testimonials";
import { Login } from "./pages/Login";
import { SignUp } from "./pages/SignUp";
import { Onboarding } from "./pages/Onboarding";
import { Dashboard } from "./pages/Dashboard";
import { NotFound } from "./pages/NotFound";
import { UserProfile } from "./pages/UserProfile";
import { CommunityGuidelines } from "./pages/CommunityGuidelines";
import { PrivacyPolicy } from "./pages/PrivacyPolicy";
import { TermsOfService } from "./pages/TermsOfService";
import { Contact } from "./pages/Contact";
import { Accessibility } from "./pages/Accessibility";
import { Team } from "./pages/Team";
import bpaLogo from "figma:asset/522f2b00fafd8f50990eb357a9cd4f0971f294ec.png";

export default function App() {
  useEffect(() => {
    // Update page title
    document.title = "The Mental Compass - Your Guide to Mental Wellness";
    
    // Update favicon
    const link = document.querySelector("link[rel~='icon']") as HTMLLinkElement || document.createElement('link');
    link.type = 'image/png';
    link.rel = 'icon';
    link.href = bpaLogo;
    if (!document.querySelector("link[rel~='icon']")) {
      document.head.appendChild(link);
    }
    
    // Update meta description
    let metaDescription = document.querySelector("meta[name='description']") as HTMLMetaElement;
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.name = 'description';
      document.head.appendChild(metaDescription);
    }
    metaDescription.content = "Navigate your mental health journey with The Mental Compass. Access resources, community support, and professional help for better mental wellness.";
  }, []);
  
  return (
    <BrowserRouter>
      <AuthProvider>
        <UserProfileProvider>
          <ScrollToTop />
          <div className="min-h-screen bg-white">
            <Header />
            <main>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/disorders" element={<Disorders />} />
                <Route path="/helplines" element={<Helplines />} />
                <Route path="/appointments" element={<Appointments />} />
                <Route path="/community" element={<Community />} />
                <Route path="/community-guidelines" element={<CommunityGuidelines />} />
                <Route path="/user/:userId" element={<UserProfile />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/terms-of-service" element={<TermsOfService />} />
                <Route path="/accessibility" element={<Accessibility />} />
                <Route path="/team" element={<Team />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/journeys" element={<GuidedJourneys />} />
                <Route path="/testimonials" element={<Testimonials />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/onboarding" element={<Onboarding />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
            <Toaster />
          </div>
        </UserProfileProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}