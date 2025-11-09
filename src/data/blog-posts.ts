export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  category: string;
  readTime: string;
  imageUrl: string;
}

export const blogPosts: BlogPost[] = [
  {
    id: "1",
    title: "Understanding the Difference Between Sadness and Depression",
    excerpt: "Learn how to recognize when everyday sadness might be something more serious and when to seek help.",
    content: "Everyone experiences sadness from time to time. It's a normal human emotion that typically passes with time. However, depression is more than just feeling sad—it's a persistent mental health condition that affects how you think, feel, and function in daily life.\n\nKey Differences:\n\nSadness is usually triggered by a specific event or situation. It's temporary and tends to lift once you process the event or circumstances change. You can still enjoy activities and connect with others, even while feeling sad.\n\nDepression, on the other hand, persists for weeks or months regardless of circumstances. It affects your ability to function, enjoy activities you once loved, and maintain relationships. Common symptoms include persistent low mood, loss of interest in activities, changes in sleep and appetite, difficulty concentrating, and thoughts of worthlessness or hopelessness.\n\nWhen to Seek Help:\n\nIf you've been experiencing these symptoms for more than two weeks, or if they're significantly impacting your daily life, it's time to reach out to a mental health professional. Depression is treatable, and seeking help is a sign of strength, not weakness.\n\nRemember: Mental health is just as important as physical health, and you deserve support and care.",
    author: "Dr. Sarah Mitchell",
    date: "2025-10-15",
    category: "Education",
    readTime: "5 min read",
    imageUrl: "https://images.unsplash.com/photo-1590841553603-1409d5672c3b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdXBwb3J0aXZlJTIwaGFuZHMlMjBoZWxwfGVufDF8fHx8MTc2MTc0ODU3MXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
  },
  {
    id: "2",
    title: "5 Daily Habits to Support Your Mental Health",
    excerpt: "Small, consistent actions can make a big difference in your mental wellbeing. Here are five science-backed habits to try.",
    content: "Taking care of your mental health doesn't always require dramatic changes. Often, it's the small, daily habits that make the biggest difference. Here are five evidence-based practices you can start today:\n\n1. Move Your Body: Even 15 minutes of movement can boost mood-enhancing endorphins. Whether it's a walk, yoga, or dancing in your kitchen, find movement that feels good.\n\n2. Practice Gratitude: Take a moment each day to acknowledge three things you're grateful for. This simple practice can rewire your brain to notice positive aspects of life.\n\n3. Connect with Others: Reach out to a friend, family member, or support group. Human connection is essential for mental wellbeing.\n\n4. Prioritize Sleep: Aim for 7-9 hours of quality sleep. Good sleep hygiene includes a consistent schedule, limiting screen time before bed, and creating a calm sleep environment.\n\n5. Limit Social Media: Set boundaries around social media use. Constant comparison and information overload can negatively impact mental health.\n\nStart with one habit and build from there. Small, consistent steps lead to lasting change.",
    author: "Marcus Johnson",
    date: "2025-10-12",
    category: "Wellness",
    readTime: "4 min read",
    imageUrl: "https://images.unsplash.com/photo-1610050731641-f855ccdaf3f6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXJzb24lMjByZWFkaW5nJTIwYm9vayUyMHdlbGxuZXNzfGVufDF8fHx8MTc2MTg0MTAzNnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
  },
  {
    id: "3",
    title: "Breaking the Stigma: Why It's Okay to Ask for Help",
    excerpt: "Exploring why mental health stigma persists and how we can all work together to create a more supportive society.",
    content: "Despite growing awareness, stigma around mental health remains a significant barrier to treatment. Many people still feel ashamed or embarrassed to admit they're struggling. But seeking help is a sign of strength, not weakness.\n\nWhy Stigma Persists:\n\nHistorically, mental health conditions have been misunderstood, leading to harmful stereotypes. Media portrayals often perpetuate misconceptions. Fear of judgment can prevent people from opening up about their struggles.\n\nThe Cost of Silence:\n\nStigma prevents people from seeking help early when treatment is most effective. It creates isolation, making people feel alone in their struggles. Untreated mental health conditions can worsen over time and impact all areas of life.\n\nHow We Can Make a Difference:\n\nSpeak openly about mental health. Share your experiences if you're comfortable. Challenge stigmatizing language and attitudes when you encounter them. Educate yourself and others about mental health conditions. Support policies and organizations that promote mental health awareness.\n\nRemember: Mental health conditions are medical conditions, just like diabetes or heart disease. You wouldn't hesitate to seek treatment for a broken bone—your mental health deserves the same care and attention.",
    author: "Dr. Emily Chen",
    date: "2025-10-08",
    category: "Advocacy",
    readTime: "6 min read",
    imageUrl: "https://images.unsplash.com/photo-1760278041788-8e20a64e3fdd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b3Jrc3BhY2UlMjBkZXNrJTIwd2VsbG5lc3N8ZW58MXx8fHwxNzYxODQxMDM2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
  },
  {
    id: "4",
    title: "Managing Anxiety in the Workplace",
    excerpt: "Practical strategies for coping with work-related anxiety and creating a healthier work-life balance.",
    content: "Work-related anxiety is incredibly common, but it doesn't have to control your life. Whether you're dealing with deadline pressure, difficult colleagues, or general workplace stress, there are effective strategies you can use...",
    author: "James Peterson",
    date: "2025-10-05",
    category: "Coping Strategies",
    readTime: "7 min read",
    imageUrl: "https://images.unsplash.com/photo-1760438449816-633e916dccea?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpdGF0aW9uJTIwcGVhY2VmdWwlMjBtZW50YWwlMjBoZWFsdGh8ZW58MXx8fHwxNzYxODQxMDM2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
  },
  {
    id: "5",
    title: "The Connection Between Sleep and Mental Health",
    excerpt: "Discover how sleep quality impacts your mental wellbeing and what you can do to improve both.",
    content: "The relationship between sleep and mental health is bidirectional—poor sleep can contribute to mental health problems, and mental health issues can make it harder to sleep well. Understanding this connection is crucial...",
    author: "Dr. Rachel Adams",
    date: "2025-09-28",
    category: "Wellness",
    readTime: "5 min read",
    imageUrl: "https://images.unsplash.com/photo-1691076198378-124d0985c851?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbGVlcGluZyUyMHBlYWNlZnVsJTIwcmVzdHxlbnwxfHx8fDE3NjE4NDEwMzd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
  },
  {
    id: "6",
    title: "Supporting a Loved One with Depression",
    excerpt: "How to be there for someone struggling with depression while taking care of your own mental health.",
    content: "When someone you care about is dealing with depression, it can be difficult to know to help. You want to be supportive, but you might worry about saying the wrong thing or making things worse...",
    author: "Lisa Williams",
    date: "2025-09-22",
    category: "Support",
    readTime: "6 min read",
    imageUrl: "https://images.unsplash.com/photo-1761441734637-8d82863f869b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmllbmRzJTIwc3VwcG9ydCUyMHRvZ2V0aGVyfGVufDF8fHx8MTc2MTg0MTAzN3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
  }
];
