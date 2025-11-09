export interface GuidedJourney {
  id: string;
  title: string;
  description: string;
  duration: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  category: string;
  color: string;
  steps: JourneyStep[];
}

export interface JourneyStep {
  id: string;
  stepNumber: number;
  title: string;
  type: "article" | "exercise" | "reflection" | "meditation";
  articleId?: string; // Reference to blog post
  content?: string; // For exercises/reflections
  estimatedTime: string;
  minimumTimeSeconds?: number; // Time gate requirement (default 60)
  requiresReflection?: boolean; // If true, requires written reflection
  confirmationType?: "quiz" | "checklist" | "drag-drop"; // For active confirmation
}

export interface StepReflection {
  stepId: string;
  reflection: string;
  createdAt: string;
  timeSpent: number; // in seconds
}

export interface JourneyBadge {
  id: string;
  name: string;
  description: string;
  icon: string; // lucide icon name
  color: string;
}

export interface UserJourneyProgress {
  journeyId: string;
  currentStep: number;
  completedSteps: string[];
  startedAt: Date;
  lastAccessedAt: Date;
  completed: boolean;
  reflections: StepReflection[]; // Track all reflections
  totalTimeSpent: number; // Total time in seconds
  completedAt?: string; // When journey was completed
}

export interface CompletedJourney {
  journeyId: string;
  journeyTitle: string;
  completedAt: string;
  badge: JourneyBadge;
  totalTimeSpent: number;
  reflectionCount: number;
}

export const guidedJourneys: GuidedJourney[] = [
  {
    id: "anxiety-mapping",
    title: "7 Days to Map Your Stress Triggers",
    description: "A week-long journey to identify and understand your anxiety patterns, develop coping strategies, and build resilience.",
    duration: "7 days",
    difficulty: "Beginner",
    category: "Anxiety",
    color: "from-amber-500 to-orange-600",
    steps: [
      {
        id: "anxiety-step-1",
        stepNumber: 1,
        title: "Understanding Your Anxiety",
        type: "article",
        articleId: "4",
        estimatedTime: "7 min",
      },
      {
        id: "anxiety-step-2",
        stepNumber: 2,
        title: "Identify Your Triggers",
        type: "exercise",
        content: "Today's Exercise: Keep a trigger journal. Every time you feel anxious, write down:\n\n1. What was happening right before?\n2. Who were you with?\n3. What thoughts went through your mind?\n4. How intense was the anxiety (1-10)?\n5. What physical sensations did you notice?\n\nDon't judge yourself - just observe and record. Patterns will emerge over the next few days.",
        estimatedTime: "5 min + daily tracking",
      },
      {
        id: "anxiety-step-3",
        stepNumber: 3,
        title: "Physical Grounding Techniques",
        type: "meditation",
        content: "Grounding Exercise: The 5-4-3-2-1 Technique\n\nWhen anxiety strikes, use your senses to anchor yourself in the present:\n\n5 - Notice FIVE things you can see around you\n4 - Notice FOUR things you can touch\n3 - Notice THREE things you can hear\n2 - Notice TWO things you can smell\n1 - Notice ONE thing you can taste\n\nPractice this technique 3 times today, even when you're not anxious, so it becomes second nature.",
        estimatedTime: "10 min",
      },
      {
        id: "anxiety-step-4",
        stepNumber: 4,
        title: "Challenging Anxious Thoughts",
        type: "exercise",
        content: "Cognitive Restructuring Exercise:\n\nChoose one recurring anxious thought. Write it down, then ask:\n\n1. What evidence supports this thought?\n2. What evidence contradicts it?\n3. What would I tell a friend who had this thought?\n4. What's a more balanced way to think about this?\n5. What's the worst that could realistically happen?\n6. Could I handle that if it did happen?\n\nReframe your thought using your answers.",
        estimatedTime: "15 min",
      },
      {
        id: "anxiety-step-5",
        stepNumber: 5,
        title: "Building Daily Wellness Habits",
        type: "article",
        articleId: "2",
        estimatedTime: "4 min",
      },
      {
        id: "anxiety-step-6",
        stepNumber: 6,
        title: "Creating Your Safety Plan",
        type: "exercise",
        content: "Anxiety Action Plan:\n\nCreate your personalized plan for when anxiety becomes overwhelming:\n\n**Prevention (Daily):**\n- List 3 daily habits that reduce your baseline anxiety\n- Schedule them in your calendar\n\n**Early Warning Signs:**\n- What are your first signs of rising anxiety?\n- What can you do immediately when you notice them?\n\n**Crisis Tools:**\n- 3 grounding techniques that work for you\n- 2 people you can call\n- 1 safe space you can go to\n\n**Professional Support:**\n- Therapist contact info\n- Crisis helpline numbers\n\nKeep this plan on your phone and review it weekly.",
        estimatedTime: "20 min",
      },
      {
        id: "anxiety-step-7",
        stepNumber: 7,
        title: "Reflection and Moving Forward",
        type: "reflection",
        content: "Journey Reflection:\n\nCongratulations on completing this journey! Take time to reflect:\n\n1. What patterns did you discover in your anxiety triggers?\n2. Which techniques were most helpful?\n3. What surprised you this week?\n4. What will you continue practicing?\n5. What's one thing you're proud of?\n\nRemember: Managing anxiety is a lifelong practice. You've built a strong foundation. Consider scheduling regular check-ins with yourself to review your trigger journal and update your action plan.\n\nNext steps: Consider joining our Community Support forums to share your experience and connect with others on similar journeys.",
        estimatedTime: "15 min",
      },
    ],
  },
  {
    id: "depression-ascent",
    title: "Starting Your Depression Ascent",
    description: "A gentle 7-day introduction to understanding and managing depression through small, achievable steps.",
    duration: "7 days",
    difficulty: "Beginner",
    category: "Depression",
    color: "from-blue-500 to-indigo-600",
    steps: [
      {
        id: "depression-step-1",
        stepNumber: 1,
        title: "Sadness vs. Depression: Know the Difference",
        type: "article",
        articleId: "1",
        estimatedTime: "5 min",
      },
      {
        id: "depression-step-2",
        stepNumber: 2,
        title: "Recognizing Your Symptoms",
        type: "reflection",
        content: "Depression Awareness Exercise:\n\nGently check in with yourself. Which of these have you experienced for 2+ weeks?\n\n□ Persistent sad, anxious, or 'empty' mood\n□ Loss of interest in activities you used to enjoy\n□ Changes in appetite or weight\n□ Sleeping too much or too little\n□ Feeling tired or having low energy\n□ Difficulty concentrating or making decisions\n□ Feelings of worthlessness or guilt\n□ Thoughts of death or suicide\n\nImportant: This is for awareness only, not diagnosis. If you checked several items, please reach out to a mental health professional. You deserve support.",
        estimatedTime: "10 min",
      },
      {
        id: "depression-step-3",
        stepNumber: 3,
        title: "The Power of Small Wins",
        type: "exercise",
        content: "Behavioral Activation Exercise:\n\nDepression tells us we can't do things. Let's prove it wrong with tiny victories.\n\nToday's Challenge: Pick ONE small task you've been avoiding. Make it so small it feels almost silly:\n\n- Make your bed\n- Take a 2-minute walk\n- Drink a glass of water\n- Text one friend\n- Open the curtains\n\nDo it, then acknowledge: 'I did that. Even though it was hard, I did it.'\n\nTomorrow, add one more small task. Build slowly.",
        estimatedTime: "5-10 min",
      },
      {
        id: "depression-step-4",
        stepNumber: 4,
        title: "Connection as Medicine",
        type: "exercise",
        content: "Reaching Out Exercise:\n\nIsolation feeds depression. Connection helps heal it.\n\nToday's goal: Make one small connection:\n\n- Send a text to someone you trust\n- Comment on a friend's social media post\n- Join our Community Support forum\n- Call a helpline just to hear a supportive voice\n\nYou don't have to explain everything. Even 'Hi, thinking of you' counts.\n\nRemember: Asking for support is strength, not weakness.",
        estimatedTime: "10 min",
      },
      {
        id: "depression-step-5",
        stepNumber: 5,
        title: "Supporting a Loved One",
        type: "article",
        articleId: "6",
        estimatedTime: "6 min",
      },
      {
        id: "depression-step-6",
        stepNumber: 6,
        title: "Self-Compassion Practice",
        type: "meditation",
        content: "Self-Compassion Meditation:\n\nDepression often comes with harsh self-criticism. Let's practice kindness instead.\n\nFind a quiet moment. Place your hand on your heart. Say to yourself:\n\n'I am going through a difficult time right now.'\n'Suffering is a part of the human experience.'\n'May I be kind to myself.'\n'May I give myself the compassion I need.'\n\nNotice any resistance. That's okay. Keep coming back to kindness.\n\nRepeat this practice daily, especially when you're struggling.\n\nReminder: You would show compassion to a friend in pain. You deserve the same kindness.",
        estimatedTime: "10 min",
      },
      {
        id: "depression-step-7",
        stepNumber: 7,
        title: "Building Your Support Network",
        type: "reflection",
        content: "Support Network Mapping:\n\nYou don't have to do this alone. Let's identify your resources:\n\n**Professional Support:**\n- Do you have a therapist? If not, would you consider finding one?\n- What's stopping you from seeking professional help?\n- Review our Appointments page for options\n\n**Personal Support:**\n- List 3 people you could reach out to\n- What kind of support would help most right now?\n\n**Self-Care Resources:**\n- Which daily habits from Day 3 worked best?\n- What brings you even tiny moments of peace?\n\n**Crisis Resources:**\n- Save these numbers: National Suicide Prevention Lifeline (988)\n- Crisis Text Line: Text HOME to 741741\n\nNext Steps: If depression is significantly impacting your life, please schedule an appointment with a mental health professional. This journey is a starting point - professional support can provide the personalized care you deserve.",
        estimatedTime: "15 min",
      },
    ],
  },
  {
    id: "wellness-foundations",
    title: "Foundations of Mental Wellness",
    description: "Build sustainable daily habits that support long-term mental health and emotional resilience.",
    duration: "5 days",
    difficulty: "Beginner",
    category: "Wellness",
    color: "from-green-500 to-emerald-600",
    steps: [
      {
        id: "wellness-step-1",
        stepNumber: 1,
        title: "5 Essential Daily Habits",
        type: "article",
        articleId: "2",
        estimatedTime: "4 min",
      },
      {
        id: "wellness-step-2",
        stepNumber: 2,
        title: "Sleep: Your Mental Health Foundation",
        type: "article",
        articleId: "5",
        estimatedTime: "5 min",
      },
      {
        id: "wellness-step-3",
        stepNumber: 3,
        title: "Movement for Mental Health",
        type: "exercise",
        content: "Movement Challenge:\n\nYour brain thrives on movement. Today, commit to 15 minutes of movement you actually enjoy:\n\n- Dance to your favorite songs\n- Walk in nature\n- Gentle yoga or stretching\n- Play with a pet\n- Garden\n\nNotice: How do you feel before vs. after? Physical and mental health are deeply connected.\n\nGoal: Find movement you'd WANT to do daily, not what you think you 'should' do.",
        estimatedTime: "15 min",
      },
      {
        id: "wellness-step-4",
        stepNumber: 4,
        title: "Mindfulness in Daily Life",
        type: "meditation",
        content: "Mindful Moments Practice:\n\nYou don't need hours of meditation. Try 'mindful moments' throughout your day:\n\n**Morning:** Spend 2 minutes noticing your breath before getting out of bed\n\n**During meals:** Eat one meal without screens, really tasting each bite\n\n**Transitions:** When moving between tasks, take 3 deep breaths\n\n**Evening:** Notice 3 things you're grateful for before sleep\n\nThese small pauses reset your nervous system and build awareness.",
        estimatedTime: "10 min total",
      },
      {
        id: "wellness-step-5",
        stepNumber: 5,
        title: "Creating Your Wellness Routine",
        type: "reflection",
        content: "Personal Wellness Plan:\n\nBring it all together. Design a realistic daily routine:\n\n**Morning Routine (10-15 min):**\n- What helps you start the day grounded?\n\n**Midday Check-in (5 min):**\n- How will you pause and reset?\n\n**Movement (15-30 min):**\n- What type? When?\n\n**Connection (10 min):**\n- Who will you connect with? How?\n\n**Evening Wind-down (20 min):**\n- What helps you transition to rest?\n\n**Weekly Commitments:**\n- One social activity\n- One activity just for joy\n\nStart small. Add gradually. Consistency beats perfection.\n\nReminder: Track your wellness streak on your dashboard!",
        estimatedTime: "20 min",
      },
    ],
  },
  {
    id: "stigma-breaking",
    title: "Breaking Free from Stigma",
    description: "Understand mental health stigma, challenge internalized shame, and become an advocate for change.",
    duration: "5 days",
    difficulty: "Intermediate",
    category: "Advocacy",
    color: "from-purple-500 to-pink-600",
    steps: [
      {
        id: "stigma-step-1",
        stepNumber: 1,
        title: "Understanding Mental Health Stigma",
        type: "article",
        articleId: "3",
        estimatedTime: "6 min",
      },
      {
        id: "stigma-step-2",
        stepNumber: 2,
        title: "Recognizing Internalized Stigma",
        type: "reflection",
        content: "Self-Stigma Awareness:\n\nStigma isn't just external - we often internalize it. Honestly explore:\n\n1. What negative beliefs about mental health did you grow up hearing?\n2. Have you ever thought 'I should be stronger' or 'This is my fault'?\n3. Do you hide your mental health struggles? Why?\n4. How would you respond if a friend had your symptoms?\n5. What makes it hard to seek help?\n\nRecognizing these patterns is the first step to changing them.",
        estimatedTime: "15 min",
      },
      {
        id: "stigma-step-3",
        stepNumber: 3,
        title: "Challenging Stigmatizing Language",
        type: "exercise",
        content: "Language Matters Exercise:\n\nWords shape perceptions. Let's choose better ones:\n\n**Instead of:** 'I'm bipolar' → **Say:** 'I have bipolar disorder'\n(You are not your diagnosis)\n\n**Instead of:** 'She's crazy' → **Say:** 'She's struggling'\n(Avoid stigmatizing labels)\n\n**Instead of:** 'Committed suicide' → **Say:** 'Died by suicide'\n(Removes criminal implication)\n\n**Instead of:** 'Attention-seeking' → **Say:** 'Asking for help'\n(Validates need for support)\n\nChallenge: Notice stigmatizing language this week - in media, conversations, even your own thoughts. Gently correct it.",
        estimatedTime: "10 min",
      },
      {
        id: "stigma-step-4",
        stepNumber: 4,
        title: "Sharing Your Story (If You Choose)",
        type: "reflection",
        content: "The Power of Your Story:\n\nSharing your experience can be healing and help others, but only if you're ready:\n\n**Consider:**\n- Are you in a stable place in your recovery?\n- Do you have support if sharing brings up difficult feelings?\n- What are your boundaries? (You don't owe anyone your full story)\n\n**If you're ready:**\n- Start small (trusted friend, support group, anonymous forum)\n- Focus on what you've learned, not just suffering\n- You can say 'I'm not comfortable discussing that' to unwanted questions\n\n**Not ready?** That's completely okay. Your privacy matters.\n\n**Consider:** Share anonymously in our Community forum, or just read others' stories to feel less alone.",
        estimatedTime: "15 min",
      },
      {
        id: "stigma-step-5",
        stepNumber: 5,
        title: "Becoming an Advocate",
        type: "exercise",
        content: "Advocacy Action Plan:\n\nEvery action counts. Choose ways to combat stigma that feel right for you:\n\n**Personal Level:**\n□ Practice person-first language\n□ Correct stigmatizing jokes or comments\n□ Thank people who share their mental health stories\n\n**Community Level:**\n□ Share mental health resources on social media\n□ Support Mental Health Awareness Month (May)\n□ Attend or organize awareness events\n\n**Systemic Level:**\n□ Advocate for mental health parity in insurance\n□ Support mental health education in schools\n□ Vote for candidates who prioritize mental health\n\nPick 2-3 actions you'll commit to this month. Small actions create big change.\n\nRemember: Sharing this journey with even one person plants seeds of understanding.",
        estimatedTime: "15 min",
      },
    ],
  },
  {
    id: "sleep-restoration",
    title: "Sleep Restoration Journey",
    description: "Understand the sleep-mental health connection and develop healthy sleep habits for emotional wellbeing.",
    duration: "6 days",
    difficulty: "Beginner",
    category: "Wellness",
    color: "from-indigo-500 to-purple-600",
    steps: [
      {
        id: "sleep-step-1",
        stepNumber: 1,
        title: "Sleep and Mental Health Connection",
        type: "article",
        articleId: "5",
        estimatedTime: "5 min",
      },
      {
        id: "sleep-step-2",
        stepNumber: 2,
        title: "Assess Your Sleep Patterns",
        type: "exercise",
        content: "Sleep Journal:\n\nFor the next 5 days, track:\n\n**Bedtime:**\n**Wake time:**\n**Hours slept:**\n**Times woken up:**\n**Morning mood (1-10):**\n**Morning energy (1-10):**\n\n**Evening habits:**\n- Screen time before bed?\n- Caffeine after 2pm?\n- Exercise timing?\n- Stress level at bedtime?\n\nPatterns will emerge. Don't judge - just observe.",
        estimatedTime: "5 min daily",
      },
      {
        id: "sleep-step-3",
        stepNumber: 3,
        title: "Creating a Sleep Sanctuary",
        type: "exercise",
        content: "Bedroom Optimization:\n\nYour bedroom environment matters:\n\n**Temperature:** 60-67°F is ideal\n**Darkness:** Blackout curtains or sleep mask\n**Noise:** White noise machine or earplugs\n**Comfort:** Comfortable mattress and pillows\n**Clutter:** Clear sleeping space\n\n**Remove:**\n- Work materials\n- Exercise equipment\n- Bright LED lights\n- Your phone (or put it across the room)\n\n**Add:**\n- Soft, calming lighting\n- Comfortable bedding\n- Relaxing scents (lavender)\n\nYour bed should signal 'rest,' not 'work' or 'worry.'",
        estimatedTime: "30 min setup",
      },
      {
        id: "sleep-step-4",
        stepNumber: 4,
        title: "Evening Wind-Down Routine",
        type: "meditation",
        content: "Sleep Preparation Routine (60-90 min before bed):\n\n**90 min before:** Dim lights, stop screen time\n**60 min before:** Gentle activity (reading, stretching, journaling)\n**30 min before:** Personal hygiene, comfortable sleep clothes\n**15 min before:** Relaxation technique\n\n**4-7-8 Breathing for Sleep:**\n1. Exhale completely through mouth\n2. Inhale through nose for 4 counts\n3. Hold breath for 7 counts\n4. Exhale through mouth for 8 counts\n5. Repeat 4 times\n\n**Body Scan:**\nStarting at toes, progressively relax each body part up to your head. Notice tension, breathe into it, let it go.\n\nConsistency is key - do the same routine nightly.",
        estimatedTime: "15 min",
      },
      {
        id: "sleep-step-5",
        stepNumber: 5,
        title: "Managing Racing Thoughts",
        type: "exercise",
        content: "Thought Dumping Technique:\n\nCan't sleep because your mind won't stop? Try this:\n\n**Keep by your bed:**\n- Notebook and pen\n- Dim book light\n\n**When thoughts race:**\n1. Don't fight them\n2. Turn on dim light\n3. Write down EVERYTHING on your mind\n4. Don't organize, just dump\n5. Close notebook and say 'I'll think about this tomorrow'\n6. Return to breathing\n\n**For worry thoughts:**\n'What if...' → Write it down → 'I'll handle it tomorrow'\n\n**For to-do thoughts:**\nWrite the task → Close notebook → It's captured, you won't forget\n\nThis technique releases the mental grip so your mind can rest.",
        estimatedTime: "10 min as needed",
      },
      {
        id: "sleep-step-6",
        stepNumber: 6,
        title: "Review and Optimize",
        type: "reflection",
        content: "Sleep Pattern Analysis:\n\nReview your sleep journal from the past 5 days:\n\n**What helped your sleep?**\n\n**What disrupted it?**\n\n**Patterns noticed:**\n- Best bedtime?\n- Ideal wake time?\n- Evening habits that helped?\n- Ones that hurt?\n\n**Your Sleep Plan:**\n- Target bedtime:\n- Target wake time:\n- Non-negotiable wind-down routine:\n- Habits to add:\n- Habits to remove:\n\n**When to seek help:**\nIf you've tried these strategies for 2+ weeks with no improvement, or if you suspect sleep apnea, insomnia, or another disorder, please consult a sleep specialist or mental health professional.\n\nQuality sleep is foundational to mental health. Prioritize it.",
        estimatedTime: "20 min",
      },
    ],
  },
];

// Helper function to get journey by ID
export function getJourneyById(id: string): GuidedJourney | undefined {
  return guidedJourneys.find(journey => journey.id === id);
}

// Helper function to get journeys by category
export function getJourneysByCategory(category: string): GuidedJourney[] {
  return guidedJourneys.filter(journey => journey.category.toLowerCase() === category.toLowerCase());
}

// Helper function to get recommended journeys based on compass bearing
export function getRecommendedJourneys(primaryStruggle: string): GuidedJourney[] {
  const categoryMap: Record<string, string[]> = {
    anxiety: ["Anxiety", "Wellness"],
    depression: ["Depression", "Wellness"],
    stress: ["Wellness", "Anxiety"],
    trauma: ["Depression", "Advocacy"],
    grief: ["Depression", "Wellness"],
    relationships: ["Wellness", "Advocacy"],
    addiction: ["Wellness", "Depression"],
    wellness: ["Wellness"],
  };

  const relevantCategories = categoryMap[primaryStruggle.toLowerCase()] || ["Wellness"];
  
  return guidedJourneys.filter(journey => 
    relevantCategories.includes(journey.category)
  );
}

// Journey Completion Badges
export const journeyBadges: Record<string, JourneyBadge> = {
  "anxiety-mapping": {
    id: "anxiety-mapping-badge",
    name: "Anxiety Navigator",
    description: "Successfully mapped stress triggers and built coping strategies",
    icon: "Shield",
    color: "from-amber-500 to-orange-600",
  },
  "depression-ascent": {
    id: "depression-ascent-badge",
    name: "Ascent Pioneer",
    description: "Took brave steps on the depression ascent journey",
    icon: "Mountain",
    color: "from-blue-500 to-indigo-600",
  },
  "wellness-foundations": {
    id: "wellness-foundations-badge",
    name: "Wellness Builder",
    description: "Established sustainable mental health foundations",
    icon: "Heart",
    color: "from-green-500 to-emerald-600",
  },
  "stigma-breaking": {
    id: "stigma-breaking-badge",
    name: "Stigma Breaker",
    description: "Challenged stigma and became a mental health advocate",
    icon: "Megaphone",
    color: "from-purple-500 to-pink-600",
  },
  "sleep-restoration": {
    id: "sleep-restoration-badge",
    name: "Sleep Restorer",
    description: "Developed healthy sleep habits for mental wellness",
    icon: "Moon",
    color: "from-indigo-500 to-purple-600",
  },
};

// Get badge for completed journey
export function getJourneyBadge(journeyId: string): JourneyBadge | undefined {
  return journeyBadges[journeyId];
}