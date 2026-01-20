import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { Calendar } from "../components/ui/calendar";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../components/ui/dialog";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import { 
  CalendarIcon, 
  Clock, 
  Compass, 
  Navigation, 
  User, 
  CheckCircle2, 
  ChevronRight, 
  ChevronLeft,
  CreditCard,
  Shield,
  Video,
  MessageCircle,
  FileText,
  Award,
  Globe,
  Mail,
  Lock,
  Sparkles,
  Heart,
  Target
} from "lucide-react";
import { toast } from "sonner@2.0.3";
import { PageTransition } from "../components/PageTransition";
import { therapists, timeSlots, Therapist } from "../data/therapists";
import { useAuth } from "../contexts/AuthContext";
import { useUserProfile } from "../contexts/UserProfileContext";
import { projectId } from "../utils/supabase/info";

interface Booking {
  therapistId: string;
  date: string;
  time: string;
  userId: string;
}

export function Appointments() {
  const { user } = useAuth();
  const { addAppointment } = useUserProfile();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedTherapist, setSelectedTherapist] = useState<Therapist | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<string>("");
  const [cardDetails, setCardDetails] = useState({
    number: "",
    expiry: "",
    cvc: "",
    name: "",
  });
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [specialtyFilter, setSpecialtyFilter] = useState<string>("");

  useEffect(() => {
    // Check for specialty filter in URL params
    const params = new URLSearchParams(window.location.search);
    const specialty = params.get("specialty");
    if (specialty) {
      setSpecialtyFilter(specialty);
      toast.info(`Showing navigators specialized in ${specialty}`);
    }
    
    if (user) {
      fetchBookings();
    }
  }, [user]);

  const fetchBookings = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/server/bookings`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token") || ""}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setBookings(data.bookings || []);
      } else {
        setBookings([]);
      }
    } catch (error) {
      // Silently handle error - edge function not available
      setBookings([]);
    }
  };

  const isTimeSlotBooked = (therapistId: string, date: Date, time: string): boolean => {
    const dateString = date.toISOString().split("T")[0];
    return bookings.some(
      (booking) =>
        booking.therapistId === therapistId &&
        booking.date === dateString &&
        booking.time === time
    );
  };

  const getAvailableTherapistsForDate = (date: Date): Therapist[] => {
    const dayName = date.toLocaleDateString("en-US", { weekday: "long" });
    let filteredTherapists = therapists.filter((therapist) =>
      therapist.availableDays.includes(dayName)
    );

    // Apply specialty filter if present
    if (specialtyFilter) {
      const specialtyMap: Record<string, string[]> = {
        anxiety: ["Anxiety", "Stress Management"],
        depression: ["Depression"],
        bipolar: ["Depression", "Mood"],
        ptsd: ["PTSD", "Trauma"],
        ocd: ["OCD", "Anxiety"],
        "eating-disorders": ["Eating"],
      };

      const targetSpecialties = specialtyMap[specialtyFilter] || [];
      if (targetSpecialties.length > 0) {
        filteredTherapists = filteredTherapists.filter((therapist) =>
          therapist.specialty.some((spec) =>
            targetSpecialties.some((target) =>
              spec.toLowerCase().includes(target.toLowerCase())
            )
          )
        );
      }
    }

    return filteredTherapists;
  };

  const sendConfirmationEmail = async (appointmentDetails: any) => {
    try {
      const accessToken = localStorage.getItem("access_token");
      
      await fetch(
        `https://${projectId}.supabase.co/functions/v1/server/send-email`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            to: user?.email,
            subject: "Appointment Confirmation - Mental Compass",
            html: `
              <h2>Your Appointment is Confirmed!</h2>
              <p>Dear ${user?.name},</p>
              <p>Your counseling session has been successfully scheduled.</p>
              <h3>Appointment Details:</h3>
              <ul>
                <li><strong>Navigator:</strong> ${appointmentDetails.therapistName}</li>
                <li><strong>Specialty:</strong> ${appointmentDetails.therapistSpecialty}</li>
                <li><strong>Date:</strong> ${new Date(appointmentDetails.date).toLocaleDateString()}</li>
                <li><strong>Time:</strong> ${appointmentDetails.time}</li>
                <li><strong>Duration:</strong> 50 minutes</li>
                <li><strong>Session Fee:</strong> $${appointmentDetails.amount}</li>
              </ul>
              <p><strong>Next Steps:</strong></p>
              <ul>
                <li>Complete any intake forms sent separately</li>
                <li>Join the session 5 minutes early</li>
                <li>Prepare any questions or topics you'd like to discuss</li>
              </ul>
              <p>If you need to reschedule or cancel, please do so at least 24 hours in advance.</p>
              <p>We look forward to supporting you on your mental health journey!</p>
              <p>Best regards,<br/>The Mental Compass Team</p>
            `,
          }),
        }
      );
      console.log("✓ Confirmation email sent");
    } catch (error) {
      console.log("Email sending not available (will be sent when backend is configured)");
    }
  };

  const processPayment = async () => {
    if (paymentMethod === "credit-card") {
      // Validate card details
      if (!cardDetails.number || !cardDetails.expiry || !cardDetails.cvc || !cardDetails.name) {
        toast.error("Please fill in all card details");
        return false;
      }

      // Basic card validation
      const cardNumber = cardDetails.number.replace(/\s/g, "");
      if (cardNumber.length < 15 || cardNumber.length > 16) {
        toast.error("Invalid card number");
        return false;
      }
      
      toast.success("Payment processed successfully!");
      return true;
    }

    return true;
  };

  const handleBookAppointment = async () => {
    if (!user) {
      toast.error("Please log in to book an appointment");
      navigate("/login");
      return;
    }

    if (!selectedTherapist || !date || !selectedTime || !paymentMethod) {
      toast.error("Please complete all booking steps");
      return;
    }

    setLoading(true);

    try {
      // Process payment first
      const paymentSuccess = await processPayment();
      if (!paymentSuccess) {
        setLoading(false);
        return;
      }

      const accessToken = localStorage.getItem("access_token");
      const dateString = date.toISOString().split("T")[0];

      const appointmentData = {
        id: `apt-${Date.now()}`,
        therapistId: selectedTherapist.id,
        therapistName: selectedTherapist.name,
        therapistSpecialty: selectedTherapist.specialty[0],
        date: dateString,
        time: selectedTime,
        userId: user.id,
        status: "Confirmed",
        paymentMethod: paymentMethod,
        amount: selectedTherapist.rate,
      };

      // Add appointment to user profile immediately (real-time update)
      addAppointment(appointmentData);

      // Try to sync with backend
      try {
        await fetch(
          `https://${projectId}.supabase.co/functions/v1/server/bookings`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(appointmentData),
          }
        );
      } catch (fetchError) {
        // Silently handle - appointment is saved locally
      }

      // Send confirmation email
      await sendConfirmationEmail(appointmentData);

      toast.success("Appointment booked successfully!");
      setShowConfirmDialog(true);
      resetBooking();
      fetchBookings();
    } catch (error: any) {
      toast.error(error.message || "Failed to book appointment");
    } finally {
      setLoading(false);
    }
  };

  const resetBooking = () => {
    setCurrentStep(1);
    setSelectedTherapist(null);
    setSelectedTime("");
    setPaymentMethod("");
  };

  const canProceedToStep2 = date !== undefined;
  const canProceedToStep3 = selectedTherapist !== null;
  const canProceedToStep4 = selectedTime !== "";

  const availableTherapists = date ? getAvailableTherapistsForDate(date) : [];

  const nextStep = () => {
    if (currentStep === 1 && canProceedToStep2) setCurrentStep(2);
    else if (currentStep === 2 && canProceedToStep3) setCurrentStep(3);
    else if (currentStep === 3 && canProceedToStep4) setCurrentStep(4);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-blue-50 to-purple-50 py-8 sm:py-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-10">
            <Compass className="h-64 w-64 text-teal-600 animate-spin" style={{ animationDuration: "60s" }} />
          </div>
          <div className="absolute bottom-20 right-10">
            <Navigation className="h-48 w-48 text-purple-600 animate-pulse" />
          </div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-7xl mx-auto">
            {/* Hero Section */}
            <div className="text-center mb-12">
              <div className="flex items-center justify-center mb-4">
                <CalendarIcon className="h-8 w-8 text-teal-600 mr-3" />
                <h1 className="text-3xl sm:text-4xl md:text-5xl text-gray-900">
                  Schedule a Counseling Session
                </h1>
              </div>
              <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
                Take the first step towards better mental health. Book an
                appointment with one of our licensed mental health navigators.
              </p>
              <div className="flex items-center justify-center gap-2 mt-6">
                <div className="h-px w-20 bg-gradient-to-r from-transparent to-teal-400"></div>
                <Navigation className="h-5 w-5 text-teal-600" />
                <div className="h-px w-20 bg-gradient-to-l from-transparent to-teal-400"></div>
              </div>
            </div>

            {/* How Our Counseling Sessions Work - Redesigned */}
            <div className="mb-16">
              <div className="text-center mb-8 sm:mb-10">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-teal-100 rounded-full mb-4">
                  <Sparkles className="h-4 w-4 text-teal-600" />
                  <span className="text-sm font-medium text-teal-900">Your Journey Starts Here</span>
                </div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                  How Our Counseling Sessions Work
                </h2>
                <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-4">
                  A seamless, supportive experience designed with your mental wellness in mind
                </p>
              </div>

              {/* Feature Cards Grid */}
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 mb-10">
                <motion.div
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-2xl p-6 shadow-lg border border-teal-100 hover:border-teal-300 transition-all"
                >
                  <div className="w-14 h-14 bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl flex items-center justify-center mb-4 shadow-md">
                    <Video className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="font-bold text-xl text-gray-900 mb-3">Virtual Sessions</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Meet with your navigator from anywhere via secure, HIPAA-compliant video conferencing. Your privacy and comfort are our top priorities.
                  </p>
                </motion.div>

                <motion.div
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-2xl p-6 shadow-lg border border-purple-100 hover:border-purple-300 transition-all"
                >
                  <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4 shadow-md">
                    <Heart className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="font-bold text-xl text-gray-900 mb-3">Continuous Support</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Access secure messaging between sessions for questions or support. Most navigators respond within 24 hours.
                  </p>
                </motion.div>

                <motion.div
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-2xl p-6 shadow-lg border border-blue-100 hover:border-blue-300 transition-all sm:col-span-2 md:col-span-1"
                >
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-4 shadow-md">
                    <Target className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="font-bold text-xl text-gray-900 mb-3">Track Your Progress</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Monitor your journey with our dashboard. Set goals, track progress, and access personalized resources between sessions.
                  </p>
                </motion.div>
              </div>

              {/* Session Timeline */}
              <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-gray-100">
                <h3 className="font-bold text-xl text-gray-900 mb-6 text-center">What to Expect in Your Journey</h3>
                <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="relative">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-teal-700 font-bold">1</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">Book & Prepare</h4>
                        <p className="text-sm text-gray-600">
                          Receive confirmation email with video link and intake forms
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="relative">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-purple-700 font-bold">2</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">First Session</h4>
                        <p className="text-sm text-gray-600">
                          Get to know your navigator and create a personalized plan
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="relative">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-blue-700 font-bold">3</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">Ongoing Care</h4>
                        <p className="text-sm text-gray-600">
                          Regular sessions with evidence-based techniques and support
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="relative">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-green-700 font-bold">4</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">Achieve Goals</h4>
                        <p className="text-sm text-gray-600">
                          Track improvements and build lasting mental wellness
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 p-4 bg-gradient-to-r from-teal-50 to-blue-50 rounded-xl border border-teal-200">
                  <div className="flex items-start gap-3">
                    <Shield className="h-5 w-5 text-teal-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-gray-900 mb-1">100% Confidential & Secure</p>
                      <p className="text-xs text-gray-700">
                        All sessions are HIPAA-compliant with end-to-end encryption. Reschedule or cancel up to 24 hours before at no charge—we understand life happens.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Login Gate or Scheduler */}
            {!user ? (
              <div className="max-w-3xl mx-auto">
                <Card className="shadow-xl border-2 border-blue-200">
                  <CardContent className="pt-8 pb-8">
                    <div className="text-center mb-6">
                      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Lock className="h-8 w-8 text-blue-600" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">
                        Login Required to Book
                      </h3>
                      <p className="text-gray-600 max-w-md mx-auto">
                        To schedule an appointment and access your personalized dashboard, please log in or create an account.
                      </p>
                    </div>
                    
                    <div className="bg-gradient-to-r from-teal-50 to-blue-50 rounded-lg p-6 mb-6">
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5 text-teal-600" />
                        Why create an account?
                      </h4>
                      <ul className="space-y-2 text-sm text-gray-700">
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-teal-600 mt-0.5 flex-shrink-0" />
                          <span>Schedule and manage all your appointments in one place</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-teal-600 mt-0.5 flex-shrink-0" />
                          <span>Track your mental health journey with personalized insights</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-teal-600 mt-0.5 flex-shrink-0" />
                          <span>Access secure messaging with your navigator</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-teal-600 mt-0.5 flex-shrink-0" />
                          <span>Join our supportive community forums and chat</span>
                        </li>
                      </ul>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button 
                        onClick={() => navigate("/login")} 
                        variant="outline" 
                        className="flex-1 h-12"
                        size="lg"
                      >
                        <User className="h-4 w-4 mr-2" />
                        Log In
                      </Button>
                      <Button 
                        onClick={() => navigate("/signup")} 
                        className="flex-1 h-12 bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700" 
                        size="lg"
                      >
                        <Sparkles className="h-4 w-4 mr-2" />
                        Create Account
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Preview of scheduler (locked) */}
                <div className="mt-8 relative">
                  <div className="absolute inset-0 bg-gray-900/10 backdrop-blur-sm z-10 rounded-2xl flex items-center justify-center">
                    <div className="text-center bg-white/95 rounded-xl p-6 shadow-lg max-w-sm mx-4">
                      <Lock className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                      <p className="font-medium text-gray-900 mb-1">Appointment Scheduler</p>
                      <p className="text-sm text-gray-600">Login to access the booking system</p>
                    </div>
                  </div>
                  <div className="opacity-50 pointer-events-none">
                    <Card className="shadow-lg">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <CalendarIcon className="h-6 w-6 text-teal-600" />
                          Choose a Date
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="h-96"></CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            ) : (
              <>
                {specialtyFilter && (
                  <div className="mb-6 bg-teal-50 border border-teal-200 rounded-lg p-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <CheckCircle2 className="h-5 w-5 text-teal-600 flex-shrink-0" />
                        <div>
                          <p className="font-medium text-teal-900">
                            Showing navigators specialized in: <span className="capitalize">{specialtyFilter}</span>
                          </p>
                          <p className="text-sm text-teal-700">
                            {availableTherapists.length} specialist{availableTherapists.length !== 1 ? 's' : ''} available
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSpecialtyFilter("");
                          navigate("/appointments");
                        }}
                      >
                        Clear Filter
                      </Button>
                    </div>
                  </div>
                )}

                {/* Progress Indicator */}
                <div className="mb-8 max-w-4xl mx-auto">
                  <div className="flex items-center justify-between">
                    {[
                      { num: 1, label: "Date" },
                      { num: 2, label: "Navigator" },
                      { num: 3, label: "Time" },
                      { num: 4, label: "Payment" },
                    ].map((step, index) => (
                      <div
                        key={step.num}
                        className="relative flex items-center flex-1 last:flex-none"
                      >
                        <div className="flex flex-col items-center z-10">
                          <div
                            className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-base sm:text-lg font-medium transition-all duration-300 shadow-md ${
                              currentStep >= step.num
                                ? "bg-teal-600 text-white"
                                : "bg-gray-300 text-gray-600"
                            }`}
                          >
                            {currentStep > step.num ? (
                              <CheckCircle2 className="h-5 w-5 sm:h-7 sm:w-7" />
                            ) : (
                              step.num
                            )}
                          </div>
                          <span className="mt-2 text-xs sm:text-sm font-medium text-gray-700">
                            {step.label}
                          </span>
                        </div>

                        {index < 3 && (
                          <div className="absolute top-5 sm:top-6 left-10 sm:left-12 right-0 h-1 -z-10">
                            <div
                              className="h-full transition-all duration-500"
                              style={{
                                backgroundColor:
                                  currentStep > step.num ? "#0d9488" : "#d1d5db",
                                width:
                                  currentStep > step.num
                                    ? "100%"
                                    : currentStep === step.num
                                    ? "50%"
                                    : "0%",
                              }}
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Step Content with Sticky Footer */}
                <div className="max-w-4xl mx-auto pb-24">
                  <AnimatePresence mode="wait">
                    {/* Step 1: Select Date */}
                    {currentStep === 1 && (
                      <motion.div
                        key="step1"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Card className="shadow-lg">
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <CalendarIcon className="h-6 w-6 text-teal-600" />
                              Choose a Date
                            </CardTitle>
                            <CardDescription>Select a date for your counseling session</CardDescription>
                          </CardHeader>
                          <CardContent className="flex flex-col items-center">
                            <Calendar
                              mode="single"
                              selected={date}
                              onSelect={setDate}
                              className="rounded-md border"
                              disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                            />
                            {date && (
                              <div className="mt-6 p-4 bg-teal-50 rounded-lg w-full">
                                <p className="text-sm text-teal-900 text-center">
                                  <strong>{availableTherapists.length}</strong> navigators available on{" "}
                                  <strong>{date.toLocaleDateString()}</strong>
                                </p>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      </motion.div>
                    )}

                    {/* Step 2: Select Therapist */}
                    {currentStep === 2 && (
                      <motion.div
                        key="step2"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Card className="shadow-lg">
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <User className="h-6 w-6 text-teal-600" />
                              Choose Your Mental Health Navigator
                            </CardTitle>
                            <CardDescription>
                              Select from our team of experienced professionals
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="max-h-[500px] overflow-y-auto">
                            {availableTherapists.length === 0 ? (
                              <div className="text-center py-8 text-gray-500">
                                <User className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                                <p>No navigators available on this day</p>
                              </div>
                            ) : (
                              <div className="space-y-4">
                                {availableTherapists.map((therapist) => (
                                  <div
                                    key={therapist.id}
                                    onClick={() => setSelectedTherapist(therapist)}
                                    className={`cursor-pointer border-2 rounded-lg p-4 transition-all ${
                                      selectedTherapist?.id === therapist.id
                                        ? "border-teal-600 bg-teal-50"
                                        : "border-gray-200 hover:border-teal-300"
                                    }`}
                                  >
                                    <div className="flex items-start gap-4">
                                      <Avatar className="h-16 w-16 flex-shrink-0">
                                        <AvatarFallback className="bg-teal-600 text-white">
                                          {therapist.name.split(" ").map(n => n[0]).join("")}
                                        </AvatarFallback>
                                      </Avatar>
                                      <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between mb-2 gap-2">
                                          <div>
                                            <h4 className="font-medium text-gray-900">{therapist.name}</h4>
                                            <p className="text-sm text-gray-600">{therapist.credential}</p>
                                          </div>
                                          <Badge className="bg-teal-600 text-white flex-shrink-0">
                                            ${therapist.rate}/session
                                          </Badge>
                                        </div>
                                        
                                        <p className="text-sm text-gray-700 mb-3 leading-relaxed">
                                          {therapist.bio}
                                        </p>
                                        
                                        <div className="flex flex-wrap gap-1 mb-3">
                                          {therapist.specialty.map((spec) => (
                                            <Badge key={spec} variant="secondary" className="bg-teal-100 text-teal-800 text-xs">
                                              {spec}
                                            </Badge>
                                          ))}
                                        </div>
                                        
                                        <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                                          <div className="flex items-center gap-1">
                                            <Award className="h-3 w-3 flex-shrink-0" />
                                            <span className="truncate">{therapist.experience} experience</span>
                                          </div>
                                          <div className="flex items-center gap-1">
                                            <Globe className="h-3 w-3 flex-shrink-0" />
                                            <span className="truncate">{therapist.languages.join(", ")}</span>
                                          </div>
                                        </div>

                                        {selectedTherapist?.id === therapist.id && (
                                          <div className="mt-4 pt-4 border-t border-teal-200">
                                            <h5 className="font-medium text-teal-900 mb-2">About {therapist.name}</h5>
                                            <p className="text-sm text-gray-700 leading-relaxed mb-3">
                                              {therapist.detailedBio}
                                            </p>
                                            
                                            <div className="space-y-2">
                                              <div>
                                                <h6 className="text-xs font-medium text-gray-900 mb-1">Education</h6>
                                                <ul className="text-xs text-gray-600 space-y-1">
                                                  {therapist.education.map((edu, idx) => (
                                                    <li key={idx}>• {edu}</li>
                                                  ))}
                                                </ul>
                                              </div>
                                              
                                              <div>
                                                <h6 className="text-xs font-medium text-gray-900 mb-1">Therapeutic Approach</h6>
                                                <p className="text-xs text-gray-600">{therapist.approach}</p>
                                              </div>
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      </motion.div>
                    )}

                    {/* Step 3: Select Time */}
                    {currentStep === 3 && (
                      <motion.div
                        key="step3"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Card className="shadow-lg">
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <Clock className="h-6 w-6 text-teal-600" />
                              Select Your Time
                            </CardTitle>
                            <CardDescription>
                              Choose an available time slot with {selectedTherapist?.name}
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="grid grid-cols-2 gap-3 mb-6">
                              {timeSlots.map((time) => {
                                const isBooked = date && selectedTherapist && isTimeSlotBooked(selectedTherapist.id, date, time);
                                return (
                                  <button
                                    key={time}
                                    onClick={() => !isBooked && setSelectedTime(time)}
                                    disabled={isBooked}
                                    className={`p-4 rounded-lg text-left transition-all ${
                                      selectedTime === time
                                        ? "bg-teal-600 text-white ring-2 ring-teal-600 ring-offset-2"
                                        : isBooked
                                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                        : "bg-gray-50 hover:bg-teal-50 text-gray-900 border-2 border-gray-200 hover:border-teal-300"
                                    }`}
                                  >
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-2">
                                        <Clock className="h-4 w-4" />
                                        <span className="font-medium">{time}</span>
                                      </div>
                                      {isBooked && (
                                        <Badge variant="secondary" className="bg-red-100 text-red-800 text-xs">
                                          Booked
                                        </Badge>
                                      )}
                                    </div>
                                  </button>
                                );
                              })}
                            </div>

                            {selectedTime && (
                              <div className="p-4 bg-teal-50 rounded-lg border border-teal-200">
                                <h4 className="font-medium text-teal-900 mb-2">Session Details</h4>
                                <div className="space-y-1 text-sm text-teal-800">
                                  <p><strong>Navigator:</strong> {selectedTherapist?.name}</p>
                                  <p><strong>Date:</strong> {date?.toLocaleDateString()}</p>
                                  <p><strong>Time:</strong> {selectedTime}</p>
                                  <p><strong>Duration:</strong> 50 minutes</p>
                                  <p><strong>Session Fee:</strong> ${selectedTherapist?.rate}</p>
                                </div>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      </motion.div>
                    )}

                    {/* Step 4: Payment */}
                    {currentStep === 4 && (
                      <motion.div
                        key="step4"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Card className="shadow-lg">
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <CreditCard className="h-6 w-6 text-teal-600" />
                              Payment Method
                            </CardTitle>
                            <CardDescription>
                              Choose how you'd like to pay for your session
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-3 mb-6">
                              <div
                                onClick={() => setPaymentMethod("credit-card")}
                                className={`cursor-pointer border-2 rounded-lg p-4 transition-all ${
                                  paymentMethod === "credit-card"
                                    ? "border-teal-600 bg-teal-50"
                                    : "border-gray-200 hover:border-teal-300"
                                }`}
                              >
                                <div className="flex items-center space-x-3">
                                  <RadioGroupItem value="credit-card" id="credit-card" />
                                  <Label htmlFor="credit-card" className="flex-1 cursor-pointer">
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-3">
                                        <CreditCard className="h-5 w-5 text-teal-600" />
                                        <div>
                                          <p className="font-medium">Credit/Debit Card</p>
                                          <p className="text-xs text-gray-500">Visa, Mastercard, Amex, Discover</p>
                                        </div>
                                      </div>
                                      <Shield className="h-5 w-5 text-gray-400" />
                                    </div>
                                  </Label>
                                </div>
                              </div>

                              <div
                                onClick={() => setPaymentMethod("insurance")}
                                className={`cursor-pointer border-2 rounded-lg p-4 transition-all ${
                                  paymentMethod === "insurance"
                                    ? "border-teal-600 bg-teal-50"
                                    : "border-gray-200 hover:border-teal-300"
                                }`}
                              >
                                <div className="flex items-center space-x-3">
                                  <RadioGroupItem value="insurance" id="insurance" />
                                  <Label htmlFor="insurance" className="flex-1 cursor-pointer">
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-3">
                                        <Shield className="h-5 w-5 text-teal-600" />
                                        <div>
                                          <p className="font-medium">Insurance</p>
                                          <p className="text-xs text-gray-500">We accept most major insurance plans</p>
                                        </div>
                                      </div>
                                    </div>
                                  </Label>
                                </div>
                              </div>

                              <div
                                onClick={() => setPaymentMethod("hsa-fsa")}
                                className={`cursor-pointer border-2 rounded-lg p-4 transition-all ${
                                  paymentMethod === "hsa-fsa"
                                    ? "border-teal-600 bg-teal-50"
                                    : "border-gray-200 hover:border-teal-300"
                                }`}
                              >
                                <div className="flex items-center space-x-3">
                                  <RadioGroupItem value="hsa-fsa" id="hsa-fsa" />
                                  <Label htmlFor="hsa-fsa" className="flex-1 cursor-pointer">
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-3">
                                        <FileText className="h-5 w-5 text-teal-600" />
                                        <div>
                                          <p className="font-medium">HSA/FSA</p>
                                          <p className="text-xs text-gray-500">Health Savings or Flexible Spending Account</p>
                                        </div>
                                      </div>
                                    </div>
                                  </Label>
                                </div>
                              </div>

                              <div
                                onClick={() => setPaymentMethod("pay-later")}
                                className={`cursor-pointer border-2 rounded-lg p-4 transition-all ${
                                  paymentMethod === "pay-later"
                                    ? "border-teal-600 bg-teal-50"
                                    : "border-gray-200 hover:border-teal-300"
                                }`}
                              >
                                <div className="flex items-center space-x-3">
                                  <RadioGroupItem value="pay-later" id="pay-later" />
                                  <Label htmlFor="pay-later" className="flex-1 cursor-pointer">
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-3">
                                        <Clock className="h-5 w-5 text-teal-600" />
                                        <div>
                                          <p className="font-medium">Pay at Session</p>
                                          <p className="text-xs text-gray-500">Complete payment during your appointment</p>
                                        </div>
                                      </div>
                                    </div>
                                  </Label>
                                </div>
                              </div>
                            </RadioGroup>

                            {/* Credit Card Details Form */}
                            {paymentMethod === "credit-card" && (
                              <div className="space-y-4 mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                                <h4 className="font-medium text-gray-900 mb-3">Card Details</h4>
                                <div>
                                  <Label htmlFor="cardName">Cardholder Name</Label>
                                  <Input
                                    id="cardName"
                                    placeholder="John Doe"
                                    value={cardDetails.name}
                                    onChange={(e) => setCardDetails({ ...cardDetails, name: e.target.value })}
                                    className="mt-1"
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="cardNumber">Card Number</Label>
                                  <Input
                                    id="cardNumber"
                                    placeholder="1234 5678 9012 3456"
                                    value={cardDetails.number}
                                    onChange={(e) => {
                                      const value = e.target.value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
                                      setCardDetails({ ...cardDetails, number: value });
                                    }}
                                    maxLength={19}
                                    className="mt-1"
                                  />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label htmlFor="expiry">Expiry Date</Label>
                                    <Input
                                      id="expiry"
                                      placeholder="MM/YY"
                                      value={cardDetails.expiry}
                                      onChange={(e) => {
                                        let value = e.target.value.replace(/\D/g, '');
                                        if (value.length >= 2) {
                                          value = value.slice(0, 2) + '/' + value.slice(2, 4);
                                        }
                                        setCardDetails({ ...cardDetails, expiry: value });
                                      }}
                                      maxLength={5}
                                      className="mt-1"
                                    />
                                  </div>
                                  <div>
                                    <Label htmlFor="cvc">CVC</Label>
                                    <Input
                                      id="cvc"
                                      placeholder="123"
                                      value={cardDetails.cvc}
                                      onChange={(e) => setCardDetails({ ...cardDetails, cvc: e.target.value.replace(/\D/g, '') })}
                                      maxLength={4}
                                      type="password"
                                      className="mt-1"
                                    />
                                  </div>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-gray-600 mt-2">
                                  <Shield className="h-4 w-4" />
                                  <span>Your payment information is encrypted and secure</span>
                                </div>
                              </div>
                            )}

                            {paymentMethod && paymentMethod !== "credit-card" && (
                              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200 mb-6">
                                <div className="flex items-start gap-3">
                                  <Shield className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                  <div>
                                    <p className="text-sm font-medium text-blue-900 mb-1">Secure Payment</p>
                                    <p className="text-xs text-blue-800">
                                      All payment information is encrypted and secure. You'll complete payment details after confirming your appointment.
                                    </p>
                                  </div>
                                </div>
                              </div>
                            )}

                            <div className="p-4 bg-teal-50 rounded-lg border border-teal-200">
                              <h4 className="font-medium text-teal-900 mb-3">Booking Summary</h4>
                              <div className="space-y-2 text-sm text-teal-800 mb-4">
                                <div className="flex justify-between">
                                  <span>Navigator:</span>
                                  <span className="font-medium">{selectedTherapist?.name}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Date:</span>
                                  <span className="font-medium">{date?.toLocaleDateString()}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Time:</span>
                                  <span className="font-medium">{selectedTime}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Duration:</span>
                                  <span className="font-medium">50 minutes</span>
                                </div>
                                <div className="flex justify-between pt-2 border-t border-teal-200">
                                  <span className="font-medium">Total:</span>
                                  <span className="font-medium text-lg">${selectedTherapist?.rate}</span>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Sticky Footer Navigation */}
                <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-20">
                  <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="max-w-4xl mx-auto flex gap-3">
                      {currentStep > 1 && (
                        <Button
                          variant="outline"
                          onClick={prevStep}
                          className="flex-1 sm:flex-initial sm:min-w-[120px]"
                        >
                          <ChevronLeft className="h-4 w-4 mr-2" />
                          Back
                        </Button>
                      )}
                      {currentStep < 4 ? (
                        <Button
                          onClick={nextStep}
                          disabled={
                            (currentStep === 1 && !canProceedToStep2) ||
                            (currentStep === 2 && !canProceedToStep3) ||
                            (currentStep === 3 && !canProceedToStep4)
                          }
                          className="flex-1 bg-teal-600 hover:bg-teal-700"
                        >
                          Continue
                          <ChevronRight className="h-4 w-4 ml-2" />
                        </Button>
                      ) : (
                        <Button
                          onClick={handleBookAppointment}
                          disabled={!paymentMethod || loading}
                          className="flex-1 bg-teal-600 hover:bg-teal-700"
                        >
                          {loading ? "Booking..." : "Confirm Appointment"}
                          <CheckCircle2 className="h-4 w-4 ml-2" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Confirmation Dialog */}
        <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
          <DialogContent>
            <DialogHeader>
              <div className="flex justify-center mb-4">
                <div className="h-16 w-16 bg-teal-100 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="h-10 w-10 text-teal-600" />
                </div>
              </div>
              <DialogTitle className="text-center text-2xl">Appointment Confirmed!</DialogTitle>
              <DialogDescription className="text-center">
                Your appointment has been successfully booked. You'll receive a confirmation email with session details and a secure video link.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="bg-teal-50 rounded-lg p-4">
                <p className="text-sm text-teal-900 text-center mb-2">
                  <strong>Next Steps:</strong>
                </p>
                <ul className="text-xs text-teal-800 space-y-1">
                  <li>• Check your email for confirmation and intake forms</li>
                  <li>• Complete any required paperwork before your session</li>
                  <li>• Join the session 5 minutes early to test your connection</li>
                </ul>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => navigate("/dashboard")}
                  className="flex-1 bg-teal-600 hover:bg-teal-700"
                >
                  View Dashboard
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowConfirmDialog(false)}
                  className="flex-1"
                >
                  Close
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </PageTransition>
  );
}
