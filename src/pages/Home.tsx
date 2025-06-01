import { useState, useEffect } from 'react';
import type { Product } from '@/entities/Product';
import { ProductService } from '@/entities/Product';
import { useAppContext } from '@/components/Layout'; // Removed unused AppContextType import
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Star, Clock, Truck, Shield, Headphones, Award } from 'lucide-react';

// Countdown Timer Component Props
interface CountdownTimerProps {
  targetDate: number;
  // Removed unused language prop
}

// Countdown Timer Component
function CountdownTimer({ targetDate }: CountdownTimerProps) { // Removed language prop
  const [timeLeft, setTimeLeft] = useState<{ hours?: number; minutes?: number; seconds?: number }>({});
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance < 0) {
        setIsExpired(true);
        clearInterval(timer);
        return;
      }

      setTimeLeft({
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  if (isExpired) return null;

  return (
    <div className="flex items-center justify-center gap-4 bg-black/20 backdrop-blur-sm rounded-2xl p-6 text-white">
      <Clock className="w-6 h-6 text-yellow-300" />
      <div className="flex gap-4">
        {Object.entries(timeLeft).map(([unit, value]) => (
          <div key={unit} className="text-center animate-pulse-soft">
            <div className="text-3xl font-bold">{String(value).padStart(2, '0')}</div>
            <div className="text-sm opacity-80 capitalize">{unit}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Product Card Component Props
interface ProductCardProps {
  product: Product;
  language: 'en' | 'he';
  onAddToCart: (product: Product) => void;
}

// Product Card Component
function ProductCard({ product, language, onAddToCart }: ProductCardProps) {
  const name = language === 'he' ? product.name_he : product.name_en;
  const highlights = language === 'he' ? product.highlights_he : product.highlights_en;
  
  const discount = product.original_price ? Math.round((1 - product.sale_price / product.original_price) * 100) : 0;

  return (
    <Card className="overflow-hidden hover-lift border-0 shadow-lg">
      <div className="relative">
        <img
          src={product.image_url}
          alt={name}
          className="w-full h-48 object-cover"
        />
        <Badge className="absolute top-3 left-3 bg-red-500 text-white font-bold px-3 py-1">
          -{discount}%
        </Badge>
        {product.stock !== undefined && product.stock <= 5 && ( // Add check for undefined stock
          <Badge className="absolute top-3 right-3 bg-orange-500 text-white font-bold px-3 py-1 animate-pulse-soft">
            {product.stock} left!
          </Badge>
        )}
      </div>
      
      <CardContent className="p-6">
        <h3 className="text-xl font-bold mb-3 text-gray-900">{name}</h3>
        
        {highlights && (
          <ul className="space-y-1 mb-4 text-sm text-gray-600">
            {highlights.slice(0, 3).map((highlight, idx) => (
              <li key={idx} className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-orange-500 rounded-full"></span>
                {highlight}
              </li>
            ))}
          </ul>
        )}

        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <span className="text-lg text-gray-400 line-through">₪{product.original_price}</span>
            <span className="text-2xl font-bold text-orange-600">₪{product.sale_price}</span>
          </div>
          
          <Button
            onClick={() => onAddToCart(product)}
            disabled={product.stock !== undefined && product.stock <= 0} // Add check for undefined stock
            className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-medium transition-all hover-lift disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {product.stock !== undefined && product.stock <= 0 ? // Add check for undefined stock
              (language === 'he' ? 'אזל מהמלאי' : 'Out of Stock') :
              (language === 'he' ? 'הוסף לעגלה' : 'Add to Cart')
            }
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// Review Structure
interface Review {
  text_en: string;
  text_he: string;
  author: string;
  country: string;
  rating: number;
}

// Reviews Carousel Component Props
interface ReviewsCarouselProps {
  language: 'en' | 'he';
}

// Reviews Carousel Component
function ReviewsCarousel({ language }: ReviewsCarouselProps) {
  const [currentReview, setCurrentReview] = useState(0);
  
  const reviews: Review[] = [
    {
      text_en: "Amazing quality and super fast delivery! The wireless earbuds work perfectly.",
      text_he: "איכות מדהימה ומשלוח מהיר! האוזניות עובדות בצורה מושלמת.",
      author: "Sarah M.",
      country: "Tel Aviv, Israel",
      rating: 5
    },
    {
      text_en: "Great prices and excellent customer service. Highly recommend!",
      text_he: "מחירים מעולים ושירות לקוחות מצוין. ממליץ בחום!",
      author: "David K.",
      country: "Haifa, Israel", 
      rating: 5
    },
    {
      text_en: "The smart watch exceeded my expectations. Worth every shekel!",
      text_he: "השעון החכם עלה על הציפיות שלי. שווה כל שקל!",
      author: "Maya L.",
      country: "Jerusalem, Israel",
      rating: 5
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentReview((prev) => (prev + 1) % reviews.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [reviews.length]);

  const review = reviews[currentReview];
  const text = review ? (language === 'he' ? review.text_he : review.text_en) : '';

  return (
    <div className="relative bg-white rounded-2xl p-8 shadow-lg max-w-2xl mx-auto">
      <div className="text-center">
        <div className="flex justify-center mb-4">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
          ))}
        </div>
        <blockquote className="text-lg text-gray-700 mb-6 leading-relaxed">
          "{text}"
        </blockquote>
        <div className="flex items-center justify-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-red-500 rounded-full flex items-center justify-center text-white font-bold">
            {review?.author[0]}
          </div>
          <div className="text-left">
            <div className="font-medium text-gray-900">{review?.author}</div>
            <div className="text-sm text-gray-500">{review?.country}</div>
          </div>
        </div>
      </div>

      <div className="flex justify-center mt-6 gap-2">
        {reviews.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentReview(idx)}
            className={`w-2 h-2 rounded-full transition-all ${
              idx === currentReview ? 'bg-orange-500 w-6' : 'bg-gray-300'
            }`}
          />
        ))}
      </div>
    </div>
  );
}

export default function HomePage() {
  const { t, language, addToCart } = useAppContext();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const data = await ProductService.list();
      setProducts(data);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  // Set flash sale end time (24 hours from now)
  const saleEndTime = new Date().getTime() + (24 * 60 * 60 * 1000);

  const scrollToProducts = () => {
    document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
  };

  const features = [
    { icon: Truck, text: t.features.shipping },
    { icon: Shield, text: t.features.secure },
    { icon: Headphones, text: t.features.support },
    { icon: Award, text: t.features.warranty }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 gradient-bg"></div>
        <div className="absolute inset-0 bg-black/30"></div>
        
        {/* Hero Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-32 h-32 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-48 h-48 bg-white rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            {t.hero.title}
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-8">
            {t.hero.subtitle}
          </p>
          
          <CountdownTimer targetDate={saleEndTime} />
          
          <Button
            onClick={scrollToProducts}
            className="mt-8 bg-white text-gray-900 hover:bg-gray-100 px-8 py-4 text-lg font-medium rounded-2xl transition-all hover-lift"
          >
            {t.hero.cta}
          </Button>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">{t.products.title}</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-orange-500 to-red-500 mx-auto rounded-full"></div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-48 bg-gray-200 rounded-t-lg"></div>
                  <div className="p-6 space-y-4">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-8 bg-gray-200 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  language={language}
                  onAddToCart={addToCart}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="text-center p-6 rounded-2xl hover-lift transition-all hover:bg-gray-50"
              >
                <div className="w-16 h-16 gradient-bg rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{feature.text}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">{t.reviews.title}</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-orange-500 to-red-500 mx-auto rounded-full"></div>
          </div>
          <ReviewsCarousel language={language} />
        </div>
      </section>
    </div>
  );
}
