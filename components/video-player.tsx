"use client"

import { useEffect, useState } from "react"

interface VideoPlayerProps {
  url: string
  title?: string
}

export function VideoPlayer({ url, title }: VideoPlayerProps) {
  const [hostname, setHostname] = useState("")

  useEffect(() => {
    if (typeof window !== "undefined") {
      setHostname(window.location.hostname)
    }
  }, [])

  // Detect video source and return appropriate embed
  const getEmbedUrl = (videoUrl: string) => {
    // YouTube
    if (videoUrl.includes("youtube.com") || videoUrl.includes("youtu.be")) {
      const videoId = videoUrl.includes("youtu.be")
        ? videoUrl.split("youtu.be/")[1]?.split("?")[0]
        : videoUrl.split("v=")[1]?.split("&")[0]
      return `https://www.youtube.com/embed/${videoId}`
    }

    // Twitch
    if (videoUrl.includes("twitch.tv")) {
      const channelOrVideo = videoUrl.split("twitch.tv/")[1]?.split("/")[0]
      return `https://player.twitch.tv/?channel=${channelOrVideo}&parent=${hostname || "localhost"}`
    }

    // Direct video link
    return videoUrl
  }

  const embedUrl = getEmbedUrl(url)
  const isDirectVideo = !url.includes("youtube.com") && !url.includes("youtu.be") && !url.includes("twitch.tv")

  return (
    <div className="w-full bg-[#0B1020] rounded-lg overflow-hidden border border-[#2a3342]">
      {isDirectVideo ? (
        <video controls className="w-full h-full" title={title}>
          <source src={url} />
          Your browser does not support the video tag.
        </video>
      ) : (
        <iframe
          width="100%"
          height="500"
          src={embedUrl}
          title={title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full aspect-video"
        />
      )}
    </div>
  )
}
