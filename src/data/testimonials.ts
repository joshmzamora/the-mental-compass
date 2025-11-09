export interface Testimonial {
  id: string;
  name: string;
  age: number;
  condition: string;
  story: string;
  quote: string;
  imageUrl: string;
}

export const testimonials: Testimonial[] = [
  {
    id: "1",
    name: "Alex Thompson",
    age: 28,
    condition: "Anxiety Disorder",
    story: "For years, I struggled with crippling anxiety that made even simple tasks feel overwhelming. Through therapy, medication, and support from my loved ones, I've learned to manage my symptoms and live a fulfilling life.",
    quote: "Asking for help was the bravest thing I ever did. Today, I'm not just surviving—I'm thriving.",
    imageUrl: "https://images.unsplash.com/photo-1551678843-b1dc560f1688?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3J0cmFpdCUyMHBlcnNvbiUyMGNvbmZpZGVudHxlbnwxfHx8fDE3NjE4NDEwMzd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
  },
  {
    id: "2",
    name: "Maria Rodriguez",
    age: 35,
    condition: "Depression",
    story: "After experiencing postpartum depression, I felt lost and alone. Finding the right therapist and connecting with other mothers who understood what I was going through changed everything. I learned that healing isn't linear, and that's okay.",
    quote: "Recovery isn't about being perfect. It's about showing up for yourself, even on the hard days.",
    imageUrl: "https://images.unsplash.com/photo-1551678843-b1dc560f1688?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3J0cmFpdCUyMHBlcnNvbiUyMGNvbmZpZGVudHxlbnwxfHx8fDE3NjE4NDEwMzd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
  },
  {
    id: "3",
    name: "David Kim",
    age: 42,
    condition: "PTSD",
    story: "As a veteran, I struggled with PTSD for years before finally seeking treatment. EMDR therapy and support groups helped me process my trauma and reclaim my life. Now I volunteer to help other veterans navigate their mental health journeys.",
    quote: "There's no shame in having scars. What matters is how we heal and help others along the way.",
    imageUrl: "https://images.unsplash.com/photo-1551678843-b1dc560f1688?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3J0cmFpdCUyMHBlcnNvbiUyMGNvbmZpZGVudHxlbnwxfHx8fDE3NjE4NDEwMzd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
  },
  {
    id: "4",
    name: "Jasmine Patel",
    age: 23,
    condition: "Eating Disorder",
    story: "My battle with anorexia nearly cost me everything. Through intensive treatment, family support, and learning to challenge my negative thoughts, I've rebuilt my relationship with food and my body. The journey was difficult, but I'm so grateful I stuck with it.",
    quote: "Recovery gave me my life back. Every day is a choice to choose health, and I'm worth that choice.",
    imageUrl: "https://images.unsplash.com/photo-1551678843-b1dc560f1688?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3J0cmFpdCUyMHBlcnNvbiUyMGNvbmZpZGVudHxlbnwxfHx8fDE3NjE4NDEwMzd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
  },
  {
    id: "5",
    name: "Michael O'Brien",
    age: 31,
    condition: "Bipolar Disorder",
    story: "Getting diagnosed with bipolar disorder was scary, but it also gave me answers. With the right medication, therapy, and lifestyle changes, I've found stability. I've learned to recognize my triggers and have a support system in place.",
    quote: "My diagnosis doesn't define me, but understanding it empowered me to take control of my mental health.",
    imageUrl: "https://images.unsplash.com/photo-1551678843-b1dc560f1688?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3J0cmFpdCUyMHBlcnNvbiUyMGNvbmZpZGVudHxlbnwxfHx8fDE3NjE4NDEwMzd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
  },
  {
    id: "6",
    name: "Sophie Chen",
    age: 26,
    condition: "OCD",
    story: "Living with OCD meant hours lost to rituals and intrusive thoughts that consumed my life. Through ERP therapy, I've learned to sit with uncertainty and challenge my compulsions. It's hard work, but the freedom I've gained is incredible.",
    quote: "You are stronger than your intrusive thoughts. Recovery is possible, and you deserve peace.",
    imageUrl: "https://images.unsplash.com/photo-1551678843-b1dc560f1688?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3J0cmFpdCUyMHBlcnNvbiUyMGNvbmZpZGVudHxlbnwxfHx8fDE3NjE4NDEwMzd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
  }
];
