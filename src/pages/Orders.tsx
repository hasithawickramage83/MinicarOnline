import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Package, Clock, CheckCircle, XCircle } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { useAuth } from '@/context/AuthContext';
import { Link, Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

// Mock orders for demo
const mockOrders = [
  {
    id: 1001,
    date: '2024-01-15',
    status: 'delivered',
    total: 359.98,
    items: [
      { name: 'Ferrari 488 GTB 1:18 Scale', quantity: 1, price: 161.49 },
      { name: 'Porsche 911 GT3 RS 1:18 Scale', quantity: 1, price: 169.99 },
    ],
  },
  {
    id: 1002,
    date: '2024-01-20',
    status: 'processing',
    total: 159.99,
    items: [
      { name: 'Lamborghini Aventador SVJ 1:18 Scale', quantity: 1, price: 159.99 },
    ],
  },
];

const statusIcons = {
  processing: <Clock className="w-5 h-5 text-yellow-500" />,
  shipped: <Package className="w-5 h-5 text-blue-500" />,
  delivered: <CheckCircle className="w-5 h-5 text-green-500" />,
  cancelled: <XCircle className="w-5 h-5 text-destructive" />,
};

const statusLabels = {
  processing: 'Processing',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

const Orders: React.FC = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/auth?redirect=/orders" replace />;
  }

  return (
    <>
      <Helmet>
        <title>My Orders | MiniWheels</title>
      </Helmet>
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <h1 className="section-title text-4xl md:text-5xl mb-8">MY ORDERS</h1>

          {mockOrders.length > 0 ? (
            <div className="space-y-6">
              {mockOrders.map((order) => (
                <div key={order.id} className="card-gradient rounded-xl overflow-hidden">
                  {/* Header */}
                  <div className="p-4 bg-secondary/50 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Order #</p>
                        <p className="font-semibold">{order.id}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Date</p>
                        <p className="font-semibold">{new Date(order.date).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Total</p>
                        <p className="font-semibold text-primary">${Number(order.total).toFixed(2)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1 bg-background rounded-full">
                      {statusIcons[order.status as keyof typeof statusIcons]}
                      <span className="font-medium capitalize">
                        {statusLabels[order.status as keyof typeof statusLabels]}
                      </span>
                    </div>
                  </div>

                  {/* Items */}
                  <div className="p-4 space-y-3">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                        </div>
                        <p className="font-semibold">${Number(item.price).toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <Package className="w-24 h-24 mx-auto mb-6 text-muted-foreground" />
              <h2 className="section-title text-3xl mb-4">NO ORDERS YET</h2>
              <p className="text-muted-foreground mb-8">Start shopping to see your orders here.</p>
              <Link to="/products">
                <Button variant="hero" size="xl">Browse Products</Button>
              </Link>
            </div>
          )}
        </div>
      </Layout>
    </>
  );
};

export default Orders;
