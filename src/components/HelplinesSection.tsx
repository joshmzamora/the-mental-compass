import { useState, useEffect } from "react";
import { Phone, Globe, Clock, AlertCircle, Compass, Navigation, MapPin, Target, X, Building2 } from "lucide-react";
import { helplines } from "../data/helplines";
import { searchResourcesByZipCode, LocalResource } from "../data/local-resources";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Alert, AlertDescription } from "./ui/alert";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { CompassDecoration } from "./CompassDecoration";

export function HelplinesSection() {
  const [userZipCode, setUserZipCode] = useState<string>("");
  const [locationEnabled, setLocationEnabled] = useState(false);
  const [detectedCity, setDetectedCity] = useState<string>("");
  const [showLocalResources, setShowLocalResources] = useState(false);
  const [detectedZipCode, setDetectedZipCode] = useState<string>("");

  const crisisHelplines = helplines.filter((h) => h.type === "crisis");
  const otherHelplines = helplines.filter((h) => h.type !== "crisis");

  // Filter local resources based on detected ZIP code or user-entered ZIP code
  const filteredLocalResources = locationEnabled 
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
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          setLocationEnabled(true);
          // In production, you would use a reverse geocoding service here
          // For demo, we'll simulate it based on the coordinates
          const { latitude, longitude } = position.coords;
          
          // Simulate reverse geocoding - map rough coordinates to major cities
          // Texas cities
          // Nashville: ~36.16N, -86.78W
          // Memphis: ~35.14N, -90.05W
          // Houston: ~29.76N, -95.36W
          // Dallas: ~32.77N, -96.79W
          // Austin: ~30.26N, -97.74W
          
          let simulatedZip = "37203"; // default to Nashville
          let simulatedCity = "Nashville, TN";
          
          // Tennessee
          if (Math.abs(latitude - 35.14) < 2 && Math.abs(longitude + 90.05) < 2) {
            simulatedZip = "38104";
            simulatedCity = "Memphis, TN";
          } else if (Math.abs(latitude - 35.96) < 2 && Math.abs(longitude + 83.92) < 2) {
            simulatedZip = "37902";
            simulatedCity = "Knoxville, TN";
          } else if (Math.abs(latitude - 35.04) < 2 && Math.abs(longitude + 85.30) < 2) {
            simulatedZip = "37404";
            simulatedCity = "Chattanooga, TN";
          }
          // Texas
          else if (Math.abs(latitude - 29.76) < 2 && Math.abs(longitude + 95.36) < 2) {
            simulatedZip = "77002";
            simulatedCity = "Houston, TX";
          } else if (Math.abs(latitude - 32.77) < 2 && Math.abs(longitude + 96.79) < 2) {
            simulatedZip = "75201";
            simulatedCity = "Dallas, TX";
          } else if (Math.abs(latitude - 30.26) < 2 && Math.abs(longitude + 97.74) < 2) {
            simulatedZip = "78701";
            simulatedCity = "Austin, TX";
          } else if (Math.abs(latitude - 29.42) < 2 && Math.abs(longitude + 98.49) < 2) {
            simulatedZip = "78205";
            simulatedCity = "San Antonio, TX";
          }
          // Other states for variety
          else if (Math.abs(latitude - 40.7) < 2 && Math.abs(longitude + 74) < 2) {
            simulatedZip = "10001";
            simulatedCity = "New York, NY";
          } else if (Math.abs(latitude - 34) < 2 && Math.abs(longitude + 118) < 2) {
            simulatedZip = "90210";
            simulatedCity = "Los Angeles, CA";
          } else if (Math.abs(latitude - 41.8) < 2 && Math.abs(longitude + 87.6) < 2) {
            simulatedZip = "60601";
            simulatedCity = "Chicago, IL";
          }
          
          setDetectedZipCode(simulatedZip);
          setDetectedCity(simulatedCity);
          setShowLocalResources(true);
        },
        (error) => {
          console.log("Location access denied:", error);
          alert("Unable to access your location. Please enter your ZIP code instead.");
        }
      );
    } else {
      alert("Geolocation is not supported by your browser. Please enter your ZIP code instead.");
    }
  };

  const handleZipCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userZipCode.length === 5 && /^\d{5}$/.test(userZipCode)) {
      setShowLocalResources(true);
      setLocationEnabled(true);
      setDetectedZipCode(userZipCode);
      
      // Map known ZIP codes to cities
      const zipToCity: Record<string, string> = {
        // Tennessee
        "37203": "Nashville, TN",
        "37204": "Nashville, TN",
        "37212": "Nashville, TN",
        "38104": "Memphis, TN",
        "38116": "Memphis, TN",
        "38115": "Memphis, TN",
        "37902": "Knoxville, TN",
        "37918": "Knoxville, TN",
        "37404": "Chattanooga, TN",
        "37402": "Chattanooga, TN",
        "38301": "Jackson, TN",
        "37129": "Murfreesboro, TN",
        // Texas
        "77002": "Houston, TX",
        "77030": "Houston, TX",
        "77024": "Houston, TX",
        "75201": "Dallas, TX",
        "75234": "Dallas, TX",
        "75235": "Dallas, TX",
        "75208": "Dallas, TX",
        "78701": "Austin, TX",
        "78756": "Austin, TX",
        "78705": "Austin, TX",
        "78205": "San Antonio, TX",
        "78207": "San Antonio, TX",
        "76104": "Fort Worth, TX",
        "79905": "El Paso, TX",
        "79401": "Lubbock, TX",
        "78401": "Corpus Christi, TX",
        // Other states
        "10001": "New York, NY",
        "90210": "Los Angeles, CA",
        "94102": "San Francisco, CA",
        "60601": "Chicago, IL",
        "33101": "Miami, FL"
      };
      
      // Try to find city, or use generic area message
      const city = zipToCity[userZipCode];
      if (city) {
        setDetectedCity(city);
      } else {
        // Try to guess based on ZIP prefix
        const prefix = userZipCode.substring(0, 3);
        if (prefix.startsWith("77")) setDetectedCity("Houston area, TX");
        else if (prefix.startsWith("75")) setDetectedCity("Dallas area, TX");
        else if (prefix.startsWith("78")) setDetectedCity("Central Texas");
        else if (prefix.startsWith("76")) setDetectedCity("Fort Worth area, TX");
        else if (prefix.startsWith("79")) setDetectedCity("West Texas");
        else if (prefix.startsWith("372") || prefix.startsWith("373")) setDetectedCity("Nashville area, TN");
        else if (prefix.startsWith("381")) setDetectedCity("Memphis area, TN");
        else if (prefix.startsWith("379")) setDetectedCity("Knoxville area, TN");
        else if (prefix.startsWith("374")) setDetectedCity("Chattanooga area, TN");
        else setDetectedCity(`ZIP ${userZipCode}`);
      }
    } else {
      alert("Please enter a valid 5-digit ZIP code");
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
              <h2 className="text-3xl md:text-4xl text-gray-900">
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
                <Card key={helpline.id} className="border-2 border-red-200 bg-red-50/50">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-gray-900">{helpline.name}</CardTitle>
                      <Badge className="bg-red-600 hover:bg-red-700">Crisis</Badge>
                    </div>
                    <CardDescription className="text-gray-700">
                      {helpline.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2 text-gray-900">
                      <Phone className="h-5 w-5 text-red-600" />
                      <a
                        href={`tel:${helpline.phone.replace(/[^0-9]/g, "")}`}
                        className="text-lg hover:underline"
                      >
                        {helpline.phone}
                      </a>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      <Clock className="h-5 w-5 text-red-600" />
                      <span>{helpline.availability}</span>
                    </div>
                    {helpline.website && (
                      <div className="flex items-center gap-2">
                        <Globe className="h-5 w-5 text-red-600" />
                        <a
                          href={helpline.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-red-700 hover:underline"
                        >
                          Visit Website
                        </a>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Other Helplines */}
          <div className="mb-12">
            <h3 className="text-2xl mb-6 text-gray-900">
              National & International Resources
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {otherHelplines.map((helpline) => (
                <Card key={helpline.id}>
                  <CardHeader>
                    <CardTitle className="text-gray-900">{helpline.name}</CardTitle>
                    <CardDescription className="text-gray-700">
                      {helpline.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2 text-gray-900">
                      <Phone className="h-5 w-5 text-teal-600" />
                      <a
                        href={`tel:${helpline.phone.replace(/[^0-9]/g, "")}`}
                        className="hover:underline"
                      >
                        {helpline.phone}
                      </a>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      <Clock className="h-5 w-5 text-teal-600" />
                      <span className="text-sm">{helpline.availability}</span>
                    </div>
                    {helpline.website && (
                      <div className="flex items-center gap-2">
                        <Globe className="h-5 w-5 text-teal-600" />
                        <a
                          href={helpline.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-teal-700 hover:underline"
                        >
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
          <Card className="mb-8 bg-gradient-to-r from-teal-50 to-blue-50 border-2 border-teal-200">
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <Target className="h-6 w-6 text-teal-600" />
                <CardTitle className="text-gray-900">Find Local Resources</CardTitle>
              </div>
              <CardDescription>
                Get personalized access to mental health resources in your area
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <Label htmlFor="zipcode" className="text-sm text-gray-700 mb-2 block">
                      Enter Your ZIP Code
                    </Label>
                    <form onSubmit={handleZipCodeSubmit} className="flex gap-2">
                      <Input
                        id="zipcode"
                        type="text"
                        placeholder="e.g., 10001"
                        value={userZipCode}
                        onChange={(e) => setUserZipCode(e.target.value)}
                        maxLength={5}
                        className="flex-1"
                      />
                      <Button
                        type="submit"
                        className="bg-teal-600 hover:bg-teal-700"
                      >
                        <MapPin className="h-4 w-4 mr-2" />
                        Find
                      </Button>
                    </form>
                  </div>
                  <div className="flex items-end">
                    <div className="text-center md:px-4">
                      <p className="text-sm text-gray-600 mb-2">or</p>
                    </div>
                  </div>
                  <div className="flex-1 flex items-end">
                    <Button
                      onClick={handleEnableLocation}
                      variant="outline"
                      className="w-full"
                    >
                      <Navigation className="h-4 w-4 mr-2" />
                      Use My Location
                    </Button>
                  </div>
                </div>
                <p className="text-xs text-gray-500">
                  We'll show crisis centers and resources near you. Your location data is never stored.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Local Resources - Shown only when location is enabled */}
          {showLocalResources && (
            <div className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <MapPin className="h-6 w-6 text-teal-600" />
                  <h3 className="text-2xl text-gray-900">Local Resources Near You</h3>
                  <Badge className="bg-teal-600">
                    {detectedCity || `ZIP: ${detectedZipCode || userZipCode}`}
                  </Badge>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setLocationEnabled(false);
                    setShowLocalResources(false);
                    setUserZipCode("");
                    setDetectedCity("");
                    setDetectedZipCode("");
                  }}
                >
                  <X className="h-4 w-4 mr-2" />
                  Clear Location
                </Button>
              </div>
              
              {filteredLocalResources.length > 0 ? (
                <div className="space-y-4">
                  <p className="text-sm text-gray-600">
                    Found <strong>{filteredLocalResources.length}</strong> mental health resource{filteredLocalResources.length !== 1 ? 's' : ''} near you
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredLocalResources.map((resource) => {
                      const typeBadge = getTypeBadge(resource.type);
                      return (
                        <Card key={resource.id} className="border-2 border-teal-300 bg-gradient-to-br from-white to-teal-50 shadow-lg hover:shadow-xl transition-shadow">
                          <CardHeader>
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex-1">
                                <CardTitle className="text-gray-900 flex items-center gap-2 mb-1">
                                  <Building2 className="h-5 w-5 text-teal-600" />
                                  {resource.name}
                                </CardTitle>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                  <MapPin className="h-3 w-3" />
                                  {resource.city}, {resource.state} {resource.zipCode}
                                </div>
                              </div>
                              <Badge className={typeBadge.className}>
                                {typeBadge.label}
                              </Badge>
                            </div>
                            <CardDescription className="text-gray-700 text-sm">
                              {resource.description}
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            <div className="flex items-center gap-2 text-gray-900">
                              <Phone className="h-5 w-5 text-teal-600" />
                              <a
                                href={`tel:${resource.phone.replace(/[^0-9]/g, "")}`}
                                className="text-lg hover:underline font-medium"
                              >
                                {resource.phone}
                              </a>
                            </div>
                            <div className="flex items-center gap-2 text-gray-700">
                              <Clock className="h-5 w-5 text-teal-600" />
                              <span className="text-sm">{resource.availability}</span>
                            </div>
                            
                            {resource.services && resource.services.length > 0 && (
                              <div className="pt-2 border-t border-teal-200">
                                <p className="text-xs text-gray-600 mb-1">Services:</p>
                                <div className="flex flex-wrap gap-1">
                                  {resource.services.slice(0, 3).map((service, idx) => (
                                    <Badge key={idx} variant="secondary" className="text-xs bg-teal-100 text-teal-800">
                                      {service}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                            
                            {(resource.acceptsInsurance || resource.slidingScale) && (
                              <div className="flex gap-2 pt-2">
                                {resource.acceptsInsurance && (
                                  <Badge variant="outline" className="text-xs border-green-300 text-green-700">
                                    Accepts Insurance
                                  </Badge>
                                )}
                                {resource.slidingScale && (
                                  <Badge variant="outline" className="text-xs border-blue-300 text-blue-700">
                                    Sliding Scale
                                  </Badge>
                                )}
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <Alert className="bg-yellow-50 border-yellow-200">
                  <AlertCircle className="h-5 w-5 text-yellow-600" />
                  <AlertDescription className="text-yellow-900">
                    <strong>No local resources found for ZIP code {detectedZipCode || userZipCode}.</strong>
                    <p className="mt-2 text-sm">
                      We don't have specific resources in our database for this area yet. 
                      Please try the national helplines above, or contact{" "}
                      <strong className="text-yellow-950">988 (Suicide & Crisis Lifeline)</strong> for immediate support and local referrals.
                    </p>
                    <p className="mt-2 text-sm">
                      Try searching with a nearby city's ZIP code, or contact us to add resources for your area.
                    </p>
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
