import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Order, type OrderData } from '@/entities/Order';
import { useAppContext, type AppContextType } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { PackageCheck, Home as HomeIcon, ShoppingBag } from 'lucide-react';

export default function ReceiptPage() {
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(window.location.search);
  const orderId = searchParams.get('orderId');
  const { t, language }: AppContextType = useAppContext();
  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) {
        navigate("/");
        return;
      }

      try {
        const fetchedOrder = await Order.getById(orderId);
        if (fetchedOrder) {
          setOrder(fetchedOrder);
        } else {
          navigate("/");
        }
      } catch (error) {
        console.error('Error loading order:', error);
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
    // Show confetti animation
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
  }, [orderId, navigate]);

  const handleBackHome = () => {
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
            <PackageCheck className="w-12 h-12 text-gray-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Loading Order...</h1>
          <p className="text-gray-600 mb-8">Please wait while we fetch your order details.</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <PackageCheck className="w-12 h-12 text-red-600" />
          </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Order not found</h1>
            <p className="text-gray-600 mb-8">The order ID provided is invalid or the order does not exist.</p>
            <Button onClick={handleBackHome}>
              <HomeIcon className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 relative overflow-hidden">
      {/* Confetti Animation */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-gradient-to-r from-orange-400 to-red-500 rounded-full animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4">
        {/* Success Header */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <PackageCheck className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{t.receipt.title}</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">{t.receipt.subtitle}</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Order Details */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PackageCheck className="w-5 h-5 text-blue-600" />
                {language === 'he' ? 'פרטי הזמנה' : 'Order Details'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">{t.receipt.orderId}</p>
                  <p className="font-mono font-bold text-lg">{order.order_id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">
                    {language === 'he' ? 'תאריך הזמנה' : 'Order Date'}
                  </p>
                  <p className="font-medium">
                    {new Date(order.created_date).toLocaleDateString(language === 'he' ? 'he-IL' : 'en-US')}
                  </p>
                </div>
              </div>

              <Separator />

              <div>
                <p className="text-sm text-gray-500 mb-1">
                  {language === 'he' ? 'שם הלקוח' : 'Customer Name'}
                </p>
                <p className="font-medium">{order.customer_name}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-1">
                  {language === 'he' ? 'כתובת אימייל' : 'Email'}
                </p>
                <p className="font-medium">{order.customer_email}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-1">
                  {language === 'he' ? 'כתובת משלוח' : 'Shipping Address'}
                </p>
                <p className="font-medium">{order.shipping_address}</p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center gap-2 text-blue-700 mb-2">
                  <PackageCheck className="w-4 h-4" />
                  <span className="font-medium">{t.receipt.estimatedDelivery}</span>
                </div>
                <p className="text-blue-800 font-medium">{t.receipt.businessDays}</p>
              </div>
            </CardContent>
          </Card>

          {/* Order Items & Total */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-purple-600" />
                {language === 'he' ? 'פריטים שנרכשו' : 'Items Purchased'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                {order.items.map((item, index: number) => (
                  <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                    <img
                      src={item.image_url}
                      alt={language === 'he' ? item.name_he : item.name_en}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div>
                      <h4 className="font-medium">{language === 'he' ? item.name_he : item.name_en}</h4>
                      <p className="text-sm text-gray-600">{language === 'he' ? 'כמות' : 'Qty'}: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-orange-600">₪{(item.sale_price * item.quantity).toFixed(2)}</p>
                      <p className="text-sm text-gray-500">₪{item.sale_price} {language === 'he' ? 'ליחידה' : 'each'}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>{language === 'he' ? 'סיכום ביניים' : 'Subtotal'}:</span>
                  <span>₪{order.total_amount?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>{language === 'he' ? 'משלוח' : 'Shipping'}:</span>
                  <span className="text-green-600 font-medium">
                    {language === 'he' ? 'חינם' : 'Free'}
                  </span>
                </div>
              </div>

              <Separator />

              <div className="flex justify-between text-xl font-bold">
                <span>{language === 'he' ? 'סה״כ ששולם' : 'Total Paid'}:</span>
                <span className="text-orange-600">₪{order.total_amount?.toFixed(2)}</span>
              </div>

              <div className="pt-4 space-y-3">
                <Button onClick={handleBackHome} className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-xl font-medium transition-all hover-lift">
                  <HomeIcon className="w-4 h-4 mr-2" />
                  {t.receipt.backHome}
                </Button>
                
                <Button onClick={handleBackHome} className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-xl font-medium transition-all hover-lift">
                  <ShoppingBag className="w-4 h-4 mr-2" />
                  {t.receipt.shopAgain}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Thank you message */}
        <div className="text-center mt-12 p-8 bg-white rounded-2xl shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {language === 'he' ? '🎉 תודה שבחרת בנו!' : '🎉 Thank you for choosing us!'}
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {language === 'he' 
              ? 'ההזמנה שלך חשובה לנו. נעדכן אותך בכל שלב של תהליך המשלוח.'
              : 'Your order means the world to us. We\'ll keep you updated every step of the way.'
            }
          </p>
        </div>
      </div>
    </div>
  );
}
