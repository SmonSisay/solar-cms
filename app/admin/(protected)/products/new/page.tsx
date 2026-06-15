import ProductForm from '@/components/admin/ProductForm';

export default function NewProductPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-primary">Add Product</h2>
        <p className="text-slate-500 text-sm mt-1">Create a new product listing.</p>
      </div>
      <ProductForm />
    </div>
  );
}
