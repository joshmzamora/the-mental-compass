import { BrowserRouter, Routes, Route } from "react-router-dom";
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

export default function App() {
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
