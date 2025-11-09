export interface Helpline {
  id: string;
  name: string;
  phone: string;
  description: string;
  availability: string;
  website?: string;
  type: "crisis" | "general" | "specific";
}

export const helplines: Helpline[] = [
  {
    id: "988",
    name: "988 Suicide & Crisis Lifeline",
    phone: "988",
    description: "Free and confidential emotional support for people in suicidal crisis or emotional distress, 24/7.",
    availability: "24/7",
    website: "https://988lifeline.org",
    type: "crisis"
  },
  {
    id: "crisis-text",
    name: "Crisis Text Line",
    phone: "Text HOME to 741741",
    description: "Free, 24/7 support for those in crisis. Text from anywhere in the USA to reach a trained Crisis Counselor.",
    availability: "24/7",
    website: "https://crisistextline.org",
    type: "crisis"
  },
  {
    id: "samhsa",
    name: "SAMHSA National Helpline",
    phone: "1-800-662-4357",
    description: "Free, confidential, 24/7 treatment referral and information service for individuals and families facing mental health and/or substance use disorders.",
    availability: "24/7",
    website: "https://samhsa.gov",
    type: "general"
  },
  {
    id: "nami",
    name: "NAMI HelpLine",
    phone: "1-800-950-6264",
    description: "Information, resource referrals and support for people living with a mental health condition, their family members and caregivers, mental health providers and the public.",
    availability: "Mon-Fri, 10am-10pm ET",
    website: "https://nami.org",
    type: "general"
  },
  {
    id: "trevor",
    name: "The Trevor Project",
    phone: "1-866-488-7386",
    description: "Leading national organization providing crisis intervention and suicide prevention services to LGBTQ+ young people.",
    availability: "24/7",
    website: "https://thetrevorproject.org",
    type: "specific"
  },
  {
    id: "veterans",
    name: "Veterans Crisis Line",
    phone: "988 (Press 1)",
    description: "Connects veterans in crisis and their families and friends with qualified, caring responders through a confidential toll-free hotline, online chat, or text.",
    availability: "24/7",
    website: "https://veteranscrisisline.net",
    type: "specific"
  },
  {
    id: "postpartum",
    name: "Postpartum Support International",
    phone: "1-800-944-4773",
    description: "Support for anyone experiencing prenatal and postpartum mental health issues, including depression and anxiety.",
    availability: "24/7",
    website: "https://postpartum.net",
    type: "specific"
  },
  {
    id: "disaster",
    name: "Disaster Distress Helpline",
    phone: "1-800-985-5990",
    description: "Provides immediate crisis counseling for people experiencing emotional distress related to natural or human-caused disasters.",
    availability: "24/7",
    type: "specific"
  }
];
