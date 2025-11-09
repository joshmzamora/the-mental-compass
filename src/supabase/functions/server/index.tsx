import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "jsr:@supabase/supabase-js@2";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Middleware
app.use("*", cors());
app.use("*", logger(console.log));

// Initialize Supabase client
const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

// Helper function to verify user
async function verifyUser(request: Request) {
  const accessToken = request.headers.get("Authorization")?.split(" ")[1];
  if (!accessToken) {
    return null;
  }

  const { data: { user }, error } = await supabase.auth.getUser(accessToken);
  if (error || !user) {
    return null;
  }

  return user;
}

// ==================== AUTH ROUTES ====================

// Sign up
app.post("/auth/signup", async (c) => {
  try {
    const { email, password, name } = await c.req.json();

    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name },
      email_confirm: true, // Auto-confirm since no email server configured
    });

    if (error) {
      return c.json({ error: error.message }, 400);
    }

    // Store user profile
    await kv.set(`user:${data.user.id}:profile`, {
      name,
      email,
      createdAt: new Date().toISOString(),
    });

    // Sign in the user to get session
    const { data: sessionData, error: sessionError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (sessionError) {
      return c.json({ error: sessionError.message }, 400);
    }

    return c.json({
      user: data.user,
      session: sessionData.session,
    });
  } catch (error: any) {
    console.error("Signup error:", error);
    return c.json({ error: error.message || "Failed to sign up" }, 500);
  }
});

// ==================== USER PROFILE ROUTES ====================

// Get user profile with all data (for dashboard)
// IMPORTANT: This must come before /user/:userId to avoid route collision
app.get("/user/profile", async (c) => {
  try {
    const user = await verifyUser(c.req.raw);
    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    // Get compass bearing
    const compassBearing = await kv.get(`user:${user.id}:compass-bearing`);

    // Get appointments
    const allBookings = await kv.getByPrefix("booking:");
    const userAppointments = allBookings
      .filter((booking: any) => booking.userId === user.id)
      .map((booking: any) => ({
        id: booking.id,
        therapistName: booking.therapistName,
        therapistSpecialty: booking.therapistSpecialty,
        date: booking.date,
        time: booking.time,
        status: "Confirmed",
      }))
      .sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // Get comments (mock for now)
    const comments = await kv.get(`user:${user.id}:comments`) || [];

    return c.json({
      compassBearing,
      appointments: userAppointments,
      comments,
    });
  } catch (error: any) {
    console.error("Get profile error:", error);
    return c.json({ error: error.message }, 500);
  }
});

// Get user profile by ID
app.get("/user/:userId", async (c) => {
  try {
    const user = await verifyUser(c.req.raw);
    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const userId = c.req.param("userId");
    const profile = await kv.get(`user:${userId}:profile`);

    if (!profile) {
      return c.json({ error: "Profile not found" }, 404);
    }

    return c.json(profile);
  } catch (error: any) {
    console.error("Get user error:", error);
    return c.json({ error: error.message }, 500);
  }
});

// ==================== COMPASS BEARING ROUTES ====================

// Save compass bearing (onboarding questionnaire)
app.post("/user/compass-bearing", async (c) => {
  try {
    const user = await verifyUser(c.req.raw);
    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const { userId, answers, analysis } = await c.req.json();

    if (user.id !== userId) {
      return c.json({ error: "Forbidden" }, 403);
    }

    await kv.set(`user:${userId}:compass-bearing`, {
      answers,
      analysis,
      primaryStruggle: answers.primaryStruggle,
      completedAt: new Date().toISOString(),
    });

    return c.json({ success: true });
  } catch (error: any) {
    console.error("Save compass bearing error:", error);
    return c.json({ error: error.message }, 500);
  }
});

// ==================== BOOKING ROUTES ====================

// Get all bookings
app.get("/bookings", async (c) => {
  try {
    const bookings = await kv.getByPrefix("booking:");
    return c.json({ bookings });
  } catch (error: any) {
    console.error("Get bookings error:", error);
    return c.json({ error: error.message }, 500);
  }
});

// Create a new booking
app.post("/bookings", async (c) => {
  try {
    const user = await verifyUser(c.req.raw);
    if (!user) {
      return c.json({ error: "Unauthorized - Please log in to book appointments" }, 401);
    }

    const { therapistId, therapistName, therapistSpecialty, date, time, userId } = await c.req.json();

    if (user.id !== userId) {
      return c.json({ error: "Forbidden" }, 403);
    }

    // Check if slot is already booked
    const existingBookings = await kv.getByPrefix("booking:");
    const isBooked = existingBookings.some(
      (booking: any) =>
        booking.therapistId === therapistId &&
        booking.date === date &&
        booking.time === time
    );

    if (isBooked) {
      return c.json({ error: "This time slot is already booked" }, 409);
    }

    // Create booking
    const bookingId = `${Date.now()}-${user.id}`;
    const booking = {
      id: bookingId,
      therapistId,
      therapistName,
      therapistSpecialty,
      date,
      time,
      userId: user.id,
      createdAt: new Date().toISOString(),
    };

    await kv.set(`booking:${bookingId}`, booking);

    return c.json({ success: true, booking });
  } catch (error: any) {
    console.error("Create booking error:", error);
    return c.json({ error: error.message }, 500);
  }
});

// ==================== COMMUNITY POSTS ROUTES ====================

// Get all community posts
app.get("/community-posts", async (c) => {
  try {
    const posts = await kv.getByPrefix("community-post:");
    
    // Sort by timestamp (newest first)
    posts.sort((a: any, b: any) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
    
    return c.json({ posts });
  } catch (error: any) {
    console.error("Get posts error:", error);
    return c.json({ error: error.message }, 500);
  }
});

// Get posts by user
app.get("/community-posts/user/:userId", async (c) => {
  try {
    const userId = c.req.param("userId");
    const allPosts = await kv.getByPrefix("community-post:");
    
    const userPosts = allPosts.filter((post: any) => post.userId === userId);
    userPosts.sort((a: any, b: any) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
    
    return c.json({ posts: userPosts });
  } catch (error: any) {
    console.error("Get user posts error:", error);
    return c.json({ error: error.message }, 500);
  }
});

// Create a new community post
app.post("/community-posts", async (c) => {
  try {
    const user = await verifyUser(c.req.raw);
    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const postData = await c.req.json();
    const postId = `${Date.now()}-${user.id}`;
    
    const post = {
      ...postData,
      id: postId,
      timestamp: new Date().toISOString(),
    };

    await kv.set(`community-post:${postId}`, post);

    return c.json({ success: true, post });
  } catch (error: any) {
    console.error("Create post error:", error);
    return c.json({ error: error.message }, 500);
  }
});

// Add a response to a post
app.post("/community-posts/:postId/responses", async (c) => {
  try {
    const user = await verifyUser(c.req.raw);
    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const postId = c.req.param("postId");
    const responseData = await c.req.json();
    
    // Get the post
    const post = await kv.get(`community-post:${postId}`);
    if (!post) {
      return c.json({ error: "Post not found" }, 404);
    }

    // Add response to post
    const updatedPost = {
      ...post,
      responses: [...(post.responses || []), responseData],
      replies: (post.replies || 0) + 1,
    };

    await kv.set(`community-post:${postId}`, updatedPost);

    return c.json({ success: true, post: updatedPost });
  } catch (error: any) {
    console.error("Add response error:", error);
    return c.json({ error: error.message }, 500);
  }
});

// Like a post
app.post("/community-posts/:postId/like", async (c) => {
  try {
    const user = await verifyUser(c.req.raw);
    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const postId = c.req.param("postId");
    const { userId } = await c.req.json();
    
    // Get the post
    const post = await kv.get(`community-post:${postId}`);
    if (!post) {
      return c.json({ error: "Post not found" }, 404);
    }

    // Check if already liked
    const likedBy = post.likedBy || [];
    if (likedBy.includes(userId)) {
      return c.json({ error: "Already liked" }, 400);
    }

    // Add like
    const updatedPost = {
      ...post,
      likes: (post.likes || 0) + 1,
      likedBy: [...likedBy, userId],
    };

    await kv.set(`community-post:${postId}`, updatedPost);

    return c.json({ success: true, post: updatedPost });
  } catch (error: any) {
    console.error("Like post error:", error);
    return c.json({ error: error.message }, 500);
  }
});

// Health check
app.get("/health", (c) => {
  return c.json({ status: "healthy" });
});

Deno.serve(app.fetch);
