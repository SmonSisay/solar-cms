export default function BlogPostPage({
  params,
}: {
  params: { locale: string; slug: string };
}) {
  return <div style={{ padding: '40px' }}>Blog post: {params.slug}</div>;
}
