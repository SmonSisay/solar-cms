import { notFound } from 'next/navigation';
import { connectDB } from '@/lib/mongodb';
import Product from '@/lib/models/Product';
import ProductForm from '@/components/admin/ProductForm';

type PageProps = { params: { id: string } };

export default async function EditProductPage({ params }: PageProps) {
  await connectDB();

  const product = await Product.findById(params.id).lean();
  if (!product) notFound();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-primary">Edit Product</h2>
        <p className="text-slate-500 text-sm mt-1">{product.name.en}</p>
      </div>
      <ProductForm initial={JSON.parse(JSON.stringify({ ...product, _id: String(product._id) }))} />
    </div>
  );
}
