import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Order } from '@/entities/Order';
import { useAppContext } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, CreditCard, Lock, Truck } from 'lucide-react';
import type { Product } from '@/entities/Product';

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  country: string;
}

interface FormErrors {
  fullName?: string;
  email?: string;
  phone?: string;
  address?: string;
  country?: string;
}

interface CartItem extends Product {
  quantity: number;
}

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { t, cart, cartTotal, clearCart, language } = useAppContext();
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    country: 'IL'
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const countries = [
    { code: 'IL', name_en: 'Israel', name_he: 'ישראל' },
    { code: 'US', name_en: 'United States', name_he: 'ארצות הברית' },
    { code: 'UK', name_en: 'United Kingdom', name_he: 'בריטניה' },
    { code: 'DE', name_en: 'Germany', name_he: 'גרמניה' },
    { code: 'FR', name_en: 'France', name_he: 'צרפת' }
  ];

  const validateForm = () => {
    const newErrors: FormErrors = {};
    
    if (!formData.fullName.trim()) newErrors.fullName = 'Required';
    if (!formData.email.trim()) newErrors.email = 'Required';
    if (!formData.email.includes('@')) newErrors.email = 'Invalid email';
    if (!formData.phone.trim()) newErrors.phone = 'Required';
    if (!formData.address.trim()) newErrors.address = 'Required';
    if (!formData.country) newErrors.country = 'Required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsProcessing(true);
    
    try {
      // Generate order ID
      const orderId = 'FS' + Date.now().toString().slice(-8);
      
      // Prepare order data
      const orderData = {
        order_id: orderId,
        customer_name: formData.fullName,
        customer_email: formData.email,
        phone: formData.phone,
        shipping_address: formData.address,
        country: formData.country,
        items: cart.map((item: CartItem) => ({
          id: item.id,
          name_en: item.name_en,
          name_he: item.name_he,
          image_url: item.image_url,
          sale_price: item.sale_price,
          quantity: item.quantity,
        })),
        total_amount: cartTotal,
        language: language,
        created_date: new Date().toISOString(),
      };

      // Save order
      await Order.create(orderData);
      
      // Clear cart
      clearCart();
      
      // Navigate to receipt with order ID
      navigate(`/receipt?orderId=${orderId}`);
      
    } catch (error) {
      console.error('Error processing order:', error);
      alert('Error processing order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
            <CreditCard className="w-12 h-12 text-gray-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
          <p className="text-gray-600 mb-8">Add some products to continue with checkout</p>
          <Button
            onClick={() => navigate("/")}
            className="bg-orange-600 hover:bg-orange-700"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Shopping
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            {language === 'he' ? 'חזרה לקנייה' : 'Back to Shopping'}
          </button>
          <h1 className="text-3xl font-bold text-gray-900">{t.checkout.title}</h1>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Checkout Form */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-green-600" />
                {language === 'he' ? 'פרטי משלוח' : 'Shipping Information'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="fullName">{t.checkout.fullName}</Label>
                  <Input
                    id="fullName"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    className={`h-12 ${errors.fullName ? 'border-red-500' : ''}`}
                    placeholder={language === 'he' ? 'הכנס שם מלא' : 'Enter your full name'}
                  />
                  {errors.fullName && <p className="text-red-500 text-sm">{errors.fullName}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">{t.checkout.email}</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={`h-12 ${errors.email ? 'border-red-500' : ''}`}
                    placeholder={language === 'he' ? 'הכנס כתובת אימייל' : 'Enter your email'}
                  />
                  {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">{t.checkout.phone}</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className={`h-12 ${errors.phone ? 'border-red-500' : ''}`}
                    placeholder={language === 'he' ? 'הכנס מספר טלפון' : 'Enter your phone number'}
                  />
                  {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">{t.checkout.address}</Label>
                  <Textarea
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    className={`min-h-24 resize-none ${errors.address ? 'border-red-500' : ''}`}
                    placeholder={language === 'he' ? 'הכנס כתובת מלאה למשלוח' : 'Enter your complete shipping address'}
                  />
                  {errors.address && <p className="text-red-500 text-sm">{errors.address}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="country">{t.checkout.country}</Label>
                  <Select value={formData.country} onValueChange={(value) => handleInputChange('country', value)}>
                    <SelectTrigger className={`h-12 ${errors.country ? 'border-red-500' : ''}`}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map((country) => (
                        <SelectItem key={country.code} value={country.code}>
                          {language === 'he' ? country.name_he : country.name_en}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.country && <p className="text-red-500 text-sm">{errors.country}</p>}
                </div>

                <Button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full h-14 bg-red-600 hover:bg-red-700 text-white text-lg font-medium rounded-xl transition-all hover-lift disabled:opacity-50"
                >
                  {isProcessing ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      {t.checkout.processing}
                    </div>
                  ) : (
                    <>
                      <CreditCard className="w-5 h-5 mr-2" />
                      {t.checkout.complete}
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Order Summary */}
          <Card className="border-0 shadow-lg h-fit">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-blue-600" />
                {t.checkout.orderSummary}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {cart.map((item: CartItem) => (
                <div key={item.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <img
                    src={item.image_url}
                    alt={language === 'he' ? item.name_he : item.name_en}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium">
                      {language === 'he' ? item.name_he : item.name_en}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {language === 'he' ? 'כמות' : 'Qty'}: {item.quantity}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-orange-600">₪{(item.sale_price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              ))}

              <Separator />

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>{t.checkout.subtotal}:</span>
                  <span>₪{cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>{t.checkout.shipping}:</span>
                  <span className="text-green-600 font-medium">{t.checkout.free}</span>
                </div>
              </div>

              <Separator />

              <div className="flex justify-between text-xl font-bold">
                <span>{t.checkout.total}:</span>
                <span className="text-orange-600">₪{cartTotal.toFixed(2)}</span>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
                <div className="flex items-center gap-2 text-green-700">
                  <Truck className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    {language === 'he' ? 'משלוח חינם עד הבית!' : 'Free home delivery!'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
