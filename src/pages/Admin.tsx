    import React, { useState, useEffect } from 'react';
    import { Helmet } from 'react-helmet-async';
    import { Navigate, useNavigate } from 'react-router-dom';
    import { Package, Plus, Edit, Trash2, ShoppingBag, Loader2, Upload, X } from 'lucide-react';
    import Layout from '@/components/layout/Layout';
    import { Switch } from "@/components/ui/switch"; // adjust path if needed
    import { Button } from '@/components/ui/button';
    import { useAuth } from '@/context/AuthContext';
    import { api, Product, ProductImage } from '@/lib/api';
    
    // Type for product form data (partial Product for editing/creation)
    type ProductFormData = Partial<Product> & {
      id?: number;
    };
    import { getProductImage } from '@/lib/productImages';
    import { toast } from 'sonner';
    import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
    
    // Mock orders for admin
    const mockAdminOrders = [
      { id: 1001, customer: 'John Doe', email: 'john@example.com', date: '2024-01-15', total: 359.98, status: 'delivered' },
      { id: 1002, customer: 'Jane Smith', email: 'jane@example.com', date: '2024-01-20', total: 159.99, status: 'processing' },
      { id: 1003, customer: 'Mike Johnson', email: 'mike@example.com', date: '2024-01-22', total: 449.97, status: 'shipped' },
    ];
    
    const Admin: React.FC = () => {
      const { isAuthenticated } = useAuth();
      const navigate = useNavigate();
      const [activeTab, setActiveTab] = useState<'products' | 'orders'>('products');
      const [products, setProducts] = useState<Product[]>([]);
      const [editingProduct, setEditingProduct] = useState<ProductFormData | null>(null);
      const [isLoading, setIsLoading] = useState(true);
    
      // Fetch products from API
      useEffect(() => {
        const fetchProducts = async () => {
          try {
            const productsData = await api.getProducts();
            setProducts(productsData);
          } catch (error) {
            console.error('Failed to fetch products:', error);
            toast.error('Failed to load products');
          } finally {
            setIsLoading(false);
          }
        };
    
        fetchProducts();
      }, []);
    
      // For demo purposes, we'll allow access. In production, check isAdmin
      if (!isAuthenticated) {
        return <Navigate to="/auth?redirect=/admin" replace />;
      }
    
      const handleDeleteProduct = async (id: number) => {
        try {
          await api.deleteProduct(id);
          setProducts(products.filter(p => p.id !== id));
          toast.success('Product deleted successfully');
        } catch (error) {
          console.error('Failed to delete product:', error);
          toast.error('Failed to delete product');
        }
      };
    
      const handleCloseDialog = () => {
        setEditingProduct(null);
      };
    
      const handleSaveProduct = async (product: ProductFormData, images?: File[]) => {
        try {
          if (product.id) {
            // Update existing product
            const updatedProduct = await api.updateProduct(product.id, product, images);
            setProducts(products.map(p => p.id === product.id ? updatedProduct : p));
            toast.success('Product updated successfully');
          } else {
            // Create new product
            const newProduct = await api.createProduct(product, images);
            setProducts([...products, newProduct]);
            toast.success('Product created successfully');
          }
          handleCloseDialog();
        } catch (error) {
          console.error('Failed to save product:', error);
          toast.error('Failed to save product');
        }
      };
    
      return (
        <>
          <Helmet>
            <title>Admin Dashboard | MiniWheels</title>
            <meta name="robots" content="noindex, nofollow" />
          </Helmet>
          <Layout>
            <div className="container mx-auto px-4 py-8">
              <div className="flex items-center justify-between mb-8">
                <h1 className="section-title text-4xl">ADMIN DASHBOARD</h1>
              </div>
    
              {/* Tabs */}
              <div className="flex gap-4 mb-8 border-b border-border">
                <button
                  onClick={() => setActiveTab('products')}
                  className={`flex items-center gap-2 px-4 py-3 font-medium transition-colors ${activeTab === 'products'
                      ? 'text-primary border-b-2 border-primary'
                      : 'text-muted-foreground hover:text-foreground'
                    }`}
                >
                  <Package className="w-5 h-5" />
                  Products
                </button>
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`flex items-center gap-2 px-4 py-3 font-medium transition-colors ${activeTab === 'orders'
                      ? 'text-primary border-b-2 border-primary'
                      : 'text-muted-foreground hover:text-foreground'
                    }`}
                >
                  <ShoppingBag className="w-5 h-5" />
                  Orders
                </button>
              </div>
    
              {/* Products Tab */}
              {activeTab === 'products' && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <p className="text-muted-foreground">
                      {isLoading ? 'Loading...' : `${products.length} products`}
                    </p>
                    <div className="flex gap-3">
                      <Button 
                        variant="outline" 
                        onClick={() => navigate('/admin/create-product')}
                        className="flex items-center gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        Create New Product
                      </Button>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="hero" onClick={() => setEditingProduct({})}>
                            <Plus className="w-4 h-4" />
                            Quick Add
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle className="font-heading text-2xl">
                              {editingProduct?.id ? 'Edit Product' : 'Add New Product'}
                            </DialogTitle>
                          </DialogHeader>
                          <ProductForm
                            product={editingProduct}
                            onSave={handleSaveProduct}
                            onClose={handleCloseDialog}
                          />
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
    
                  {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                      <Loader2 className="w-8 h-8 animate-spin text-primary" />
                      <span className="ml-2 text-muted-foreground">Loading products...</span>
                    </div>
                  ) : products.length === 0 ? (
                    <div className="text-center py-12">
                      <Package className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No products found</h3>
                      <p className="text-muted-foreground mb-6">
                        Get started by creating your first product
                      </p>
                      <Button 
                        onClick={() => navigate('/admin/create-product')}
                        variant="hero"
                        className="flex items-center gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        Create Your First Product
                      </Button>
                    </div>
                  ) : (
    
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left py-4 px-4">Product</th>
                          <th className="text-left py-4 px-4">Model</th>
                          <th className="text-left py-4 px-4">Price</th>
                          <th className="text-left py-4 px-4">Discount</th>
                          <th className="text-left py-4 px-4">Stock</th>
                          <th className="text-right py-4 px-4">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {products.map((product) => (
                          <tr key={product.id} className="border-b border-border/50 hover:bg-secondary/30">
                            <td className="py-4 px-4">
                              <div className="flex items-center gap-3">
                               <img
  src={product.images?.[0]?.image || "/placeholder.png"}
  alt={product.name}
  className="w-12 h-12 rounded-lg object-cover"
/>

                                <span className="font-medium">{product.name}</span>
                              </div>
                            </td>
                            <td className="py-4 px-4 text-muted-foreground">{product.product_model}</td>
                            <td className="py-4 px-4">${Number(product.price).toFixed(2)}</td>
                            <td className="py-4 px-4">
                              {product.discount_percentage > 0 ? (
                                <span className="px-2 py-1 bg-accent text-accent-foreground text-sm rounded">
                                  {product.discount_percentage}%
                                </span>
                              ) : (
                                '-'
                              )}
                            </td>
                            <td className="py-4 px-4">{product.quantity}</td>
                            <td className="py-4 px-4">
                              <div className="flex justify-end gap-2">
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => setEditingProduct(product)}
                                    >
                                      <Edit className="w-4 h-4" />
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                                    <DialogHeader>
                                      <DialogTitle className="font-heading text-2xl">Edit Product</DialogTitle>
                                    </DialogHeader>
                                    <ProductForm
                                      product={product}
                                      onSave={handleSaveProduct}
                                      onClose={handleCloseDialog}
                                    />
                                  </DialogContent>
                                </Dialog>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="text-destructive"
                                  onClick={() => handleDeleteProduct(product.id)}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  )}
                </div>
              )}
    
              {/* Orders Tab */}
              {activeTab === 'orders' && (
                <div>
                  <p className="text-muted-foreground mb-6">{mockAdminOrders.length} orders</p>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left py-4 px-4">Order #</th>
                          <th className="text-left py-4 px-4">Customer</th>
                          <th className="text-left py-4 px-4">Date</th>
                          <th className="text-left py-4 px-4">Total</th>
                          <th className="text-left py-4 px-4">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {mockAdminOrders.map((order) => (
                          <tr key={order.id} className="border-b border-border/50 hover:bg-secondary/30">
                            <td className="py-4 px-4 font-medium">#{order.id}</td>
                            <td className="py-4 px-4">
                              <div>
                                <p className="font-medium">{order.customer}</p>
                                <p className="text-sm text-muted-foreground">{order.email}</p>
                              </div>
                            </td>
                            <td className="py-4 px-4 text-muted-foreground">
                              {new Date(order.date).toLocaleDateString()}
                            </td>
                            <td className="py-4 px-4 font-semibold text-primary">${order.total.toFixed(2)}</td>
                            <td className="py-4 px-4">
                              <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${order.status === 'delivered' ? 'bg-green-500/20 text-green-500' :
                                  order.status === 'shipped' ? 'bg-blue-500/20 text-blue-500' :
                                    'bg-yellow-500/20 text-yellow-500'
                                }`}>
                                {order.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </Layout>
        </>
      );
    };
    
    // Product Form Component
    const ProductForm: React.FC<{ product: ProductFormData; onSave: (product: ProductFormData, images?: File[]) => void; onClose: () => void }> = ({ product, onSave, onClose }) => {
      const [formData, setFormData] = useState({
        name: product?.name || '',
        description: product?.description || '',
        price: product?.price?.toString() || '',
        quantity: product?.quantity?.toString() || '',
        discount_percentage: product?.discount_percentage?.toString() || '0',
        promotion_text: product?.promotion_text || '',
        product_model: product?.product_model || 'Ferrari',
        product_dimension: product?.product_dimension || '24 cm',
        is_active: product?.is_active ?? true
      });
      const [images, setImages] = useState<File[]>([]);
      const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    
      const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        const newImages = [...images, ...files];
        const newPreviews = [...imagePreviews];
    
        files.forEach(file => {
          if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
              newPreviews.push(e.target?.result as string);
              setImagePreviews([...newPreviews]);
            };
            reader.readAsDataURL(file);
          }
        });
    
        setImages(newImages);
      };
    
      const removeImage = (index: number) => {
        const newImages = images.filter((_, i) => i !== index);
        const newPreviews = imagePreviews.filter((_, i) => i !== index);
        setImages(newImages);
        setImagePreviews(newPreviews);
      };
    
      const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const submitData: ProductFormData = {
          ...formData,
          price: parseFloat(formData.price as string),
          quantity: parseInt(formData.quantity as string),
          discount_percentage: parseInt(formData.discount_percentage as string),
        };
        
        // Include the product ID if this is an edit operation
        if (product?.id) {
          submitData.id = product.id;
        }
        
        onSave(submitData, images.length > 0 ? images : undefined);
      };
    
      return (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Product Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="input-styled"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="input-styled min-h-[100px]"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Price ($)</label>
              <input
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="input-styled"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Quantity</label>
              <input
                type="number"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                className="input-styled"
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Discount %</label>
              <input
                type="number"
                min="0"
                max="100"
                value={formData.discount_percentage}
                onChange={(e) => setFormData({ ...formData, discount_percentage: e.target.value })}
                className="input-styled"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Model</label>
              <select
                value={formData.product_model}
                onChange={(e) => setFormData({ ...formData, product_model: e.target.value })}
                className="input-styled"
              >
                {['Ferrari', 'Porsche', 'Lamborghini', 'BMW', 'Mercedes', 'Audi', 'McLaren', 'Toyota', 'Nissan', 'Ford', 'Chevrolet', 'Bugatti'].map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Promotion Text</label>
              <input
                type="text"
                value={formData.promotion_text}
                onChange={(e) => setFormData({ ...formData, promotion_text: e.target.value })}
                className="input-styled"
                placeholder="e.g., Limited Edition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Dimension</label>
              <input
                type="text"
                value={formData.product_dimension}
                onChange={(e) => setFormData({ ...formData, product_dimension: e.target.value })}
                className="input-styled"
              />
            </div>
           <div className="flex items-center gap-2">
  <label className="block text-sm font-medium">Active</label>
  <Switch
    checked={formData.is_active} // bind to formData
    onCheckedChange={(checked) =>
      setFormData({ ...formData, is_active: checked as boolean })
    }
  />
</div>


          </div>
          
          {/* Image Upload Section */}
          <div>
            <label className="block text-sm font-medium mb-2">Product Images</label>
            <div className="border-2 border-dashed border-border rounded-lg p-4 text-center">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="product-image-upload"
              />
              <label
                htmlFor="product-image-upload"
                className="cursor-pointer inline-flex items-center gap-2 px-3 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm"
              >
                <Upload className="w-4 h-4" />
                Add Images
              </label>
              <p className="text-xs text-muted-foreground mt-2">
                Upload new images to replace existing ones
              </p>
            </div>
            
            {/* Image Previews */}
            {imagePreviews.length > 0 && (
              <div className="grid grid-cols-3 gap-2 mt-4">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-20 object-cover rounded-lg border border-border"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 p-1 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            
            {/* Existing Images Display */}
            {product?.images && product.images.length > 0 && imagePreviews.length === 0 && (
              <div className="grid grid-cols-3 gap-2 mt-4">
                {product.images.map((image: ProductImage, index: number) => (
                  <div key={image.id} className="relative">
                    <img
                      src={image.image}
                      alt={`Existing image ${index + 1}`}
                      className="w-full h-20 object-cover rounded-lg border border-border"
                    />
                    <div className="absolute bottom-1 left-1 bg-black/50 text-white text-xs px-1 py-0.5 rounded">
                      Current
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="flex gap-3">
            <Button variant="outline" type="button" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button variant="hero" type="submit" className="flex-1">
              {product?.id ? 'Update Product' : 'Create Product'}
            </Button>
          </div>
        </form>
      );
    };
    
    export default Admin;
