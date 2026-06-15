export default function ProductDetailPage({
  params,
}: {
  params: { locale: string; slug: string };
}) {
  return <div style={{ padding: '40px' }}>Product: {params.slug}</div>;
}
