"use server"

import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { put } from "@vercel/blob"

export async function createPost(formData: FormData) {
  const session = await getServerSession(authOptions)
  if (!session) throw new Error("Unauthorized")

  const title = formData.get("title") as string
  const content = formData.get("content") as string
  const mediaType = formData.get("mediaType") as string
  const instagramUrl = formData.get("instagramUrl") as string
  
  // Handle File Upload
  const audioFile = formData.get("audioFile") as File | null
  let audioUrl = formData.get("audioUrl") as string | null

  if (audioFile && audioFile.size > 0) {
    const blob = await put(audioFile.name, audioFile, { access: "public" })
    audioUrl = blob.url
  }
  
  await db.post.create({
    data: {
      title,
      content,
      mediaType: mediaType || "text",
      audioUrl: audioUrl || null,
      instagramUrl: instagramUrl || null,
      authorId: session.user?.email || "admin",
      published: true
    }
  })

  revalidatePath("/")
  revalidatePath("/admin")
  redirect("/admin")
}

export async function deletePost(id: string) {
  const session = await getServerSession(authOptions)
  if (!session) throw new Error("Unauthorized")
  
  await db.post.delete({ where: { id } })
  revalidatePath("/")
  revalidatePath("/admin")
}
