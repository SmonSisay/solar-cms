import Link from 'next/link';
import Image from 'next/image';
import { connectDB } from '@/lib/mongodb';
import Product from '@/lib/models/Product';
import { formatETB } from '@/lib/utils';
import DeleteProductButton from '@/components/admin/DeleteProductButton';
import { requirePermission } from '@/lib/api';
import { redirect } from 'next/navigation';

export default async function AdminProductsPage() {
  const allowed = await requirePermission('manage_products');
  if (!allowed) {
    redirect('/admin');
  }

  await connectDB();
  const products = await Product.find().sort({ createdAt: -1 }).lean();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-primary">Products</h2>
          <p className="text-slate-500 text-sm mt-1">{products.length} products</p>
        </div>
        <Link
          href="/admin/products/new"
          className="bg-solar text-primary px-4 py-2 rounded-components text-sm font-semibold hover:bg-solar-lt transition-colors"
        >
          + Add Product
        </Link>
      </div>

      <div className="bg-white rounded-cards border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-primary">Image</th>
              <th className="text-left px-4 py-3 font-medium text-primary">Name (EN)</th>
              <th className="text-left px-4 py-3 font-medium text-primary">Category</th>
              <th className="text-left px-4 py-3 font-medium text-primary">Price</th>
              <th className="text-left px-4 py-3 font-medium text-primary">Stock</th>
              <th className="text-left px-4 py-3 font-medium text-primary">Featured</th>
              <th className="text-right px-4 py-3 font-medium text-primary">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-slate-500">
                  No products yet.{' '}
                  <Link href="/admin/products/new" className="text-solar font-medium">
                    Add your first product
                  </Link>
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={String(product._id)} className="border-b border-slate-100">
                  <td className="px-4 py-3">
                    {product.images?.[0] ? (
                      <Image
                        src={product.images[0]}
                        alt={product.name.en}
                        width={40}
                        height={40}
                        className="rounded object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-slate-100 rounded flex items-center justify-center text-slate-400 text-xs">
                        —
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 font-medium">{product.name.en}</td>
                  <td className="px-4 py-3 capitalize text-slate-600">{product.category}</td>
                  <td className="px-4 py-3 text-slate-600">
                    {product.priceOnRequest ? 'On request' : formatETB(product.price)}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs ${
                        product.inStock
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {product.inStock ? 'In stock' : 'Out'}
                    </span>
                  </td>
                  <td className="px-4 py-3">{product.featured ? '★' : '—'}</td>
                  <td className="px-4 py-3 text-right space-x-2">
                    <Link
                      href={`/admin/products/${product._id}/edit`}
                      className="text-primary-lt hover:underline text-sm"
                    >
                      Edit
                    </Link>
                    <DeleteProductButton id={String(product._id)} name={product.name.en} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
