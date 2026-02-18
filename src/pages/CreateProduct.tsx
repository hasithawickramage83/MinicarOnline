import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, Plus, X, Upload, Save } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { api, Product } from '@/lib/api';
import { toast } from 'sonner';

interface ProductFormData {
  name: string;
  description: string;
  price: number;
  quantity: number;
  discount_percentage: number;
  promotion_text: string;
  product_model: string;
  product_dimension: string;
  is_active: boolean;
}

const CreateProduct: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    price: 0,
    quantity: 0,
    discount_percentage: 0,
    promotion_text: '',
    product_model: '',
    product_dimension: '',
    is_active: true
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value
    }));
  };

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.description || !formData.product_model || !formData.product_dimension) {
      toast.error('Please fill in all required fields');
      return;
    } 
    if (images.length === 0) {
      toast.error('Please add at least one product image');
      return;
    }

    setIsLoading(true);

    try {
      // Create product data
      const productData = {
        name: formData.name,
        description: formData.description,
        price: formData.price,
        quantity: formData.quantity,
        discount_percentage: formData.discount_percentage,
        promotion_text: formData.promotion_text,
        product_model: formData.product_model,
        product_dimension: formData.product_dimension,
        is_active:formData.is_active
      };

      // Create product with images
      const createdProduct = await api.createProduct(productData, images);
      
      toast.success('Product created successfully!');
      navigate('/admin');
      
    } catch (error) {
      console.error('Failed to create product:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to create product');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Create Product | MiniWheels Admin</title>
      </Helmet>
      <Layout>
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/admin')}
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Admin
              </button>
              <h1 className="section-title text-3xl md:text-4xl">CREATE NEW PRODUCT</h1>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-8">
            {/* Basic Information */}
            <div className="card-gradient rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-6">Basic Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Product Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Enter product name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Product Model *</label>
                  <input
                    type="text"
                    name="product_model"
                    value={formData.product_model}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="e.g., Ferrari, Lamborghini"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Price ($) *</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    step="0.01"
                    min="0"
                    className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="0.00"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Quantity *</label>
                  <input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="0"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Discount Percentage (%)</label>
                  <input
                    type="number"
                    name="discount_percentage"
                    value={formData.discount_percentage}
                    onChange={handleInputChange}
                    step="0.1"
                    min="0"
                    max="100"
                    className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Product Dimensions *</label>
                  <input
                    type="text"
                    name="product_dimension"
                    value={formData.product_dimension}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="e.g., 1:18 Scale, 12 inches"
                    required
                  />
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium mb-2">Description *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Enter product description"
                  required
                />
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium mb-2">Promotion Text</label>
                <input
                  type="text"
                  name="promotion_text"
                  value={formData.promotion_text}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="e.g., Limited Edition, New Arrival"
                />
              </div>
            </div>

            {/* Product Images */}
            <div className="card-gradient rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-6">Product Images</h2>
              
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Upload Images *</label>
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    <Upload className="w-4 h-4" />
                    Choose Images
                  </label>
                  <p className="text-sm text-muted-foreground mt-2">
                    Upload multiple images (JPG, PNG, etc.)
                  </p>
                </div>
              </div>

              {/* Image Previews */}
              {imagePreviews.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 p-1 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                        {index === 0 ? 'Primary' : `Image ${index + 1}`}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/admin')}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="hero"
                disabled={isLoading}
                className="flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                {isLoading ? 'Creating...' : 'Create Product'}
              </Button>
            </div>
          </form>
        </div>
      </Layout>
    </>
  );
};

export default CreateProduct;
