import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar } from "./ui/calendar";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { CalendarIcon, Clock, Compass, Navigation, User, CheckCircle2 } from "lucide-react";
import { toast } from "sonner@2.0.3";
import { CompassDecoration } from "./CompassDecoration";
import { therapists, timeSlots, Therapist } from "../data/therapists";
import { useAuth } from "../contexts/AuthContext";
import { projectId } from "../utils/supabase/info";

interface Booking {
  therapistId: string;
  date: string;
  time: string;
  userId: string;
}

export function AppointmentSection() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedTherapist, setSelectedTherapist] = useState<Therapist | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  useEffect(() => {
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
        // Initialize with empty bookings
        setBookings([]);
      }
    } catch (error) {
      // Initialize with empty bookings (edge function not available)
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
    return therapists.filter((therapist) =>
      therapist.availableDays.includes(dayName)
    );
  };

  const handleBookAppointment = async () => {
    if (!user) {
      toast.error("Please log in to book an appointment");
      navigate("/login");
      return;
    }

    if (!selectedTherapist || !date || !selectedTime) {
      toast.error("Please select a therapist and time slot");
      return;
    }

    setLoading(true);

    try {
      const accessToken = localStorage.getItem("access_token");
      const dateString = date.toISOString().split("T")[0];

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/server/bookings`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            therapistId: selectedTherapist.id,
            therapistName: selectedTherapist.name,
            therapistSpecialty: selectedTherapist.specialty[0],
            date: dateString,
            time: selectedTime,
            userId: user.id,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to book appointment");
      }

      toast.success("Appointment booked successfully!");
      setShowConfirmDialog(true);
      setSelectedTherapist(null);
      setSelectedTime("");
      fetchBookings(); // Refresh bookings
    } catch (error: any) {
      toast.error(error.message || "Failed to book appointment");
    } finally {
      setLoading(false);
    }
  };

  const availableTherapists = date ? getAvailableTherapistsForDate(date) : [];

  return (
    <section id="appointment" className="py-20 bg-white relative overflow-hidden">
      <CompassDecoration variant="light" />
      
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
          
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <CalendarIcon className="h-8 w-8 text-teal-600 mr-3" />
              <h2 className="text-3xl md:text-4xl text-gray-900">
                Schedule a Counseling Session
              </h2>
            </div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Take the first step towards better mental health. Book an
              appointment with one of our licensed navigators.
            </p>
            <div className="flex items-center justify-center gap-2 mt-4">
              <div className="h-px w-20 bg-gradient-to-r from-transparent to-teal-400"></div>
              <Navigation className="h-5 w-5 text-teal-600" />
              <div className="h-px w-20 bg-gradient-to-l from-transparent to-teal-400"></div>
            </div>
          </div>

          {/* Progress Stepper */}
          <div className="mb-8 max-w-3xl mx-auto">
            <div className="flex items-center justify-between relative">
              {/* Step 1 */}
              <div className="flex flex-col items-center z-10 flex-1">
                <div className={`flex items-center justify-center h-10 w-10 sm:h-12 sm:w-12 rounded-full ${date ? 'bg-teal-600' : 'bg-gray-300'} text-white transition-colors`}>
                  <span className="text-sm sm:text-base">1</span>
                </div>
                <p className="text-xs sm:text-sm mt-2 text-center text-gray-600">Date</p>
              </div>
              
              {/* Line 1-2 */}
              <div className={`h-1 flex-1 mx-2 sm:mx-4 ${date ? 'bg-teal-600' : 'bg-gray-300'} transition-colors`}></div>
              
              {/* Step 2 */}
              <div className="flex flex-col items-center z-10 flex-1">
                <div className={`flex items-center justify-center h-10 w-10 sm:h-12 sm:w-12 rounded-full ${selectedTherapist ? 'bg-teal-600' : 'bg-gray-300'} text-white transition-colors`}>
                  <span className="text-sm sm:text-base">2</span>
                </div>
                <p className="text-xs sm:text-sm mt-2 text-center text-gray-600">Navigator</p>
              </div>
              
              {/* Line 2-3 */}
              <div className={`h-1 flex-1 mx-2 sm:mx-4 ${selectedTherapist ? 'bg-teal-600' : 'bg-gray-300'} transition-colors`}></div>
              
              {/* Step 3 */}
              <div className="flex flex-col items-center z-10 flex-1">
                <div className={`flex items-center justify-center h-10 w-10 sm:h-12 sm:w-12 rounded-full ${selectedTime ? 'bg-teal-600' : 'bg-gray-300'} text-white transition-colors`}>
                  <span className="text-sm sm:text-base">3</span>
                </div>
                <p className="text-xs sm:text-sm mt-2 text-center text-gray-600">Time</p>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Step 1: Select Date */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="flex items-center justify-center h-8 w-8 rounded-full bg-teal-600 text-white text-sm">1</span>
                  Choose a Date
                </CardTitle>
                <CardDescription>Select a date for your session</CardDescription>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="rounded-md"
                  disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                />
                {date && (
                  <div className="mt-4 p-3 bg-teal-50 rounded-lg">
                    <p className="text-sm text-teal-900">
                      <strong>{availableTherapists.length}</strong> navigators available on{" "}
                      <strong>{date.toLocaleDateString()}</strong>
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Step 2: Select Therapist */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="flex items-center justify-center h-8 w-8 rounded-full bg-teal-600 text-white text-sm">2</span>
                  Choose Your Navigator
                </CardTitle>
                <CardDescription>
                  {date ? "Select a mental health professional" : "Select a date first"}
                </CardDescription>
              </CardHeader>
              <CardContent className="max-h-[500px] overflow-y-auto">
                {!date ? (
                  <div className="text-center py-8 text-gray-500">
                    <CalendarIcon className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                    <p>Please select a date first</p>
                  </div>
                ) : availableTherapists.length === 0 ? (
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
                        <div className="flex items-start gap-3">
                          <Avatar className="h-12 w-12">
                            <AvatarFallback className="bg-teal-600 text-white">
                              {therapist.name.split(" ").map(n => n[0]).join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{therapist.name}</h4>
                            <p className="text-sm text-gray-600">{therapist.credential}</p>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {therapist.specialty.map((spec) => (
                                <Badge key={spec} variant="secondary" className="bg-teal-100 text-teal-800 text-xs">
                                  {spec}
                                </Badge>
                              ))}
                            </div>
                            <p className="text-xs text-gray-600 mt-2">{therapist.experience} experience</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Step 3: Select Time */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="flex items-center justify-center h-8 w-8 rounded-full bg-teal-600 text-white text-sm">3</span>
                  Select Time
                </CardTitle>
                <CardDescription>
                  {selectedTherapist ? "Choose an available time slot" : "Select a navigator first"}
                </CardDescription>
              </CardHeader>
              <CardContent className="max-h-[500px] overflow-y-auto">
                {!selectedTherapist ? (
                  <div className="text-center py-8 text-gray-500">
                    <User className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                    <p>Please select a navigator first</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {timeSlots.map((time) => {
                      const isBooked = date && isTimeSlotBooked(selectedTherapist.id, date, time);
                      return (
                        <button
                          key={time}
                          onClick={() => !isBooked && setSelectedTime(time)}
                          disabled={isBooked}
                          className={`w-full p-3 rounded-lg text-left transition-all ${
                            selectedTime === time
                              ? "bg-teal-600 text-white"
                              : isBooked
                              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                              : "bg-gray-50 hover:bg-teal-50 text-gray-900"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4" />
                              <span>{time}</span>
                            </div>
                            {isBooked && (
                              <Badge variant="secondary" className="bg-red-100 text-red-800">
                                Booked
                              </Badge>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}

                {selectedTherapist && selectedTime && (
                  <div className="mt-6 p-4 bg-teal-50 rounded-lg border border-teal-200">
                    <h4 className="font-medium text-teal-900 mb-2">Appointment Summary</h4>
                    <div className="space-y-1 text-sm text-teal-800">
                      <p><strong>Navigator:</strong> {selectedTherapist.name}</p>
                      <p><strong>Date:</strong> {date?.toLocaleDateString()}</p>
                      <p><strong>Time:</strong> {selectedTime}</p>
                      <p><strong>Duration:</strong> 50 minutes</p>
                    </div>
                    <Button
                      onClick={handleBookAppointment}
                      disabled={loading}
                      className="w-full mt-4 bg-teal-600 hover:bg-teal-700"
                    >
                      {loading ? "Booking..." : "Confirm Appointment"}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Therapist Details Section */}
          {selectedTherapist && (
            <Card className="mt-8">
              <CardHeader>
                <CardTitle>About {selectedTherapist.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="md:col-span-2">
                    <p className="text-gray-700 leading-relaxed mb-4">{selectedTherapist.bio}</p>
                    <div className="flex flex-wrap gap-2">
                      <Badge className="bg-teal-100 text-teal-800">
                        {selectedTherapist.experience}
                      </Badge>
                      <Badge className="bg-blue-100 text-blue-800">
                        {selectedTherapist.credential}
                      </Badge>
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-3">Specializations</h4>
                    <ul className="space-y-2">
                      {selectedTherapist.specialty.map((spec) => (
                        <li key={spec} className="flex items-center gap-2 text-sm text-gray-700">
                          <CheckCircle2 className="h-4 w-4 text-teal-600" />
                          {spec}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
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
              Your appointment has been successfully booked. You'll receive a confirmation email shortly.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-teal-50 rounded-lg p-4">
              <p className="text-sm text-teal-900 text-center">
                Check your dashboard to view all your scheduled appointments.
              </p>
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
    </section>
  );
}
