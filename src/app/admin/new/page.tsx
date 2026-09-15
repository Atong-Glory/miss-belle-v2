"use client"

import { useState } from "react"
import { createPost } from "../actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function NewPostPage() {
  const [mediaType, setMediaType] = useState("text")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    try {
      await createPost(formData)
    } catch (error) {
      console.error(error)
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <h2 className="text-2xl font-bold">Create New Post</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input id="title" name="title" required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="mediaType">Post Type</Label>
          <Select name="mediaType" value={mediaType} onValueChange={setMediaType}>
            <SelectTrigger>
              <SelectValue placeholder="Select post type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="text">Poem / Text</SelectItem>
              <SelectItem value="audio">Audio / Spoken Word</SelectItem>
              <SelectItem value="instagram">Instagram Post</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {mediaType === "audio" && (
          <div className="space-y-4 p-4 border rounded-md bg-muted/50">
            <div className="space-y-2">
              <Label htmlFor="audioFile">Upload Audio File (MP3, WAV)</Label>
              <Input id="audioFile" name="audioFile" type="file" accept="audio/*" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="audioUrl">OR Paste Audio URL (SoundCloud, Spotify, external MP3)</Label>
              <Input id="audioUrl" name="audioUrl" type="url" placeholder="https://..." />
            </div>
          </div>
        )}

        {mediaType === "instagram" && (
          <div className="space-y-2 p-4 border rounded-md bg-muted/50">
            <Label htmlFor="instagramUrl">Instagram Post URL</Label>
            <Input id="instagramUrl" name="instagramUrl" type="url" placeholder="https://www.instagram.com/p/....." />
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="content">Content / Poem Text (Optional)</Label>
          <Textarea id="content" name="content" rows={10} placeholder="Write your poem here..." />
        </div>

        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Publish Post"}
        </Button>
      </form>
    </div>
  )
}
