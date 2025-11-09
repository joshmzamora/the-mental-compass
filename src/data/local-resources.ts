export interface LocalResource {
  id: string;
  name: string;
  phone: string;
  description: string;
  type: "crisis" | "counseling" | "support" | "psychiatric" | "youth" | "veterans" | "substance";
  availability: string;
  zipCode: string;
  city: string;
  state: string;
  address?: string;
  services?: string[];
  acceptsInsurance?: boolean;
  slidingScale?: boolean;
}

// Comprehensive database of local mental health resources
// Focused on Texas and Tennessee with coverage across other states
export const localResources: LocalResource[] = [
  // TEXAS - Major Cities
  // Houston Area (770xx)
  {
    id: "tx-houston-1",
    name: "Houston Crisis Center",
    phone: "(713) 228-1505",
    description: "24/7 crisis intervention, suicide prevention, and emotional support",
    type: "crisis",
    availability: "24/7",
    zipCode: "77002",
    city: "Houston",
    state: "TX",
    address: "P.O. Box 130866, Houston, TX 77219",
    services: ["Crisis intervention", "Suicide prevention", "Emotional support"],
    acceptsInsurance: false,
    slidingScale: true
  },
  {
    id: "tx-houston-2",
    name: "The Menninger Clinic",
    phone: "(713) 275-5000",
    description: "Comprehensive psychiatric hospital offering specialized mental health treatment",
    type: "psychiatric",
    availability: "24/7 Admissions",
    zipCode: "77030",
    city: "Houston",
    state: "TX",
    address: "12301 Main St, Houston, TX 77035",
    services: ["Inpatient care", "Mood disorders", "Trauma treatment"],
    acceptsInsurance: true,
    slidingScale: false
  },
  {
    id: "tx-houston-3",
    name: "Memorial Assistance Ministries",
    phone: "(281) 468-4516",
    description: "Community-based counseling and mental health support services",
    type: "counseling",
    availability: "Mon-Fri 9am-5pm",
    zipCode: "77024",
    city: "Houston",
    state: "TX",
    services: ["Individual therapy", "Family counseling", "Support groups"],
    acceptsInsurance: true,
    slidingScale: true
  },
  {
    id: "tx-houston-4",
    name: "Houston VA Mental Health Clinic",
    phone: "(713) 794-7145",
    description: "Specialized mental health services for veterans and active military",
    type: "veterans",
    availability: "Mon-Fri 8am-4:30pm",
    zipCode: "77030",
    city: "Houston",
    state: "TX",
    services: ["PTSD treatment", "Veterans counseling", "Substance abuse"],
    acceptsInsurance: true,
    slidingScale: false
  },
  
  // Dallas Area (752xx, 750xx)
  {
    id: "tx-dallas-1",
    name: "Dallas Crisis Center - Suicide Hotline",
    phone: "(214) 828-1000",
    description: "24/7 crisis support and suicide prevention services for Dallas metro",
    type: "crisis",
    availability: "24/7",
    zipCode: "75201",
    city: "Dallas",
    state: "TX",
    services: ["Crisis calls", "Suicide prevention", "Referrals"],
    acceptsInsurance: false,
    slidingScale: true
  },
  {
    id: "tx-dallas-2",
    name: "Metrocare Services",
    phone: "(214) 743-1200",
    description: "Community mental health center serving Dallas County residents",
    type: "counseling",
    availability: "Mon-Fri 8am-5pm",
    zipCode: "75234",
    city: "Dallas",
    state: "TX",
    services: ["Outpatient therapy", "Medication management", "Case management"],
    acceptsInsurance: true,
    slidingScale: true
  },
  {
    id: "tx-dallas-3",
    name: "Children's Health Psychiatric Emergency",
    phone: "(214) 456-2273",
    description: "Emergency psychiatric services for children and adolescents",
    type: "youth",
    availability: "24/7",
    zipCode: "75235",
    city: "Dallas",
    state: "TX",
    services: ["Youth crisis care", "Assessment", "Stabilization"],
    acceptsInsurance: true,
    slidingScale: false
  },
  {
    id: "tx-dallas-4",
    name: "Nexus Recovery Center",
    phone: "(214) 321-0156",
    description: "Substance abuse and dual diagnosis treatment programs",
    type: "substance",
    availability: "24/7 Admissions",
    zipCode: "75208",
    city: "Dallas",
    state: "TX",
    services: ["Detox", "Residential treatment", "Dual diagnosis"],
    acceptsInsurance: true,
    slidingScale: true
  },

  // Austin Area (787xx)
  {
    id: "tx-austin-1",
    name: "Integral Care Crisis Helpline",
    phone: "(512) 472-4357",
    description: "24/7 mental health crisis services for Travis County",
    type: "crisis",
    availability: "24/7",
    zipCode: "78701",
    city: "Austin",
    state: "TX",
    services: ["Crisis intervention", "Mobile crisis team", "Walk-in services"],
    acceptsInsurance: true,
    slidingScale: true
  },
  {
    id: "tx-austin-2",
    name: "Austin Child Guidance Center",
    phone: "(512) 451-2242",
    description: "Mental health services for children, adolescents, and families",
    type: "youth",
    availability: "Mon-Fri 8am-5pm",
    zipCode: "78756",
    city: "Austin",
    state: "TX",
    services: ["Play therapy", "Family therapy", "School consultation"],
    acceptsInsurance: true,
    slidingScale: true
  },
  {
    id: "tx-austin-3",
    name: "Seton Mind Institute",
    phone: "(512) 324-2039",
    description: "Comprehensive psychiatric and mental health services",
    type: "psychiatric",
    availability: "Mon-Fri 8am-5pm, Emergency 24/7",
    zipCode: "78705",
    city: "Austin",
    state: "TX",
    services: ["Psychiatric evaluation", "Medication management", "Therapy"],
    acceptsInsurance: true,
    slidingScale: false
  },

  // San Antonio Area (782xx)
  {
    id: "tx-sa-1",
    name: "United Way Crisis Helpline - San Antonio",
    phone: "(210) 227-4357",
    description: "24/7 emotional support and crisis intervention",
    type: "crisis",
    availability: "24/7",
    zipCode: "78205",
    city: "San Antonio",
    state: "TX",
    services: ["Crisis support", "Referrals", "Information"],
    acceptsInsurance: false,
    slidingScale: true
  },
  {
    id: "tx-sa-2",
    name: "Center for Health Care Services",
    phone: "(210) 223-7233",
    description: "Community mental health and substance abuse services",
    type: "counseling",
    availability: "Mon-Fri 8am-5pm",
    zipCode: "78207",
    city: "San Antonio",
    state: "TX",
    services: ["Outpatient therapy", "Substance abuse treatment", "Peer support"],
    acceptsInsurance: true,
    slidingScale: true
  },

  // Fort Worth Area (761xx)
  {
    id: "tx-fw-1",
    name: "MHMR of Tarrant County Crisis Line",
    phone: "(817) 569-4673",
    description: "Mental health crisis services for Tarrant County residents",
    type: "crisis",
    availability: "24/7",
    zipCode: "76104",
    city: "Fort Worth",
    state: "TX",
    services: ["Crisis intervention", "Assessment", "Stabilization"],
    acceptsInsurance: true,
    slidingScale: true
  },
  {
    id: "tx-fw-2",
    name: "Cook Children's Psychiatry",
    phone: "(682) 885-2500",
    description: "Pediatric mental health and behavioral services",
    type: "youth",
    availability: "Mon-Fri 8am-5pm",
    zipCode: "76104",
    city: "Fort Worth",
    state: "TX",
    services: ["Child psychiatry", "Adolescent therapy", "Family support"],
    acceptsInsurance: true,
    slidingScale: false
  },

  // El Paso Area (799xx)
  {
    id: "tx-ep-1",
    name: "Emergence Health Network Crisis Line",
    phone: "(915) 779-1800",
    description: "24/7 crisis intervention and mental health services",
    type: "crisis",
    availability: "24/7",
    zipCode: "79905",
    city: "El Paso",
    state: "TX",
    services: ["Crisis support", "Mobile crisis", "Peer services"],
    acceptsInsurance: true,
    slidingScale: true
  },

  // Smaller Texas Cities
  {
    id: "tx-lubbock-1",
    name: "StarCare Specialty Health System",
    phone: "(806) 740-1414",
    description: "Community mental health services for Lubbock County",
    type: "counseling",
    availability: "Mon-Fri 8am-5pm",
    zipCode: "79401",
    city: "Lubbock",
    state: "TX",
    services: ["Therapy", "Case management", "Crisis services"],
    acceptsInsurance: true,
    slidingScale: true
  },
  {
    id: "tx-corpus-1",
    name: "Gulf Bend Center Crisis Line",
    phone: "(361) 693-5111",
    description: "Mental health crisis services for Coastal Bend area",
    type: "crisis",
    availability: "24/7",
    zipCode: "78401",
    city: "Corpus Christi",
    state: "TX",
    services: ["Crisis intervention", "Screening", "Referrals"],
    acceptsInsurance: true,
    slidingScale: true
  },

  // TENNESSEE - Major Cities
  // Nashville Area (372xx)
  {
    id: "tn-nash-1",
    name: "Crisis Center - Nashville",
    phone: "(615) 244-7444",
    description: "24/7 crisis intervention and suicide prevention services",
    type: "crisis",
    availability: "24/7",
    zipCode: "37203",
    city: "Nashville",
    state: "TN",
    services: ["Crisis calls", "Suicide prevention", "Community education"],
    acceptsInsurance: false,
    slidingScale: true
  },
  {
    id: "tn-nash-2",
    name: "Centerstone Mental Health Services",
    phone: "(615) 463-6600",
    description: "Comprehensive mental health and substance abuse treatment",
    type: "counseling",
    availability: "Mon-Fri 8am-5pm",
    zipCode: "37204",
    city: "Nashville",
    state: "TN",
    services: ["Individual therapy", "Group therapy", "Psychiatric services"],
    acceptsInsurance: true,
    slidingScale: true
  },
  {
    id: "tn-nash-3",
    name: "Vanderbilt Psychiatric Hospital",
    phone: "(615) 322-2303",
    description: "Acute inpatient and outpatient psychiatric care",
    type: "psychiatric",
    availability: "24/7 Admissions",
    zipCode: "37212",
    city: "Nashville",
    state: "TN",
    services: ["Inpatient care", "Partial hospitalization", "Intensive outpatient"],
    acceptsInsurance: true,
    slidingScale: false
  },
  {
    id: "tn-nash-4",
    name: "Tennessee Valley Healthcare System",
    phone: "(615) 327-4751",
    description: "VA mental health services for veterans in Middle Tennessee",
    type: "veterans",
    availability: "Mon-Fri 8am-4:30pm",
    zipCode: "37212",
    city: "Nashville",
    state: "TN",
    services: ["PTSD programs", "Substance abuse treatment", "Counseling"],
    acceptsInsurance: true,
    slidingScale: false
  },

  // Memphis Area (381xx)
  {
    id: "tn-mem-1",
    name: "Memphis Crisis Center",
    phone: "(901) 274-7477",
    description: "24/7 crisis intervention and emotional support hotline",
    type: "crisis",
    availability: "24/7",
    zipCode: "38104",
    city: "Memphis",
    state: "TN",
    services: ["Crisis calls", "Suicide prevention", "Teen support"],
    acceptsInsurance: false,
    slidingScale: true
  },
  {
    id: "tn-mem-2",
    name: "Alliance Healthcare Services",
    phone: "(901) 686-1000",
    description: "Community mental health center serving Shelby County",
    type: "counseling",
    availability: "Mon-Fri 8am-5pm",
    zipCode: "38116",
    city: "Memphis",
    state: "TN",
    services: ["Outpatient therapy", "Case management", "Peer support"],
    acceptsInsurance: true,
    slidingScale: true
  },
  {
    id: "tn-mem-3",
    name: "Lakeside Behavioral Health System",
    phone: "(901) 377-4700",
    description: "Psychiatric hospital for children, adolescents, and adults",
    type: "psychiatric",
    availability: "24/7",
    zipCode: "38115",
    city: "Memphis",
    state: "TN",
    services: ["Inpatient treatment", "Crisis stabilization", "Day programs"],
    acceptsInsurance: true,
    slidingScale: false
  },

  // Knoxville Area (379xx)
  {
    id: "tn-knox-1",
    name: "Helen Ross McNabb Center Crisis Line",
    phone: "(865) 539-2409",
    description: "24/7 mental health crisis intervention",
    type: "crisis",
    availability: "24/7",
    zipCode: "37902",
    city: "Knoxville",
    state: "TN",
    services: ["Crisis intervention", "Mobile crisis", "Walk-in services"],
    acceptsInsurance: true,
    slidingScale: true
  },
  {
    id: "tn-knox-2",
    name: "Peninsula Behavioral Health",
    phone: "(865) 588-2291",
    description: "Substance abuse and mental health treatment programs",
    type: "substance",
    availability: "24/7 Admissions",
    zipCode: "37918",
    city: "Knoxville",
    state: "TN",
    services: ["Detox", "Residential treatment", "Outpatient programs"],
    acceptsInsurance: true,
    slidingScale: true
  },

  // Chattanooga Area (374xx)
  {
    id: "tn-chat-1",
    name: "Parkridge Valley Crisis Line",
    phone: "(423) 894-4220",
    description: "Mental health and substance abuse crisis services",
    type: "crisis",
    availability: "24/7",
    zipCode: "37404",
    city: "Chattanooga",
    state: "TN",
    services: ["Crisis assessment", "Stabilization", "Referrals"],
    acceptsInsurance: true,
    slidingScale: true
  },
  {
    id: "tn-chat-2",
    name: "Volunteer Behavioral Health",
    phone: "(423) 602-7900",
    description: "Community mental health services for Hamilton County",
    type: "counseling",
    availability: "Mon-Fri 8am-5pm",
    zipCode: "37402",
    city: "Chattanooga",
    state: "TN",
    services: ["Individual therapy", "Family counseling", "Medication management"],
    acceptsInsurance: true,
    slidingScale: true
  },

  // Smaller Tennessee Cities
  {
    id: "tn-jackson-1",
    name: "Pathways Behavioral Health",
    phone: "(731) 541-8200",
    description: "Mental health services for West Tennessee",
    type: "counseling",
    availability: "Mon-Fri 8am-5pm",
    zipCode: "38301",
    city: "Jackson",
    state: "TN",
    services: ["Therapy", "Crisis services", "Support groups"],
    acceptsInsurance: true,
    slidingScale: true
  },
  {
    id: "tn-murfreesboro-1",
    name: "Trustpoint Hospital Crisis Services",
    phone: "(615) 867-1111",
    description: "Psychiatric emergency and crisis stabilization",
    type: "crisis",
    availability: "24/7",
    zipCode: "37129",
    city: "Murfreesboro",
    state: "TN",
    services: ["Crisis evaluation", "Short-term stabilization", "Referrals"],
    acceptsInsurance: true,
    slidingScale: false
  },

  // OTHER STATES (for variety)
  // California
  {
    id: "ca-la-1",
    name: "Didi Hirsch Mental Health Crisis Line",
    phone: "(877) 727-4747",
    description: "24/7 crisis intervention and suicide prevention",
    type: "crisis",
    availability: "24/7",
    zipCode: "90210",
    city: "Los Angeles",
    state: "CA",
    services: ["Crisis support", "Suicide prevention", "Teen line"],
    acceptsInsurance: false,
    slidingScale: true
  },
  {
    id: "ca-sf-1",
    name: "San Francisco Suicide Prevention",
    phone: "(415) 781-0500",
    description: "24/7 crisis and suicide prevention hotline",
    type: "crisis",
    availability: "24/7",
    zipCode: "94102",
    city: "San Francisco",
    state: "CA",
    services: ["Crisis calls", "Suicide prevention", "Emotional support"],
    acceptsInsurance: false,
    slidingScale: true
  },

  // New York
  {
    id: "ny-nyc-1",
    name: "NYC Well",
    phone: "(888) 692-9355",
    description: "24/7 mental health support for New York City residents",
    type: "crisis",
    availability: "24/7",
    zipCode: "10001",
    city: "New York",
    state: "NY",
    services: ["Crisis counseling", "Referrals", "Follow-up support"],
    acceptsInsurance: false,
    slidingScale: true
  },

  // Illinois
  {
    id: "il-chicago-1",
    name: "NAMI Chicago Helpline",
    phone: "(833) 626-4244",
    description: "Mental health support and resource navigation",
    type: "support",
    availability: "Mon-Fri 9am-5pm",
    zipCode: "60601",
    city: "Chicago",
    state: "IL",
    services: ["Information", "Referrals", "Support groups"],
    acceptsInsurance: false,
    slidingScale: true
  },

  // Florida
  {
    id: "fl-miami-1",
    name: "Thriving Mind South Florida",
    phone: "(305) 549-8777",
    description: "24/7 crisis services and mental health support",
    type: "crisis",
    availability: "24/7",
    zipCode: "33101",
    city: "Miami",
    state: "FL",
    services: ["Crisis intervention", "Mobile response", "Stabilization"],
    acceptsInsurance: true,
    slidingScale: true
  },
];

// Helper function to search resources by ZIP code
export function searchResourcesByZipCode(zipCode: string): LocalResource[] {
  if (!zipCode || zipCode.length < 3) return [];
  
  const results: LocalResource[] = [];
  
  // First, find exact matches
  const exactMatches = localResources.filter(r => r.zipCode === zipCode);
  results.push(...exactMatches);
  
  // Then, find regional matches (same first 3 digits)
  const regionalMatches = localResources.filter(
    r => r.zipCode.substring(0, 3) === zipCode.substring(0, 3) && r.zipCode !== zipCode
  );
  results.push(...regionalMatches);
  
  // If we have less than 3 results, expand to nearby areas (same first 2 digits)
  if (results.length < 3 && zipCode.length >= 2) {
    const nearbyMatches = localResources.filter(
      r => r.zipCode.substring(0, 2) === zipCode.substring(0, 2) && 
           !results.some(existing => existing.id === r.id)
    );
    results.push(...nearbyMatches.slice(0, 5 - results.length));
  }
  
  return results;
}

// Helper function to get resources by state
export function getResourcesByState(state: string): LocalResource[] {
  return localResources.filter(r => r.state === state);
}

// Helper function to get crisis resources by ZIP
export function getCrisisResourcesByZipCode(zipCode: string): LocalResource[] {
  return searchResourcesByZipCode(zipCode).filter(r => r.type === "crisis");
}
