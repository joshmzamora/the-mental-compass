export interface MentalHealthDisorder {
  id: string;
  name: string;
  description: string;
  symptoms: string[];
  treatments: string[];
  resources: string[];
}

export const mentalHealthDisorders: MentalHealthDisorder[] = [
  {
    id: "anxiety",
    name: "Anxiety Disorders",
    description: "Anxiety disorders involve excessive fear or worry that interferes with daily activities. This includes generalized anxiety disorder, panic disorder, social anxiety disorder, and specific phobias.",
    symptoms: [
      "Excessive worry or fear",
      "Restlessness or feeling on edge",
      "Difficulty concentrating",
      "Sleep disturbances",
      "Physical symptoms like rapid heartbeat, sweating, or trembling"
    ],
    treatments: [
      "Cognitive Behavioral Therapy (CBT)",
      "Exposure therapy",
      "Medication (anti-anxiety medications, antidepressants)",
      "Mindfulness and relaxation techniques",
      "Lifestyle changes (exercise, sleep hygiene, stress management)"
    ],
    resources: [
      "Anxiety and Depression Association of America (ADAA)",
      "National Institute of Mental Health (NIMH)",
      "Mental Health America"
    ]
  },
  {
    id: "depression",
    name: "Depression",
    description: "Depression is a mood disorder that causes persistent feelings of sadness and loss of interest. It affects how you feel, think, and handle daily activities.",
    symptoms: [
      "Persistent sad, anxious, or empty mood",
      "Loss of interest in activities once enjoyed",
      "Changes in appetite or weight",
      "Sleep problems (insomnia or oversleeping)",
      "Fatigue or loss of energy",
      "Feelings of worthlessness or guilt",
      "Difficulty concentrating or making decisions",
      "Thoughts of death or suicide"
    ],
    treatments: [
      "Psychotherapy (talk therapy, CBT, interpersonal therapy)",
      "Antidepressant medications",
      "Brain stimulation therapies (for severe cases)",
      "Exercise and physical activity",
      "Light therapy (for seasonal depression)",
      "Support groups"
    ],
    resources: [
      "Depression and Bipolar Support Alliance (DBSA)",
      "National Alliance on Mental Illness (NAMI)",
      "Substance Abuse and Mental Health Services Administration (SAMHSA)"
    ]
  },
  {
    id: "bipolar",
    name: "Bipolar Disorder",
    description: "Bipolar disorder is characterized by unusual shifts in mood, energy, activity levels, and the ability to carry out day-to-day tasks, including manic and depressive episodes.",
    symptoms: [
      "Manic episodes: elevated mood, increased energy, decreased need for sleep",
      "Depressive episodes: sadness, hopelessness, loss of interest",
      "Rapid mood changes",
      "Risky behavior during manic phases",
      "Difficulty maintaining relationships or work responsibilities"
    ],
    treatments: [
      "Mood stabilizers",
      "Antipsychotic medications",
      "Antidepressants (used carefully)",
      "Psychotherapy (CBT, family-focused therapy)",
      "Lifestyle management and routine",
      "Psychoeducation"
    ],
    resources: [
      "Depression and Bipolar Support Alliance (DBSA)",
      "International Bipolar Foundation",
      "National Alliance on Mental Illness (NAMI)"
    ]
  },
  {
    id: "ptsd",
    name: "Post-Traumatic Stress Disorder (PTSD)",
    description: "PTSD can develop after experiencing or witnessing a traumatic event. It involves intrusive thoughts, avoidance behaviors, and hyperarousal.",
    symptoms: [
      "Flashbacks or nightmares about the traumatic event",
      "Avoidance of reminders of the trauma",
      "Negative changes in thoughts and mood",
      "Hypervigilance and being easily startled",
      "Difficulty sleeping or concentrating"
    ],
    treatments: [
      "Trauma-focused psychotherapy (CPT, EMDR, PE)",
      "Medications (antidepressants, anti-anxiety)",
      "Group therapy",
      "Stress management techniques",
      "Support from family and community"
    ],
    resources: [
      "National Center for PTSD",
      "PTSD Alliance",
      "Sidran Institute"
    ]
  },
  {
    id: "ocd",
    name: "Obsessive-Compulsive Disorder (OCD)",
    description: "OCD is characterized by recurring, unwanted thoughts (obsessions) and repetitive behaviors (compulsions) that the person feels driven to perform.",
    symptoms: [
      "Intrusive, unwanted thoughts or images",
      "Repetitive behaviors (hand washing, checking, counting)",
      "Excessive concern with order or symmetry",
      "Significant distress or impairment in daily life",
      "Recognition that obsessions are excessive (in most cases)"
    ],
    treatments: [
      "Cognitive Behavioral Therapy (particularly ERP - Exposure and Response Prevention)",
      "Medications (SSRIs, clomipramine)",
      "Mindfulness and acceptance-based therapies",
      "Support groups",
      "Family education and involvement"
    ],
    resources: [
      "International OCD Foundation",
      "Anxiety and Depression Association of America (ADAA)",
      "National Alliance on Mental Illness (NAMI)"
    ]
  },
  {
    id: "eating-disorders",
    name: "Eating Disorders",
    description: "Eating disorders involve persistent disturbance in eating behaviors and distressing thoughts and emotions about food, body weight, and shape.",
    symptoms: [
      "Preoccupation with weight, food, and body image",
      "Severe restriction of food intake",
      "Binge eating episodes",
      "Purging behaviors (vomiting, laxative use)",
      "Excessive exercise",
      "Distorted body image"
    ],
    treatments: [
      "Psychotherapy (CBT, DBT, family-based therapy)",
      "Nutritional counseling",
      "Medical monitoring",
      "Medications (for co-occurring conditions)",
      "Hospitalization (for severe cases)",
      "Support groups"
    ],
    resources: [
      "National Eating Disorders Association (NEDA)",
      "Academy for Eating Disorders",
      "National Association of Anorexia Nervosa and Associated Disorders (ANAD)"
    ]
  },
  {
    id: "adhd",
    name: "Attention-Deficit/Hyperactivity Disorder (ADHD)",
    description: "ADHD affects attention, impulse control, and activity levels. It can impact school, work, relationships, and day-to-day organization.",
    symptoms: [
      "Trouble sustaining attention",
      "Frequent distractibility",
      "Difficulty with planning and organization",
      "Impulsivity or interrupting others",
      "Restlessness or feeling internally driven"
    ],
    treatments: [
      "Behavioral therapy and skills coaching",
      "Medication (stimulant or non-stimulant options)",
      "Executive functioning supports",
      "School or workplace accommodations",
      "Sleep and routine optimization"
    ],
    resources: [
      "National Institute of Mental Health (NIMH)",
      "Mental Health America",
      "National Alliance on Mental Illness (NAMI)"
    ]
  },
  {
    id: "social-anxiety",
    name: "Social Anxiety Disorder",
    description: "Social anxiety disorder causes intense fear of social situations where a person might be judged, embarrassed, or rejected.",
    symptoms: [
      "Fear of being watched or judged",
      "Avoidance of social situations",
      "Physical anxiety symptoms in social settings",
      "Worry before events or conversations",
      "Difficulty speaking up in groups"
    ],
    treatments: [
      "Cognitive Behavioral Therapy (CBT)",
      "Exposure-based therapy",
      "Social skills practice",
      "Medication when appropriate",
      "Support groups"
    ],
    resources: [
      "Anxiety and Depression Association of America (ADAA)",
      "National Institute of Mental Health (NIMH)",
      "Mental Health America"
    ]
  },
  {
    id: "panic-disorder",
    name: "Panic Disorder",
    description: "Panic disorder involves recurring panic attacks and ongoing concern about having additional attacks or their consequences.",
    symptoms: [
      "Sudden episodes of intense fear",
      "Racing heart, shortness of breath, or chest discomfort",
      "Fear of losing control during attacks",
      "Avoidance of places linked to panic",
      "Persistent anxiety about future attacks"
    ],
    treatments: [
      "Cognitive Behavioral Therapy (CBT)",
      "Interoceptive and situational exposure",
      "Medication options such as SSRIs",
      "Breathing and grounding strategies",
      "Psychoeducation and relapse prevention"
    ],
    resources: [
      "Anxiety and Depression Association of America (ADAA)",
      "National Institute of Mental Health (NIMH)",
      "National Alliance on Mental Illness (NAMI)"
    ]
  },
  {
    id: "gad",
    name: "Generalized Anxiety Disorder (GAD)",
    description: "GAD is marked by ongoing, hard-to-control worry across multiple life areas such as health, work, family, and daily responsibilities.",
    symptoms: [
      "Persistent excessive worry",
      "Muscle tension and fatigue",
      "Irritability",
      "Difficulty concentrating",
      "Sleep problems"
    ],
    treatments: [
      "Cognitive Behavioral Therapy (CBT)",
      "Acceptance and commitment approaches",
      "Medication when indicated",
      "Stress management routines",
      "Mindfulness-based practices"
    ],
    resources: [
      "Anxiety and Depression Association of America (ADAA)",
      "National Institute of Mental Health (NIMH)",
      "Mental Health America"
    ]
  },
  {
    id: "schizophrenia",
    name: "Schizophrenia Spectrum Disorders",
    description: "Schizophrenia spectrum disorders can affect perception, thinking, emotion, and behavior, often requiring long-term coordinated care.",
    symptoms: [
      "Hallucinations or delusions",
      "Disorganized thinking or speech",
      "Reduced emotional expression",
      "Social withdrawal",
      "Difficulty with daily functioning"
    ],
    treatments: [
      "Antipsychotic medication",
      "Coordinated specialty care",
      "Psychosocial rehabilitation",
      "Family education and support",
      "Supported employment and housing services"
    ],
    resources: [
      "National Alliance on Mental Illness (NAMI)",
      "Substance Abuse and Mental Health Services Administration (SAMHSA)",
      "National Institute of Mental Health (NIMH)"
    ]
  },
  {
    id: "bpd",
    name: "Borderline Personality Disorder (BPD)",
    description: "BPD involves intense emotions, fear of abandonment, relationship instability, and challenges with self-image and impulse control.",
    symptoms: [
      "Intense mood shifts",
      "Fear of abandonment",
      "Unstable interpersonal relationships",
      "Impulsive behaviors",
      "Chronic feelings of emptiness"
    ],
    treatments: [
      "Dialectical Behavior Therapy (DBT)",
      "Mentalization-based therapy",
      "Schema-focused therapy",
      "Medication for co-occurring symptoms",
      "Skills groups and crisis planning"
    ],
    resources: [
      "National Alliance on Mental Illness (NAMI)",
      "Substance Abuse and Mental Health Services Administration (SAMHSA)",
      "Mental Health America"
    ]
  },
  {
    id: "substance-use-disorder",
    name: "Substance Use Disorder",
    description: "Substance use disorder is a treatable condition where recurring substance use causes impairment, distress, and loss of control.",
    symptoms: [
      "Using more than intended",
      "Difficulty cutting down despite efforts",
      "Cravings and withdrawal symptoms",
      "Neglecting responsibilities",
      "Continued use despite negative consequences"
    ],
    treatments: [
      "Motivational interviewing and counseling",
      "Medication-assisted treatment when appropriate",
      "Outpatient or residential programs",
      "Peer recovery and support groups",
      "Relapse prevention planning"
    ],
    resources: [
      "Substance Abuse and Mental Health Services Administration (SAMHSA)",
      "National Alliance on Mental Illness (NAMI)",
      "Mental Health America"
    ]
  },
  {
    id: "seasonal-affective-disorder",
    name: "Seasonal Affective Disorder (SAD)",
    description: "SAD is a depression pattern linked to seasonal light changes, often emerging during fall and winter months.",
    symptoms: [
      "Low mood during specific seasons",
      "Low energy and oversleeping",
      "Increased appetite or carbohydrate cravings",
      "Reduced motivation",
      "Social withdrawal"
    ],
    treatments: [
      "Light therapy",
      "Psychotherapy",
      "Medication options",
      "Physical activity",
      "Daily routine and sleep regulation"
    ],
    resources: [
      "National Institute of Mental Health (NIMH)",
      "Depression and Bipolar Support Alliance (DBSA)",
      "Mental Health America"
    ]
  },
  {
    id: "pmdd",
    name: "Premenstrual Dysphoric Disorder (PMDD)",
    description: "PMDD is a severe mood disorder tied to the menstrual cycle, causing significant emotional and physical symptoms before menstruation.",
    symptoms: [
      "Marked irritability or mood swings premenstrually",
      "Depressed mood or anxiety in luteal phase",
      "Fatigue and concentration difficulties",
      "Sleep and appetite changes",
      "Symptoms that improve after menstruation begins"
    ],
    treatments: [
      "Cognitive Behavioral Therapy (CBT)",
      "SSRIs (continuous or luteal-phase dosing)",
      "Hormonal treatment options",
      "Exercise and stress-reduction plans",
      "Cycle symptom tracking"
    ],
    resources: [
      "National Institute of Mental Health (NIMH)",
      "Mental Health America",
      "National Alliance on Mental Illness (NAMI)"
    ]
  },
  {
    id: "autism",
    name: "Autism Spectrum Disorder (ASD)",
    description: "Autism is a neurodevelopmental condition that affects social communication and behavior patterns, with diverse strengths and support needs.",
    symptoms: [
      "Differences in social communication",
      "Repetitive behaviors or focused interests",
      "Sensory sensitivities",
      "Need for predictable routines",
      "Challenges with transitions"
    ],
    treatments: [
      "Strengths-based behavioral supports",
      "Speech, occupational, or social skills therapies",
      "School and workplace accommodations",
      "Family education and coaching",
      "Co-occurring mental health care"
    ],
    resources: [
      "National Institute of Mental Health (NIMH)",
      "Mental Health America",
      "Substance Abuse and Mental Health Services Administration (SAMHSA)"
    ]
  },
  {
    id: "dissociative-disorders",
    name: "Dissociative Disorders",
    description: "Dissociative disorders involve disruptions in memory, identity, or awareness, often related to overwhelming stress or trauma history.",
    symptoms: [
      "Feeling detached from self or surroundings",
      "Memory gaps for personal events",
      "Identity confusion",
      "Emotional numbness",
      "Functional impairment during dissociative episodes"
    ],
    treatments: [
      "Trauma-informed psychotherapy",
      "Grounding and stabilization techniques",
      "Skills for emotion regulation",
      "Medication for co-occurring symptoms",
      "Safety and support planning"
    ],
    resources: [
      "National Alliance on Mental Illness (NAMI)",
      "National Institute of Mental Health (NIMH)",
      "Sidran Institute"
    ]
  },
  {
    id: "insomnia-disorder",
    name: "Insomnia Disorder",
    description: "Insomnia disorder includes persistent trouble falling asleep, staying asleep, or waking too early, with daytime impact on mood and functioning.",
    symptoms: [
      "Difficulty initiating sleep",
      "Frequent nighttime awakenings",
      "Early morning waking",
      "Daytime fatigue",
      "Irritability and concentration difficulties"
    ],
    treatments: [
      "Cognitive Behavioral Therapy for Insomnia (CBT-I)",
      "Sleep hygiene and stimulus control",
      "Relaxation and stress reduction techniques",
      "Short-term medication when needed",
      "Treatment of co-occurring mental health conditions"
    ],
    resources: [
      "National Institute of Mental Health (NIMH)",
      "Mental Health America",
      "Substance Abuse and Mental Health Services Administration (SAMHSA)"
    ]
  }
];
