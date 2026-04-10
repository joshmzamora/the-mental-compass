import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
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
  ChevronRight as ChevronRightIcon,
  Minus,
  ChevronDown,
  ChevronUp
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
import { supabase } from "../utils/supabase/client";

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
  user_id: string;
  author: string;
  content: string;
  created_at: string;
  avatar: string;
}

// Generic starter messages to display before real user messages
const initialChatMessages: ChatMessage[] = [
  {
    id: "starter-1",
    user_id: "system",
    author: "Michael",
    content: "Has anyone tried the new meditation app recommended in the blog?",
    created_at: new Date(Date.now() - 3600000).toISOString(),
    avatar: "M"
  },
  {
    id: "starter-2",
    user_id: "system",
    author: "Jessica",
    content: "Yes! I've been using it for a week now and it's really helpful for my anxiety.",
    created_at: new Date(Date.now() - 3480000).toISOString(),
    avatar: "J"
  },
];

const DAILY_ENGAGEMENT_START = new Date("2026-04-10T00:00:00");
const DAILY_ENGAGEMENT_END = new Date("2026-06-01T23:59:59");
const DAILY_ENGAGEMENT_POSTS_PER_DAY = 3;

type EngagementTemplate = {
  title: string;
  content: string;
  tags: CommunityTag[];
  replyPool: string[];
};

const engagementTemplates: EngagementTemplate[] = [
  {
    title: "Quick check-in: what's one thing helping today?",
    content: "Doing a quick community check-in. What's one small thing that's helping you stay grounded today?",
    tags: ["Support", "Wellness"],
    replyPool: [
      "A short walk helped me reset this morning.",
      "Music in the background while I work has helped a lot.",
      "I wrote down 3 tiny goals and that lowered my stress."
    ]
  },
  {
    title: "Anxiety spike today - anyone using short resets?",
    content: "Had a stress spike this afternoon and used a short reset. What are your go-to 2 to 5 minute coping tools?",
    tags: ["Anxiety", "Coping Strategies"],
    replyPool: [
      "Cold water on my wrists usually helps me.",
      "Box breathing for 2 minutes is my default.",
      "Naming 5 things I can see helps me return to the moment."
    ]
  },
  {
    title: "Friendly reminder: progress still counts on hard days",
    content: "If today feels heavy, this is your reminder that small progress still counts. What does a gentle win look like for you today?",
    tags: ["Recovery", "Support"],
    replyPool: [
      "My gentle win was replying to one important email.",
      "I made myself lunch instead of skipping it.",
      "I asked for help instead of isolating."
    ]
  },
  {
    title: "End-of-day decompress ideas?",
    content: "Trying to build a better wind-down routine after long days. What helps your mind slow down at night?",
    tags: ["Self-Care", "Wellness"],
    replyPool: [
      "No screens 30 minutes before bed made a big difference.",
      "I do a short stretch and then journal for 5 minutes.",
      "Herbal tea and low lights helps me settle."
    ]
  },
  {
    title: "Relationship boundaries check-in",
    content: "Working on boundaries without guilt. What's one boundary phrase that feels respectful and clear for you?",
    tags: ["Relationships", "Coping Strategies"],
    replyPool: [
      "I use: 'I can't commit to that right now.'",
      "I say: 'I care, and I need some time to recharge first.'",
      "I replaced apologies with 'thanks for understanding.'"
    ]
  },
  {
    title: "Motivation low? What's your first tiny step?",
    content: "On low-energy days, I focus on one tiny step first. What's your version of a low-pressure start?",
    tags: ["Depression", "Recovery"],
    replyPool: [
      "I open the curtains and drink water first.",
      "I put both feet on the floor and do a 60-second reset.",
      "I choose one two-minute task to build momentum."
    ]
  }
];

const engagementAuthors = [
  "Community Pulse",
  "Care Circle",
  "Support Desk",
  "Wellness Team",
  "Check-in Crew",
  "Growth Circle"
];

const toDayStart = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate());

const toIsoDay = (date: Date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

const generateDailyEngagementPosts = (now: Date): ForumPost[] => {
  const today = toDayStart(now);
  const campaignEnd = toDayStart(
    new Date(Math.min(today.getTime(), DAILY_ENGAGEMENT_END.getTime())),
  );

  if (campaignEnd < DAILY_ENGAGEMENT_START) {
    return [];
  }

  const generated: ForumPost[] = [];
  const cursor = new Date(DAILY_ENGAGEMENT_START);
  let dayIndex = 0;

  while (cursor <= campaignEnd) {
    const isToday = toIsoDay(cursor) === toIsoDay(today);

    for (let slot = 0; slot < DAILY_ENGAGEMENT_POSTS_PER_DAY; slot++) {
      const template =
        engagementTemplates[
          (dayIndex * DAILY_ENGAGEMENT_POSTS_PER_DAY + slot) %
            engagementTemplates.length
        ];

      const author =
        engagementAuthors[
          (dayIndex + slot) % engagementAuthors.length
        ];

      const timestamp = new Date(cursor);
      if (isToday) {
        // Spread today's engagement posts so the feed feels active
        // without looking artificially clustered "right now".
        const todayOffsetsMinutes = [12, 165, 360];
        const minutesAgo = todayOffsetsMinutes[slot] ?? (120 + slot * 90);
        timestamp.setTime(now.getTime() - minutesAgo * 60000);
      } else {
        timestamp.setHours(
          9 + slot * 4,
          (dayIndex * 11 + slot * 7) % 60,
          0,
          0,
        );
      }

      const replyCount = 1 + ((dayIndex + slot) % 3);
      const likeMultiplier = 7 + ((dayIndex + slot) % 6);
      const postId = `campaign-${toIsoDay(cursor)}-${slot + 1}`;

      const responses: Response[] = Array.from(
        { length: replyCount },
        (_, responseIndex) => {
          const replyTimestamp = new Date(timestamp);
          replyTimestamp.setMinutes(
            replyTimestamp.getMinutes() +
              10 +
              responseIndex * 9,
          );
          if (isToday && replyTimestamp > now) {
            replyTimestamp.setTime(
              now.getTime() - (2 + responseIndex) * 60000,
            );
          }

          const replyContent =
            template.replyPool[
              (responseIndex + dayIndex + slot) %
                template.replyPool.length
            ];

          return {
            id: `${postId}-r${responseIndex + 1}`,
            postId,
            userId: `campaign-user-${slot}-${responseIndex}`,
            author: `Member ${String.fromCharCode(
              65 +
                ((dayIndex + slot + responseIndex) %
                  26),
            )}.`,
            content: replyContent,
            timestamp: replyTimestamp,
            likes: 3 + ((dayIndex + responseIndex) % 7),
            likedBy: [],
          };
        },
      );

      generated.push({
        id: postId,
        userId: `campaign-${slot + 1}`,
        author,
        title: template.title,
        content: template.content,
        tags: template.tags,
        replies: responses.length,
        likes: responses.length * likeMultiplier,
        likedBy: [],
        timestamp,
        responses,
      });
    }

    cursor.setDate(cursor.getDate() + 1);
    dayIndex += 1;
  }

  return generated;
};

const mergeUniquePosts = (
  posts: ForumPost[],
  generatedPosts: ForumPost[],
) => {
  const merged = [...generatedPosts, ...posts];
  return merged.filter(
    (post, index, array) =>
      array.findIndex((candidate) => candidate.id === post.id) ===
      index,
  );
};

const normalizeForumTimestamps = (
  posts: ForumPost[],
  now: Date,
): ForumPost[] => {
  return posts.map((post, postIndex) => {
    let safePostTimestamp = new Date(post.timestamp);

    // Prevent future post timestamps from showing up as "Just now".
    if (safePostTimestamp.getTime() > now.getTime()) {
      const minutesAgo = 20 + (postIndex % 9) * 47;
      safePostTimestamp = new Date(
        now.getTime() - minutesAgo * 60000,
      );
    }

    const safeResponses = post.responses.map(
      (response, responseIndex) => {
        const minResponseTime = new Date(
          safePostTimestamp.getTime() +
            (responseIndex + 1) * 6 * 60000,
        );
        const maxResponseTime = new Date(
          now.getTime() - (responseIndex + 1) * 2 * 60000,
        );

        let safeResponseTimestamp = new Date(response.timestamp);

        if (
          safeResponseTimestamp.getTime() <
          safePostTimestamp.getTime()
        ) {
          safeResponseTimestamp = minResponseTime;
        }

        if (
          safeResponseTimestamp.getTime() > now.getTime()
        ) {
          safeResponseTimestamp = maxResponseTime;
        }

        if (
          safeResponseTimestamp.getTime() <
          safePostTimestamp.getTime()
        ) {
          safeResponseTimestamp = new Date(
            safePostTimestamp.getTime() + 3 * 60000,
          );
        }

        return {
          ...response,
          timestamp: safeResponseTimestamp,
        };
      },
    );

    return {
      ...post,
      timestamp: safePostTimestamp,
      responses: safeResponses,
    };
  });
};

export function CommunitySection() {
  const { user } = useAuth();
  const { updateProfile, profile } = useUserProfile();
  const navigate = useNavigate();

  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [realTimeChatMessages, setRealTimeChatMessages] = useState<ChatMessage[]>([]);
  const [chatLoading, setChatLoading] = useState(true);
  const [chatDatabaseConfigured, setChatDatabaseConfigured] = useState(true);
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

  // Featured discussions minimize state
  const [isFeaturedMinimized, setIsFeaturedMinimized] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);

  const isSearching = !!(searchQuery.trim() || selectedTags.length > 0 || dateRangeFilter !== "all");

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

  // Load chat messages from Supabase and set up real-time subscription
  useEffect(() => {
    loadChatMessages();

    // Set up real-time subscription for new messages
    const channel = supabase
      .channel('live_chat_messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'live_chat_messages'
        },
        (payload) => {
          const newMessage = payload.new as ChatMessage;
          setRealTimeChatMessages(prev => [...prev, newMessage]);
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log('✓ Real-time chat connected');
        } else if (status === 'CHANNEL_ERROR') {
          console.log('Real-time chat unavailable - using local messages');
        } else if (status === 'TIMED_OUT') {
          console.log('Real-time chat connection timed out - using local messages');
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Load local messages from localStorage on mount
  useEffect(() => {
    const savedLocalMessages = localStorage.getItem('local_chat_messages');
    if (savedLocalMessages) {
      try {
        const parsed = JSON.parse(savedLocalMessages);
        setRealTimeChatMessages(prev => [...prev, ...parsed]);
      } catch (error) {
        console.error('Error loading local messages:', error);
      }
    }
  }, []);

  // Save local messages to localStorage whenever they change
  useEffect(() => {
    const localMessages = realTimeChatMessages.filter(msg => msg.id.startsWith('local-'));
    if (localMessages.length > 0) {
      localStorage.setItem('local_chat_messages', JSON.stringify(localMessages));
    }
  }, [realTimeChatMessages]);

  // Combine starter messages with real-time messages
  useEffect(() => {
    // Show starter messages first, then real user messages
    const combinedMessages = [...initialChatMessages, ...realTimeChatMessages];
    setChatMessages(combinedMessages);
  }, [realTimeChatMessages]);

  // Auto-scroll chat to bottom only on initial load
  useEffect(() => {
    if (chatMessages.length > 0 && chatMessages.length <= initialChatMessages.length + 1) {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages.length]);

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
        const campaignPosts = generateDailyEngagementPosts(new Date());
        const combinedPosts = mergeUniquePosts(posts, campaignPosts);
        const normalizedPosts = normalizeForumTimestamps(
          combinedPosts,
          new Date(),
        );
        setForumPosts(normalizedPosts);
        checkForNewNotifications(normalizedPosts);
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

  const loadChatMessages = async () => {
    try {
      setChatLoading(true);

      // Check if we have a valid session first (silently)
      try {
        await supabase.auth.getSession();
      } catch (sessionError) {
        // Ignore session errors
      }

      const { data, error } = await supabase
        .from('live_chat_messages')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) {
        // Silently handle all database errors - chat is optional
        console.log('Live chat database not configured yet - using local mode');
        setChatDatabaseConfigured(false);
        setChatLoading(false);
        return;
      }

      if (data) {
        setRealTimeChatMessages(data);
        setChatDatabaseConfigured(true);
        console.log('✓ Live chat database connected - real-time mode enabled');
      }
      setChatLoading(false);
    } catch (error: any) {
      // Silently handle all errors - chat is optional and should not break the app
      setChatDatabaseConfigured(false);
      setChatLoading(false);
    }
  };

  const loadMockPosts = () => {
    const mockPosts: ForumPost[] = [
      {
        id: "new-1",
        userId: "mock-new-1",
        author: "Alex J.",
        title: "New to the community and looking for support",
        content: "Hi everyone, I just joined The Mental Compass today. I've been dealing with some rough patches recently and decided it's time to reach out. Really glad to find a community like this.",
        tags: ["Support", "Wellness"],
        replies: 4,
        likes: 28,
        likedBy: [],
        timestamp: new Date("2026-04-10T08:15:00"),
        responses: [
          {
            id: "r-new-1-1",
            postId: "new-1",
            userId: "mock2",
            author: "Mike T.",
            content: "Welcome, Alex! Taking the first step to reach out is huge. You're in a safe place here.",
            timestamp: new Date("2026-04-10T09:30:00"),
            likes: 5,
            likedBy: []
          },
          {
            id: "r-new-1-2",
            postId: "new-1",
            userId: "mock18",
            author: "Nora P.",
            content: "Glad you're here. A lot of us started exactly where you are, and it does get easier with support.",
            timestamp: new Date("2026-04-10T10:05:00"),
            likes: 4,
            likedBy: []
          },
          {
            id: "r-new-1-3",
            postId: "new-1",
            userId: "mock19",
            author: "Daniel K.",
            content: "If it helps, I keep a tiny daily check-in note on my phone. It made a big difference for me over time.",
            timestamp: new Date("2026-04-10T10:40:00"),
            likes: 3,
            likedBy: []
          },
          {
            id: "r-new-1-4",
            postId: "new-1",
            userId: "mock20",
            author: "Aisha L.",
            content: "Sending support. You are not alone in this.",
            timestamp: new Date("2026-04-10T11:20:00"),
            likes: 2,
            likedBy: []
          }
        ]
      },
      {
        id: "new-2",
        userId: "mock-new-2",
        author: "Emily R.",
        title: "Managing spring triggers",
        content: "Does anyone else find their anxiety spikes when the seasons change? The transition to spring always makes me feel off-balance and overwhelmed. Any tips for managing seasonal transitions?",
        tags: ["Anxiety", "Coping Strategies"],
        replies: 5,
        likes: 40,
        likedBy: [],
        timestamp: new Date("2026-04-09T14:20:00"),
        responses: [
          {
            id: "r-new-2-1",
            postId: "new-2",
            userId: "mock8",
            author: "Emma L.",
            content: "Absolutely. The change in daylight and routine always throws me off. Sticking to a strict sleep schedule helps me a lot.",
            timestamp: new Date("2026-04-09T16:10:00"),
            likes: 14,
            likedBy: []
          },
          {
            id: "r-new-2-2",
            postId: "new-2",
            userId: "mock9",
            author: "Rachel W.",
            content: "I totally get this. I try to spend 15 minutes outside every morning just to let my body adjust gradually to the new season's light.",
            timestamp: new Date("2026-04-09T18:45:00"),
            likes: 8,
            likedBy: []
          },
          {
            id: "r-new-2-3",
            postId: "new-2",
            userId: "mock13",
            author: "Leah G.",
            content: "Layering helped me a lot this season. I also set a gentle morning routine and avoid caffeine on high-anxiety days.",
            timestamp: new Date("2026-04-09T19:30:00"),
            likes: 6,
            likedBy: []
          },
          {
            id: "r-new-2-4",
            postId: "new-2",
            userId: "mock14",
            author: "Chris H.",
            content: "Same here. I track weather shifts and schedule a shorter to-do list those days.",
            timestamp: new Date("2026-04-09T20:00:00"),
            likes: 5,
            likedBy: []
          },
          {
            id: "r-new-2-5",
            postId: "new-2",
            userId: "mock15",
            author: "Priya N.",
            content: "Light walks at lunch and consistent bedtime helped reduce that spring spike for me.",
            timestamp: new Date("2026-04-09T20:40:00"),
            likes: 4,
            likedBy: []
          }
        ]
      },
      {
        id: "new-3",
        userId: "mock-new-3",
        author: "Marcus T.",
        title: "Journaling has completely changed my mindset",
        content: "I wanted to share a win. About a month ago, I started writing down three things I'm grateful for every night. It felt silly at first, but it's genuinely shifted how I view my days. Highly recommend giving it a try.",
        tags: ["Wellness", "Self-Care", "Recovery"],
        replies: 4,
        likes: 36,
        likedBy: [],
        timestamp: new Date("2026-04-08T20:00:00"),
        responses: [
          {
            id: "r-new-3-1",
            postId: "new-3",
            userId: "mock4",
            author: "Maya P.",
            content: "This is so inspiring! I've been trying to get into journaling. Thank you for sharing your positive experience.",
            timestamp: new Date("2026-04-08T09:15:00"),
            likes: 21,
            likedBy: []
          },
          {
            id: "r-new-3-2",
            postId: "new-3",
            userId: "mock16",
            author: "Ben O.",
            content: "I started with one line a day. It felt manageable and eventually became part of my routine.",
            timestamp: new Date("2026-04-08T11:35:00"),
            likes: 11,
            likedBy: []
          },
          {
            id: "r-new-3-3",
            postId: "new-3",
            userId: "mock17",
            author: "Tara M.",
            content: "Prompts helped me a lot. I keep a small list for days when I do not know what to write.",
            timestamp: new Date("2026-04-08T14:10:00"),
            likes: 9,
            likedBy: []
          },
          {
            id: "r-new-3-4",
            postId: "new-3",
            userId: "mock21",
            author: "Jules R.",
            content: "Love this win. Tiny habits really add up.",
            timestamp: new Date("2026-04-08T16:00:00"),
            likes: 7,
            likedBy: []
          }
        ]
      },
      {
        id: "new-4",
        userId: "mock-new-4",
        author: "Sam D.",
        title: "Navigating relationship boundaries with a partner",
        content: "How do you explain your mental health boundaries to a partner who doesn't fully understand? I need alone time to recharge, but they take it personally. I love them but the guilt is exhausting.",
        tags: ["Relationships", "Support"],
        replies: 4,
        likes: 40,
        likedBy: [],
        timestamp: new Date("2026-04-07T11:30:00"),
        responses: [
          {
            id: "r-new-4-1",
            postId: "new-4",
            userId: "mock11",
            author: "Nina S.",
            content: "Communication is key. Try emphasizing that your need for space is about *your* well-being, not a reflection of how you feel about them.",
            timestamp: new Date("2026-04-07T13:20:00"),
            likes: 31,
            likedBy: []
          },
          {
            id: "r-new-4-2",
            postId: "new-4",
            userId: "mock12",
            author: "Tom B.",
            content: "I use the 'battery' analogy. I tell my partner my social battery is low and needs to charge. It makes it less personal and more about energy levels.",
            timestamp: new Date("2026-04-07T15:05:00"),
            likes: 45,
            likedBy: []
          },
          {
            id: "r-new-4-3",
            postId: "new-4",
            userId: "mock22",
            author: "Hannah V.",
            content: "I scripted a short sentence I could repeat kindly. It reduced conflict a lot in my relationship.",
            timestamp: new Date("2026-04-07T16:30:00"),
            likes: 13,
            likedBy: []
          },
          {
            id: "r-new-4-4",
            postId: "new-4",
            userId: "mock23",
            author: "Kyle D.",
            content: "We now schedule recharge time in advance so it feels planned, not personal.",
            timestamp: new Date("2026-04-07T17:20:00"),
            likes: 10,
            likedBy: []
          }
        ]
      },
      {
        id: "new-5",
        userId: "mock-new-5",
        author: "Jordan F.",
        title: "Finding motivation on the bad days",
        content: "Some days, getting out of bed feels like climbing a mountain. For anyone else struggling today, please remember that surviving is enough. Be kind to yourselves.",
        tags: ["Depression", "Support"],
        replies: 5,
        likes: 55,
        likedBy: [],
        timestamp: new Date("2026-04-06T08:45:00"),
        responses: [
          {
            id: "r-new-5-1",
            postId: "new-5",
            userId: "mock26",
            author: "Riley C.",
            content: "Needed to hear this today. Thank you. Sometimes just making a cup of tea is an achievement.",
            timestamp: new Date("2026-04-06T10:10:00"),
            likes: 56,
            likedBy: []
          },
          {
            id: "r-new-5-2",
            postId: "new-5",
            userId: "mock24",
            author: "Mina E.",
            content: "Thank you for this reminder. I call these my low-energy days and lower expectations on purpose.",
            timestamp: new Date("2026-04-06T11:05:00"),
            likes: 22,
            likedBy: []
          },
          {
            id: "r-new-5-3",
            postId: "new-5",
            userId: "mock25",
            author: "Ivan S.",
            content: "My therapist suggested a two-item goal list. It helps me avoid feeling overwhelmed.",
            timestamp: new Date("2026-04-06T12:40:00"),
            likes: 19,
            likedBy: []
          },
          {
            id: "r-new-5-4",
            postId: "new-5",
            userId: "mock27",
            author: "Zara W.",
            content: "This thread helped me feel less alone today. Appreciate everyone sharing.",
            timestamp: new Date("2026-04-06T14:10:00"),
            likes: 12,
            likedBy: []
          },
          {
            id: "r-new-5-5",
            postId: "new-5",
            userId: "mock28",
            author: "Noah B.",
            content: "Surviving is absolutely enough. Thanks for posting this.",
            timestamp: new Date("2026-04-06T15:35:00"),
            likes: 9,
            likedBy: []
          }
        ]
      },
      {
        id: "1",
        userId: "mock1",
        author: "Sarah M.",
        title: "Coping with anxiety at work - any tips?",
        content: "I've been struggling with workplace anxiety lately, especially during meetings and presentations. My heart races, I get sweaty palms, and sometimes I feel like I can't breathe. Does anyone have strategies that have worked for them?",
        tags: ["Anxiety", "Coping Strategies"],
        replies: 3,
        likes: 36,
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
        likes: 7,
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
        likes: 8,
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
        likes: 18,
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
        likes: 20,
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
        likes: 22,
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
        likes: 12,
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
        likes: 7,
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
        likes: 16,
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
        likes: 9,
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
        content: "It has been a year since my mom passed, and I still have random days where it hits like day one. Some friends mean well but keep saying I should be \"moving on\" by now. Anyone else feel like grief comes in waves no matter how much time passes?",
        tags: ["Support", "Coping Strategies"],
        replies: 4,
        likes: 40,
        likedBy: [],
        timestamp: new Date("2026-04-09T16:45:00"),
        responses: [
          {
            id: "r11-1",
            postId: "11",
            userId: "mock28",
            author: "Patricia W.",
            content: "Yes. Absolutely. I still get blindsided by little things too. There is no expiration date on missing someone.",
            timestamp: new Date("2026-04-09T19:00:00"),
            likes: 89,
            likedBy: []
          },
          {
            id: "r11-2",
            postId: "11",
            userId: "mock62",
            author: "Jenna R.",
            content: "Same here. Anniversaries are hard, but honestly random Tuesdays can be harder. You're not doing grief wrong.",
            timestamp: new Date("2026-04-09T20:20:00"),
            likes: 41,
            likedBy: []
          },
          {
            id: "r11-3",
            postId: "11",
            userId: "mock63",
            author: "Luis M.",
            content: "One thing that helped me was making a small ritual on hard days. It gives the grief somewhere to go.",
            timestamp: new Date("2026-04-09T21:05:00"),
            likes: 33,
            likedBy: []
          },
          {
            id: "r11-4",
            postId: "11",
            userId: "mock64",
            author: "Holly T.",
            content: "Thanks for posting this. I needed this thread tonight.",
            timestamp: new Date("2026-04-09T22:10:00"),
            likes: 18,
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
        likes: 11,
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
        content: "Hit one year in recovery today. Not every day has been easy, but I can honestly say my relationship with food and my body feels way safer than it used to. If you're in the messy middle, keep going. Small steps really do add up.",
        tags: ["Eating Disorders", "Recovery", "Support"],
        replies: 4,
        likes: 48,
        likedBy: [],
        timestamp: new Date("2026-04-08T14:00:00"),
        responses: [
          {
            id: "r13-1",
            postId: "13",
            userId: "mock32",
            author: "Ashley D.",
            content: "This gives me so much hope. I'm a few months into treatment and some days feel impossible.",
            timestamp: new Date("2026-04-08T16:30:00"),
            likes: 67,
            likedBy: []
          },
          {
            id: "r13-2",
            postId: "13",
            userId: "mock65",
            author: "Rina C.",
            content: "Proud of you. Thank you for being honest about it not being perfect and still being worth it.",
            timestamp: new Date("2026-04-08T17:10:00"),
            likes: 36,
            likedBy: []
          },
          {
            id: "r13-3",
            postId: "13",
            userId: "mock66",
            author: "Dev K.",
            content: "Needed this today. I'm at 6 weeks and trying to trust the process.",
            timestamp: new Date("2026-04-08T18:25:00"),
            likes: 29,
            likedBy: []
          },
          {
            id: "r13-4",
            postId: "13",
            userId: "mock67",
            author: "Mila J.",
            content: "Congrats on 1 year. That's huge.",
            timestamp: new Date("2026-04-08T19:40:00"),
            likes: 21,
            likedBy: []
          }
        ]
      },
      {
        id: "14",
        userId: "mock33",
        author: "Ryan P.",
        title: "Medication stigma needs to end",
        content: "Can we retire the idea that taking antidepressants is \"the easy way out\"? My meds help me function and show up for my life. No one shames people for taking medication for other health conditions. Mental health treatment should be treated the same way.",
        tags: ["Support", "Wellness"],
        replies: 5,
        likes: 35,
        likedBy: [],
        timestamp: new Date("2026-04-10T09:30:00"),
        responses: [
          {
            id: "r14-1",
            postId: "14",
            userId: "mock34",
            author: "Nicole K.",
            content: "Thank you for saying this. Medication helped me get stable enough to use therapy skills.",
            timestamp: new Date("2026-04-10T11:45:00"),
            likes: 134,
            likedBy: []
          },
          {
            id: "r14-2",
            postId: "14",
            userId: "mock68",
            author: "Aiden F.",
            content: "Same. It wasn't magic, but it gave me a floor so I could start rebuilding.",
            timestamp: new Date("2026-04-10T12:30:00"),
            likes: 58,
            likedBy: []
          },
          {
            id: "r14-3",
            postId: "14",
            userId: "mock69",
            author: "Kara N.",
            content: "People forget treatment can be meds + therapy + routines. It's all healthcare.",
            timestamp: new Date("2026-04-10T13:15:00"),
            likes: 44,
            likedBy: []
          },
          {
            id: "r14-4",
            postId: "14",
            userId: "mock70",
            author: "Eli P.",
            content: "I used to hide that I was on meds. Threads like this make it easier to be open.",
            timestamp: new Date("2026-04-10T14:05:00"),
            likes: 27,
            likedBy: []
          },
          {
            id: "r14-5",
            postId: "14",
            userId: "mock71",
            author: "Sophie L.",
            content: "Co-signing this 100%. You're taking care of your health, period.",
            timestamp: new Date("2026-04-10T14:55:00"),
            likes: 23,
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
        likes: 8,
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
      },
      {
        id: "16",
        userId: "mock40",
        author: "Lena P.",
        title: "Anyone else doing a 5-minute reset between tasks?",
        content: "Started taking 5-minute mental resets between work tasks this week and my anxiety is noticeably lower. Curious if anyone has a favorite mini reset routine.",
        tags: ["Anxiety", "Coping Strategies"],
        replies: 2,
        likes: 18,
        likedBy: [],
        timestamp: new Date("2026-04-10T17:40:00"),
        responses: [
          {
            id: "r16-1",
            postId: "16",
            userId: "mock41",
            author: "Evan C.",
            content: "I do 10 deep breaths + water break. Super simple but it works.",
            timestamp: new Date("2026-04-10T17:55:00"),
            likes: 9,
            likedBy: []
          },
          {
            id: "r16-2",
            postId: "16",
            userId: "mock42",
            author: "Ruth A.",
            content: "Same. I also step outside for sunlight for 3 minutes when I can.",
            timestamp: new Date("2026-04-10T18:05:00"),
            likes: 7,
            likedBy: []
          }
        ]
      },
      {
        id: "17",
        userId: "mock43",
        author: "Miles T.",
        title: "Today was rough, but I still showed up",
        content: "Not a huge win, but I made it through a hard day without isolating. Posting this for anyone else having one of those days.",
        tags: ["Support", "Recovery"],
        replies: 1,
        likes: 10,
        likedBy: [],
        timestamp: new Date("2026-04-10T16:05:00"),
        responses: [
          {
            id: "r17-1",
            postId: "17",
            userId: "mock44",
            author: "Dana W.",
            content: "That is a huge win. Proud of you for sharing it.",
            timestamp: new Date("2026-04-10T16:20:00"),
            likes: 6,
            likedBy: []
          }
        ]
      },
      {
        id: "18",
        userId: "mock45",
        author: "Nora K.",
        title: "Sleep has been my biggest mood trigger lately",
        content: "If I sleep badly for 2 nights, my mood tanks. Anyone have realistic sleep tips that actually stick?",
        tags: ["Wellness", "Self-Care"],
        replies: 2,
        likes: 22,
        likedBy: [],
        timestamp: new Date("2026-04-09T22:25:00"),
        responses: [
          {
            id: "r18-1",
            postId: "18",
            userId: "mock46",
            author: "Paula S.",
            content: "Phone out of room helped me more than anything else.",
            timestamp: new Date("2026-04-09T22:45:00"),
            likes: 8,
            likedBy: []
          },
          {
            id: "r18-2",
            postId: "18",
            userId: "mock47",
            author: "Greg H.",
            content: "Consistent wake time changed everything for me.",
            timestamp: new Date("2026-04-09T23:00:00"),
            likes: 7,
            likedBy: []
          }
        ]
      },
      {
        id: "19",
        userId: "mock48",
        author: "Ari J.",
        title: "How do you handle Sunday anxiety?",
        content: "Every Sunday evening I get that pit-in-stomach feeling about Monday. Anyone have a routine that softens it?",
        tags: ["Anxiety", "Support"],
        replies: 3,
        likes: 27,
        likedBy: [],
        timestamp: new Date("2026-04-09T18:10:00"),
        responses: [
          {
            id: "r19-1",
            postId: "19",
            userId: "mock49",
            author: "Iris M.",
            content: "I prep clothes + lunch on Sunday. Reduces the panic a lot.",
            timestamp: new Date("2026-04-09T18:25:00"),
            likes: 9,
            likedBy: []
          },
          {
            id: "r19-2",
            postId: "19",
            userId: "mock50",
            author: "Jamal D.",
            content: "I do a short walk and no email after 7pm.",
            timestamp: new Date("2026-04-09T18:40:00"),
            likes: 8,
            likedBy: []
          },
          {
            id: "r19-3",
            postId: "19",
            userId: "mock51",
            author: "Kate L.",
            content: "Planning one thing I look forward to Monday helps me.",
            timestamp: new Date("2026-04-09T18:55:00"),
            likes: 7,
            likedBy: []
          }
        ]
      },
      {
        id: "20",
        userId: "mock52",
        author: "Theo R.",
        title: "Checking in: hydration actually helps my focus",
        content: "I know it sounds basic, but drinking enough water this week helped my ADHD focus way more than expected.",
        tags: ["ADHD", "Wellness"],
        replies: 1,
        likes: 11,
        likedBy: [],
        timestamp: new Date("2026-04-08T20:30:00"),
        responses: [
          {
            id: "r20-1",
            postId: "20",
            userId: "mock53",
            author: "Mina Q.",
            content: "Not basic at all. Same for me, especially in the afternoon.",
            timestamp: new Date("2026-04-08T20:50:00"),
            likes: 6,
            likedBy: []
          }
        ]
      },
      {
        id: "21",
        userId: "mock54",
        author: "Ella N.",
        title: "First panic attack in months - feeling discouraged",
        content: "Had a panic attack today after months of progress. I know setbacks happen, but it still feels defeating.",
        tags: ["Anxiety", "Recovery"],
        replies: 2,
        likes: 20,
        likedBy: [],
        timestamp: new Date("2026-04-08T14:10:00"),
        responses: [
          {
            id: "r21-1",
            postId: "21",
            userId: "mock55",
            author: "Samir B.",
            content: "Setbacks are part of recovery, not proof you failed.",
            timestamp: new Date("2026-04-08T14:35:00"),
            likes: 8,
            likedBy: []
          },
          {
            id: "r21-2",
            postId: "21",
            userId: "mock56",
            author: "Jules F.",
            content: "You still kept all the progress you built. One day doesn't erase it.",
            timestamp: new Date("2026-04-08T14:55:00"),
            likes: 7,
            likedBy: []
          }
        ]
      },
      {
        id: "22",
        userId: "mock57",
        author: "Rina V.",
        title: "Boundary scripts that worked for me",
        content: "Sharing two short boundary scripts that helped me with family stress. Happy to post them if anyone wants.",
        tags: ["Relationships", "Coping Strategies"],
        replies: 1,
        likes: 8,
        likedBy: [],
        timestamp: new Date("2026-04-07T19:20:00"),
        responses: [
          {
            id: "r22-1",
            postId: "22",
            userId: "mock58",
            author: "Corey P.",
            content: "Please share. I freeze in those conversations every time.",
            timestamp: new Date("2026-04-07T19:40:00"),
            likes: 5,
            likedBy: []
          }
        ]
      },
      {
        id: "23",
        userId: "mock59",
        author: "Felix W.",
        title: "What helps with post-therapy emotional crash?",
        content: "After sessions I feel raw for a few hours. Does anyone do something specific right after therapy to regulate?",
        tags: ["Support", "Self-Care"],
        replies: 2,
        likes: 24,
        likedBy: [],
        timestamp: new Date("2026-04-06T15:30:00"),
        responses: [
          {
            id: "r23-1",
            postId: "23",
            userId: "mock60",
            author: "Nadia T.",
            content: "I schedule a no-meeting hour and take a slow walk.",
            timestamp: new Date("2026-04-06T15:50:00"),
            likes: 7,
            likedBy: []
          },
          {
            id: "r23-2",
            postId: "23",
            userId: "mock61",
            author: "Vik R.",
            content: "Snack + journal dump for 10 minutes helps me reset.",
            timestamp: new Date("2026-04-06T16:05:00"),
            likes: 6,
            likedBy: []
          }
        ]
      },
      {
        id: "24",
        userId: "mock72",
        author: "Harper Z.",
        title: "Social battery at zero this week",
        content: "Anyone else hit a wall this week? I like people but my social battery is completely drained.",
        tags: ["Support", "Wellness"],
        replies: 1,
        likes: 12,
        likedBy: [],
        timestamp: new Date("2026-04-05T21:10:00"),
        responses: [
          {
            id: "r24-1",
            postId: "24",
            userId: "mock73",
            author: "Noel G.",
            content: "Yep, same. I gave myself a no-plans weekend and it helped.",
            timestamp: new Date("2026-04-05T21:30:00"),
            likes: 6,
            likedBy: []
          }
        ]
      },
      {
        id: "25",
        userId: "mock74",
        author: "Bianca C.",
        title: "Quick grounding list I keep in my notes app",
        content: "I made a short list for panic moments: cold water, feet on floor, name 5 colors, slow exhale. Sharing in case it helps.",
        tags: ["Anxiety", "Coping Strategies"],
        replies: 2,
        likes: 14,
        likedBy: [],
        timestamp: new Date("2026-04-03T13:45:00"),
        responses: [
          {
            id: "r25-1",
            postId: "25",
            userId: "mock75",
            author: "Tessa M.",
            content: "Saving this. Thank you for posting something practical.",
            timestamp: new Date("2026-04-03T14:05:00"),
            likes: 5,
            likedBy: []
          },
          {
            id: "r25-2",
            postId: "25",
            userId: "mock76",
            author: "Leon S.",
            content: "The cold water one helps me every time.",
            timestamp: new Date("2026-04-03T14:25:00"),
            likes: 5,
            likedBy: []
          }
        ]
      },
      {
        id: "26",
        userId: "mock77",
        author: "Mara D.",
        title: "Anyone tracking moods with a simple 1-10 scale?",
        content: "Trying to make mood tracking less overwhelming. Is a daily 1-10 check-in enough to spot patterns?",
        tags: ["Bipolar", "Wellness"],
        replies: 1,
        likes: 9,
        likedBy: [],
        timestamp: new Date("2026-03-30T09:20:00"),
        responses: [
          {
            id: "r26-1",
            postId: "26",
            userId: "mock78",
            author: "Priyank A.",
            content: "That worked for me. Consistency mattered more than detail.",
            timestamp: new Date("2026-03-30T09:45:00"),
            likes: 4,
            likedBy: []
          }
        ]
      },
      {
        id: "27",
        userId: "mock79",
        author: "Cara B.",
        title: "How do you stop doomscrolling at night?",
        content: "My sleep is wrecked because I keep scrolling bad news before bed. What actually helped you break that cycle?",
        tags: ["Wellness", "Self-Care"],
        replies: 3,
        likes: 30,
        likedBy: [],
        timestamp: new Date("2026-03-25T23:10:00"),
        responses: [
          {
            id: "r27-1",
            postId: "27",
            userId: "mock80",
            author: "Jon P.",
            content: "Charging my phone in another room was the game changer.",
            timestamp: new Date("2026-03-25T23:30:00"),
            likes: 7,
            likedBy: []
          },
          {
            id: "r27-2",
            postId: "27",
            userId: "mock81",
            author: "Remy C.",
            content: "I set app limits and replaced it with a podcast.",
            timestamp: new Date("2026-03-25T23:45:00"),
            likes: 6,
            likedBy: []
          },
          {
            id: "r27-3",
            postId: "27",
            userId: "mock82",
            author: "Ava N.",
            content: "I keep a physical book by my bed to make the switch easier.",
            timestamp: new Date("2026-03-26T00:00:00"),
            likes: 5,
            likedBy: []
          }
        ]
      },
      {
        id: "28",
        userId: "mock83",
        author: "Dario M.",
        title: "Tiny victory: asked for help at work",
        content: "Normally I hide when overwhelmed, but today I asked my manager for help and it actually went well.",
        tags: ["Recovery", "Support"],
        replies: 1,
        likes: 7,
        likedBy: [],
        timestamp: new Date("2026-03-20T11:10:00"),
        responses: [
          {
            id: "r28-1",
            postId: "28",
            userId: "mock84",
            author: "Nina G.",
            content: "Love this. Asking early prevents burnout spirals.",
            timestamp: new Date("2026-03-20T11:30:00"),
            likes: 4,
            likedBy: []
          }
        ]
      },
      {
        id: "29",
        userId: "mock85",
        author: "Quinn H.",
        title: "Any gentle routines for high-stress mornings?",
        content: "Mornings feel chaotic lately. Looking for a short routine that calms my brain before work.",
        tags: ["Anxiety", "Self-Care"],
        replies: 2,
        likes: 16,
        likedBy: [],
        timestamp: new Date("2026-03-12T08:00:00"),
        responses: [
          {
            id: "r29-1",
            postId: "29",
            userId: "mock86",
            author: "Eli N.",
            content: "No phone for first 20 minutes + quick stretch helped me.",
            timestamp: new Date("2026-03-12T08:20:00"),
            likes: 5,
            likedBy: []
          },
          {
            id: "r29-2",
            postId: "29",
            userId: "mock87",
            author: "Pia L.",
            content: "I do tea, sunlight, then write one intention for the day.",
            timestamp: new Date("2026-03-12T08:35:00"),
            likes: 4,
            likedBy: []
          }
        ]
      },
      {
        id: "30",
        userId: "mock88",
        author: "Soren Y.",
        title: "Reminder: resting is productive too",
        content: "I've been treating rest like failure and it burned me out. Relearning that rest is part of recovery.",
        tags: ["Recovery", "Wellness"],
        replies: 1,
        likes: 11,
        likedBy: [],
        timestamp: new Date("2026-03-04T20:15:00"),
        responses: [
          {
            id: "r30-1",
            postId: "30",
            userId: "mock89",
            author: "Kira D.",
            content: "Needed this reminder today, thank you.",
            timestamp: new Date("2026-03-04T20:40:00"),
            likes: 5,
            likedBy: []
          }
        ]
      },
      {
        id: "31",
        userId: "mock90",
        author: "Yara F.",
        title: "Therapy homework actually helped my week",
        content: "I usually skip homework, but I did it this week and felt way less reactive in conflict.",
        tags: ["Support", "Coping Strategies"],
        replies: 2,
        likes: 24,
        likedBy: [],
        timestamp: new Date("2026-02-24T18:35:00"),
        responses: [
          {
            id: "r31-1",
            postId: "31",
            userId: "mock91",
            author: "Milo P.",
            content: "Same! The skills feel awkward until they suddenly work.",
            timestamp: new Date("2026-02-24T18:55:00"),
            likes: 6,
            likedBy: []
          },
          {
            id: "r31-2",
            postId: "31",
            userId: "mock92",
            author: "Jia K.",
            content: "What homework was it? Looking for ideas to try.",
            timestamp: new Date("2026-02-24T19:10:00"),
            likes: 5,
            likedBy: []
          }
        ]
      },
      {
        id: "32",
        userId: "mock93",
        author: "Noa E.",
        title: "How do you recover after social overwhelm?",
        content: "After long social events I feel wired and exhausted. Would love your decompression routines.",
        tags: ["Social Anxiety", "Self-Care"],
        replies: 1,
        likes: 8,
        likedBy: [],
        timestamp: new Date("2026-02-15T22:10:00"),
        responses: [
          {
            id: "r32-1",
            postId: "32",
            userId: "mock94",
            author: "Blake M.",
            content: "Quiet shower + dim lights + no notifications for an hour.",
            timestamp: new Date("2026-02-15T22:35:00"),
            likes: 4,
            likedBy: []
          }
        ]
      },
      {
        id: "33",
        userId: "mock95",
        author: "Rae S.",
        title: "Does anyone else get brain fog with anxiety?",
        content: "On high-anxiety days I struggle to remember basic things. It makes me feel worse and behind.",
        tags: ["Anxiety", "Support"],
        replies: 2,
        likes: 20,
        likedBy: [],
        timestamp: new Date("2026-02-07T10:25:00"),
        responses: [
          {
            id: "r33-1",
            postId: "33",
            userId: "mock96",
            author: "Omar T.",
            content: "Definitely. I switch to tiny task lists on those days.",
            timestamp: new Date("2026-02-07T10:45:00"),
            likes: 5,
            likedBy: []
          },
          {
            id: "r33-2",
            postId: "33",
            userId: "mock97",
            author: "Sky P.",
            content: "You're not alone. My therapist says it's nervous-system overload.",
            timestamp: new Date("2026-02-07T11:00:00"),
            likes: 5,
            likedBy: []
          }
        ]
      },
      {
        id: "34",
        userId: "mock98",
        author: "Tori J.",
        title: "Post-breakup anxiety check-in",
        content: "Breakup happened last month and my anxiety is all over the place. Any grounded ways to get through evenings?",
        tags: ["Relationships", "Support"],
        replies: 1,
        likes: 12,
        likedBy: [],
        timestamp: new Date("2026-01-31T19:05:00"),
        responses: [
          {
            id: "r34-1",
            postId: "34",
            userId: "mock99",
            author: "Leo B.",
            content: "Evening walks and voice notes to myself helped a lot.",
            timestamp: new Date("2026-01-31T19:20:00"),
            likes: 4,
            likedBy: []
          }
        ]
      },
      {
        id: "35",
        userId: "mock100",
        author: "Ivy D.",
        title: "Small win: made my first psychiatrist appointment",
        content: "Finally booked it after putting it off for months. Nervous but relieved.",
        tags: ["Support", "Recovery"],
        replies: 2,
        likes: 14,
        likedBy: [],
        timestamp: new Date("2026-01-20T13:40:00"),
        responses: [
          {
            id: "r35-1",
            postId: "35",
            userId: "mock101",
            author: "Maddie V.",
            content: "Huge step. Proud of you.",
            timestamp: new Date("2026-01-20T14:00:00"),
            likes: 5,
            likedBy: []
          },
          {
            id: "r35-2",
            postId: "35",
            userId: "mock102",
            author: "Arun K.",
            content: "Bring a few notes about symptoms. It helps a lot.",
            timestamp: new Date("2026-01-20T14:20:00"),
            likes: 4,
            likedBy: []
          }
        ]
      },
      {
        id: "36",
        userId: "mock103",
        author: "Gia M.",
        title: "Working on not apologizing for every boundary",
        content: "Trying to stop saying sorry every time I set a boundary. Harder than I expected.",
        tags: ["Relationships", "Recovery"],
        replies: 1,
        likes: 9,
        likedBy: [],
        timestamp: new Date("2026-01-10T12:10:00"),
        responses: [
          {
            id: "r36-1",
            postId: "36",
            userId: "mock104",
            author: "Carmen L.",
            content: "I replaced sorry with 'thanks for understanding.' It helped a lot.",
            timestamp: new Date("2026-01-10T12:35:00"),
            likes: 4,
            likedBy: []
          }
        ]
      },
      {
        id: "37",
        userId: "mock105",
        author: "Ash R.",
        title: "What songs calm your nervous system?",
        content: "Building a calming playlist for anxious nights. Drop your go-to tracks.",
        tags: ["Wellness", "Support"],
        replies: 3,
        likes: 33,
        likedBy: [],
        timestamp: new Date("2025-12-28T21:40:00"),
        responses: [
          {
            id: "r37-1",
            postId: "37",
            userId: "mock106",
            author: "Faye N.",
            content: "Ambient piano + rain sounds every time.",
            timestamp: new Date("2025-12-28T22:00:00"),
            likes: 5,
            likedBy: []
          },
          {
            id: "r37-2",
            postId: "37",
            userId: "mock107",
            author: "Ben T.",
            content: "Lo-fi beats, no lyrics. Helps my brain settle.",
            timestamp: new Date("2025-12-28T22:15:00"),
            likes: 5,
            likedBy: []
          },
          {
            id: "r37-3",
            postId: "37",
            userId: "mock108",
            author: "Rosa K.",
            content: "I keep one playlist just for panic recovery and it helps a lot.",
            timestamp: new Date("2025-12-28T22:30:00"),
            likes: 4,
            likedBy: []
          }
        ]
      },
      {
        id: "38",
        userId: "mock109",
        author: "Neel P.",
        title: "Holiday season loneliness check-in",
        content: "The holidays are usually hard for me emotionally. Posting so anyone else feeling alone knows they are not the only one.",
        tags: ["Support", "Depression"],
        replies: 2,
        likes: 16,
        likedBy: [],
        timestamp: new Date("2025-12-15T18:20:00"),
        responses: [
          {
            id: "r38-1",
            postId: "38",
            userId: "mock110",
            author: "Sia D.",
            content: "Thanks for posting this. The holidays are tough for me too.",
            timestamp: new Date("2025-12-15T18:45:00"),
            likes: 4,
            likedBy: []
          },
          {
            id: "r38-2",
            postId: "38",
            userId: "mock111",
            author: "Ty W.",
            content: "You’re not alone. Community threads helped me last year.",
            timestamp: new Date("2025-12-15T19:00:00"),
            likes: 4,
            likedBy: []
          }
        ]
      },
      {
        id: "39",
        userId: "mock112",
        author: "Parker H.",
        title: "Anyone using body-doubling for focus?",
        content: "Tried body-doubling on video call for chores and it surprisingly worked. Anyone else do this?",
        tags: ["ADHD", "Coping Strategies"],
        replies: 1,
        likes: 10,
        likedBy: [],
        timestamp: new Date("2025-11-30T10:30:00"),
        responses: [
          {
            id: "r39-1",
            postId: "39",
            userId: "mock113",
            author: "Kian M.",
            content: "Yes! It's one of the few things that consistently helps me start tasks.",
            timestamp: new Date("2025-11-30T10:50:00"),
            likes: 4,
            likedBy: []
          }
        ]
      },
      {
        id: "40",
        userId: "mock114",
        author: "Luca S.",
        title: "Grounding tricks for crowded stores?",
        content: "Crowded stores spike my anxiety fast. Looking for quick grounding tips I can use discreetly.",
        tags: ["Anxiety", "Coping Strategies"],
        replies: 2,
        likes: 18,
        likedBy: [],
        timestamp: new Date("2025-11-10T15:40:00"),
        responses: [
          {
            id: "r40-1",
            postId: "40",
            userId: "mock115",
            author: "Mika T.",
            content: "One earbud with calm music + slow counting helps me.",
            timestamp: new Date("2025-11-10T16:00:00"),
            likes: 5,
            likedBy: []
          },
          {
            id: "r40-2",
            postId: "40",
            userId: "mock116",
            author: "Haley R.",
            content: "I hold something cold in my hand and focus on the sensation.",
            timestamp: new Date("2025-11-10T16:15:00"),
            likes: 4,
            likedBy: []
          }
        ]
      },
      {
        id: "41",
        userId: "mock117",
        author: "Aria P.",
        title: "Sharing a script for saying no without guilt",
        content: "Script that helped me: 'I can’t commit to that right now, but thank you for thinking of me.'",
        tags: ["Relationships", "Self-Care"],
        replies: 1,
        likes: 7,
        likedBy: [],
        timestamp: new Date("2025-10-28T11:10:00"),
        responses: [
          {
            id: "r41-1",
            postId: "41",
            userId: "mock118",
            author: "Dean L.",
            content: "Bookmarking this. I always over-explain.",
            timestamp: new Date("2025-10-28T11:30:00"),
            likes: 3,
            likedBy: []
          }
        ]
      },
      {
        id: "42",
        userId: "mock119",
        author: "Zoe A.",
        title: "When motivation is low, what is your first tiny step?",
        content: "Mine is 'stand up and drink water.' Curious what your first tiny step is.",
        tags: ["Depression", "Recovery"],
        replies: 2,
        likes: 22,
        likedBy: [],
        timestamp: new Date("2025-10-03T09:55:00"),
        responses: [
          {
            id: "r42-1",
            postId: "42",
            userId: "mock120",
            author: "Reed K.",
            content: "Open the curtains. That one action usually starts momentum.",
            timestamp: new Date("2025-10-03T10:15:00"),
            likes: 4,
            likedBy: []
          },
          {
            id: "r42-2",
            postId: "42",
            userId: "mock121",
            author: "Cam P.",
            content: "Put both feet on floor and count to 20. Sounds silly but works.",
            timestamp: new Date("2025-10-03T10:25:00"),
            likes: 4,
            likedBy: []
          }
        ]
      },
      {
        id: "43",
        userId: "mock122",
        author: "Rory J.",
        title: "PTSD trigger day - trying to stay grounded",
        content: "Having a trigger-heavy day and doing grounding on repeat. Posting to stay connected instead of shutting down.",
        tags: ["PTSD", "Support"],
        replies: 1,
        likes: 12,
        likedBy: [],
        timestamp: new Date("2025-09-07T17:20:00"),
        responses: [
          {
            id: "r43-1",
            postId: "43",
            userId: "mock123",
            author: "Megan R.",
            content: "You’re doing exactly the right thing by reaching out.",
            timestamp: new Date("2025-09-07T17:40:00"),
            likes: 3,
            likedBy: []
          }
        ]
      },
      {
        id: "44",
        userId: "mock124",
        author: "Talia N.",
        title: "Meal consistency check-in for recovery",
        content: "Trying to keep meals consistent this week and not skip when stressed. Anyone want to do a gentle accountability thread?",
        tags: ["Eating Disorders", "Recovery"],
        replies: 2,
        likes: 20,
        likedBy: [],
        timestamp: new Date("2025-07-22T12:25:00"),
        responses: [
          {
            id: "r44-1",
            postId: "44",
            userId: "mock125",
            author: "Irene C.",
            content: "I’m in. Consistency is hard but this sounds helpful.",
            timestamp: new Date("2025-07-22T12:45:00"),
            likes: 4,
            likedBy: []
          },
          {
            id: "r44-2",
            postId: "44",
            userId: "mock126",
            author: "Gabe H.",
            content: "Count me in too. We can keep it low pressure.",
            timestamp: new Date("2025-07-22T13:00:00"),
            likes: 4,
            likedBy: []
          }
        ]
      },
      {
        id: "45",
        userId: "mock127",
        author: "Nia B.",
        title: "New here and trying to rebuild routines",
        content: "Hi all, first post. I’m trying to rebuild routines after a long rough stretch. Any advice for starting small and staying consistent?",
        tags: ["Support", "Wellness"],
        replies: 1,
        likes: 8,
        likedBy: [],
        timestamp: new Date("2025-06-10T09:00:00"),
        responses: [
          {
            id: "r45-1",
            postId: "45",
            userId: "mock128",
            author: "Owen P.",
            content: "Welcome. Start with one anchor habit and build from there.",
            timestamp: new Date("2025-06-10T09:25:00"),
            likes: 3,
            likedBy: []
          }
        ]
      }
    ];
    const campaignPosts = generateDailyEngagementPosts(new Date());
    const combinedPosts = mergeUniquePosts(mockPosts, campaignPosts);
    const normalizedPosts = normalizeForumTimestamps(
      combinedPosts,
      new Date(),
    );
    setForumPosts(normalizedPosts);
    checkForNewNotifications(normalizedPosts);
  };

  const handleSendMessage = async () => {
    if (!user) {
      setShowLoginDialog(true);
      return;
    }

    if (message.trim()) {
      const newMessage = {
        user_id: user.id,
        author: user.email?.split('@')[0] || "You",
        content: message.trim(),
        avatar: (user.email?.charAt(0) || "Y").toUpperCase()
      };

      // If database is not configured, use local mode immediately
      if (!chatDatabaseConfigured) {
        const localMessage: ChatMessage = {
          id: `local-${Date.now()}`,
          ...newMessage,
          created_at: new Date().toISOString()
        };
        setRealTimeChatMessages(prev => [...prev, localMessage]);
        setMessage("");
        toast.success("Message sent!");
        return;
      }

      try {
        const { error } = await supabase
          .from('live_chat_messages')
          .insert([newMessage]);

        if (error) {
          // Handle specific error cases - switch to local mode
          if (error.code === 'PGRST205' || error.code === 'PGRST116' ||
            error.message.includes('relation') ||
            error.message.includes('does not exist') ||
            error.message.includes('schema cache')) {
            console.log('Switching to local mode - database table not found');
            setChatDatabaseConfigured(false);
            // Add message locally
            const localMessage: ChatMessage = {
              id: `local-${Date.now()}`,
              ...newMessage,
              created_at: new Date().toISOString()
            };
            setRealTimeChatMessages(prev => [...prev, localMessage]);
            setMessage("");
            toast.success("Message sent!");
          } else {
            console.error('Error sending message:', error);
            toast.error("Failed to send message. Please try again.");
          }
          return;
        }

        setMessage("");
        toast.success("Message sent!");
      } catch (error: any) {
        // Handle network errors - add message locally as fallback
        console.log('Network error, using local mode:', error);
        const localMessage: ChatMessage = {
          id: `local-${Date.now()}`,
          ...newMessage,
          created_at: new Date().toISOString()
        };
        setRealTimeChatMessages(prev => [...prev, localMessage]);
        setMessage("");
        toast.success("Message sent!");
      }
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
  const regularPosts = (user && profile?.compassBearing && !isSearching)
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
    <section id="community" className="py-20 bg-gradient-to-br from-teal-50 via-blue-50 to-purple-50 relative overflow-hidden">
      <CompassDecoration variant="light" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8 sm:mb-12 relative">
            <div className="flex items-center justify-center mb-4">
              <Users className="h-6 w-6 sm:h-8 sm:w-8 text-teal-600 mr-2 sm:mr-3" />
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-medium text-gray-900">
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
                              className={`p-3 rounded-lg border cursor-pointer transition-colors ${notification.read
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

            <TabsContent value="forums" className="space-y-4 sm:space-y-6 outline-none">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="space-y-6 sm:space-y-8 max-w-4xl mx-auto"
              >

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
                              className={`flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm transition-colors ${selectedTags.includes(tag)
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

                {/* Feed Content */}
                {isSearching ? (
                  <div className="space-y-4 sm:space-y-6">
                    {/* Search Results Header */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 bg-white/50 p-4 rounded-xl border border-teal-100/50 backdrop-blur-sm shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-teal-100 flex items-center justify-center text-teal-600">
                          <Search className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-gray-900 leading-tight">Search Results</h3>
                          <p className="text-xs text-gray-600">Found {filteredPosts.length} matches for your criteria</p>
                        </div>
                      </div>
                      {filteredPosts.length > 0 && (
                        <Badge variant="outline" className="bg-teal-50 border-teal-200 text-teal-700">
                          {indexOfFirstPost + 1}-{Math.min(indexOfLastPost, filteredPosts.length)} of {filteredPosts.length}
                        </Badge>
                      )}
                    </div>

                    {loading ? (
                      <Card className="p-12 text-center overflow-hidden relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-teal-50/50 to-blue-50/50 opacity-50" />
                        <div className="relative z-10">
                          <div className="flex flex-col items-center justify-center gap-3">
                            <div className="relative">
                              <Compass className="h-10 w-10 text-teal-600 animate-spin" />
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div className="h-1.5 w-1.5 bg-teal-600 rounded-full" />
                              </div>
                            </div>
                            <p className="text-gray-600 font-medium">Scanning discussions...</p>
                          </div>
                        </div>
                      </Card>
                    ) : filteredPosts.length === 0 ? (
                      <Card className="p-12 text-center bg-white border-dashed border-2 border-gray-200 shadow-sm">
                        <div className="h-16 w-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100">
                          <Search className="h-8 w-8 text-gray-300" />
                        </div>
                        <h4 className="text-lg font-bold text-gray-900 mb-2">No matches found</h4>
                        <p className="text-gray-600 max-w-sm mx-auto mb-6 italic">
                          "Your search didn't return any results. Try adjusting your filters or using different keywords."
                        </p>
                        <Button variant="outline" onClick={clearFilters} className="border-teal-200 text-teal-700 hover:bg-teal-50">
                          Clear all filters
                        </Button>
                      </Card>
                    ) : (
                      <div className="grid grid-cols-1 gap-4">
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
                      </div>
                    )}
                  </div>
                ) : (
                  <>
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
                      const nowMs = Date.now();
                      const getFeaturedScore = (post: ForumPost) => {
                        const ageInDays = (nowMs - post.timestamp.getTime()) / (1000 * 60 * 60 * 24);
                        const recencyBoost = Math.max(0, 30 - ageInDays) * 1.5;
                        return post.likes + post.replies * 2 + recencyBoost;
                      };

                      const featuredPosts = [...forumPosts]
                        .sort((a, b) => getFeaturedScore(b) - getFeaturedScore(a))
                        .slice(0, 3);

                      return featuredPosts.length > 0 && (
                        <Card className="border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-amber-50 shadow-lg">
                          <CardHeader className="pb-3">
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1">
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
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setIsFeaturedMinimized(!isFeaturedMinimized)}
                                className="flex-shrink-0 h-8 w-8 p-0 hover:bg-orange-100"
                              >
                                {isFeaturedMinimized ? (
                                  <ChevronDown className="h-4 w-4 text-orange-700" />
                                ) : (
                                  <ChevronUp className="h-4 w-4 text-orange-700" />
                                )}
                              </Button>
                            </div>
                          </CardHeader>
                          {!isFeaturedMinimized && (
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
                          )}
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
                  </>
                )}

                {/* Pagination */}
                {!loading && totalPages > 1 && (
                  <div className="mt-12 pt-8 border-t border-teal-100/50 w-full mb-8">
                    <div className="flex flex-col items-center justify-center gap-6 w-full">
                      <Pagination className="w-full flex justify-center">
                        <PaginationContent className="gap-2 sm:gap-3 justify-center">
                          <PaginationItem>
                            <Button
                              variant="outline"
                              size="default"
                              onClick={() => handlePageChange(currentPage - 1)}
                              disabled={currentPage === 1}
                              className="gap-2 h-9 sm:h-10 px-3 sm:px-4 bg-white hover:bg-teal-50 border-teal-100 text-teal-700 shadow-sm transition-all"
                            >
                              <ChevronLeft className="h-4 w-4" />
                              <span className="hidden sm:inline">Previous</span>
                              <span className="sm:hidden">Prev</span>
                            </Button>
                          </PaginationItem>

                          <div className="hidden sm:flex gap-2">
                            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                              let pageNum;
                              if (totalPages <= 5) pageNum = i + 1;
                              else if (currentPage <= 3) pageNum = i + 1;
                              else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i;
                              else pageNum = currentPage - 2 + i;

                              return (
                                <PaginationItem key={pageNum}>
                                  <PaginationLink
                                    onClick={() => handlePageChange(pageNum)}
                                    isActive={currentPage === pageNum}
                                    className={`cursor-pointer h-9 w-9 sm:h-10 sm:w-10 flex items-center justify-center rounded-md transition-all ${currentPage === pageNum ? 'bg-teal-600 text-white border-teal-600 shadow-md' : 'bg-white hover:bg-teal-50 border-teal-100 text-teal-700 shadow-sm'}`}
                                  >
                                    {pageNum}
                                  </PaginationLink>
                                </PaginationItem>
                              );
                            })}
                          </div>

                          <div className="sm:hidden flex items-center px-4 h-9 bg-white border border-teal-100 rounded-md text-sm font-medium text-teal-700 shadow-sm">
                            {currentPage} / {totalPages}
                          </div>

                          <PaginationItem>
                            <Button
                              variant="outline"
                              size="default"
                              onClick={() => handlePageChange(currentPage + 1)}
                              disabled={currentPage === totalPages}
                              className="gap-2 h-9 sm:h-10 px-3 sm:px-4 bg-white hover:bg-teal-50 border-teal-100 text-teal-700 shadow-sm transition-all"
                            >
                              <span className="hidden sm:inline">Next</span>
                              <span className="sm:hidden">Next</span>
                              <ChevronRightIcon className="h-4 w-4" />
                            </Button>
                          </PaginationItem>
                        </PaginationContent>
                      </Pagination>
                      <p className="text-sm text-gray-500 font-medium tracking-wide">
                        Page <span className="text-teal-700 font-bold">{currentPage}</span> of {totalPages} <span className="text-gray-300 mx-2">|</span> {totalPosts} total discussions
                      </p>
                    </div>
                  </div>
                )}
              </motion.div>
            </TabsContent>

            {/* Chat Tab */}
            <TabsContent value="chat" className="space-y-4 outline-none">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="max-w-4xl mx-auto"
              >

                {/* Real-time Info Banner */}
                <Card className="bg-gradient-to-r from-teal-50 to-blue-50 border-teal-200">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <Sparkles className="h-5 w-5 text-teal-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-900 mb-1">
                          <strong>Real-Time Chat Enabled</strong>
                        </p>
                        <p className="text-xs text-gray-700">
                          Messages appear instantly across all connected devices. Your conversations are synchronized in real-time.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

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
                      {chatLoading ? (
                        <div className="flex items-center justify-center h-full">
                          <div className="text-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mx-auto mb-2"></div>
                            <p className="text-sm text-gray-600">Loading messages...</p>
                          </div>
                        </div>
                      ) : chatMessages.length === 0 ? (
                        <div className="flex items-center justify-center h-full">
                          <div className="text-center">
                            <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                            <p className="text-sm text-gray-600">No messages yet</p>
                            <p className="text-xs text-gray-500 mt-1">Be the first to start the conversation!</p>
                          </div>
                        </div>
                      ) : (
                        <>
                          {chatMessages.map((msg) => (
                            <div key={msg.id} className="flex gap-3 animate-in fade-in duration-300">
                              <Avatar className="h-8 w-8 flex-shrink-0">
                                <AvatarFallback className={`${msg.user_id === user?.id
                                  ? "bg-teal-100 text-teal-700"
                                  : "bg-purple-100 text-purple-700"
                                  }`}>
                                  {msg.avatar}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <button
                                    onClick={() => msg.user_id !== 'system' && navigate(`/user/${msg.user_id}`)}
                                    className={`text-sm ${msg.user_id !== 'system' ? 'hover:underline' : ''} ${msg.user_id === user?.id ? "text-teal-700 font-medium" : "text-gray-900"
                                      }`}
                                  >
                                    {msg.author}
                                  </button>
                                  <span className="text-xs text-gray-500">
                                    {formatTimestamp(new Date(msg.created_at))}
                                  </span>
                                </div>
                                <p className={`text-sm text-gray-700 rounded-lg p-3 ${msg.user_id === user?.id ? "bg-teal-100" : "bg-white"
                                  }`}>
                                  {msg.content}
                                </p>
                              </div>
                            </div>
                          ))}
                          <div ref={chatEndRef} />
                        </>
                      )}
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
              </motion.div>
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
    <Card className={`hover:shadow-lg transition-shadow cursor-pointer group ${isPrioritized ? "border-2 border-teal-300 bg-teal-50/30" : ""
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
