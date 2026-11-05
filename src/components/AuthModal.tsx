import { useState } from 'react';
import { X, Lock, Mail, User, Phone, MapPin, Building, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AuthModal() {
  const { isAuthModalOpen, closeAuthModal, login, register } = useAuth();
  const [tab, setTab] = useState<'login' | 'register'>('login');

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register form state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regAddress, setRegAddress] = useState('');
  const [regCity, setRegCity] = useState('');
  const [regPincode, setRegPincode] = useState('');
  const [regPassword, setRegPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isAuthModalOpen) return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(loginEmail, loginPassword);
    } catch (err: any) {
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password') {
        setError('Incorrect email or password. Please try again.');
      } else if (err.code === 'auth/user-not-found') {
        setError('No account found with this email. Please create an account.');
      } else {
        setError(err.message || 'Failed to sign in. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (regPassword.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (!regPhone || regPhone.length < 10) {
      setError('Please provide a valid 10-digit mobile number for order dispatch.');
      return;
    }
    if (!regPincode || regPincode.length < 6) {
      setError('Please provide a valid 6-digit delivery pincode.');
      return;
    }

    setLoading(true);
    try {
      await register({
        name: regName,
        email: regEmail,
        phone: regPhone,
        address: regAddress,
        city: regCity,
        pincode: regPincode,
        password: regPassword,
      });
    } catch (err: any) {
      if (err.code === 'auth/email-already-in-use') {
        setError('This email is already registered. Please sign in instead.');
      } else {
        setError(err.message || 'Failed to create account.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg max-h-[90vh] bg-white rounded-3xl shadow-2xl border border-ivory-dark overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 bg-ivory border-b border-ivory-dark flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-sage">InbaNaturals Account</span>
            <h2 className="font-serif text-2xl font-bold text-charcoal mt-0.5">
              {tab === 'login' ? 'Sign In to Your Account' : 'Create Customer Account'}
            </h2>
            <p className="text-xs text-charcoal-light mt-1">
              Required to place orders, save your delivery address, and track dispatch status.
            </p>
          </div>
          <button
            onClick={closeAuthModal}
            className="p-2 text-charcoal-light hover:text-charcoal rounded-full hover:bg-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-ivory-dark bg-white">
          <button
            type="button"
            onClick={() => { setTab('login'); setError(null); }}
            className={`flex-1 py-3.5 text-sm font-semibold transition-all text-center border-b-2 ${
              tab === 'login'
                ? 'border-sage text-sage bg-sage/5'
                : 'border-transparent text-charcoal-light hover:text-charcoal'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setTab('register'); setError(null); }}
            className={`flex-1 py-3.5 text-sm font-semibold transition-all text-center border-b-2 ${
              tab === 'register'
                ? 'border-sage text-sage bg-sage/5'
                : 'border-transparent text-charcoal-light hover:text-charcoal'
            }`}
          >
            New Customer? Register
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mx-6 mt-4 p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {/* Form Body */}
        <div className="p-6 overflow-y-auto space-y-4">
          {tab === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-charcoal mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-3 text-charcoal-light" />
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="e.g. yourname@gmail.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-ivory-dark bg-ivory text-charcoal text-sm placeholder-charcoal-light focus:outline-none focus:border-sage focus:ring-2 focus:ring-sage/20 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-charcoal mb-1.5">Password</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-3 text-charcoal-light" />
                  <input
                    type="password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-ivory-dark bg-ivory text-charcoal text-sm placeholder-charcoal-light focus:outline-none focus:border-sage focus:ring-2 focus:ring-sage/20 transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-sage hover:bg-sage-dark text-white rounded-xl text-sm font-semibold transition-all duration-200 active:scale-[0.98] disabled:opacity-50 mt-2 shadow-md shadow-sage/20"
              >
                {loading ? 'Signing In...' : 'Sign In & Continue'}
              </button>

              <p className="text-center text-xs text-charcoal-light pt-2">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => { setTab('register'); setError(null); }}
                  className="text-sage font-semibold hover:underline"
                >
                  Create one here
                </button>
              </p>
            </form>
          ) : (
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-charcoal mb-1">Full Name *</label>
                <div className="relative">
                  <User size={16} className="absolute left-3.5 top-2.5 text-charcoal-light" />
                  <input
                    type="text"
                    required
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="e.g. Priya Sharma"
                    className="w-full pl-10 pr-4 py-2 rounded-xl border border-ivory-dark bg-ivory text-charcoal text-sm placeholder-charcoal-light focus:outline-none focus:border-sage focus:ring-2 focus:ring-sage/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-charcoal mb-1">Email Address *</label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3.5 top-2.5 text-charcoal-light" />
                    <input
                      type="email"
                      required
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="priya@gmail.com"
                      className="w-full pl-10 pr-4 py-2 rounded-xl border border-ivory-dark bg-ivory text-charcoal text-sm placeholder-charcoal-light focus:outline-none focus:border-sage focus:ring-2 focus:ring-sage/20"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-charcoal mb-1">Mobile / WhatsApp Number *</label>
                  <div className="relative">
                    <Phone size={16} className="absolute left-3.5 top-2.5 text-charcoal-light" />
                    <input
                      type="tel"
                      required
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full pl-10 pr-4 py-2 rounded-xl border border-ivory-dark bg-ivory text-charcoal text-sm placeholder-charcoal-light focus:outline-none focus:border-sage focus:ring-2 focus:ring-sage/20"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-charcoal mb-1">Delivery Address (Door No, Street) *</label>
                <div className="relative">
                  <MapPin size={16} className="absolute left-3.5 top-2.5 text-charcoal-light" />
                  <input
                    type="text"
                    required
                    value={regAddress}
                    onChange={(e) => setRegAddress(e.target.value)}
                    placeholder="House/Flat No, Apartment, Street name"
                    className="w-full pl-10 pr-4 py-2 rounded-xl border border-ivory-dark bg-ivory text-charcoal text-sm placeholder-charcoal-light focus:outline-none focus:border-sage focus:ring-2 focus:ring-sage/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-charcoal mb-1">City & State *</label>
                  <div className="relative">
                    <Building size={16} className="absolute left-3.5 top-2.5 text-charcoal-light" />
                    <input
                      type="text"
                      required
                      value={regCity}
                      onChange={(e) => setRegCity(e.target.value)}
                      placeholder="e.g. Bangalore, KA"
                      className="w-full pl-10 pr-4 py-2 rounded-xl border border-ivory-dark bg-ivory text-charcoal text-sm placeholder-charcoal-light focus:outline-none focus:border-sage focus:ring-2 focus:ring-sage/20"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-charcoal mb-1">Pincode *</label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={regPincode}
                    onChange={(e) => setRegPincode(e.target.value.replace(/\D/g, ''))}
                    placeholder="e.g. 560001"
                    className="w-full px-4 py-2 rounded-xl border border-ivory-dark bg-ivory text-charcoal text-sm placeholder-charcoal-light focus:outline-none focus:border-sage focus:ring-2 focus:ring-sage/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-charcoal mb-1">Create Password (min 6 characters) *</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-2.5 text-charcoal-light" />
                  <input
                    type="password"
                    required
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2 rounded-xl border border-ivory-dark bg-ivory text-charcoal text-sm placeholder-charcoal-light focus:outline-none focus:border-sage focus:ring-2 focus:ring-sage/20"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-sage hover:bg-sage-dark text-white rounded-xl text-sm font-semibold transition-all duration-200 active:scale-[0.98] disabled:opacity-50 shadow-md shadow-sage/20"
                >
                  {loading ? 'Creating Account...' : 'Complete Registration & Continue'}
                </button>
              </div>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-charcoal-light pt-1">
                <ShieldCheck size={14} className="text-sage" />
                <span>Your address will be automatically saved for all future orders.</span>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
