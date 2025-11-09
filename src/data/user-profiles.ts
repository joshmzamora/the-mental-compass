export interface UserProfile {
  id: string;
  name: string;
  initials: string;
  joinedDate: Date;
  postsCreated: string[]; // Array of post IDs
  commentsCreated: string[]; // Array of comment IDs
  bio?: string;
  interests?: string[];
}

export const userProfiles: UserProfile[] = [
  {
    id: "mock1",
    name: "Sarah M.",
    initials: "SM",
    joinedDate: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000), // 6 months ago
    postsCreated: ["1"],
    commentsCreated: [],
    bio: "Living with anxiety, learning to thrive. Marketing professional finding my balance.",
    interests: ["Anxiety", "Coping Strategies", "Workplace Wellness"]
  },
  {
    id: "mock2",
    name: "Mike T.",
    initials: "MT",
    joinedDate: new Date(Date.now() - 200 * 24 * 60 * 60 * 1000),
    postsCreated: [],
    commentsCreated: ["r1"],
    bio: "Therapist and mental health advocate. Here to support and learn.",
    interests: ["Anxiety", "Stress Management", "Therapy"]
  },
  {
    id: "mock3",
    name: "John D.",
    initials: "JD",
    joinedDate: new Date(Date.now() - 150 * 24 * 60 * 60 * 1000),
    postsCreated: ["2"],
    commentsCreated: [],
    bio: "Recovery warrior. 30 days strong in therapy!",
    interests: ["Support", "Recovery", "Personal Growth"]
  },
  {
    id: "mock4",
    name: "Maya P.",
    initials: "MP",
    joinedDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
    postsCreated: ["3"],
    commentsCreated: [],
    bio: "Yoga instructor exploring mindfulness and mental wellness.",
    interests: ["Wellness", "Self-Care", "Mindfulness"]
  },
  {
    id: "mock5",
    name: "Carlos R.",
    initials: "CR",
    joinedDate: new Date(Date.now() - 220 * 24 * 60 * 60 * 1000),
    postsCreated: ["4"],
    commentsCreated: [],
    bio: "Learning to support my partner through depression. Looking for guidance.",
    interests: ["Depression", "Relationships", "Support"]
  },
  {
    id: "mock6",
    name: "Amanda K.",
    initials: "AK",
    joinedDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    postsCreated: ["5"],
    commentsCreated: [],
    bio: "New to therapy, excited for the journey ahead!",
    interests: ["Support", "Wellness", "Personal Growth"]
  },
  {
    id: "mock7",
    name: "Kevin L.",
    initials: "KL",
    joinedDate: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000),
    postsCreated: ["6"],
    commentsCreated: [],
    bio: "Breaking stigmas, one conversation at a time. Men's mental health matters.",
    interests: ["Support", "Wellness", "Advocacy"]
  },
  {
    id: "mock8",
    name: "Emma L.",
    initials: "EL",
    joinedDate: new Date(Date.now() - 240 * 24 * 60 * 60 * 1000),
    postsCreated: [],
    commentsCreated: ["r1-2"],
    bio: "Corporate consultant, anxiety survivor, coffee enthusiast.",
    interests: ["Anxiety", "Work-Life Balance", "Coping Strategies"]
  },
  {
    id: "mock9",
    name: "Rachel W.",
    initials: "RW",
    joinedDate: new Date(Date.now() - 280 * 24 * 60 * 60 * 1000),
    postsCreated: [],
    commentsCreated: ["r2-1"],
    bio: "Celebrating others' victories like they're my own. You've got this!",
    interests: ["Support", "Recovery", "Encouragement"]
  },
  {
    id: "mock10",
    name: "Lisa H.",
    initials: "LH",
    joinedDate: new Date(Date.now() - 320 * 24 * 60 * 60 * 1000),
    postsCreated: [],
    commentsCreated: ["r3-1"],
    bio: "Meditation teacher and mindfulness advocate.",
    interests: ["Wellness", "Self-Care", "Mindfulness", "Meditation"]
  },
  {
    id: "mock11",
    name: "Nina S.",
    initials: "NS",
    joinedDate: new Date(Date.now() - 400 * 24 * 60 * 60 * 1000),
    postsCreated: [],
    commentsCreated: ["r4-1"],
    bio: "Psychologist specializing in couples therapy and depression.",
    interests: ["Depression", "Relationships", "Professional Support"]
  },
  {
    id: "mock12",
    name: "Tom B.",
    initials: "TB",
    joinedDate: new Date(Date.now() - 190 * 24 * 60 * 60 * 1000),
    postsCreated: [],
    commentsCreated: ["r4-2"],
    bio: "Living with depression. Sharing what I've learned along the way.",
    interests: ["Depression", "Support", "Relationships"]
  },
  {
    id: "mock13",
    name: "Jennifer M.",
    initials: "JM",
    joinedDate: new Date(Date.now() - 450 * 24 * 60 * 60 * 1000),
    postsCreated: [],
    commentsCreated: ["r5-1"],
    bio: "Therapist with 10 years experience. Here to demystify the therapy process.",
    interests: ["Therapy", "Support", "Professional Insights"]
  },
  {
    id: "mock14",
    name: "David K.",
    initials: "DK",
    joinedDate: new Date(Date.now() - 160 * 24 * 60 * 60 * 1000),
    postsCreated: [],
    commentsCreated: ["r1-3"],
    bio: "Tech professional managing workplace anxiety through therapy and CBT.",
    interests: ["Anxiety", "Therapy", "Coping Strategies"]
  },
  {
    id: "mock15",
    name: "Alex P.",
    initials: "AP",
    joinedDate: new Date(Date.now() - 210 * 24 * 60 * 60 * 1000),
    postsCreated: [],
    commentsCreated: ["r5-2"],
    bio: "Therapy advocate. Finding the right therapist changed my life!",
    interests: ["Therapy", "Support", "Self-Discovery"]
  },
  {
    id: "mock16",
    name: "Marcus J.",
    initials: "MJ",
    joinedDate: new Date(Date.now() - 270 * 24 * 60 * 60 * 1000),
    postsCreated: [],
    commentsCreated: ["r6-1"],
    bio: "Former athlete, current mental health advocate. Strength is asking for help.",
    interests: ["Support", "Men's Mental Health", "Wellness"]
  },
  {
    id: "mock17",
    name: "Sophie C.",
    initials: "SC",
    joinedDate: new Date(Date.now() - 500 * 24 * 60 * 60 * 1000),
    postsCreated: [],
    commentsCreated: ["r6-2"],
    bio: "Suicide prevention advocate. Every conversation matters.",
    interests: ["Support", "Advocacy", "Crisis Prevention"]
  },
  {
    id: "mock18",
    name: "Priya N.",
    initials: "PN",
    joinedDate: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000),
    postsCreated: ["7"],
    commentsCreated: [],
    bio: "Navigating social anxiety one family gathering at a time.",
    interests: ["Anxiety", "Social Anxiety", "Relationships"]
  },
  {
    id: "mock19",
    name: "Hannah R.",
    initials: "HR",
    joinedDate: new Date(Date.now() - 300 * 24 * 60 * 60 * 1000),
    postsCreated: [],
    commentsCreated: ["r7-1"],
    bio: "Social worker helping others set healthy boundaries.",
    interests: ["Anxiety", "Boundaries", "Family Dynamics"]
  },
  {
    id: "mock20",
    name: "Tyler M.",
    initials: "TM",
    joinedDate: new Date(Date.now() - 250 * 24 * 60 * 60 * 1000),
    postsCreated: ["8"],
    commentsCreated: [],
    bio: "PTSD warrior. In therapy and fighting nightmares one day at a time.",
    interests: ["PTSD", "Trauma", "Coping Strategies"]
  },
  {
    id: "mock21",
    name: "Veteran Dan",
    initials: "VD",
    joinedDate: new Date(Date.now() - 600 * 24 * 60 * 60 * 1000),
    postsCreated: [],
    commentsCreated: ["r8-1"],
    bio: "Military veteran sharing PTSD recovery strategies. You're not alone.",
    interests: ["PTSD", "Veterans", "Recovery"]
  },
  {
    id: "mock22",
    name: "Olivia T.",
    initials: "OT",
    joinedDate: new Date(Date.now() - 100 * 24 * 60 * 60 * 1000),
    postsCreated: ["9"],
    commentsCreated: [],
    bio: "New mom navigating postpartum depression. Learning it's okay to not be okay.",
    interests: ["Depression", "Postpartum", "Support"]
  },
  {
    id: "mock23",
    name: "Maria V.",
    initials: "MV",
    joinedDate: new Date(Date.now() - 350 * 24 * 60 * 60 * 1000),
    postsCreated: [],
    commentsCreated: ["r9-1"],
    bio: "PPD survivor. Got help, got better. You can too!",
    interests: ["Depression", "Postpartum", "Recovery"]
  },
  {
    id: "mock24",
    name: "Dr. Sarah K.",
    initials: "SK",
    joinedDate: new Date(Date.now() - 700 * 24 * 60 * 60 * 1000),
    postsCreated: [],
    commentsCreated: ["r9-2"],
    bio: "Licensed therapist specializing in maternal mental health.",
    interests: ["Depression", "Postpartum", "Professional Support"]
  },
  {
    id: "mock25",
    name: "Jordan F.",
    initials: "JF",
    joinedDate: new Date(Date.now() - 380 * 24 * 60 * 60 * 1000),
    postsCreated: ["10"],
    commentsCreated: [],
    bio: "OCD advocate. Your thoughts don't define you.",
    interests: ["OCD", "Support", "Advocacy"]
  },
  {
    id: "mock26",
    name: "Riley C.",
    initials: "RC",
    joinedDate: new Date(Date.now() - 140 * 24 * 60 * 60 * 1000),
    postsCreated: [],
    commentsCreated: ["r10-1"],
    bio: "Dealing with OCD intrusive thoughts. Finding community here.",
    interests: ["OCD", "Support", "Coping Strategies"]
  },
  {
    id: "mock27",
    name: "Samantha B.",
    initials: "SB",
    joinedDate: new Date(Date.now() - 420 * 24 * 60 * 60 * 1000),
    postsCreated: ["11"],
    commentsCreated: [],
    bio: "Grieving mom. Taking it one day at a time.",
    interests: ["Grief", "Support", "Coping Strategies"]
  },
  {
    id: "mock28",
    name: "Patricia W.",
    initials: "PW",
    joinedDate: new Date(Date.now() - 550 * 24 * 60 * 60 * 1000),
    postsCreated: [],
    commentsCreated: ["r11-1"],
    bio: "Grief counselor and compassionate listener.",
    interests: ["Grief", "Support", "Professional Counseling"]
  },
  {
    id: "mock29",
    name: "Chris H.",
    initials: "CH",
    joinedDate: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
    postsCreated: ["12"],
    commentsCreated: [],
    bio: "Newly diagnosed with Bipolar II. Learning and growing.",
    interests: ["Bipolar", "Support", "Diagnosis Journey"]
  },
  {
    id: "mock30",
    name: "Lauren G.",
    initials: "LG",
    joinedDate: new Date(Date.now() - 480 * 24 * 60 * 60 * 1000),
    postsCreated: [],
    commentsCreated: ["r12-1"],
    bio: "Living well with Bipolar II for 5+ years. Happy to help!",
    interests: ["Bipolar", "Support", "Mood Tracking"]
  },
  {
    id: "mock31",
    name: "Megan S.",
    initials: "MS",
    joinedDate: new Date(Date.now() - 390 * 24 * 60 * 60 * 1000),
    postsCreated: ["13"],
    commentsCreated: [],
    bio: "Eating disorder recovery warrior. One year strong!",
    interests: ["Eating Disorders", "Recovery", "Body Positivity"]
  },
  {
    id: "mock32",
    name: "Ashley D.",
    initials: "AD",
    joinedDate: new Date(Date.now() - 100 * 24 * 60 * 60 * 1000),
    postsCreated: [],
    commentsCreated: ["r13-1"],
    bio: "3 months into ED treatment. Taking it day by day.",
    interests: ["Eating Disorders", "Recovery", "Support"]
  },
  {
    id: "mock33",
    name: "Ryan P.",
    initials: "RP",
    joinedDate: new Date(Date.now() - 520 * 24 * 60 * 60 * 1000),
    postsCreated: ["14"],
    commentsCreated: [],
    bio: "Proud to be on antidepressants. Medication is healthcare!",
    interests: ["Medication", "Support", "Anti-Stigma"]
  },
  {
    id: "mock34",
    name: "Nicole K.",
    initials: "NK",
    joinedDate: new Date(Date.now() - 430 * 24 * 60 * 60 * 1000),
    postsCreated: [],
    commentsCreated: ["r14-1"],
    bio: "Medication saved my life. Fighting stigma one conversation at a time.",
    interests: ["Medication", "Support", "Advocacy"]
  },
  {
    id: "mock35",
    name: "Derek M.",
    initials: "DM",
    joinedDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
    postsCreated: ["15"],
    commentsCreated: [],
    bio: "Complete beginner to mindfulness. Excited to learn!",
    interests: ["Mindfulness", "Wellness", "Self-Care"]
  },
  {
    id: "mock36",
    name: "Yuki T.",
    initials: "YT",
    joinedDate: new Date(Date.now() - 410 * 24 * 60 * 60 * 1000),
    postsCreated: [],
    commentsCreated: ["r15-1"],
    bio: "Mindfulness practitioner and meditation guide.",
    interests: ["Mindfulness", "Meditation", "Wellness"]
  }
];

export function getUserProfile(userId: string): UserProfile | undefined {
  return userProfiles.find(profile => profile.id === userId);
}

export function getUserPosts(userId: string): string[] {
  const profile = getUserProfile(userId);
  return profile?.postsCreated || [];
}

export function getUserComments(userId: string): string[] {
  const profile = getUserProfile(userId);
  return profile?.commentsCreated || [];
}
