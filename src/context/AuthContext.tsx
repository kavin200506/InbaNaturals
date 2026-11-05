import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  type User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

export interface UserProfile {
  uid: string;
  email: string;
  name: string;
  phone: string;
  address: string;
  city: string;
  pincode: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  phone: string;
  address: string;
  city: string;
  pincode: string;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  isAuthModalOpen: boolean;
  isOrdersModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  openOrdersModal: () => void;
  closeOrdersModal: () => void;
  requireAuth: (action: () => void) => void;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isOrdersModalOpen, setIsOrdersModalOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const userDocRef = doc(db, 'users', currentUser.uid);
          const snap = await getDoc(userDocRef);
          if (snap.exists()) {
            setProfile(snap.data() as UserProfile);
          } else {
            setProfile({
              uid: currentUser.uid,
              email: currentUser.email || '',
              name: currentUser.displayName || 'Customer',
              phone: '',
              address: '',
              city: '',
              pincode: '',
            });
          }
        } catch (err) {
          console.error('Error fetching user profile:', err);
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
    setPendingAction(null);
  };

  const openOrdersModal = () => setIsOrdersModalOpen(true);
  const closeOrdersModal = () => setIsOrdersModalOpen(false);

  /**
   * Guard function: runs action if logged in, otherwise opens Auth Modal and queues action
   */
  const requireAuth = (action: () => void) => {
    if (user) {
      action();
    } else {
      setPendingAction(() => action);
      setIsAuthModalOpen(true);
    }
  };

  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
    setIsAuthModalOpen(false);
    if (pendingAction) {
      setTimeout(() => {
        pendingAction();
        setPendingAction(null);
      }, 300);
    }
  };

  const register = async (data: RegisterData) => {
    const cred = await createUserWithEmailAndPassword(auth, data.email, data.password);
    if (cred.user) {
      await updateProfile(cred.user, { displayName: data.name });

      const newProfile: UserProfile = {
        uid: cred.user.uid,
        email: data.email,
        name: data.name,
        phone: data.phone,
        address: data.address,
        city: data.city,
        pincode: data.pincode,
      };

      await setDoc(doc(db, 'users', cred.user.uid), {
        ...newProfile,
        created_at: serverTimestamp(),
      });

      setProfile(newProfile);
    }

    setIsAuthModalOpen(false);
    if (pendingAction) {
      setTimeout(() => {
        pendingAction();
        setPendingAction(null);
      }, 300);
    }
  };

  const logout = async () => {
    await signOut(auth);
    setProfile(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        isAuthModalOpen,
        isOrdersModalOpen,
        openAuthModal,
        closeAuthModal,
        openOrdersModal,
        closeOrdersModal,
        requireAuth,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
