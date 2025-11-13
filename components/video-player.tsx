"use client"

import { useEffect, useState, useRef } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLocale } from "@/lib/locale-context"
import {
  initializeUser,
  trackVideoStart,
  trackVideoEnd,
  trackVideoLoad,
  trackConnectionIssue,
  resolveConnectionIssue,
} from "@/lib/analytics"

interface VideoPlayerProps {
  videoId: string
  videoTitle?: string
  channelName?: string
  latitude?: number
  longitude?: number
  onClose: () => void
}

export function VideoPlayer({
  videoId,
  videoTitle = "Unknown Video",
  channelName = "Unknown Channel",
  latitude,
  longitude,
  onClose,
}: VideoPlayerProps) {
  const { t } = useLocale()
  const [userId, setUserId] = useState<string | null>(null)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [connectionIssueId, setConnectionIssueId] = useState<string | null>(null)
  const startTimeRef = useRef<number>(Date.now())
  const loadStartRef = useRef<number>(Date.now())
  const watchStartRef = useRef<number>(Date.now())

  useEffect(() => {
    async function initialize() {
      const uid = await initializeUser()
      setUserId(uid)

      if (uid) {
        const sid = await trackVideoStart(uid, videoId, videoTitle, channelName, latitude, longitude)
        setSessionId(sid)
        watchStartRef.current = Date.now()
      }
    }
    initialize()
  }, [videoId, videoTitle, channelName, latitude, longitude])

  useEffect(() => {
    const iframe = document.querySelector('iframe[src*="youtube.com"]')
    if (!iframe || !userId) return

    const handleLoad = () => {
      const loadDuration = Date.now() - loadStartRef.current
      trackVideoLoad(userId, videoId, loadDuration, true)
    }

    const handleError = () => {
      const loadDuration = Date.now() - loadStartRef.current
      trackVideoLoad(userId, videoId, loadDuration, false, "Failed to load video")
      trackConnectionIssue(userId, videoId, "load_error", "Video failed to load").then((issueId) => {
        if (issueId) setConnectionIssueId(issueId)
      })
    }

    iframe.addEventListener("load", handleLoad)
    iframe.addEventListener("error", handleError)

    return () => {
      iframe.removeEventListener("load", handleLoad)
      iframe.removeEventListener("error", handleError)
    }
  }, [userId, videoId])

  useEffect(() => {
    if (!userId) return

    const handleOnline = () => {
      if (connectionIssueId) {
        resolveConnectionIssue(connectionIssueId)
        setConnectionIssueId(null)
      }
    }

    const handleOffline = () => {
      trackConnectionIssue(userId, videoId, "connection_lost", "Internet connection lost").then((issueId) => {
        if (issueId) setConnectionIssueId(issueId)
      })
    }

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [userId, videoId, connectionIssueId])

  useEffect(() => {
    return () => {
      if (sessionId) {
        const watchDuration = Math.floor((Date.now() - watchStartRef.current) / 1000)
        trackVideoEnd(sessionId, watchDuration, false)
      }
    }
  }, [sessionId])

  useEffect(() => {
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", handleEscape)
    return () => window.removeEventListener("keydown", handleEscape)
  }, [onClose])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4" onClick={onClose}>
      <div
        className="relative w-full max-w-5xl aspect-video bg-black rounded-lg overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 z-10 bg-black/50 hover:bg-black/70 text-white"
          onClick={onClose}
        >
          <X className="h-5 w-5" />
        </Button>
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full"
        />
      </div>
    </div>
  )
}
