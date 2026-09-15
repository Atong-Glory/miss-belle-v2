import { InstagramEmbed } from "react-social-media-embed"
import { Post } from "@prisma/client"

export default function PostFeed({ posts }: { posts: Post[] }) {
  if (!posts || posts.length === 0) return null;

  return (
    <section className="py-24 bg-background relative z-10">
      <div className="container mx-auto px-4 max-w-4xl space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-3xl md:text-5xl font-serif text-gold">Recent Expressions</h2>
          <p className="text-muted-foreground">Latest poems, spoken words, and moments from Instagram.</p>
        </div>
        
        <div className="space-y-16">
          {posts.map((post) => (
            <article key={post.id} className="p-6 rounded-2xl bg-stage border border-border shadow-lg">
              <h3 className="text-2xl font-bold mb-4">{post.title}</h3>
              
              {post.content && (
                <div className="prose prose-invert max-w-none mb-6 whitespace-pre-wrap">
                  {post.content}
                </div>
              )}
              
              {post.mediaType === "audio" && post.audioUrl && (
                <div className="mt-6">
                  <audio controls className="w-full h-12 rounded-full outline-none" src={post.audioUrl}>
                    Your browser does not support the audio element.
                  </audio>
                </div>
              )}

              {post.mediaType === "instagram" && post.instagramUrl && (
                <div className="mt-6 flex justify-center">
                  <InstagramEmbed url={post.instagramUrl} width={328} />
                </div>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
