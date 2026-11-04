import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  collection,
  onSnapshot,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  getDocs,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage, isFirebaseConfigured } from '../lib/firebase';
import { products as defaultProducts, type Product } from '../data/products';

interface ProductContextType {
  products: Product[];
  loading: boolean;
  error: string | null;
  getProductById: (id: string) => Product | undefined;
  updateProduct: (id: string, updates: Partial<Product>) => Promise<void>;
  createProduct: (product: Product) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  uploadProductImage: (file: File | Blob, filename: string) => Promise<string>;
  seedProductsToFirestore: () => Promise<void>;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(defaultProducts);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isFirebaseConfigured) {
      setProducts(defaultProducts);
      setLoading(false);
      return;
    }

    const productsRef = collection(db, 'products');

    const unsubscribe = onSnapshot(
      productsRef,
      (snapshot) => {
        if (!snapshot.empty) {
          const fetchedProducts = snapshot.docs.map((docSnap) => {
            const data = docSnap.data() as Omit<Product, 'id'>;
            const defaultProd = defaultProducts.find((p) => p.id === docSnap.id);
            return {
              id: docSnap.id,
              ...data,
              image: data.image || defaultProd?.image || '',
            };
          });
          setProducts(fetchedProducts);
        } else {
          // Fallback to default local products if collection is empty
          setProducts(defaultProducts);
        }
        setLoading(false);
      },
      (err) => {
        console.error('Error fetching products from Firestore:', err);
        setError(err.message);
        setProducts(defaultProducts);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const getProductById = (id: string): Product | undefined => {
    return products.find((p) => p.id === id);
  };

  /**
   * Update product fields (e.g. price, image, tagline, stock, description) in Firestore.
   */
  const updateProduct = async (id: string, updates: Partial<Product>): Promise<void> => {
    if (!isFirebaseConfigured) throw new Error('Firebase is not configured.');
    const productRef = doc(db, 'products', id);
    await updateDoc(productRef, updates);
  };

  /**
   * Add a new product to Firestore.
   */
  const createProduct = async (product: Product): Promise<void> => {
    if (!isFirebaseConfigured) throw new Error('Firebase is not configured.');
    const productRef = doc(db, 'products', product.id);
    await setDoc(productRef, product);
  };

  /**
   * Delete a product from Firestore.
   */
  const deleteProduct = async (id: string): Promise<void> => {
    if (!isFirebaseConfigured) throw new Error('Firebase is not configured.');
    const productRef = doc(db, 'products', id);
    await deleteDoc(productRef);
  };

  /**
   * Upload an image to Firebase Storage and return its public URL.
   */
  const uploadProductImage = async (file: File | Blob, filename: string): Promise<string> => {
    if (!isFirebaseConfigured) throw new Error('Firebase is not configured.');
    const imageRef = ref(storage, `products/${Date.now()}-${filename}`);
    const snapshot = await uploadBytes(imageRef, file);
    const downloadUrl = await getDownloadURL(snapshot.ref);
    return downloadUrl;
  };

  /**
   * Seed initial products into Firestore if not already present.
   */
  const seedProductsToFirestore = async (): Promise<void> => {
    if (!isFirebaseConfigured) return;
    const productsRef = collection(db, 'products');
    const existing = await getDocs(productsRef);
    if (existing.empty) {
      for (const prod of defaultProducts) {
        await setDoc(doc(db, 'products', prod.id), prod);
      }
      console.info('Initial products seeded to Firestore.');
    }
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        loading,
        error,
        getProductById,
        updateProduct,
        createProduct,
        deleteProduct,
        uploadProductImage,
        seedProductsToFirestore,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = (): ProductContextType => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};
