import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { 
  MessageCircle, 
  Users, 
  Send, 
  Compass, 
  Plus, 
  ThumbsUp, 
  ChevronRight, 
  Search,
  Filter,
  X,
  Clock,
  TrendingUp,
  AlertCircle,
  Shield,
  Sparkles,
  LogIn,
  User as UserIcon,
  Bell,
  Calendar,
  ChevronLeft,
  ChevronRight as ChevronRightIcon
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { CompassDecoration } from "./CompassDecoration";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Checkbox } from "./ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "./ui/pagination";
import { toast } from "sonner@2.0.3";
import { useAuth } from "../contexts/AuthContext";
import { useUserProfile } from "../contexts/UserProfileContext";
import { projectId } from "../utils/supabase/info";

// Standardized tags that match the site's content tagging system
export const COMMUNITY_TAGS = [
  "Anxiety",
  "Depression", 
  "Bipolar",
  "PTSD",
  "OCD",
  "Eating Disorders",
  "Support",
  "Wellness",
  "Coping Strategies",
  "Recovery",
  "Self-Care",
  "Relationships"
] as const;

export type CommunityTag = typeof COMMUNITY_TAGS[number];

export interface ForumPost {
  id: string;
  userId: string;
  author: string;
  authorEmail?: string;
  title: string;
  content: string;
  tags: CommunityTag[];
  replies: number;
  likes: number;
  likedBy: string[];
  timestamp: Date;
  responses: Response[];
}

export interface Response {
  id: string;
  postId: string;
  userId: string;
  author: string;
  content: string;
  timestamp: Date;
  likes: number;
  likedBy: string[];
}

export interface Notification {
  id: string;
  postId: string;
  postTitle: string;
  responseId: string;
  responseAuthor: string;
  responseContent: string;
  timestamp: Date;
  read: boolean;
}

type DateRangeFilter = "all" | "today" | "week" | "month" | "3months" | "6months" | "custom";

interface ChatMessage {
  id: string;
  userId: string;
  author: string;
  content: string;
  timestamp: Date;
  avatar: string;
}

const initialChatMessages: ChatMessage[] = [
  {
    id: "1",
    userId: "user1",
    author: "Michael",
    content: "Has anyone tried the new meditation app recommended in the blog?",
    timestamp: new Date(Date.now() - 3600000),
    avatar: "M"
  },
  {
    id: "2",
    userId: "user2",
    author: "Jessica",
    content: "Yes! I've been using it for a week now and it's really helpful for my anxiety.",
    timestamp: new Date(Date.now() - 3480000),
    avatar: "J"
  },
];

export function CommunitySection() {
  const { user } = useAuth();
  const { updateProfile, profile } = useUserProfile();
  const navigate = useNavigate();
  
  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(initialChatMessages);
  const [forumPosts, setForumPosts] = useState<ForumPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<ForumPost[]>([]);
  const [showNewPostDialog, setShowNewPostDialog] = useState(false);
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [selectedPost, setSelectedPost] = useState<ForumPost | null>(null);
  const [newResponse, setNewResponse] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<CommunityTag[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(10);
  
  // Date range filtering state
  const [dateRangeFilter, setDateRangeFilter] = useState<DateRangeFilter>("all");
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");
  
  // Notifications state
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Load notifications from localStorage on mount
  useEffect(() => {
    if (user) {
      const savedNotifications = localStorage.getItem(`notifications_${user.id}`);
      if (savedNotifications) {
        const parsed = JSON.parse(savedNotifications);
        setNotifications(parsed.map((n: any) => ({
          ...n,
          timestamp: new Date(n.timestamp)
        })));
      }
    }
  }, [user]);

  // Save notifications to localStorage whenever they change
  useEffect(() => {
    if (user && notifications.length > 0) {
      localStorage.setItem(`notifications_${user.id}`, JSON.stringify(notifications));
    }
  }, [notifications, user]);

  // Real-time forum updates using polling (simulating Firestore onSnapshot)
  useEffect(() => {
    loadForumPosts();
    
    // Set up real-time polling every 10 seconds
    const interval = setInterval(() => {
      loadForumPosts();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  // Auto-scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  // Filter and prioritize posts
  useEffect(() => {
    let filtered = [...forumPosts];

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (post) =>
          post.title.toLowerCase().includes(query) ||
          post.content.toLowerCase().includes(query) ||
          post.author.toLowerCase().includes(query) ||
          post.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Apply tag filter
    if (selectedTags.length > 0) {
      filtered = filtered.filter((post) =>
        selectedTags.some((tag) => post.tags.includes(tag))
      );
    }

    // Apply date range filter
    if (dateRangeFilter !== "all") {
      const now = new Date();
      let startDate: Date | null = null;
      let endDate: Date = now;

      switch (dateRangeFilter) {
        case "today":
          startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          break;
        case "week":
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case "month":
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        case "3months":
          startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
          break;
        case "6months":
          startDate = new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000);
          break;
        case "custom":
          if (customStartDate) startDate = new Date(customStartDate);
          if (customEndDate) endDate = new Date(customEndDate);
          break;
      }

      if (startDate) {
        filtered = filtered.filter(post => {
          const postDate = new Date(post.timestamp);
          return postDate >= startDate! && postDate <= endDate;
        });
      }
    }

    // Personalized prioritization based on Compass Bearing
    if (user && profile?.compassBearing && !searchQuery && selectedTags.length === 0 && dateRangeFilter === "all") {
      const primaryStruggle = profile.compassBearing.primaryStruggle;
      
      // Sort posts - matching tags first, then by timestamp
      filtered.sort((a, b) => {
        const aMatches = a.tags.some(tag => 
          tag.toLowerCase().includes(primaryStruggle.toLowerCase())
        );
        const bMatches = b.tags.some(tag => 
          tag.toLowerCase().includes(primaryStruggle.toLowerCase())
        );
        
        if (aMatches && !bMatches) return -1;
        if (!aMatches && bMatches) return 1;
        
        return b.timestamp.getTime() - a.timestamp.getTime();
      });
    } else {
      // Default sort by timestamp
      filtered.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    }

    setFilteredPosts(filtered);
    // Reset to first page when filters change
    setCurrentPage(1);
  }, [forumPosts, searchQuery, selectedTags, dateRangeFilter, customStartDate, customEndDate, user, profile]);

  const loadForumPosts = async () => {
    try {
      const accessToken = localStorage.getItem("access_token");
      
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/server/community-posts`,
        {
          headers: {
            Authorization: `Bearer ${accessToken || ""}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        // Convert timestamp strings back to Date objects
        const posts = data.posts.map((post: any) => ({
          ...post,
          timestamp: new Date(post.timestamp),
          responses: post.responses.map((r: any) => ({
            ...r,
            timestamp: new Date(r.timestamp)
          }))
        }));
        setForumPosts(posts);
        checkForNewNotifications(posts);
      } else {
        // Use mock data if backend not available
        loadMockPosts();
      }
    } catch (error) {
      // Silently fall back to mock data when backend is unavailable
      loadMockPosts();
    } finally {
      setLoading(false);
    }
  };

  // Check for new replies to user's posts and create notifications
  const checkForNewNotifications = (posts: ForumPost[]) => {
    if (!user) return;

    const userPosts = posts.filter(post => post.userId === user.id);
    const newNotifications: Notification[] = [];

    userPosts.forEach(post => {
      post.responses.forEach(response => {
        // Don't notify for user's own responses
        if (response.userId === user.id) return;

        // Check if we already have a notification for this response
        const existingNotification = notifications.find(n => n.responseId === response.id);
        if (!existingNotification) {
          newNotifications.push({
            id: `${post.id}-${response.id}`,
            postId: post.id,
            postTitle: post.title,
            responseId: response.id,
            responseAuthor: response.author,
            responseContent: response.content,
            timestamp: response.timestamp,
            read: false
          });
        }
      });
    });

    if (newNotifications.length > 0) {
      setNotifications(prev => [...newNotifications, ...prev]);
    }
  };

  const loadMockPosts = () => {
    const mockPosts: ForumPost[] = [
      {
        id: "1",
        userId: "mock1",
        author: "Sarah M.",
        title: "Coping with anxiety at work - any tips?",
        content: "I've been struggling with workplace anxiety lately, especially during meetings and presentations. My heart races, I get sweaty palms, and sometimes I feel like I can't breathe. Does anyone have strategies that have worked for them?",
        tags: ["Anxiety", "Coping Strategies"],
        replies: 3,
        likes: 24,
        likedBy: [],
        timestamp: new Date("2026-01-09T10:30:00"),
        responses: [
          {
            id: "r1",
            postId: "1",
            userId: "mock2",
            author: "Mike T.",
            content: "I've found deep breathing exercises really helpful before meetings. Try the 4-7-8 technique: breathe in for 4, hold for 7, exhale for 8.",
            timestamp: new Date("2026-01-09T14:15:00"),
            likes: 8,
            likedBy: []
          },
          {
            id: "r1-2",
            postId: "1",
            userId: "mock8",
            author: "Emma L.",
            content: "Also try arriving early to meetings so you can settle in. Having a familiar water bottle or stress ball can be grounding objects.",
            timestamp: new Date("2026-01-09T16:20:00"),
            likes: 12,
            likedBy: []
          },
          {
            id: "r1-3",
            postId: "1",
            userId: "mock14",
            author: "David K.",
            content: "I started therapy specifically for this and my therapist taught me that anticipatory anxiety is often worse than the actual event. Writing down my worries beforehand helps me see how rarely they come true.",
            timestamp: new Date("2026-01-09T18:45:00"),
            likes: 15,
            likedBy: []
          }
        ]
      },
      {
        id: "2",
        userId: "mock3",
        author: "John D.",
        title: "Celebrating small wins in recovery",
        content: "Today marks 30 days of consistent therapy sessions and I'm so proud of myself! For years I resisted getting help, but now I wish I'd started sooner.",
        tags: ["Support", "Recovery"],
        replies: 1,
        likes: 156,
        likedBy: [],
        timestamp: new Date("2026-01-05T09:15:00"),
        responses: [
          {
            id: "r2-1",
            postId: "2",
            userId: "mock9",
            author: "Rachel W.",
            content: "This is amazing! Congratulations! It takes real courage to start therapy. Your future self will thank you.",
            timestamp: new Date("2026-01-05T11:30:00"),
            likes: 23,
            likedBy: []
          }
        ]
      },
      {
        id: "3",
        userId: "mock4",
        author: "Maya P.",
        title: "Looking for mindfulness resources",
        content: "I'm trying to incorporate more mindfulness into my daily routine. Can anyone recommend good mindfulness apps or guided meditations?",
        tags: ["Wellness", "Self-Care"],
        replies: 1,
        likes: 15,
        likedBy: [],
        timestamp: new Date("2025-12-28T14:20:00"),
        responses: [
          {
            id: "r3-1",
            postId: "3",
            userId: "mock10",
            author: "Lisa H.",
            content: "I love Insight Timer! It has thousands of free guided meditations for all experience levels.",
            timestamp: new Date("2025-12-28T16:45:00"),
            likes: 9,
            likedBy: []
          }
        ]
      },
      {
        id: "4",
        userId: "mock5",
        author: "Carlos R.",
        title: "How to support a partner with depression?",
        content: "My partner has been struggling with depression and I want to be supportive but I'm not always sure what to say or do. Sometimes they push me away. How can I help without being overbearing?",
        tags: ["Depression", "Relationships", "Support"],
        replies: 2,
        likes: 87,
        likedBy: [],
        timestamp: new Date("2025-12-20T11:00:00"),
        responses: [
          {
            id: "r4-1",
            postId: "4",
            userId: "mock11",
            author: "Nina S.",
            content: "The fact that you're asking this shows you care. Sometimes just being present is enough. Ask them what they need rather than assuming. And take care of yourself too - you can't pour from an empty cup.",
            timestamp: new Date("2025-12-20T15:30:00"),
            likes: 34,
            likedBy: []
          },
          {
            id: "r4-2",
            postId: "4",
            userId: "mock12",
            author: "Tom B.",
            content: "I've been on the other side of this. What helped most was when my partner just sat with me without trying to 'fix' it. Also, helping with small tasks when I couldn't manage them myself meant everything.",
            timestamp: new Date("2025-12-20T18:15:00"),
            likes: 41,
            likedBy: []
          }
        ]
      },
      {
        id: "5",
        userId: "mock6",
        author: "Amanda K.",
        title: "First therapy session tomorrow - what should I expect?",
        content: "I finally made an appointment with a therapist after months of thinking about it. I'm excited but also really nervous. What happens in a first session? Any tips?",
        tags: ["Support", "Wellness"],
        replies: 2,
        likes: 43,
        likedBy: [],
        timestamp: new Date("2025-12-10T13:45:00"),
        responses: [
          {
            id: "r5-1",
            postId: "5",
            userId: "mock13",
            author: "Jennifer M.",
            content: "Congratulations on taking this step! First sessions are usually about getting to know each other. They'll ask about what brought you in and your background. Don't worry about having everything figured out - that's what therapy is for!",
            timestamp: new Date("2025-12-10T16:00:00"),
            likes: 18,
            likedBy: []
          },
          {
            id: "r5-2",
            postId: "5",
            userId: "mock15",
            author: "Alex P.",
            content: "Remember it's okay if the first therapist isn't the right fit. Finding a good match sometimes takes a few tries. Be honest about how you're feeling and don't be afraid to ask questions!",
            timestamp: new Date("2025-12-10T19:30:00"),
            likes: 22,
            likedBy: []
          }
        ]
      },
      {
        id: "6",
        userId: "mock7",
        author: "Kevin L.",
        title: "Breaking the stigma around men's mental health",
        content: "As a guy, I grew up being told to 'man up' and not show emotions. It took me hitting rock bottom to finally ask for help. We need to normalize men talking about their mental health. Anyone else struggle with this?",
        tags: ["Support", "Wellness"],
        replies: 2,
        likes: 234,
        likedBy: [],
        timestamp: new Date("2025-11-25T08:30:00"),
        responses: [
          {
            id: "r6-1",
            postId: "6",
            userId: "mock16",
            author: "Marcus J.",
            content: "100% relate to this. The 'strong silent type' stereotype nearly destroyed me. Asking for help is strength, not weakness. Thanks for speaking up about this.",
            timestamp: new Date("2025-11-25T10:45:00"),
            likes: 67,
            likedBy: []
          },
          {
            id: "r6-2",
            postId: "6",
            userId: "mock17",
            author: "Sophie C.",
            content: "As someone who lost a brother to suicide, thank you for talking about this. The stigma kills. We need more men having these conversations.",
            timestamp: new Date("2025-11-25T14:20:00"),
            likes: 89,
            likedBy: []
          }
        ]
      },
      {
        id: "7",
        userId: "mock18",
        author: "Priya N.",
        title: "Dealing with social anxiety at family gatherings",
        content: "The holidays are coming up and I'm already dreading family gatherings. Large groups make me so anxious, plus everyone asks invasive questions about my life. How do you all handle this?",
        tags: ["Anxiety", "Coping Strategies", "Relationships"],
        replies: 1,
        likes: 67,
        likedBy: [],
        timestamp: new Date("2025-11-15T17:00:00"),
        responses: [
          {
            id: "r7-1",
            postId: "7",
            userId: "mock19",
            author: "Hannah R.",
            content: "I set a time limit for myself and plan an exit strategy. Also, having a trusted family member who knows about your anxiety can be a lifesaver - they can help redirect conversations or give you breaks.",
            timestamp: new Date("2025-11-15T19:30:00"),
            likes: 28,
            likedBy: []
          }
        ]
      },
      {
        id: "8",
        userId: "mock20",
        author: "Tyler M.",
        title: "PTSD nightmares - coping strategies?",
        content: "My PTSD nightmares have been getting worse lately. I wake up several times a night and then I'm afraid to go back to sleep. I'm already in therapy but looking for additional coping strategies. What's worked for you?",
        tags: ["PTSD", "Coping Strategies"],
        replies: 1,
        likes: 52,
        likedBy: [],
        timestamp: new Date("2025-11-01T22:15:00"),
        responses: [
          {
            id: "r8-1",
            postId: "8",
            userId: "mock21",
            author: "Veteran Dan",
            content: "Fellow PTSD here. Imagery Rehearsal Therapy helped me a lot - you 'rewrite' the nightmare with a different ending while awake. Also, having a nighttime routine and keeping a light on helps. Talk to your therapist about this specific technique.",
            timestamp: new Date("2025-11-02T08:30:00"),
            likes: 31,
            likedBy: []
          }
        ]
      },
      {
        id: "9",
        userId: "mock22",
        author: "Olivia T.",
        title: "Postpartum depression is no joke",
        content: "I had my baby 3 months ago and everyone expects me to be over the moon happy, but I feel empty and overwhelmed. I love my baby but I don't feel the joy I thought I would. Is this normal?",
        tags: ["Depression", "Support"],
        replies: 2,
        likes: 145,
        likedBy: [],
        timestamp: new Date("2025-10-20T15:30:00"),
        responses: [
          {
            id: "r9-1",
            postId: "9",
            userId: "mock23",
            author: "Maria V.",
            content: "Please talk to your doctor ASAP. This sounds like postpartum depression and it's very treatable. You're not a bad mom - this is a medical condition. I went through this and getting help changed everything.",
            timestamp: new Date("2025-10-20T17:45:00"),
            likes: 76,
            likedBy: []
          },
          {
            id: "r9-2",
            postId: "9",
            userId: "mock24",
            author: "Dr. Sarah K.",
            content: "Therapist here - this is extremely common and absolutely treatable. Please reach out to your OB or a mental health professional. You deserve support. Postpartum depression affects up to 1 in 7 mothers.",
            timestamp: new Date("2025-10-20T20:00:00"),
            likes: 94,
            likedBy: []
          }
        ]
      },
      {
        id: "10",
        userId: "mock25",
        author: "Jordan F.",
        title: "OCD intrusive thoughts - you're not your thoughts",
        content: "Reminder for anyone struggling with OCD: intrusive thoughts are not your fault and they don't define you. They're symptoms of a treatable condition. You are not a bad person for having them.",
        tags: ["OCD", "Support"],
        replies: 1,
        likes: 198,
        likedBy: [],
        timestamp: new Date("2025-10-05T12:00:00"),
        responses: [
          {
            id: "r10-1",
            postId: "10",
            userId: "mock26",
            author: "Riley C.",
            content: "Thank you for this. I needed to hear it today. The guilt from intrusive thoughts is sometimes worse than the thoughts themselves.",
            timestamp: new Date("2025-10-05T14:30:00"),
            likes: 52,
            likedBy: []
          }
        ]
      },
      {
        id: "11",
        userId: "mock27",
        author: "Samantha B.",
        title: "Grief doesn't have a timeline",
        content: "It's been a year since I lost my mom and people keep saying I should be 'over it by now.' But grief isn't linear. Some days are okay, others I can barely function. Anyone else experience this?",
        tags: ["Support", "Coping Strategies"],
        replies: 1,
        likes: 267,
        likedBy: [],
        timestamp: new Date("2025-09-18T16:45:00"),
        responses: [
          {
            id: "r11-1",
            postId: "11",
            userId: "mock28",
            author: "Patricia W.",
            content: "There's no 'right' way to grieve. Anyone who tells you there's a timeline doesn't understand grief. Take all the time you need. Sending love.",
            timestamp: new Date("2025-09-18T19:00:00"),
            likes: 89,
            likedBy: []
          }
        ]
      },
      {
        id: "12",
        userId: "mock29",
        author: "Chris H.",
        title: "Bipolar diagnosis - feeling overwhelmed",
        content: "Just got diagnosed with bipolar II after years of thinking I was just moody. I'm relieved to have answers but also scared about what this means. Where do I even start?",
        tags: ["Bipolar", "Support"],
        replies: 1,
        likes: 89,
        likedBy: [],
        timestamp: new Date("2025-09-01T10:20:00"),
        responses: [
          {
            id: "r12-1",
            postId: "12",
            userId: "mock30",
            author: "Lauren G.",
            content: "Welcome to the club! Getting diagnosed was actually a relief for me - suddenly everything made sense. Find a good psychiatrist, educate yourself, track your moods, and be patient with yourself. It gets easier.",
            timestamp: new Date("2025-09-01T13:45:00"),
            likes: 47,
            likedBy: []
          }
        ]
      },
      {
        id: "13",
        userId: "mock31",
        author: "Megan S.",
        title: "Recovery from eating disorder - celebrating 1 year",
        content: "One year ago today I started treatment for my eating disorder. It's been the hardest thing I've ever done, but I'm finally learning to have a healthy relationship with food and my body. To anyone struggling: recovery is possible.",
        tags: ["Eating Disorders", "Recovery", "Support"],
        replies: 1,
        likes: 312,
        likedBy: [],
        timestamp: new Date("2025-08-20T14:00:00"),
        responses: [
          {
            id: "r13-1",
            postId: "13",
            userId: "mock32",
            author: "Ashley D.",
            content: "This gives me so much hope. I'm 3 months into treatment and some days I want to give up. Thank you for sharing that it gets better.",
            timestamp: new Date("2025-08-20T16:30:00"),
            likes: 67,
            likedBy: []
          }
        ]
      },
      {
        id: "14",
        userId: "mock33",
        author: "Ryan P.",
        title: "Medication stigma needs to end",
        content: "I'm tired of people saying I'm 'taking the easy way out' by being on antidepressants. You wouldn't shame a diabetic for taking insulin. Mental illness is a medical condition. Medication is healthcare, not weakness.",
        tags: ["Support", "Wellness"],
        replies: 1,
        likes: 421,
        likedBy: [],
        timestamp: new Date("2025-07-15T09:30:00"),
        responses: [
          {
            id: "r14-1",
            postId: "14",
            userId: "mock34",
            author: "Nicole K.",
            content: "THANK YOU. My medication literally saved my life. People who've never experienced severe mental illness don't understand that sometimes medication isn't optional - it's survival.",
            timestamp: new Date("2025-07-15T11:45:00"),
            likes: 134,
            likedBy: []
          }
        ]
      },
      {
        id: "15",
        userId: "mock35",
        author: "Derek M.",
        title: "Starting mindfulness practice - complete beginner",
        content: "I keep hearing about mindfulness and meditation but I have no idea where to start. My mind races constantly. Any beginner-friendly tips or resources?",
        tags: ["Wellness", "Self-Care"],
        replies: 1,
        likes: 34,
        likedBy: [],
        timestamp: new Date("2025-06-10T18:00:00"),
        responses: [
          {
            id: "r15-1",
            postId: "15",
            userId: "mock36",
            author: "Yuki T.",
            content: "Start with just 2 minutes a day! There's a misconception that you need to clear your mind completely - that's not the goal. Notice when your mind wanders and gently bring it back. That's the practice.",
            timestamp: new Date("2025-06-10T20:15:00"),
            likes: 19,
            likedBy: []
          }
        ]
      }
    ];
    setForumPosts(mockPosts);
    checkForNewNotifications(mockPosts);
  };

  const handleSendMessage = () => {
    if (!user) {
      setShowLoginDialog(true);
      return;
    }

    if (message.trim()) {
      const newMessage: ChatMessage = {
        id: Date.now().toString(),
        userId: user.id,
        author: user.email?.split('@')[0] || "You",
        content: message,
        timestamp: new Date(),
        avatar: (user.email?.charAt(0) || "Y").toUpperCase()
      };
      setChatMessages([...chatMessages, newMessage]);
      setMessage("");
      toast.success("Message sent!");
    }
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      setShowLoginDialog(true);
      return;
    }

    const formData = new FormData(e.target as HTMLFormElement);
    const selectedTagsArray: CommunityTag[] = [];
    
    // Get selected tags from checkboxes
    COMMUNITY_TAGS.forEach(tag => {
      if (formData.get(`tag-${tag}`) === 'on') {
        selectedTagsArray.push(tag);
      }
    });

    if (selectedTagsArray.length === 0) {
      toast.error("Please select at least one tag for your post");
      return;
    }

    const newPost: ForumPost = {
      id: Date.now().toString(),
      userId: user.id,
      author: user.email?.split('@')[0] || "Anonymous",
      authorEmail: user.email,
      title: formData.get("title") as string,
      content: formData.get("content") as string,
      tags: selectedTagsArray,
      replies: 0,
      likes: 0,
      likedBy: [],
      timestamp: new Date(),
      responses: []
    };

    try {
      // Save to backend
      const accessToken = localStorage.getItem("access_token");
      await fetch(
        `https://${projectId}.supabase.co/functions/v1/server/community-posts`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken || ""}`,
          },
          body: JSON.stringify(newPost),
        }
      );
    } catch (error) {
      // Silently handle error - post will be saved locally
    }

    // Add to local state immediately (optimistic update)
    setForumPosts([newPost, ...forumPosts]);
    setShowNewPostDialog(false);
    
    // Update profile - real-time dashboard update!
    if (profile) {
      await updateProfile({
        forumPosts: (profile.forumPosts || 0) + 1
      });
    }
    
    toast.success("Your post has been published!");
    
    // Reload to get server data
    setTimeout(() => loadForumPosts(), 1000);
  };

  const handleAddResponse = async () => {
    if (!user) {
      setShowLoginDialog(true);
      return;
    }

    if (newResponse.trim() && selectedPost) {
      const response: Response = {
        id: Date.now().toString(),
        postId: selectedPost.id,
        userId: user.id,
        author: user.email?.split('@')[0] || "Anonymous",
        content: newResponse,
        timestamp: new Date(),
        likes: 0,
        likedBy: []
      };
      
      try {
        // Save to backend
        const accessToken = localStorage.getItem("access_token");
        await fetch(
          `https://${projectId}.supabase.co/functions/v1/server/community-posts/${selectedPost.id}/responses`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken || ""}`,
            },
            body: JSON.stringify(response),
          }
        );
      } catch (error) {
        // Silently handle error - response will be saved locally
      }

      // Update local state
      const updatedPosts = forumPosts.map(post => 
        post.id === selectedPost.id 
          ? { ...post, responses: [...post.responses, response], replies: post.replies + 1 }
          : post
      );
      
      setForumPosts(updatedPosts);
      setSelectedPost({ ...selectedPost, responses: [...selectedPost.responses, response], replies: selectedPost.replies + 1 });
      setNewResponse("");
      
      // Update profile
      if (profile) {
        await updateProfile({
          forumPosts: (profile.forumPosts || 0) + 1
        });
      }
      
      toast.success("Response added!");
      
      // Reload to sync
      setTimeout(() => loadForumPosts(), 1000);
    }
  };

  const handleLikePost = async (postId: string) => {
    if (!user) {
      setShowLoginDialog(true);
      return;
    }

    const post = forumPosts.find(p => p.id === postId);
    if (!post) return;

    // Check if already liked
    if (post.likedBy.includes(user.id)) {
      toast.info("You've already liked this post");
      return;
    }

    const updatedPosts = forumPosts.map(p =>
      p.id === postId 
        ? { ...p, likes: p.likes + 1, likedBy: [...p.likedBy, user.id] } 
        : p
    );
    setForumPosts(updatedPosts);
    
    if (selectedPost?.id === postId) {
      setSelectedPost({ ...selectedPost, likes: selectedPost.likes + 1, likedBy: [...selectedPost.likedBy, user.id] });
    }
    
    toast.success("Post liked!");

    // Save to backend
    try {
      const accessToken = localStorage.getItem("access_token");
      await fetch(
        `https://${projectId}.supabase.co/functions/v1/server/community-posts/${postId}/like`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken || ""}`,
          },
          body: JSON.stringify({ userId: user.id }),
        }
      );
    } catch (error) {
      // Silently handle error - like will be updated locally
    }
  };

  const toggleTag = (tag: CommunityTag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const clearFilters = () => {
    setSelectedTags([]);
    setSearchQuery("");
    setDateRangeFilter("all");
    setCustomStartDate("");
    setCustomEndDate("");
  };

  const markNotificationAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (notificationId: string) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  };

  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  const getRecommendedPosts = () => {
    if (!user || !profile?.compassBearing) return [];
    
    const primaryStruggle = profile.compassBearing.primaryStruggle;
    return filteredPosts.filter(post => 
      post.tags.some(tag => tag.toLowerCase().includes(primaryStruggle.toLowerCase()))
    ).slice(0, 2);
  };

  const recommendedPosts = getRecommendedPosts();
  const regularPosts = user && profile?.compassBearing 
    ? filteredPosts.filter(post => !recommendedPosts.includes(post))
    : filteredPosts;

  // Pagination calculations
  const totalPosts = regularPosts.length;
  const totalPages = Math.ceil(totalPosts / postsPerPage);
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = regularPosts.slice(indexOfFirstPost, indexOfLastPost);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top of forum section
    document.getElementById('forum-posts-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return timestamp.toLocaleDateString();
  };

  const formatPostTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (hours < 1) return "Just now";
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return timestamp.toLocaleDateString();
  };

  return (
    <section id="community" className="py-12 sm:py-20 lg:py-32 bg-gradient-to-br from-teal-50 via-blue-50 to-purple-50 relative overflow-hidden">
      <CompassDecoration variant="light" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8 sm:mb-12 relative">
            <div className="flex items-center justify-center mb-4">
              <Users className="h-6 w-6 sm:h-8 sm:w-8 text-teal-600 mr-2 sm:mr-3" />
              <h2 className="text-2xl sm:text-3xl md:text-4xl text-gray-900">
                Community Support
              </h2>
            </div>
            <p className="text-sm sm:text-base lg:text-lg text-gray-600 max-w-2xl mx-auto px-4">
              Connect with others who understand your journey. Share experiences,
              find support, and build meaningful connections in a safe, moderated space.
            </p>
            <div className="flex items-center justify-center gap-2 mt-4">
              <div className="h-px w-20 bg-gradient-to-r from-transparent to-teal-400"></div>
              <Compass className="h-5 w-5 text-teal-600" />
              <div className="h-px w-20 bg-gradient-to-l from-transparent to-teal-400"></div>
            </div>

            {/* Notifications Bell - positioned in top right */}
            {user && (
              <div className="absolute top-0 right-0 sm:right-4">
                <Popover open={showNotifications} onOpenChange={setShowNotifications}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="icon" className="relative h-9 w-9 sm:h-10 sm:w-10">
                      <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
                      {unreadNotificationsCount > 0 && (
                        <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                          {unreadNotificationsCount}
                        </span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[90vw] sm:w-96 max-h-[70vh] sm:max-h-[500px] overflow-y-auto" align="end">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between pb-3 border-b">
                        <h3 className="text-lg text-gray-900">Notifications</h3>
                        {unreadNotificationsCount > 0 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={markAllNotificationsAsRead}
                          >
                            Mark all as read
                          </Button>
                        )}
                      </div>
                      {notifications.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                          <Bell className="h-12 w-12 mx-auto mb-3 opacity-50" />
                          <p>No notifications yet</p>
                          <p className="text-sm mt-1">You'll be notified when someone replies to your posts</p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {notifications.map((notification) => (
                            <div
                              key={notification.id}
                              className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                                notification.read
                                  ? "bg-white border-gray-200"
                                  : "bg-teal-50 border-teal-200"
                              }`}
                              onClick={() => {
                                markNotificationAsRead(notification.id);
                                const post = forumPosts.find(p => p.id === notification.postId);
                                if (post) {
                                  setSelectedPost(post);
                                  setShowNotifications(false);
                                }
                              }}
                            >
                              <div className="flex items-start justify-between gap-2 mb-1">
                                <p className="text-sm text-gray-900">
                                  <span className="font-medium">{notification.responseAuthor}</span> replied to your post
                                </p>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    deleteNotification(notification.id);
                                  }}
                                  className="text-gray-400 hover:text-gray-600"
                                >
                                  <X className="h-4 w-4" />
                                </button>
                              </div>
                              <p className="text-sm text-teal-700 mb-2">"{notification.postTitle}"</p>
                              <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                                {notification.responseContent}
                              </p>
                              <p className="text-xs text-gray-500">
                                {formatTimestamp(notification.timestamp)}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            )}
          </div>

          {/* Community Guidelines Banner */}
          <Card className="mb-6 sm:mb-8 bg-blue-50 border-blue-200">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-start gap-3 sm:gap-4">
                <Shield className="h-6 w-6 sm:h-7 sm:w-7 text-blue-600 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <h3 className="text-sm sm:text-base text-blue-900 mb-2">
                    <strong>Community Guidelines</strong>
                  </h3>
                  <p className="text-xs sm:text-sm text-blue-800 leading-relaxed mb-3">
                    This is a safe, supportive space. Please be respectful, kind, and mindful of others' experiences.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                    <Button 
                      onClick={() => navigate("/community-guidelines")}
                      variant="outline"
                      size="sm"
                      className="bg-white hover:bg-blue-100 text-blue-700 border-blue-300 text-xs sm:text-sm"
                    >
                      <Shield className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                      Read Full Guidelines
                    </Button>
                    <Button 
                      onClick={() => navigate("/helplines")}
                      variant="outline"
                      size="sm"
                      className="bg-white hover:bg-red-100 text-red-700 border-red-300 text-xs sm:text-sm"
                    >
                      <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                      Crisis Helplines
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="forums" className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-6 sm:mb-8">
              <TabsTrigger value="forums" className="text-sm sm:text-base">Discussion Forums</TabsTrigger>
              <TabsTrigger value="chat" className="text-sm sm:text-base">Live Chat</TabsTrigger>
            </TabsList>

            <TabsContent value="forums" className="space-y-4 sm:space-y-6">
              {/* Search and Filter Bar */}
              <Card className="shadow-md" id="forum-posts-section">
                <CardContent className="p-3 sm:p-5">
                  <div className="flex flex-col gap-3 sm:gap-4">
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                      <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                        <Input
                          type="text"
                          placeholder="Search discussions..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-9 sm:pl-10 text-sm sm:text-base"
                        />
                      </div>
                      <Button
                        variant="outline"
                        onClick={() => setShowFilters(!showFilters)}
                        className="flex items-center gap-2 text-sm sm:text-base"
                      >
                        <Filter className="h-4 w-4" />
                        <span className="hidden sm:inline">Filter by Tags</span>
                        <span className="sm:hidden">Filters</span>
                        {selectedTags.length > 0 && (
                          <Badge className="ml-1 bg-teal-600 text-xs">
                            {selectedTags.length}
                          </Badge>
                        )}
                      </Button>
                    </div>

                    {/* Date Range Filter */}
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-600" />
                        <Label className="text-xs sm:text-sm text-gray-700">Date Range:</Label>
                      </div>
                      <div className="flex flex-col gap-3 w-full">
                        <div className="flex flex-wrap gap-2 sm:gap-3 items-center">
                          <Select value={dateRangeFilter} onValueChange={(value: DateRangeFilter) => setDateRangeFilter(value)}>
                            <SelectTrigger className="w-full sm:w-[180px] text-sm">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All Time</SelectItem>
                              <SelectItem value="today">Today</SelectItem>
                              <SelectItem value="week">Last 7 Days</SelectItem>
                              <SelectItem value="month">Last 30 Days</SelectItem>
                              <SelectItem value="3months">Last 3 Months</SelectItem>
                              <SelectItem value="6months">Last 6 Months</SelectItem>
                              <SelectItem value="custom">Custom Range</SelectItem>
                            </SelectContent>
                          </Select>
                          {dateRangeFilter !== "all" && (
                            <Badge variant="secondary" className="bg-blue-100 text-blue-800 text-xs">
                              Date filtered
                            </Badge>
                          )}
                        </div>
                        
                        {dateRangeFilter === "custom" && (
                          <div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center w-full">
                            <Input
                              type="date"
                              value={customStartDate}
                              onChange={(e) => setCustomStartDate(e.target.value)}
                              className="w-full sm:w-[150px] text-sm"
                              placeholder="Start date"
                            />
                            <span className="text-gray-500 text-center sm:text-left text-sm">to</span>
                            <Input
                              type="date"
                              value={customEndDate}
                              onChange={(e) => setCustomEndDate(e.target.value)}
                              className="w-full sm:w-[150px] text-sm"
                              placeholder="End date"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Filter Panel */}
                  {showFilters && (
                    <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t">
                      <div className="flex items-center justify-between mb-3">
                        <Label className="text-xs sm:text-sm">Filter by Topics</Label>
                        {selectedTags.length > 0 && (
                          <Button variant="ghost" size="sm" onClick={clearFilters} className="text-xs sm:text-sm h-8">
                            Clear All
                          </Button>
                        )}
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3">
                        {COMMUNITY_TAGS.map((tag) => (
                          <button
                            key={tag}
                            onClick={() => toggleTag(tag)}
                            className={`flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm transition-colors ${
                              selectedTags.includes(tag)
                                ? "bg-teal-600 text-white"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                          >
                            {selectedTags.includes(tag) && <X className="h-3 w-3 flex-shrink-0" />}
                            <span className="truncate">{tag}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Active Filters Display */}
                  {(searchQuery || selectedTags.length > 0 || dateRangeFilter !== "all") && (
                    <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
                      <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                        <TrendingUp className="h-4 w-4 text-teal-600" />
                        <span>
                          Showing {filteredPosts.length} discussion{filteredPosts.length !== 1 ? 's' : ''}
                        </span>
                      </div>
                      <Button variant="ghost" size="sm" onClick={clearFilters} className="text-xs sm:text-sm h-8">
                        <X className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                        Clear Filters
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Start a New Discussion Button */}
              <Card className="bg-gradient-to-br from-teal-50 to-blue-50 border-teal-200">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-center sm:text-left">
                      <h3 className="text-base sm:text-lg text-gray-900 mb-1">
                        Share Your Story or Ask for Support
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-600">
                        Start a conversation with the community. Your voice matters.
                      </p>
                    </div>
                    <Button 
                      onClick={() => user ? setShowNewPostDialog(true) : setShowLoginDialog(true)}
                      className="bg-teal-600 hover:bg-teal-700 w-full sm:w-auto whitespace-nowrap"
                      size="lg"
                    >
                      <Plus className="h-5 w-5 mr-2" />
                      Start a Discussion
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Featured/Most Interacted Posts */}
              {forumPosts.length > 0 && (() => {
                const featuredPosts = [...forumPosts]
                  .sort((a, b) => (b.likes + b.replies * 2) - (a.likes + a.replies * 2))
                  .slice(0, 3);
                
                return featuredPosts.length > 0 && (
                  <Card className="border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-amber-50 shadow-lg">
                    <CardHeader className="pb-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <div className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white px-3 py-1.5 rounded-full shadow-md">
                          <TrendingUp className="h-4 w-4" />
                          <span className="text-sm font-medium">Featured Discussions</span>
                        </div>
                        <Badge className="bg-orange-600 text-white text-xs border-none shadow-sm">
                          Most Active
                        </Badge>
                      </div>
                      <CardDescription className="text-sm text-gray-700 mt-2">
                        Join the most engaging conversations in our community
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3 sm:space-y-4">
                      {featuredPosts.map((post) => (
                        <PostCard
                          key={post.id}
                          post={post}
                          onSelect={setSelectedPost}
                          onLike={handleLikePost}
                          navigate={navigate}
                          formatPostTimestamp={formatPostTimestamp}
                        />
                      ))}
                    </CardContent>
                  </Card>
                );
              })()}

              {/* Personalized Recommendations */}
              {recommendedPosts.length > 0 && (
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-teal-600" />
                    <h3 className="text-base sm:text-lg text-gray-900">
                      Recommended For You
                    </h3>
                    <Badge className="bg-teal-600 text-xs sm:text-sm">
                      <span className="hidden sm:inline">Based on your Compass Bearing</span>
                      <span className="sm:hidden">For You</span>
                    </Badge>
                  </div>
                  {recommendedPosts.map((post) => (
                    <PostCard
                      key={post.id}
                      post={post}
                      onSelect={setSelectedPost}
                      onLike={handleLikePost}
                      navigate={navigate}
                      formatPostTimestamp={formatPostTimestamp}
                      isPrioritized={true}
                    />
                  ))}
                </div>
              )}

              {/* Regular Posts */}
              <div className="space-y-3 sm:space-y-4">
                {recommendedPosts.length > 0 && (
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1 sm:gap-0 mt-6 sm:mt-8">
                    <h3 className="text-base sm:text-lg text-gray-900">All Discussions</h3>
                    {totalPosts > 0 && (
                      <p className="text-xs sm:text-sm text-gray-600">
                        Showing {indexOfFirstPost + 1}-{Math.min(indexOfLastPost, totalPosts)} of {totalPosts}
                      </p>
                    )}
                  </div>
                )}
                
                {loading ? (
                  <Card className="p-8 text-center">
                    <div className="flex items-center justify-center gap-3">
                      <Compass className="h-6 w-6 text-teal-600 animate-spin" />
                      <p className="text-gray-600">Loading discussions...</p>
                    </div>
                  </Card>
                ) : regularPosts.length === 0 ? (
                  <Card className="p-8 text-center bg-yellow-50 border-yellow-200">
                    <AlertCircle className="h-12 w-12 text-yellow-600 mx-auto mb-3" />
                    <p className="text-gray-700 mb-2">No discussions found</p>
                    <p className="text-sm text-gray-600">
                      {searchQuery || selectedTags.length > 0 || dateRangeFilter !== "all"
                        ? "Try adjusting your filters or search terms"
                        : "Be the first to start a conversation!"}
                    </p>
                  </Card>
                ) : (
                  <>
                    {currentPosts.map((post) => (
                      <PostCard
                        key={post.id}
                        post={post}
                        onSelect={setSelectedPost}
                        onLike={handleLikePost}
                        navigate={navigate}
                        formatPostTimestamp={formatPostTimestamp}
                      />
                    ))}
                  </>
                )}
              </div>

              {/* Pagination */}
              {!loading && totalPages > 1 && (
                <Card className="mt-6">
                  <CardContent className="p-3 sm:p-4">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
                      <p className="text-xs sm:text-sm text-gray-600 text-center sm:text-left">
                        Page {currentPage} of {totalPages} ({totalPosts} discussions)
                      </p>
                      <Pagination>
                        <PaginationContent className="gap-1">
                          <PaginationItem>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handlePageChange(currentPage - 1)}
                              disabled={currentPage === 1}
                              className="gap-1 h-8 sm:h-9 px-2 sm:px-3"
                            >
                              <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" />
                              <span className="hidden sm:inline">Previous</span>
                              <span className="sm:hidden">Prev</span>
                            </Button>
                          </PaginationItem>
                          
                          {/* Page numbers - fewer on mobile */}
                          <div className="hidden sm:flex gap-1">
                            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                              let pageNum;
                              if (totalPages <= 5) {
                                pageNum = i + 1;
                              } else if (currentPage <= 3) {
                                pageNum = i + 1;
                              } else if (currentPage >= totalPages - 2) {
                                pageNum = totalPages - 4 + i;
                              } else {
                                pageNum = currentPage - 2 + i;
                              }
                              
                              return (
                                <PaginationItem key={pageNum}>
                                  <PaginationLink
                                    onClick={() => handlePageChange(pageNum)}
                                    isActive={currentPage === pageNum}
                                    className="cursor-pointer"
                                  >
                                    {pageNum}
                                  </PaginationLink>
                                </PaginationItem>
                              );
                            })}
                          </div>
                          
                          {/* Mobile: just show current page */}
                          <div className="sm:hidden flex items-center px-2 text-sm text-gray-700">
                            {currentPage}/{totalPages}
                          </div>

                          <PaginationItem>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handlePageChange(currentPage + 1)}
                              disabled={currentPage === totalPages}
                              className="gap-1 h-8 sm:h-9 px-2 sm:px-3"
                            >
                              <span className="sm:hidden">Next</span>
                              <span className="hidden sm:inline">Next</span>
                              <ChevronRightIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                            </Button>
                          </PaginationItem>
                        </PaginationContent>
                      </Pagination>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Chat Tab */}
            <TabsContent value="chat">
              <Card className="h-[600px] flex flex-col shadow-lg">
                <CardHeader className="border-b">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2 text-gray-900">
                        <Users className="h-5 w-5 text-teal-600" />
                        General Support Chat
                      </CardTitle>
                      <CardDescription>
                        <span className="inline-flex items-center gap-1">
                          <span className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></span>
                          {23 + chatMessages.length - initialChatMessages.length} people online
                        </span>
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col p-0">
                  <div className="flex-1 bg-gray-50 p-4 overflow-y-auto space-y-4">
                    {chatMessages.map((msg) => (
                      <div key={msg.id} className="flex gap-3">
                        <Avatar className="h-8 w-8 flex-shrink-0">
                          <AvatarFallback className={`${
                            msg.userId === user?.id
                              ? "bg-teal-100 text-teal-700" 
                              : "bg-purple-100 text-purple-700"
                          }`}>
                            {msg.avatar}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <button
                              onClick={() => navigate(`/user/${msg.userId}`)}
                              className={`text-sm hover:underline ${
                                msg.userId === user?.id ? "text-teal-700 font-medium" : "text-gray-900"
                              }`}
                            >
                              {msg.author}
                            </button>
                            <span className="text-xs text-gray-500">
                              {formatTimestamp(msg.timestamp)}
                            </span>
                          </div>
                          <p className={`text-sm text-gray-700 rounded-lg p-3 ${
                            msg.userId === user?.id ? "bg-teal-100" : "bg-white"
                          }`}>
                            {msg.content}
                          </p>
                        </div>
                      </div>
                    ))}
                    <div ref={chatEndRef} />
                  </div>

                  <div className="p-4 border-t bg-white">
                    <div className="flex gap-2">
                      <Textarea
                        placeholder={user ? "Type your message..." : "Log in to chat..."}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage();
                          }
                        }}
                        className="resize-none"
                        rows={2}
                        disabled={!user}
                      />
                      <Button
                        onClick={handleSendMessage}
                        className="bg-teal-600 hover:bg-teal-700"
                        size="icon"
                        disabled={!message.trim() || !user}
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Press Enter to send, Shift+Enter for new line
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* New Post Dialog */}
      <NewPostDialog
        open={showNewPostDialog}
        onOpenChange={setShowNewPostDialog}
        onSubmit={handleCreatePost}
      />

      {/* View Post Dialog */}
      <ViewPostDialog
        post={selectedPost}
        onClose={() => setSelectedPost(null)}
        onLike={handleLikePost}
        onAddResponse={handleAddResponse}
        newResponse={newResponse}
        setNewResponse={setNewResponse}
        navigate={navigate}
        user={user}
        showLoginDialog={() => setShowLoginDialog(true)}
      />

      {/* Login Prompt Dialog */}
      <LoginPromptDialog
        open={showLoginDialog}
        onOpenChange={setShowLoginDialog}
        navigate={navigate}
      />
    </section>
  );
}

// Post Card Component
function PostCard({ 
  post, 
  onSelect, 
  onLike, 
  navigate,
  formatPostTimestamp,
  isPrioritized = false 
}: { 
  post: ForumPost; 
  onSelect: (post: ForumPost) => void; 
  onLike: (id: string) => void;
  navigate: any;
  formatPostTimestamp: (timestamp: Date) => string;
  isPrioritized?: boolean;
}) {
  return (
    <Card className={`hover:shadow-lg transition-shadow cursor-pointer group ${
      isPrioritized ? "border-2 border-teal-300 bg-teal-50/30" : ""
    }`}>
      <CardHeader onClick={() => onSelect(post)} className="p-4 sm:p-6">
        <div className="flex flex-col gap-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
              <Avatar className="h-8 w-8 sm:h-10 sm:w-10 flex-shrink-0">
                <AvatarFallback className="bg-teal-100 text-teal-700 text-sm sm:text-base">
                  {post.author.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/user/${post.userId}`);
                  }}
                  className="text-xs sm:text-sm text-gray-900 hover:text-teal-600 hover:underline truncate block"
                >
                  {post.author}
                </button>
                <div className="flex items-center gap-1 sm:gap-2">
                  <p className="text-xs text-gray-500">
                    <Clock className="h-3 w-3 inline mr-0.5 sm:mr-1" />
                    {formatPostTimestamp(post.timestamp instanceof Date ? post.timestamp : new Date())}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-1 items-start flex-shrink-0">
              {post.tags.slice(0, 1).map((tag) => (
                <Badge key={tag} variant="secondary" className="bg-teal-100 text-teal-800 text-xs hidden sm:inline-flex">
                  {tag}
                </Badge>
              ))}
              {post.tags.length > 1 && (
                <Badge variant="secondary" className="bg-gray-100 text-gray-600 text-xs hidden sm:inline-flex">
                  +{post.tags.length - 1}
                </Badge>
              )}
            </div>
          </div>
          <div>
            <CardTitle className="text-base sm:text-lg lg:text-xl text-gray-900 group-hover:text-teal-600 transition-colors mb-2">
              {post.title}
            </CardTitle>
            <CardDescription className="text-sm sm:text-base text-gray-700 line-clamp-2">
              {post.content}
            </CardDescription>
          </div>
          {/* Tags on mobile - shown below content */}
          <div className="flex flex-wrap gap-1 sm:hidden">
            {post.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="bg-teal-100 text-teal-800 text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 sm:p-6 pt-0">
        <div className="flex flex-wrap items-center gap-3 sm:gap-6 text-xs sm:text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <MessageCircle className="h-3 w-3 sm:h-4 sm:w-4" />
            <span>{post.replies} {post.replies === 1 ? 'reply' : 'replies'}</span>
          </div>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onLike(post.id);
            }}
            className="flex items-center gap-1 hover:text-teal-600 transition-colors"
          >
            <ThumbsUp className="h-3 w-3 sm:h-4 sm:w-4" />
            <span>{post.likes} {post.likes === 1 ? 'like' : 'likes'}</span>
          </button>
          <Button 
            variant="link" 
            className="text-teal-600 p-0 h-auto group-hover:gap-2 transition-all text-xs sm:text-sm"
            onClick={() => onSelect(post)}
          >
            <span className="hidden sm:inline">View Discussion</span>
            <span className="sm:hidden">View</span>
            <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// New Post Dialog Component
function NewPostDialog({ 
  open, 
  onOpenChange, 
  onSubmit 
}: { 
  open: boolean; 
  onOpenChange: (open: boolean) => void;
  onSubmit: (e: React.FormEvent) => void;
}) {
  const [guidelinesAccepted, setGuidelinesAccepted] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guidelinesAccepted) {
      toast.error("Please accept the community guidelines to continue");
      return;
    }
    onSubmit(e);
    setGuidelinesAccepted(false); // Reset for next time
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create a New Discussion</DialogTitle>
          <DialogDescription>
            Share your thoughts, ask questions, or start a conversation with the community
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Discussion Title *</Label>
            <Input
              id="title"
              name="title"
              placeholder="What's on your mind?"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="content">Your Message *</Label>
            <Textarea
              id="content"
              name="content"
              placeholder="Share your thoughts in detail..."
              rows={6}
              required
            />
          </div>

          <div>
            <Label className="mb-3 block">Select Topics * (Choose at least one)</Label>
            <div className="grid grid-cols-2 gap-3">
              {COMMUNITY_TAGS.map((tag) => (
                <div key={tag} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`tag-${tag}`}
                    name={`tag-${tag}`}
                  />
                  <label
                    htmlFor={`tag-${tag}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    {tag}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Community Guidelines Acceptance */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Checkbox 
                  id="guidelines-acceptance"
                  checked={guidelinesAccepted}
                  onCheckedChange={(checked) => setGuidelinesAccepted(checked as boolean)}
                  className="mt-1"
                />
                <div className="flex-1">
                  <label
                    htmlFor="guidelines-acceptance"
                    className="text-sm text-blue-900 cursor-pointer"
                  >
                    I have read and agree to follow the{' '}
                    <button
                      type="button"
                      onClick={() => {
                        navigate("/community-guidelines");
                        onOpenChange(false);
                      }}
                      className="text-blue-700 hover:text-blue-800 underline font-medium"
                    >
                      Community Guidelines
                    </button>
                    . I understand this is a safe, supportive space and will be respectful to all members. *
                  </label>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-4">
            <Button 
              type="submit" 
              className="flex-1 bg-teal-600 hover:bg-teal-700"
              disabled={!guidelinesAccepted}
            >
              <Plus className="h-4 w-4 mr-2" />
              Publish Post
            </Button>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// View Post Dialog Component
function ViewPostDialog({ 
  post, 
  onClose, 
  onLike, 
  onAddResponse,
  newResponse,
  setNewResponse,
  navigate,
  user,
  showLoginDialog
}: { 
  post: ForumPost | null;
  onClose: () => void;
  onLike: (id: string) => void;
  onAddResponse: () => void;
  newResponse: string;
  setNewResponse: (value: string) => void;
  navigate: any;
  user: any;
  showLoginDialog: () => void;
}) {
  if (!post) return null;

  return (
    <Dialog open={!!post} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex flex-wrap gap-2 mb-3">
                {post.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="bg-teal-100 text-teal-800">
                    {tag}
                  </Badge>
                ))}
              </div>
              <DialogTitle className="text-2xl">{post.title}</DialogTitle>
              <DialogDescription className="sr-only">
                Community discussion post with responses
              </DialogDescription>
            </div>
          </div>
          <div className="flex items-center gap-3 mt-4">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-teal-100 text-teal-700">
                {post.author.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <button
                onClick={() => navigate(`/user/${post.userId}`)}
                className="text-sm text-gray-900 hover:text-teal-600 hover:underline"
              >
                {post.author}
              </button>
              <p className="text-xs text-gray-500">
                {post.timestamp instanceof Date 
                  ? post.timestamp.toLocaleString()
                  : new Date().toLocaleString()}
              </p>
            </div>
          </div>
        </DialogHeader>
        
        <div className="mt-6">
          <p className="text-gray-700 leading-relaxed mb-6 whitespace-pre-wrap">{post.content}</p>
          
          <div className="flex items-center gap-6 text-sm text-gray-600 pb-6 border-b">
            <button 
              onClick={() => onLike(post.id)}
              className="flex items-center gap-1 hover:text-teal-600 transition-colors"
            >
              <ThumbsUp className="h-4 w-4" />
              <span>{post.likes} {post.likes === 1 ? 'like' : 'likes'}</span>
            </button>
            <div className="flex items-center gap-1">
              <MessageCircle className="h-4 w-4" />
              <span>{post.replies} {post.replies === 1 ? 'reply' : 'replies'}</span>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-lg mb-4 text-gray-900">
              Responses ({post.responses.length})
            </h3>
            <div className="space-y-4 mb-6">
              {post.responses.map((response) => (
                <div key={response.id} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-blue-100 text-blue-700">
                        {response.author.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <button
                        onClick={() => navigate(`/user/${response.userId}`)}
                        className="text-sm text-gray-900 hover:text-teal-600 hover:underline"
                      >
                        {response.author}
                      </button>
                      <p className="text-xs text-gray-500">
                        {response.timestamp instanceof Date 
                          ? response.timestamp.toLocaleString()
                          : new Date().toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-700 whitespace-pre-wrap">{response.content}</p>
                </div>
              ))}
            </div>

            <div className="space-y-3">
              <Label>Add Your Response</Label>
              <Textarea
                value={newResponse}
                onChange={(e) => setNewResponse(e.target.value)}
                placeholder={user ? "Share your thoughts or advice..." : "Log in to post a response..."}
                rows={4}
                disabled={!user}
              />
              <Button 
                onClick={() => user ? onAddResponse() : showLoginDialog()}
                className="bg-teal-600 hover:bg-teal-700"
                disabled={!newResponse.trim() && user}
              >
                <Send className="h-4 w-4 mr-2" />
                Post Response
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Login Prompt Dialog
function LoginPromptDialog({ 
  open, 
  onOpenChange, 
  navigate 
}: { 
  open: boolean; 
  onOpenChange: (open: boolean) => void;
  navigate: any;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Compass className="h-6 w-6 text-teal-600" />
            Join the Community
          </DialogTitle>
          <DialogDescription>
            Create an account to participate in discussions and connect with others
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-gray-700">
            To participate in community discussions, please create a free account or log in.
          </p>
          <div className="bg-teal-50 rounded-lg p-4 border border-teal-200">
            <h4 className="font-medium text-teal-900 mb-2">Community Benefits:</h4>
            <ul className="space-y-1 text-sm text-teal-800">
              <li className="flex items-start gap-2">
                <Users className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>Connect with others who understand your journey</span>
              </li>
              <li className="flex items-start gap-2">
                <MessageCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>Share experiences and get support</span>
              </li>
              <li className="flex items-start gap-2">
                <Shield className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>Safe, moderated environment</span>
              </li>
              <li className="flex items-start gap-2">
                <Sparkles className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>Personalized discussion recommendations</span>
              </li>
            </ul>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={() => {
                onOpenChange(false);
                navigate("/signup");
              }}
              className="flex-1 bg-teal-600 hover:bg-teal-700"
            >
              Create Account
            </Button>
            <Button
              onClick={() => {
                onOpenChange(false);
                navigate("/login");
              }}
              variant="outline"
              className="flex-1"
            >
              <LogIn className="h-4 w-4 mr-2" />
              Log In
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
