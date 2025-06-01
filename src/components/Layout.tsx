import React, { createContext, useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Globe, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Product } from '@/entities/Product';
import Footer from './Footer';

interface CartItem extends Product {
  quantity: number;
}

interface Translations {
  nav: { home: string; checkout: string; cart: string; };
  hero: { title: string; subtitle: string; cta: string; };
  products: { title: string; originalPrice: string; salePrice: string; addToCart: string; outOfStock: string; };
  cart: { title: string; empty: string; total: string; checkout: string; remove: string; quantity: string; };
  features: { shipping: string; secure: string; support: string; warranty: string; };
  reviews: { title: string; };
  checkout: { title: string; fullName: string; email: string; phone: string; address: string; country: string; orderSummary: string; subtotal: string; shipping: string; free: string; total: string; complete: string; processing: string; };
  receipt: { title: string; subtitle: string; orderId: string; estimatedDelivery: string; businessDays: string; backHome: string; shopAgain: string; };
}

// Language and Cart Context
export interface AppContextType {
  language: keyof typeof translations;
  setLanguage: React.Dispatch<React.SetStateAction<keyof typeof translations>>;
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartItemCount: number;
  isCartOpen: boolean;
  setIsCartOpen: React.Dispatch<React.SetStateAction<boolean>>;
  t: Translations;
  isRTL: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
};

// Translations
const translations = {
  en: {
    nav: {
      home: "Home",
      checkout: "Checkout", 
      cart: "Cart"
    },
    hero: {
      title: "🔥 Flash Sale – Up to 50% Off on Must-Have Tech!",
      subtitle: "Limited time only – while supplies last!",
      cta: "Shop Now"
    },
    products: {
      title: "Featured Products",
      originalPrice: "Original",
      salePrice: "Sale Price", 
      addToCart: "Add to Cart",
      outOfStock: "Out of Stock"
    },
    cart: {
      title: "Your Cart",
      empty: "Your cart is empty",
      total: "Total",
      checkout: "Proceed to Checkout",
      remove: "Remove",
      quantity: "Qty"
    },
    features: {
      shipping: "Free Express Shipping",
      secure: "Secure Payment",
      support: "24/7 Support", 
      warranty: "Warranty on All Items"
    },
    reviews: {
      title: "What Our Customers Say"
    },
    checkout: {
      title: "Checkout",
      fullName: "Full Name",
      email: "Email",
      phone: "Phone Number",
      address: "Shipping Address", 
      country: "Country",
      orderSummary: "Order Summary",
      subtotal: "Subtotal",
      shipping: "Shipping",
      free: "Free",
      total: "Total",
      complete: "Complete My Purchase",
      processing: "Processing..."
    },
    receipt: {
      title: "✅ Thank you for your purchase!",
      subtitle: "Your order is on its way. A receipt has been sent to your email.",
      orderId: "Order ID",
      estimatedDelivery: "Estimated Delivery",
      businessDays: "2-3 business days",
      backHome: "Back to Homepage",
      shopAgain: "Shop Again"
    }
  },
  he: {
    nav: {
      home: "בית",
      checkout: "תשלום",
      cart: "עגלה"
    },
    hero: {
      title: "🔥 מבצע בזק – עד 50% הנחה על גאדג'טים שחייבים!",
      subtitle: "זמן מוגבל בלבד – עד שהמלאי אוזל!",
      cta: "קנה עכשיו"
    },
    products: {
      title: "מוצרים מובילים",
      originalPrice: "מחיר מקורי",
      salePrice: "מחיר מבצע",
      addToCart: "הוסף לעגלה", 
      outOfStock: "אזל מהמלאי"
    },
    cart: {
      title: "העגלה שלך",
      empty: "העגלה שלך ריקה",
      total: "סה״כ",
      checkout: "המשך לתשלום",
      remove: "הסר",
      quantity: "כמות"
    },
    features: {
      shipping: "משלוח מהיר חינם",
      secure: "תשלום מאובטח", 
      support: "תמיכה 24/7",
      warranty: "אחריות על כל הפריטים"
    },
    reviews: {
      title: "מה הלקוחות שלנו אומרים"
    },
    checkout: {
      title: "תשלום",
      fullName: "שם מלא",
      email: "אימייל",
      phone: "מספר טלפון",
      address: "כתובת למשלוח",
      country: "מדינה", 
      orderSummary: "סיכום הזמנה",
      subtotal: "סיכום ביניים",
      shipping: "משלוח",
      free: "חינם",
      total: "סה״כ",
      complete: "השלם את הרכישה",
      processing: "מעבד..."
    },
    receipt: {
      title: "✅ תודה על הרכישה!",
      subtitle: "ההזמנה שלך בדרך. קבלה נשלחה לאימייל שלך.",
      orderId: "מספר הזמנה",
      estimatedDelivery: "משלוח צפוי",
      businessDays: "2-3 ימי עסקים",
      backHome: "חזור לעמוד הבית",
      shopAgain: "קנה שוב"
    }
  }
} as const;

interface LayoutProps {
  children: React.ReactNode;
  // currentPageName: string; // Removed unused prop
}

export default function Layout({ children }: LayoutProps) {
  // const location = useLocation(); // Removed unused variable
  const [language, setLanguage] = useState<keyof typeof translations>('en');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuMenuOpen] = useState(false);

  // Load cart from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('flashSaleCart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    localStorage.setItem('flashSaleCart', JSON.stringify(cart));
  }, [cart]);

  // Set document direction and language
  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'he' ? 'rtl' : 'ltr';
  }, [language]);

  const t = translations[language];
  const isRTL = language === 'he';

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev => 
      prev.map(item => 
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.sale_price * item.quantity), 0);
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const contextValue = {
    language,
    setLanguage,
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartTotal,
    cartItemCount,
    isCartOpen,
    setIsCartOpen,
    t,
    isRTL
  };

  return (
    <AppContext.Provider value={contextValue}>
      <style>{`
        :root {
          --primary: #FF9800;
          --cta: #D32F2F;
          --accent: #FFC107;
          --bg: #fffefa;
          --text: #222222;
          --shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }
        
        body {
          background-color: var(--bg);
          font-family: ${language === 'he' ? '"Heebo", sans-serif' : '"Inter", sans-serif'};
          color: var(--text);
          margin: 0;
          padding: 0;
        }
        
        * {
          box-sizing: border-box;
        }
        
        .animate-slide-up {
          animation: slideUp 0.3s ease-out;
        }
        
        .animate-fade-in {
          animation: fadeIn 0.5s ease-out;
        }
        
        .animate-pulse-soft {
          animation: pulseSoft 2s infinite;
        }
        
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes pulseSoft {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        
        .hover-lift {
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        
        .hover-lift:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
        }
        
        .gradient-bg {
          background: linear-gradient(135deg, var(--primary) 0%, var(--cta) 100%);
        }
      `}</style>

      <div className="min-h-screen bg-gray-50">
        {/* Navigation */}
        <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              {/* Logo */}
              <Link to="/" className="flex items-center gap-3">
                <div className="w-10 h-10 gradient-bg rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-lg">⚡</span>
                </div>
                <span className="font-bold text-xl text-gray-900">FlashSale</span>
              </Link>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center gap-6">
                <Link 
                  to="/" 
                  className="text-gray-700 hover:text-orange-600 transition-colors font-medium"
                >
                  {t.nav.home}
                </Link>
                
                {/* Language Switcher */}
                <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setLanguage('en')}
                    className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${
                      language === 'en' 
                        ? 'bg-white text-orange-600 shadow-sm' 
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    EN
                  </button>
                  <button
                    onClick={() => setLanguage('he')}
                    className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${
                      language === 'he' 
                        ? 'bg-white text-orange-600 shadow-sm' 
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    עב
                  </button>
                </div>

                {/* Cart Button */}
                <button
                  onClick={() => setIsCartOpen(true)}
                  className="relative p-2 text-gray-700 hover:text-orange-600 transition-colors"
                >
                  <ShoppingCart className="w-6 h-6" />
                  {cartItemCount > 0 && (
                    <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full min-w-6 h-6 flex items-center justify-center animate-pulse-soft">
                      {cartItemCount}
                    </Badge>
                  )}
                </button>
              </div>

              {/* Mobile menu button */}
              <button
                onClick={() => setIsMobileMenuMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 text-gray-700"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden bg-white border-t border-gray-200 animate-slide-up">
              <div className="px-4 py-3 space-y-3">
                <Link 
                  to="/" 
                  className="block text-gray-700 hover:text-orange-600 transition-colors font-medium"
                  onClick={() => setIsMobileMenuMenuOpen(false)}
                >
                  {t.nav.home}
                </Link>
                
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-gray-500" />
                  <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                    <button
                      onClick={() => setLanguage('en')}
                      className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${
                        language === 'en' ? 'bg-white text-orange-600' : 'text-gray-600'
                      }`}
                    >
                      EN
                    </button>
                    <button
                      onClick={() => setLanguage('he')}
                      className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${
                        language === 'he' ? 'bg-white text-orange-600' : 'text-gray-600'
                      }`}
                    >
                      עב
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setIsCartOpen(true);
                    setIsMobileMenuMenuOpen(false);
                  }}
                  className="flex items-center gap-3 text-gray-700 hover:text-orange-600 transition-colors"
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span>{t.nav.cart}</span>
                  {cartItemCount > 0 && (
                    <Badge className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                      {cartItemCount}
                    </Badge>
                  )}
                </button>
              </div>
            </div>
          )}
        </nav>

        {/* Main Content */}
        <main className="animate-fade-in">
          {children}
        <Footer language={language}/>
        </main>

        {/* Cart Drawer */}
        {isCartOpen && (
          <div className="fixed inset-0 z-50 overflow-hidden">
            <div className="absolute inset-0 bg-black/50" onClick={() => setIsCartOpen(false)} />
            <div className={`absolute top-0 ${isRTL ? 'left-0' : 'right-0'} h-full w-96 max-w-full bg-white shadow-xl animate-slide-up`}>
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between p-6 border-b">
                  <h2 className="text-xl font-bold">{t.cart.title}</h2>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                  {cart.length === 0 ? (
                    <div className="text-center py-12">
                      <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">{t.cart.empty}</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {cart.map((item) => (
                        <div key={item.id} className="flex items-center gap-4 p-4 border rounded-lg">
                          <img
                            src={item.image_url}
                            alt={language === 'he' ? item.name_he : item.name_en}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                          <div className="flex-1">
                            <h3 className="font-medium text-sm">
                              {language === 'he' ? item.name_he : item.name_en}
                            </h3>
                            <p className="text-orange-600 font-bold">₪{item.sale_price}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                              >
                                -
                              </button>
                              <span className="w-8 text-center">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                              >
                                +
                              </button>
                            </div>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-red-500 hover:text-red-700 transition-colors"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {cart.length > 0 && (
                  <div className="border-t p-6">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-lg font-bold">{t.cart.total}:</span>
                      <span className="text-xl font-bold text-orange-600">₪{cartTotal.toFixed(2)}</span>
                    </div>
                    <Link to="/checkout">
                      <Button 
                        className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-medium transition-all hover-lift"
                        onClick={() => setIsCartOpen(false)}
                      >
                        {t.cart.checkout}
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </AppContext.Provider>
  );
}