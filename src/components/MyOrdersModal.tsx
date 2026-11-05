import { useEffect, useState } from 'react';
import { X, Package, Clock, CheckCircle2, Truck, ShoppingBag } from 'lucide-react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';

interface OrderItem {
  id: string;
  name: string;
  price: string;
  size?: string;
  quantity: number;
  image?: string;
}

interface OrderRecord {
  id: string;
  items: OrderItem[];
  total_amount: number | string;
  status: string;
  created_at?: any;
}

export default function MyOrdersModal() {
  const { isOrdersModalOpen, closeOrdersModal, user } = useAuth();
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isOrdersModalOpen || !user) {
      setOrders([]);
      return;
    }

    setLoading(true);
    const q = query(
      collection(db, 'orders'),
      where('user_id', '==', user.uid)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const list: OrderRecord[] = snapshot.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Omit<OrderRecord, 'id'>),
        }));
        // Sort descending by created_at if available
        list.sort((a, b) => {
          const tA = a.created_at?.seconds || 0;
          const tB = b.created_at?.seconds || 0;
          return tB - tA;
        });
        setOrders(list);
        setLoading(false);
      },
      (err) => {
        console.error('Error fetching customer orders:', err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [isOrdersModalOpen, user]);

  if (!isOrdersModalOpen) return null;

  const renderStatusBadge = (status: string) => {
    const s = (status || 'PENDING').toUpperCase();
    if (s === 'PAID' || s === 'CONFIRMED') {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-50 text-green-700 text-xs font-semibold rounded-full border border-green-200">
          <CheckCircle2 size={13} /> Payment Confirmed
        </span>
      );
    }
    if (s === 'DISPATCHED') {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full border border-blue-200">
          <Truck size={13} /> Dispatched & On the Way
        </span>
      );
    }
    if (s === 'DELIVERED') {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-full border border-emerald-200">
          <CheckCircle2 size={13} /> Delivered
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-3 py-1 bg-amber-50 text-amber-700 text-xs font-semibold rounded-full border border-amber-200">
        <Clock size={13} /> Awaiting Payment / Verification
      </span>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl max-h-[85vh] bg-white rounded-3xl shadow-2xl border border-ivory-dark overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 bg-ivory border-b border-ivory-dark flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-sage/10 text-sage flex items-center justify-center">
              <Package size={20} />
            </div>
            <div>
              <h2 className="font-serif text-2xl font-bold text-charcoal">My Orders & Tracking</h2>
              <p className="text-xs text-charcoal-light">Live status of your handcrafted orders</p>
            </div>
          </div>
          <button
            onClick={closeOrdersModal}
            className="p-2 text-charcoal-light hover:text-charcoal rounded-full hover:bg-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {loading ? (
            <div className="py-16 text-center text-charcoal-light text-sm">
              Loading your orders...
            </div>
          ) : orders.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-ivory-dark text-charcoal-light flex items-center justify-center mx-auto">
                <ShoppingBag size={28} />
              </div>
              <h3 className="font-serif text-xl font-semibold text-charcoal">No Orders Placed Yet</h3>
              <p className="text-sm text-charcoal-light max-w-xs mx-auto">
                Discover our pure botanical beauty essentials and place your first order.
              </p>
              <button
                onClick={closeOrdersModal}
                className="mt-2 px-6 py-2.5 bg-sage hover:bg-sage-dark text-white rounded-xl text-sm font-semibold transition-all"
              >
                Browse Shop
              </button>
            </div>
          ) : (
            orders.map((ord) => {
              const formattedDate = ord.created_at?.seconds
                ? new Date(ord.created_at.seconds * 1000).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })
                : 'Just now';

              return (
                <div
                  key={ord.id}
                  className="bg-ivory/50 rounded-2xl p-5 border border-ivory-dark space-y-4 hover:border-sage/40 transition-colors"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-ivory-dark pb-3">
                    <div>
                      <p className="text-xs text-charcoal-light">Order ID</p>
                      <p className="font-mono text-xs font-semibold text-charcoal">#{ord.id.slice(0, 8).toUpperCase()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-charcoal-light">{formattedDate}</p>
                      <div className="mt-1">{renderStatusBadge(ord.status)}</div>
                    </div>
                  </div>

                  {/* Items */}
                  <div className="space-y-2">
                    {Array.isArray(ord.items) &&
                      ord.items.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between text-sm py-1">
                          <div className="flex items-center gap-3">
                            {item.image && (
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-10 h-10 rounded-lg object-cover border border-ivory-dark shrink-0"
                              />
                            )}
                            <div>
                              <p className="font-medium text-charcoal">{item.name}</p>
                              <p className="text-xs text-charcoal-light">
                                {item.quantity}x {item.size ? `(${item.size})` : ''}
                              </p>
                            </div>
                          </div>
                          <span className="font-semibold text-charcoal">{item.price}</span>
                        </div>
                      ))}
                  </div>

                  <div className="pt-2 border-t border-ivory-dark flex items-center justify-between">
                    <span className="text-xs font-semibold text-charcoal-light uppercase tracking-wider">Total</span>
                    <span className="font-serif text-lg font-bold text-terracotta">
                      ₹{typeof ord.total_amount === 'number' ? ord.total_amount.toLocaleString('en-IN') : ord.total_amount}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
