import SnippetClient from "./SnippetClient"

export default async function SnippetPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000" }/api/snippet/${slug}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    return <div>Snippet not found</div>;
  }

  const { snippet } = await res.json();

  return <SnippetClient snippet={snippet} />;
}
