export interface Post {
  slug: string;
  title: string;
  date: string; // ISO
  summary: string;
  body: string[]; // paragraphs
}

/** Essays. Empty on purpose — the nav link and routes appear
 *  automatically once the first post lands here. Candidate titles
 *  Shaurya has already said out loud:
 *  - "Never let synthesis outrun retrieval"
 *  - "Design the degraded path before the happy one"
 *  - "What a portfolio terminal taught me about agent UX" */
export const posts: Post[] = [];

export function getPost(slug: string): Post | undefined {
  return posts.find((p) => p.slug === slug);
}
