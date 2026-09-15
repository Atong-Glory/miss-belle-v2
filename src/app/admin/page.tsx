import { db } from "@/lib/db"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default async function AdminDashboard() {
  const posts = await db.post.findMany({
    orderBy: { createdAt: "desc" }
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Posts & Content</h2>
        <Link href="/admin/new">
          <Button>Add New Content</Button>
        </Link>
      </div>
      
      <div className="rounded-md border">
        <div className="p-4">
          {posts.length === 0 ? (
            <p className="text-muted-foreground">No content added yet.</p>
          ) : (
            <ul className="divide-y">
              {posts.map((post) => (
                <li key={post.id} className="flex items-center justify-between py-4">
                  <div>
                    <p className="font-medium">{post.title}</p>
                    <p className="text-sm text-muted-foreground capitalize">{post.mediaType}</p>
                  </div>
                  <Link href={"/admin/edit/"}>
                    <Button variant="outline" size="sm">Edit</Button>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
