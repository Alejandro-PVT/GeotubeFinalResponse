import { createClient } from "@/lib/supabase/client"
import { v4 as uuidv4 } from "uuid"

// Get or create session ID for anonymous tracking
export function getSessionId(): string {
  if (typeof window === "undefined") return ""

  let sessionId = localStorage.getItem("geotube_session_id")
  if (!sessionId) {
    sessionId = uuidv4()
    localStorage.setItem("geotube_session_id", sessionId)
  }
  return sessionId
}

// Get device information
function getDeviceInfo() {
  if (typeof window === "undefined") return {}

  const ua = navigator.userAgent
  let deviceType = "desktop"
  let browser = "unknown"
  let os = "unknown"

  // Detect device type
  if (/mobile/i.test(ua)) deviceType = "mobile"
  else if (/tablet/i.test(ua)) deviceType = "tablet"

  // Detect browser
  if (ua.includes("Firefox")) browser = "Firefox"
  else if (ua.includes("Chrome")) browser = "Chrome"
  else if (ua.includes("Safari")) browser = "Safari"
  else if (ua.includes("Edge")) browser = "Edge"

  // Detect OS
  if (ua.includes("Windows")) os = "Windows"
  else if (ua.includes("Mac")) os = "macOS"
  else if (ua.includes("Linux")) os = "Linux"
  else if (ua.includes("Android")) os = "Android"
  else if (ua.includes("iOS")) os = "iOS"

  return { deviceType, browser, os, userAgent: ua }
}

// Initialize or update user
export async function initializeUser(): Promise<string | null> {
  const supabase = createClient()
  const sessionId = getSessionId()
  const deviceInfo = getDeviceInfo()

  try {
    // Check if user exists
    const { data: existingUser } = await supabase.from("users").select("id").eq("session_id", sessionId).single()

    if (existingUser) {
      // Update last_seen
      await supabase.from("users").update({ last_seen: new Date().toISOString() }).eq("id", existingUser.id)

      return existingUser.id
    }

    // Create new user
    const { data: newUser, error } = await supabase
      .from("users")
      .insert({
        session_id: sessionId,
        ...deviceInfo,
      })
      .select("id")
      .single()

    if (error) throw error
    return newUser?.id || null
  } catch (error) {
    console.error("[v0] Error initializing user:", error)
    return null
  }
}

// Track video session start
export async function trackVideoStart(
  userId: string,
  videoId: string,
  videoTitle: string,
  channelName: string,
  latitude?: number,
  longitude?: number,
): Promise<string | null> {
  const supabase = createClient()

  try {
    const { data, error } = await supabase
      .from("video_sessions")
      .insert({
        user_id: userId,
        video_id: videoId,
        video_title: videoTitle,
        channel_name: channelName,
        latitude,
        longitude,
        started_at: new Date().toISOString(),
      })
      .select("id")
      .single()

    if (error) throw error
    return data?.id || null
  } catch (error) {
    console.error("[v0] Error tracking video start:", error)
    return null
  }
}

// Track video session end
export async function trackVideoEnd(sessionId: string, watchDurationSeconds: number, completed: boolean) {
  const supabase = createClient()

  try {
    await supabase
      .from("video_sessions")
      .update({
        ended_at: new Date().toISOString(),
        watch_duration_seconds: watchDurationSeconds,
        completed,
      })
      .eq("id", sessionId)
  } catch (error) {
    console.error("[v0] Error tracking video end:", error)
  }
}

// Track video load metrics
export async function trackVideoLoad(
  userId: string,
  videoId: string,
  loadDurationMs: number,
  success: boolean,
  errorMessage?: string,
) {
  const supabase = createClient()

  // Get connection type
  const connection =
    (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection
  const connectionType = connection?.effectiveType || "unknown"

  try {
    await supabase.from("video_load_metrics").insert({
      user_id: userId,
      video_id: videoId,
      load_duration_ms: loadDurationMs,
      success,
      error_message: errorMessage,
      connection_type: connectionType,
      load_end_time: new Date().toISOString(),
    })
  } catch (error) {
    console.error("[v0] Error tracking video load:", error)
  }
}

// Track connection issues
export async function trackConnectionIssue(
  userId: string,
  videoId: string | null,
  issueType: string,
  errorMessage: string,
): Promise<string | null> {
  const supabase = createClient()

  try {
    const { data, error } = await supabase
      .from("connection_issues")
      .insert({
        user_id: userId,
        video_id: videoId,
        issue_type: issueType,
        error_message: errorMessage,
        occurred_at: new Date().toISOString(),
      })
      .select("id")
      .single()

    if (error) throw error
    return data?.id || null
  } catch (error) {
    console.error("[v0] Error tracking connection issue:", error)
    return null
  }
}

// Resolve connection issue
export async function resolveConnectionIssue(issueId: string) {
  const supabase = createClient()

  try {
    await supabase
      .from("connection_issues")
      .update({
        resolved: true,
        resolution_time: new Date().toISOString(),
      })
      .eq("id", issueId)
  } catch (error) {
    console.error("[v0] Error resolving connection issue:", error)
  }
}
