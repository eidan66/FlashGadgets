export type Product = {
  id: string;
  name_en: string;
  name_he: string;
  description_en?: string;
  description_he?: string;
  original_price?: number;
  sale_price: number;
  image_url: string;
  highlights_en?: string[];
  highlights_he?: string[];
  stock?: number;
}

export class ProductService {
  /**
   * Fetches a list of products.
   * In a real application, this would fetch data from an API or database.
   * @returns A promise that resolves to an array of Product objects.
   */
  static async list(): Promise<Product[]> {
    // TODO: Replace with actual data fetching logic
    const mockProducts: Product[] = [
      {
        id: '1',
        name_en: 'Wireless Ergonomic Mouse',
        name_he: 'עכבר ארגונומי אלחוטי',
        description_en: 'Comfortable wireless mouse designed for prolonged use.',
        description_he: 'עכבר אלחוטי נוח המיועד לשימוש ממושך.',
        original_price: 29.99,
        sale_price: 24.99,
        image_url: 'https://images.unsplash.com/photo-1739742473235-34a7bd9b8f87?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fFdpcmeless%20Ergonomic%20Mouse%7Cen%7D%7D%7D', // mouse
        highlights_en: ['Ergonomic design', 'Wireless', 'Long battery life'],
        highlights_he: ['עיצוב ארגונומי', 'אלחוטי', 'חיי סוללה ארוכים'],
        stock: 15
      },
      {
        id: '2',
        name_en: 'Portable Bluetooth Speaker',
        name_he: `רמקול בלוטות' נייד`,
        description_en: 'Compact speaker with powerful sound.',
        description_he: 'רמקול קומפקטי עם צליל עוצמתי.',
        original_price: 49.99,
        sale_price: 39.99,
        image_url: 'https://images.unsplash.com/photo-1674303324806-7018a739ed11?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8UG9ydGFibGUlMjBCbHVldG9vdGglMjBTcGVha2VyfGVufDB8fDB8fHww', // speaker
        highlights_en: ['Bluetooth 5.0', 'Waterproof', '10-hour battery'],
        highlights_he: [`בלוטות' 5.0`, `עמיד למים`, `10 שעות סוללה`],
        stock: 0
      },
      {
        id: '3',
        name_en: 'USB-C Hub 7-in-1',
        name_he: `רכזת USB-C 7 ב-1`,
        description_en: `Expand your laptop's connectivity.`,
        description_he: 'הרחב את אפשרויות הקישוריות של המחשב הנייד שלך.',
        original_price: 59.99,
        sale_price: 49.99,
        image_url: 'https://m.media-amazon.com/images/I/61gUxbUgsiL._AC_SL1200_.jpg', // USB-C hub
        highlights_en: ['HDMI 4K', '2 USB 3.0', 'SD card reader'],
        highlights_he: ['HDMI 4K', '2 USB 3.0', 'קורא כרטיסי SD'],
        stock: 25
      }
    ];
    
    // Simulate network delay
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(mockProducts);
      }, 500);
    });
  }
}