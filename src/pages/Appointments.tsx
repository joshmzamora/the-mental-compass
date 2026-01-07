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
  Mail
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
    
    fetchBookings();
  }, []);

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
    // Mock email sending - in production, integrate with SendGrid, AWS SES, or similar
    try {
      const accessToken = localStorage.getItem("access_token");
      
      // Attempt to send email via edge function
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
      // Email sending failed silently - not critical for booking
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

      // In production, integrate with Stripe:
      // const stripe = await loadStripe('your_publishable_key');
      // const { error, paymentMethod } = await stripe.createPaymentMethod({
      //   type: 'card',
      //   card: cardElement,
      // });
      
      // Mock payment processing
      toast.success("Payment processed successfully!");
      return true;
    }

    // Other payment methods don't require immediate processing
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
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-blue-50 to-purple-50 py-20 relative overflow-hidden">
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
            {!user && (
              <div className="mb-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <User className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-blue-900 mb-2">Account Required for Booking</h3>
                    <p className="text-sm text-blue-800 mb-4">
                      To schedule an appointment and access your personalized dashboard, please log in or create an account.
                    </p>
                    <div className="flex gap-3">
                      <Button onClick={() => navigate("/login")} variant="outline" size="sm">
                        Log In
                      </Button>
                      <Button onClick={() => navigate("/signup")} className="bg-blue-600 hover:bg-blue-700" size="sm">
                        Create Account
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {specialtyFilter && (
              <div className="mb-6 bg-teal-50 border border-teal-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-teal-600" />
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

            <div className="text-center mb-12">
              <div className="flex items-center justify-center mb-4">
                <CalendarIcon className="h-8 w-8 text-teal-600 mr-3" />
                <h1 className="text-4xl md:text-5xl text-gray-900">
                  Schedule a Counseling Session
                </h1>
              </div>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Take the first step towards better mental health. Book an
                appointment with one of our licensed mental health navigators.
              </p>
              <div className="flex items-center justify-center gap-2 mt-6">
                <div className="h-px w-20 bg-gradient-to-r from-transparent to-teal-400"></div>
                <Navigation className="h-5 w-5 text-teal-600" />
                <div className="h-px w-20 bg-gradient-to-l from-transparent to-teal-400"></div>
              </div>
            </div>

            {/* Progress Indicator */}
<div className="mb-12 max-w-4xl mx-auto">
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
        {/* Step Circle and Label */}
        <div className="flex flex-col items-center z-10">
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-medium transition-all duration-300 shadow-md ${
              currentStep >= step.num
                ? "bg-teal-600 text-white"
                : "bg-gray-300 text-gray-600"
            }`}
          >
            {currentStep > step.num ? (
              <CheckCircle2 className="h-7 w-7" />
            ) : (
              step.num
            )}
          </div>
          <span className="mt-3 text-sm font-medium text-gray-700">
            {step.label}
          </span>
        </div>

        {/* Connecting Line */}
        {index < 3 && (
          <div className="absolute top-6 left-12 right-0 h-1 -z-10">
            <div
              className="h-full transition-all duration-500"
              style={{
                backgroundColor:
                  currentStep > step.num ? "#0d9488" : "#d1d5db",
                width:
                  currentStep > step.num
                    ? "100%" // previous steps fully filled
                    : currentStep === step.num
                    ? "50%" // optional partial fill for active step
                    : "0%", // future steps empty
              }}
            />
          </div>
        )}
      </div>
    ))}
  </div>
</div>

            {/* Step Content */}
            <div className="max-w-4xl mx-auto mb-12">
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
                        <div className="flex gap-3 mt-6 w-full">
                          <Button
                            onClick={nextStep}
                            disabled={!canProceedToStep2}
                            className="flex-1 bg-teal-600 hover:bg-teal-700"
                          >
                            Continue
                            <ChevronRight className="h-4 w-4 ml-2" />
                          </Button>
                        </div>
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
                      <CardContent className="max-h-[600px] overflow-y-auto">
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
                                  <Avatar className="h-16 w-16">
                                    <AvatarFallback className="bg-teal-600 text-white">
                                      {therapist.name.split(" ").map(n => n[0]).join("")}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div className="flex-1">
                                    <div className="flex items-start justify-between mb-2">
                                      <div>
                                        <h4 className="font-medium text-gray-900">{therapist.name}</h4>
                                        <p className="text-sm text-gray-600">{therapist.credential}</p>
                                      </div>
                                      <Badge className="bg-teal-600 text-white">
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
                                        <Award className="h-3 w-3" />
                                        {therapist.experience} experience
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <Globe className="h-3 w-3" />
                                        {therapist.languages.join(", ")}
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
                        
                        <div className="flex gap-3 mt-6">
                          <Button
                            variant="outline"
                            onClick={prevStep}
                            className="flex-1"
                          >
                            <ChevronLeft className="h-4 w-4 mr-2" />
                            Back
                          </Button>
                          <Button
                            onClick={nextStep}
                            disabled={!canProceedToStep3}
                            className="flex-1 bg-teal-600 hover:bg-teal-700"
                          >
                            Continue
                            <ChevronRight className="h-4 w-4 ml-2" />
                          </Button>
                        </div>
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
                          <div className="p-4 bg-teal-50 rounded-lg border border-teal-200 mb-6">
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

                        <div className="flex gap-3">
                          <Button
                            variant="outline"
                            onClick={prevStep}
                            className="flex-1"
                          >
                            <ChevronLeft className="h-4 w-4 mr-2" />
                            Back
                          </Button>
                          <Button
                            onClick={nextStep}
                            disabled={!canProceedToStep4}
                            className="flex-1 bg-teal-600 hover:bg-teal-700"
                          >
                            Continue to Payment
                            <ChevronRight className="h-4 w-4 ml-2" />
                          </Button>
                        </div>
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

                        <div className="p-4 bg-teal-50 rounded-lg border border-teal-200 mb-6">
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

                        <div className="flex gap-3">
                          <Button
                            variant="outline"
                            onClick={prevStep}
                            className="flex-1"
                          >
                            <ChevronLeft className="h-4 w-4 mr-2" />
                            Back
                          </Button>
                          <Button
                            onClick={handleBookAppointment}
                            disabled={!paymentMethod || loading}
                            className="flex-1 bg-teal-600 hover:bg-teal-700"
                          >
                            {loading ? "Booking..." : "Confirm Appointment"}
                            <CheckCircle2 className="h-4 w-4 ml-2" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* How It Works Section */}
            <Card className="max-w-6xl mx-auto shadow-lg">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">How Our Counseling Sessions Work</CardTitle>
                <CardDescription>
                  Everything you need to know about your mental health journey with us
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Video className="h-8 w-8 text-teal-600" />
                    </div>
                    <h3 className="font-medium text-gray-900 mb-2">Virtual Sessions</h3>
                    <p className="text-sm text-gray-600">
                      Meet with your navigator from the comfort of your home via secure video conferencing. All sessions are HIPAA-compliant and completely confidential.
                    </p>
                  </div>

                  <div className="text-center">
                    <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <MessageCircle className="h-8 w-8 text-teal-600" />
                    </div>
                    <h3 className="font-medium text-gray-900 mb-2">Between-Session Support</h3>
                    <p className="text-sm text-gray-600">
                      Access secure messaging with your navigator between sessions for questions or support. Most navigators respond within 24 hours.
                    </p>
                  </div>

                  <div className="text-center">
                    <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FileText className="h-8 w-8 text-teal-600" />
                    </div>
                    <h3 className="font-medium text-gray-900 mb-2">Progress Tracking</h3>
                    <p className="text-sm text-gray-600">
                      Track your mental health journey with our dashboard. Set goals, monitor progress, and access personalized resources between sessions.
                    </p>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="font-medium text-gray-900 mb-4">What to Expect</h3>
                  <div className="space-y-3 text-sm text-gray-700">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-teal-600 flex-shrink-0 mt-0.5" />
                      <p>
                        <strong>Before Your Session:</strong> You'll receive a confirmation email with a secure video link and intake forms to complete.
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-teal-600 flex-shrink-0 mt-0.5" />
                      <p>
                        <strong>First Session:</strong> Your navigator will get to know you, understand your concerns, and collaboratively create a treatment plan.
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-teal-600 flex-shrink-0 mt-0.5" />
                      <p>
                        <strong>Ongoing Care:</strong> Regular sessions help you work toward your goals with evidence-based techniques and compassionate support.
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-teal-600 flex-shrink-0 mt-0.5" />
                      <p>
                        <strong>Flexibility:</strong> Reschedule or cancel up to 24 hours before your session at no charge. We understand life happens.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-start gap-3">
                    <Shield className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-blue-900 mb-1">Your Privacy is Protected</p>
                      <p className="text-xs text-blue-800">
                        All sessions are confidential and HIPAA-compliant. Your information is encrypted and never shared without your explicit consent, except in cases required by law.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
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
