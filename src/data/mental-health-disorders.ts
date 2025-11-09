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
  }
];
