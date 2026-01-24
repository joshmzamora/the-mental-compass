export interface Therapist {
  id: string;
  name: string;
  credential: string;
  specialty: string[];
  bio: string;
  detailedBio: string;
  experience: string;
  education: string[];
  approach: string;
  languages: string[];
  imageUrl: string;
  availableDays: string[];
  rate: number;
}

export const therapists: Therapist[] = [
  {
    id: "therapist-1",
    name: "Dr. Sarah Mitchell",
    credential: "PhD, Licensed Clinical Psychologist",
    specialty: ["Anxiety", "Depression", "Stress Management"],
    bio: "Expert in cognitive-behavioral therapy with over 15 years of experience helping clients navigate anxiety and depression.",
    detailedBio: "Dr. Sarah Mitchell is a highly accomplished clinical psychologist with a passion for empowering individuals to overcome anxiety and depression. With over 15 years of clinical experience, she has helped hundreds of clients develop effective coping strategies and build resilience. Dr. Mitchell specializes in Cognitive Behavioral Therapy (CBT), Acceptance and Commitment Therapy (ACT), and mindfulness-based interventions. She believes in creating a warm, non-judgmental space where clients feel safe to explore their thoughts and emotions. Her approach is collaborative and tailored to each individual's unique needs and goals.",
    experience: "15+ years",
    education: ["PhD in Clinical Psychology - Stanford University", "MA in Counseling Psychology - UCLA", "BA in Psychology - UC Berkeley"],
    approach: "Evidence-based, client-centered therapy combining CBT, ACT, and mindfulness techniques",
    languages: ["English", "Spanish"],
    imageUrl: "/images/therapists/female-1.png",
    availableDays: ["Monday", "Wednesday", "Friday"],
    rate: 180
  },
  {
    id: "therapist-2",
    name: "Dr. Marcus Johnson",
    credential: "PsyD, Trauma Specialist",
    specialty: ["PTSD", "Trauma", "Grief Counseling"],
    bio: "Compassionate trauma-informed therapist specializing in EMDR and somatic experiencing for healing and recovery.",
    detailedBio: "Dr. Marcus Johnson is a dedicated trauma specialist who has devoted his career to helping survivors of trauma reclaim their lives. With extensive training in Eye Movement Desensitization and Reprocessing (EMDR) and Somatic Experiencing, Dr. Johnson provides cutting-edge, evidence-based treatment for PTSD, complex trauma, and grief. He understands that healing from trauma is a journey, not a destination, and works at each client's individual pace. His compassionate, patient-centered approach creates a safe therapeutic environment where clients can process difficult experiences and move toward post-traumatic growth.",
    experience: "12+ years",
    education: ["PsyD in Clinical Psychology - Pepperdine University", "MA in Trauma Psychology - John F. Kennedy University", "BS in Psychology - Howard University"],
    approach: "Trauma-informed care using EMDR, Somatic Experiencing, and Internal Family Systems (IFS)",
    languages: ["English"],
    imageUrl: "/images/therapists/male-1.png",
    availableDays: ["Tuesday", "Thursday", "Saturday"],
    rate: 195
  },
  {
    id: "therapist-3",
    name: "Dr. Emily Chen",
    credential: "LCSW, Family Therapist",
    specialty: ["Relationships", "Family Therapy", "Communication"],
    bio: "Skilled in helping individuals and couples improve communication and build stronger, healthier relationships.",
    detailedBio: "Dr. Emily Chen brings warmth, insight, and practical tools to help individuals, couples, and families navigate relationship challenges. As a Licensed Clinical Social Worker with specialized training in Emotionally Focused Therapy (EFT) and the Gottman Method, she helps clients break negative patterns, improve communication, and rebuild emotional connection. Whether working with couples facing conflict, families in transition, or individuals seeking to improve their relationship skills, Dr. Chen creates a supportive environment where all voices are heard and valued. She is passionate about helping people create the loving, supportive relationships they deserve.",
    experience: "10+ years",
    education: ["LCSW - Columbia University School of Social Work", "MSW in Clinical Social Work - NYU", "BA in Sociology - Cornell University"],
    approach: "Systemic and attachment-based therapy using EFT, Gottman Method, and Solution-Focused techniques",
    languages: ["English", "Mandarin", "Cantonese"],
    imageUrl: "/images/therapists/female-2.png",
    availableDays: ["Monday", "Tuesday", "Thursday"],
    rate: 175
  },
  {
    id: "therapist-4",
    name: "Dr. James Peterson",
    credential: "MD, Psychiatrist",
    specialty: ["Medication Management", "Bipolar Disorder", "OCD"],
    bio: "Board-certified psychiatrist combining medication management with therapy for comprehensive mental health care.",
    detailedBio: "Dr. James Peterson is a board-certified psychiatrist who takes a comprehensive, holistic approach to mental health treatment. With nearly two decades of experience, he specializes in managing complex conditions including bipolar disorder, OCD, treatment-resistant depression, and anxiety disorders. Dr. Peterson believes that the best outcomes come from combining appropriate medication management with therapy and lifestyle interventions. He takes time to thoroughly understand each patient's unique situation, carefully considering all treatment options before making recommendations. His patients appreciate his thorough approach, clear communication, and commitment to finding the right treatment plan.",
    experience: "18+ years",
    education: ["MD - Harvard Medical School", "Residency in Psychiatry - Johns Hopkins Hospital", "BS in Neuroscience - MIT"],
    approach: "Integrative psychiatry combining psychopharmacology, psychotherapy, and lifestyle medicine",
    languages: ["English", "French"],
    imageUrl: "/images/therapists/male-2.png",
    availableDays: ["Wednesday", "Friday"],
    rate: 250
  },
  {
    id: "therapist-5",
    name: "Dr. Rachel Adams",
    credential: "PhD, Wellness Coach",
    specialty: ["Mindfulness", "Wellness", "Life Coaching"],
    bio: "Integrative mental health professional focusing on mindfulness-based stress reduction and holistic wellness.",
    detailedBio: "Dr. Rachel Adams is a passionate advocate for holistic mental wellness and sustainable self-care. With a background in both clinical psychology and integrative health, she helps clients build balanced, meaningful lives through mindfulness, wellness coaching, and positive psychology interventions. Dr. Adams specializes in helping high-achieving professionals manage stress, prevent burnout, and cultivate greater life satisfaction. Her approach combines evidence-based mindfulness practices with practical lifestyle strategies for sleep, nutrition, movement, and social connection. She believes that true wellness comes from nurturing all aspects of ourselves - mind, body, and spirit.",
    experience: "8+ years",
    education: ["PhD in Counseling Psychology - University of Pennsylvania", "Certificate in Mindfulness-Based Stress Reduction - UMass Medical School", "BA in Psychology and Health Sciences - Northwestern University"],
    approach: "Integrative approach combining mindfulness, positive psychology, and wellness coaching",
    languages: ["English"],
    imageUrl: "/images/therapists/female-3.png",
    availableDays: ["Monday", "Wednesday", "Friday", "Saturday"],
    rate: 165
  },
  {
    id: "therapist-6",
    name: "Dr. Michael Rodriguez",
    credential: "PsyD, Substance Abuse Specialist",
    specialty: ["Addiction", "Substance Abuse", "Dual Diagnosis"],
    bio: "Specialized in addiction recovery and dual diagnosis treatment with a focus on long-term sobriety.",
    detailedBio: "Dr. Michael Rodriguez is a leading expert in addiction treatment and recovery, bringing both professional expertise and personal understanding to his work. With over 13 years of experience in substance abuse treatment, he specializes in helping individuals overcome addiction while addressing co-occurring mental health conditions. Dr. Rodriguez uses evidence-based approaches including Motivational Interviewing, CBT for addiction, and 12-step facilitation. He works with clients to develop personalized recovery plans that address not just substance use, but the underlying issues that contribute to addiction. His compassionate, non-judgmental approach helps clients build the skills and support systems needed for lasting recovery.",
    experience: "13+ years",
    education: ["PsyD in Clinical Psychology - Alliant International University", "MA in Addiction Counseling - Hazelden Betty Ford Graduate School", "BS in Psychology - University of Texas at Austin"],
    approach: "Integrated treatment using Motivational Interviewing, CBT, and trauma-informed addiction therapy",
    languages: ["English", "Spanish"],
    imageUrl: "/images/therapists/male-3.png",
    availableDays: ["Monday", "Tuesday", "Wednesday", "Saturday"],
    rate: 185
  },
  {
    id: "therapist-7",
    name: "Dr. Aisha Patel",
    credential: "PhD, Child & Adolescent Psychologist",
    specialty: ["Child Psychology", "Adolescent Issues", "ADHD"],
    bio: "Compassionate specialist in child and adolescent mental health, helping young people thrive.",
    detailedBio: "Dr. Aisha Patel is a dedicated child and adolescent psychologist who is passionate about supporting young people's mental health and development. She has extensive experience working with children and teens facing a wide range of challenges including ADHD, anxiety, depression, behavioral issues, and academic stress. Dr. Patel uses developmentally appropriate, engaging techniques including play therapy, art therapy, and CBT adapted for younger clients. She works closely with families, recognizing that parents and caregivers are essential partners in their child's healing. Her warm, patient approach helps young people feel understood and empowered to make positive changes.",
    experience: "11+ years",
    education: ["PhD in Child Clinical Psychology - University of Michigan", "MA in Developmental Psychology - Yale University", "BA in Psychology - Duke University"],
    approach: "Developmentally-informed therapy using play therapy, CBT for youth, and family systems work",
    languages: ["English", "Hindi", "Gujarati"],
    imageUrl: "/images/therapists/female-1.png",
    availableDays: ["Tuesday", "Thursday", "Friday"],
    rate: 170
  },
  {
    id: "therapist-8",
    name: "Dr. David Kim",
    credential: "LMFT, Couples Therapist",
    specialty: ["Couples Therapy", "Infidelity", "Premarital Counseling"],
    bio: "Expert couples therapist helping partners rebuild trust, improve intimacy, and create lasting connection.",
    detailedBio: "Dr. David Kim is a Licensed Marriage and Family Therapist specializing in couples therapy and relationship healing. With advanced training in the Gottman Method and Emotionally Focused Therapy, he has helped countless couples navigate even the most challenging relationship issues including infidelity, communication breakdowns, and intimacy concerns. Dr. Kim also provides premarital counseling to help couples build a strong foundation before marriage. His balanced, structured approach helps partners understand their patterns, heal old wounds, and create the loving partnership they desire. He believes that with the right tools and guidance, most relationship challenges can be overcome.",
    experience: "14+ years",
    education: ["LMFT - California State University, Northridge", "MA in Marriage and Family Therapy - Fuller Theological Seminary", "BA in Psychology - UCLA"],
    approach: "Evidence-based couples therapy using Gottman Method and EFT",
    languages: ["English", "Korean"],
    imageUrl: "/images/therapists/male-2.png",
    availableDays: ["Monday", "Wednesday", "Thursday", "Friday"],
    rate: 190
  },
  {
    id: "therapist-9",
    name: "Dr. Jennifer Walsh",
    credential: "PhD, Eating Disorder Specialist",
    specialty: ["Eating Disorders", "Body Image", "Nutrition Psychology"],
    bio: "Specialized in treating anorexia, bulimia, and binge eating disorder with compassion and evidence-based care.",
    detailedBio: "Dr. Jennifer Walsh is a leading expert in eating disorder treatment with over 16 years of experience helping individuals recover from anorexia, bulimia, binge eating disorder, and related conditions. She uses a comprehensive approach that addresses both the psychological and physical aspects of eating disorders, working closely with nutritionists and medical providers when needed. Dr. Walsh specializes in Cognitive Behavioral Therapy for Eating Disorders (CBT-E), Dialectical Behavior Therapy (DBT), and Family-Based Treatment (FBT) for adolescents. Her compassionate, non-judgmental approach helps clients heal their relationship with food and their bodies.",
    experience: "16+ years",
    education: ["PhD in Clinical Psychology - University of Minnesota", "Postdoctoral Fellowship in Eating Disorders - Stanford University", "BA in Psychology - Boston University"],
    approach: "Comprehensive eating disorder treatment using CBT-E, DBT, and family-based therapy",
    languages: ["English"],
    imageUrl: "/images/therapists/female-1.png",
    availableDays: ["Monday", "Tuesday", "Thursday", "Friday"],
    rate: 200
  },
  {
    id: "therapist-10",
    name: "Dr. Thomas Lee",
    credential: "PsyD, OCD Specialist",
    specialty: ["OCD", "Anxiety", "Exposure Therapy"],
    bio: "Expert in Exposure and Response Prevention (ERP) therapy for OCD and anxiety disorders.",
    detailedBio: "Dr. Thomas Lee is a highly specialized psychologist with extensive training in treating Obsessive-Compulsive Disorder and related conditions. As a certified expert in Exposure and Response Prevention (ERP), he has helped hundreds of individuals break free from the cycle of obsessions and compulsions. Dr. Lee's approach is evidence-based, practical, and tailored to each client's specific symptoms and goals. He creates a supportive environment where clients can gradually face their fears and learn that they can tolerate anxiety without resorting to compulsions. His patients appreciate his patience, expertise, and commitment to their recovery.",
    experience: "9+ years",
    education: ["PsyD in Clinical Psychology - Yeshiva University", "Advanced Training in ERP - International OCD Foundation", "BA in Neuroscience - Johns Hopkins University"],
    approach: "Specialized OCD treatment using ERP, ACT, and mindfulness-based interventions",
    languages: ["English", "Mandarin"],
    imageUrl: "/images/therapists/male-1.png",
    availableDays: ["Tuesday", "Wednesday", "Friday", "Saturday"],
    rate: 185
  },
  {
    id: "therapist-11",
    name: "Dr. Maria Gonzalez",
    credential: "LCSW, Mood Disorder Specialist",
    specialty: ["Bipolar Disorder", "Mood Disorders", "Depression"],
    bio: "Compassionate therapist specializing in bipolar disorder and mood stabilization through therapy and lifestyle management.",
    detailedBio: "Dr. Maria Gonzalez is a Licensed Clinical Social Worker with specialized expertise in bipolar disorder and other mood disorders. With over 12 years of experience, she helps clients manage mood episodes, develop stability, and build fulfilling lives. Dr. Gonzalez uses a combination of psychoeducation, CBT, interpersonal therapy, and lifestyle interventions to help clients understand their condition and develop effective coping strategies. She works collaboratively with psychiatrists to ensure comprehensive care and believes strongly in the power of therapy to complement medication management. Her warm, empowering approach helps clients feel hopeful about their recovery journey.",
    experience: "12+ years",
    education: ["LCSW - University of Southern California", "MSW in Mental Health - Washington University in St. Louis", "BA in Social Work - University of Texas at El Paso"],
    approach: "Integrated treatment combining psychoeducation, CBT, interpersonal therapy, and wellness planning",
    languages: ["English", "Spanish"],
    imageUrl: "/images/therapists/female-3.png",
    availableDays: ["Monday", "Wednesday", "Thursday"],
    rate: 175
  }
];

// Generate time slots for appointments
export const timeSlots = [
  "09:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "01:00 PM",
  "02:00 PM",
  "03:00 PM",
  "04:00 PM",
  "05:00 PM",
  "06:00 PM"
];
