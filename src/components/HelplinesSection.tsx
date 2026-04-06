import { useState, useEffect } from "react";
import { Phone, Globe, Clock, AlertCircle, Compass, Navigation, MapPin, Target, X, Building2, Loader2 } from "lucide-react";
import { helplines } from "../data/helplines";
import { searchResourcesByZipCode, LocalResource } from "../data/local-resources";
import { lookupZip3 } from "../data/zip-codes";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Alert, AlertDescription } from "./ui/alert";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Skeleton } from "./ui/skeleton";
import { CompassDecoration } from "./CompassDecoration";
import { motion, AnimatePresence } from "motion/react";

export function HelplinesSection() {
  const [userZipCode, setUserZipCode] = useState<string>("");
  const [locationEnabled, setLocationEnabled] = useState(false);
  const [detectedCity, setDetectedCity] = useState<string>("");
  const [showLocalResources, setShowLocalResources] = useState(false);
  const [detectedZipCode, setDetectedZipCode] = useState<string>("");
  const [isSearching, setIsSearching] = useState(false);
  const [inlineError, setInlineError] = useState<{ visible: boolean; title: string; message: string }>({
    visible: false,
    title: "",
    message: ""
  });

  const crisisHelplines = helplines.filter((h) => h.type === "crisis");
  const otherHelplines = helplines.filter((h) => h.type !== "crisis");

  // Filter local resources based on detected ZIP code or user-entered ZIP code
  const filteredLocalResources = (locationEnabled || showLocalResources) && (detectedZipCode || userZipCode)
    ? searchResourcesByZipCode(detectedZipCode || userZipCode)
    : [];
  
  // Get resource type badge info
  const getTypeBadge = (type: LocalResource["type"]) => {
    const badges = {
      crisis: { label: "Crisis", className: "bg-red-600 hover:bg-red-700" },
      counseling: { label: "Counseling", className: "bg-blue-600 hover:bg-blue-700" },
      psychiatric: { label: "Psychiatric", className: "bg-purple-600 hover:bg-purple-700" },
      support: { label: "Support", className: "bg-teal-600 hover:bg-teal-700" },
      youth: { label: "Youth Services", className: "bg-orange-600 hover:bg-orange-700" },
      veterans: { label: "Veterans", className: "bg-green-600 hover:bg-green-700" },
      substance: { label: "Substance Abuse", className: "bg-amber-600 hover:bg-amber-700" }
    };
    return badges[type] || badges.support;
  };

  const handleEnableLocation = () => {
    if ("geolocation" in navigator) {
      setIsSearching(true);
      setInlineError({ visible: false, title: "", message: "" });
      setShowLocalResources(false);

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          
          // Simulate some server-side "search" feel
          setTimeout(() => {
            let simulatedZip = "10001";
            let simulatedCity = "New York, NY";
            
            // Very rough geo logic for variety
            if (latitude < 35) {
              simulatedZip = "77002";
              simulatedCity = "Houston, TX";
            } else if (longitude > -100) {
              simulatedZip = "60601";
              simulatedCity = "Chicago, IL";
            }

            setDetectedZipCode(simulatedZip);
            setDetectedCity(simulatedCity);
            setLocationEnabled(true);
            setShowLocalResources(true);
            setIsSearching(false);
          }, 800);
        },
        (error) => {
          console.log("Location access denied:", error);
          setIsSearching(false);
          setInlineError({
            visible: true,
            title: "Location Access Denied",
            message: "Please enter your ZIP code manually."
          });
        }
      );
    } else {
      setInlineError({
        visible: true,
        title: "Not Supported",
        message: "Geolocation is not supported by your browser."
      });
    }
  };

  const handleZipCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userZipCode.length === 5 && /^\d{5}$/.test(userZipCode)) {
      setIsSearching(true);
      setInlineError({ visible: false, title: "", message: "" });
      setShowLocalResources(false);
      
      // Simulate search delay for smooth experience
      setTimeout(() => {
        setShowLocalResources(true);
        setLocationEnabled(false);
        setDetectedZipCode(userZipCode);
        
        const zipInfo = lookupZip3(userZipCode);
        if (zipInfo) {
          setDetectedCity(`${zipInfo.city}, ${zipInfo.state}`);
        } else {
          setDetectedCity(`ZIP ${userZipCode}`);
        }
        setIsSearching(false);
      }, 700);
    } else {
      setInlineError({
        visible: true,
        title: "Invalid ZIP Code",
        message: "Enter exactly 5 digits for a valid U.S. ZIP code."
      });
    }
  };

  return (
    <section id="helplines" className="py-20 bg-gray-50 relative overflow-hidden">
      <CompassDecoration variant="light" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <Phone className="h-8 w-8 text-teal-600 mr-3" />
              <h2 className="text-3xl md:text-4xl font-medium text-gray-900">
                Get Help Now
              </h2>
            </div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              You're not alone. Reach out to these free, confidential helplines
              for support and guidance.
            </p>
            <div className="flex items-center justify-center gap-2 mt-4">
              <div className="h-px w-20 bg-gradient-to-r from-transparent to-teal-400"></div>
              <Navigation className="h-5 w-5 text-teal-600" />
              <div className="h-px w-20 bg-gradient-to-l from-transparent to-teal-400"></div>
            </div>
          </div>

          <Alert className="mb-8 bg-red-50 border-red-200">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <AlertDescription className="text-red-900">
              <strong>If you or someone you know is in immediate danger, please call 911 or go to your nearest emergency room.</strong>
            </AlertDescription>
          </Alert>

          {/* Crisis Helplines */}
          <div className="mb-12">
            <h3 className="text-2xl mb-6 text-gray-900">Crisis Support</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {crisisHelplines.map((helpline) => (
                <Card key={helpline.id} className="border-2 border-red-200 bg-red-50/20 shadow-sm transition-all hover:shadow-md">
                  <CardHeader className="space-y-4">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-xl font-bold text-gray-900 leading-tight">
                        {helpline.name}
                      </CardTitle>
                      <Badge className="bg-red-600 hover:bg-red-700 shrink-0">Crisis</Badge>
                    </div>
                    <CardDescription className="text-gray-700 leading-relaxed min-h-[4rem]">
                      {helpline.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2 text-gray-900">
                      <Phone className="h-5 w-5 text-red-600" />
                      <a href={`tel:${helpline.phone.replace(/[^0-9]/g, "")}`} className="text-lg hover:underline font-medium">
                        {helpline.phone}
                      </a>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      <Clock className="h-5 w-5 text-red-600" />
                      <span className="text-sm font-medium">{helpline.availability}</span>
                    </div>
                    {helpline.website && (
                      <div className="flex items-center gap-2">
                        <Globe className="h-5 w-5 text-red-600" />
                        <a href={helpline.website} target="_blank" rel="noopener noreferrer" className="text-red-700 hover:underline text-sm font-medium">
                          Visit Website
                        </a>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Location-Based Resource Finder */}
          <Card className="mb-8 border-2 border-teal-200 bg-teal-50/30 overflow-hidden">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Target className="h-6 w-6 text-teal-600" />
                <CardTitle className="text-gray-900">Find Local Resources</CardTitle>
              </div>
              <CardDescription>Get personalized access to mental health resources in your area</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <AnimatePresence>
                  {inlineError.visible && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      <Alert variant="destructive" className="mb-4">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription className="flex items-center justify-between">
                          <span><strong>{inlineError.title}:</strong> {inlineError.message}</span>
                          <X className="h-4 w-4 cursor-pointer" onClick={() => setInlineError({ ...inlineError, visible: false })} />
                        </AlertDescription>
                      </Alert>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <Label htmlFor="zipcode" className="text-sm mb-2 block font-medium text-gray-700">Enter Your ZIP Code</Label>
                    <form onSubmit={handleZipCodeSubmit} className="flex gap-2">
                      <Input
                        id="zipcode"
                        type="text"
                        placeholder="e.g., 10001"
                        value={userZipCode}
                        onChange={(e) => setUserZipCode(e.target.value)}
                        maxLength={5}
                        className="bg-white border-teal-200 focus:ring-teal-500"
                        disabled={isSearching}
                      />
                      <Button type="submit" className="bg-teal-600 hover:bg-teal-700 min-w-24" disabled={isSearching}>
                        {isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : <><MapPin className="h-4 w-4 mr-2" /> Find</>}
                      </Button>
                    </form>
                  </div>
                  <div className="flex items-center justify-center font-medium text-gray-400 px-4 pt-6">OR</div>
                  <div className="flex-1 flex items-end">
                    <Button onClick={handleEnableLocation} variant="outline" className="w-full border-teal-200 text-teal-700 hover:bg-teal-50" disabled={isSearching}>
                      <Navigation className="h-4 w-4 mr-2" /> Use My Location
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Results Area with Animation */}
          <AnimatePresence mode="wait">
            {isSearching && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                {[1, 2, 3, 4].map(i => (
                  <Card key={i} className="border border-teal-100">
                    <CardHeader className="space-y-2">
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <Skeleton className="h-20 w-full" />
                      <div className="flex gap-2"><Skeleton className="h-4 w-1/4" /><Skeleton className="h-4 w-1/4" /></div>
                    </CardContent>
                  </Card>
                ))}
              </motion.div>
            )}

            {showLocalResources && !isSearching && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <MapPin className="h-6 w-6 text-teal-600" />
                    <h3 className="text-2xl font-medium text-gray-900">
                      Resources in {detectedCity}
                    </h3>
                    <Badge variant="outline" className="text-teal-700 border-teal-200 bg-teal-50">
                      {detectedZipCode}
                    </Badge>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setShowLocalResources(false)} className="text-gray-500 hover:text-red-600">
                    <X className="h-4 w-4 mr-1" /> Clear
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredLocalResources.map((resource, index) => {
                    const badge = getTypeBadge(resource.type);
                    return (
                      <motion.div
                        key={resource.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Card className="h-full border-teal-200 hover:shadow-md transition-shadow">
                          <CardHeader className="pb-3">
                            <div className="flex justify-between items-start">
                              <CardTitle className="text-lg text-gray-900">{resource.name}</CardTitle>
                              <Badge className={badge.className}>{badge.label}</Badge>
                            </div>
                            <CardDescription className="text-gray-700">
                              {resource.description}
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            <div className="flex items-center gap-2 text-gray-900">
                              <Phone className="h-4 w-4 text-teal-600" />
                              <a href={`tel:${resource.phone}`} className="hover:underline font-medium">{resource.phone}</a>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600 text-sm">
                              <Clock className="h-4 w-4 text-teal-600" />
                              <span>{resource.availability}</span>
                            </div>
                            {resource.services && (
                              <div className="flex flex-wrap gap-1 pt-2">
                                {resource.services.map(s => (
                                  <Badge key={s} variant="secondary" className="text-[10px] uppercase tracking-wider bg-teal-50 text-teal-700">
                                    {s}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Other National Resources Below if results shown */}
          {!showLocalResources && !isSearching && (
             <div className="mb-12">
               <h3 className="text-2xl mb-6 text-gray-900">National & International Resources</h3>
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {otherHelplines.map((helpline) => {
                   const bgClass = "bg-teal-50/30 border-teal-100 shadow-sm";
                   const iconColor = "text-teal-600";
                   
                   return (
                     <Card key={helpline.id} className={`flex flex-col h-full hover:shadow-md transition-all border-2 ${bgClass}`}>
                       <CardHeader className="space-y-4 flex-grow">
                         <CardTitle className="text-lg font-bold text-gray-900 leading-snug">
                           {helpline.name}
                         </CardTitle>
                         <CardDescription className="text-gray-700 leading-relaxed">
                           {helpline.description}
                         </CardDescription>
                       </CardHeader>
                       <CardContent className="space-y-4 pt-4 border-t border-teal-100/50">
                         <div className="space-y-2">
                           <div className="flex items-center gap-2">
                             <Phone className={`h-4 w-4 ${iconColor}`} />
                             <span className="text-sm font-bold text-gray-900 tracking-tight">{helpline.phone}</span>
                           </div>
                           <div className="flex items-center gap-2">
                             <Clock className={`h-4 w-4 ${iconColor}`} />
                             <span className="text-xs text-gray-500 font-semibold">{helpline.availability}</span>
                           </div>
                           {helpline.website && (
                             <div className="flex items-center gap-2 pt-1">
                               <Globe className={`h-4 w-4 ${iconColor}`} />
                               <a 
                                 href={helpline.website} 
                                 target="_blank" 
                                 rel="noopener noreferrer" 
                                 className="text-xs font-bold text-teal-700 hover:underline flex items-center"
                               >
                                 Visit Official Website
                               </a>
                             </div>
                           )}
                         </div>
                       </CardContent>
                     </Card>
                   );
                 })}
               </div>
             </div>
          )}
        </div>
      </div>
    </section>
  );
}
