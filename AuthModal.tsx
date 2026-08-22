import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  User as UserIcon,
  Lock,
  Mail,
  Sparkles,
  Eye,
  EyeOff,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Smartphone,
  RefreshCw,
  KeyRound,
  Check,
  Loader2,
  CheckCircle,
} from 'lucide-react';
import { User } from '../types';
import { DEMO_USER } from '../data/mockData';
import {
  firebaseSignIn,
  firebaseSignUp,
  firebaseGoogleSignIn,
  firebaseSendPasswordReset,
} from '../services/firebaseService';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShowToast: (msg: string) => void;
  onLoginSuccess: (user: User) => void;
  initialMode?: 'signin' | 'signup';
}

type AuthMode = 'signin' | 'signup' | 'forgot_password' | 'otp_verify' | 'reset_new_password';

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onShowToast,
  onLoginSuccess,
  initialMode = 'signin',
}) => {
  const [authMode, setAuthMode] = useState<AuthMode>(initialMode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('+92 315 2643791');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // OTP & Verification state
  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [otpResendTimer, setOtpResendTimer] = useState(45);
  const [otpPurpose, setOtpPurpose] = useState<'signup' | 'reset' | 'email_verify'>('signup');

  // Sync mode when initialMode or modal opens
  useEffect(() => {
    if (isOpen) {
      setAuthMode(initialMode);
      setIsLoading(false);
    }
  }, [isOpen, initialMode]);

  // Resend OTP countdown timer effect
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (authMode === 'otp_verify' && otpResendTimer > 0) {
      timer = setInterval(() => {
        setOtpResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [authMode, otpResendTimer]);

  if (!isOpen) return null;

  // Password strength logic
  const getPasswordStrength = (pass: string) => {
    if (!pass) return { level: 0, text: '' };
    if (pass.length < 6) return { level: 1, text: 'Weak', color: 'bg-rose-500' };
    if (pass.length < 10) return { level: 2, text: 'Medium', color: 'bg-amber-500' };
    return { level: 3, text: 'Strong VIP Standard', color: 'bg-emerald-500' };
  };

  const strength = getPasswordStrength(password);

  const handleOtpInputChange = (index: number, val: string) => {
    if (!/^\d*$/.test(val)) return;
    const copy = [...otpDigits];
    copy[index] = val.slice(-1);
    setOtpDigits(copy);

    if (val && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleAutoFillDemoOtp = () => {
    setOtpDigits(['4', '8', '2', '1', '9', '5']);
    onShowToast('Auto-filled OTP: 482195');
  };

  const handleResendOtp = async () => {
    setOtpResendTimer(45);
    if (email) {
      await firebaseSendPasswordReset(email);
    }
    onShowToast(`New 6-digit verification code dispatched to ${email || phone}`);
  };

  // Google Auth Handler
  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      const userProfile = await firebaseGoogleSignIn();
      const mappedUser: User = {
        id: userProfile.uid,
        name: userProfile.name,
        email: userProfile.email,
        isEmailVerified: true,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
        phone: '+92 315 2643791',
        vipTier: 'Gold VIP',
        rewardPoints: 500,
        joinedDate: 'Google Auth',
      };
      onLoginSuccess(mappedUser);
      onShowToast(`🎉 Signed in with Google as ${mappedUser.name}!`);
      onClose();
    } catch (err) {
      onShowToast('Google Sign In failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Email & Password Sign Up Initiation
  const handleInitiateSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      onShowToast('Please fill all required fields');
      return;
    }
    setIsLoading(true);
    try {
      await firebaseSignUp(name || 'UmarMart Customer', email, password);
      setOtpPurpose('signup');
      setOtpResendTimer(45);
      setAuthMode('otp_verify');
      onShowToast(`Firebase verification OTP dispatched to ${email}`);
    } catch (err) {
      onShowToast('Sign Up failed. Please check your details.');
    } finally {
      setIsLoading(false);
    }
  };

  // Forgot Password Initiation
  const handleInitiateForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      onShowToast('Please enter your registered email');
      return;
    }
    setIsLoading(true);
    try {
      await firebaseSendPasswordReset(email);
      setOtpPurpose('reset');
      setOtpResendTimer(45);
      setAuthMode('otp_verify');
      onShowToast(`Password recovery instructions & OTP dispatched to ${email}`);
    } catch (err) {
      onShowToast('Could not send reset link. Try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Verify OTP Code
  const handleVerifyOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const enteredOtp = otpDigits.join('');
    if (enteredOtp.length < 6) {
      onShowToast('Please enter all 6 digits of the verification code');
      return;
    }

    if (otpPurpose === 'signup') {
      const newUser: User = {
        ...DEMO_USER,
        id: 'usr-' + Date.now(),
        name: name.trim() || 'UmarMart VIP Member',
        email: email.trim() || 'member@umarmart.pk',
        phone: phone.trim() || '+92 315 2643791',
        isEmailVerified: true,
        joinedDate: 'Just now',
      };
      onLoginSuccess(newUser);
      onShowToast(`🎉 Email Verified & Firebase Account Created! Welcome, ${newUser.name}!`);
      onClose();
    } else if (otpPurpose === 'reset') {
      setAuthMode('reset_new_password');
      onShowToast('OTP verified! Enter your new password.');
    }
  };

  // Reset New Password Submit
  const handleSetNewPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      onShowToast('Password must be at least 6 characters');
      return;
    }
    const user: User = {
      ...DEMO_USER,
      email: email.trim() || DEMO_USER.email,
    };
    onLoginSuccess(user);
    onShowToast('🔑 Password reset successfully via Firebase Auth!');
    onClose();
  };

  // Email & Password Sign In Handler
  const handleSignInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      onShowToast('Please enter your email and password');
      return;
    }
    setIsLoading(true);
    try {
      const profile = await firebaseSignIn(email, password);
      const user: User = {
        ...DEMO_USER,
        id: profile.uid,
        name: profile.name || name || DEMO_USER.name,
        email: profile.email || email,
        isEmailVerified: true,
      };
      onLoginSuccess(user);
      onShowToast(`Welcome back to UmarMart, ${user.name}!`);
      onClose();
    } catch (err) {
      onShowToast('Invalid credentials. Please check your password.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoSignIn = () => {
    onLoginSuccess(DEMO_USER);
    onShowToast(`Signed in as Demo VIP: ${DEMO_USER.name}`);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.2 }}
          className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 sm:p-8 relative shadow-2xl space-y-5 text-slate-900 my-8 overflow-hidden"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Modal Header */}
          <div className="text-center space-y-1.5 pt-1">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center mx-auto shadow-sm">
              {authMode === 'otp_verify' ? (
                <ShieldCheck className="w-6 h-6 text-emerald-600" />
              ) : authMode === 'reset_new_password' ? (
                <KeyRound className="w-6 h-6 text-blue-600" />
              ) : (
                <UserIcon className="w-6 h-6 text-blue-600" />
              )}
            </div>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">
              {authMode === 'signin' && 'Sign In to UmarMart'}
              {authMode === 'signup' && 'Create VIP Account'}
              {authMode === 'forgot_password' && 'Reset Password'}
              {authMode === 'otp_verify' && 'Verify Email & OTP'}
              {authMode === 'reset_new_password' && 'Set New Password'}
            </h3>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              {authMode === 'signin' && 'Access your order history, saved addresses, and VIP rewards'}
              {authMode === 'signup' && 'Register now for instant VIP perks, email verification & express checkout'}
              {authMode === 'forgot_password' && 'Enter your registered email for password recovery OTP code'}
              {authMode === 'otp_verify' && `We sent a 6-digit verification code to ${email || phone}`}
              {authMode === 'reset_new_password' && 'Enter a secure new password for your account'}
            </p>
          </div>

          {/* Google Sign In & 1-Click Demo Buttons (Visible on Signin & Signup) */}
          {(authMode === 'signin' || authMode === 'signup') && (
            <div className="space-y-2 pt-1">
              {/* Google Sign In Button */}
              <button
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                type="button"
                className="w-full bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-bold p-3 rounded-2xl flex items-center justify-center space-x-3 text-xs transition-all shadow-sm hover:shadow"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Continue with Google</span>
              </button>

              {/* 1-Click Demo VIP Login Button */}
              <button
                onClick={handleDemoSignIn}
                type="button"
                className="w-full bg-gradient-to-r from-blue-50 via-indigo-50 to-blue-50 border border-blue-200 hover:border-blue-300 text-blue-700 p-2.5 rounded-2xl flex items-center justify-between text-xs font-bold transition-all shadow-sm group"
              >
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>1-Click Demo VIP Login ({DEMO_USER.name})</span>
                </div>
                <ArrowRight className="w-4 h-4 text-blue-600 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          )}

          {/* Divider */}
          {(authMode === 'signin' || authMode === 'signup') && (
            <div className="relative flex items-center justify-center">
              <div className="border-t border-slate-200 w-full" />
              <span className="bg-white px-3 text-[10px] font-bold uppercase text-slate-400 shrink-0">
                {authMode === 'signin' ? 'or sign in with email & password' : 'or register with email & phone'}
              </span>
            </div>
          )}

          {/* --- SIGN IN FORM --- */}
          {authMode === 'signin' && (
            <form onSubmit={handleSignInSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email or Phone</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="shaniumar87@gmail.com"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-700">Password</label>
                  <button
                    type="button"
                    onClick={() => setAuthMode('forgot_password')}
                    className="text-[11px] text-blue-600 font-bold hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-10 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-0.5">
                <label className="flex items-center space-x-2 text-slate-600 font-semibold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                  <span>Remember me on this browser</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-full shadow-md shadow-blue-600/20 text-xs transition-all flex items-center justify-center space-x-2"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Sign In to UmarMart</span>}
              </button>
            </form>
          )}

          {/* --- SIGN UP FORM --- */}
          {authMode === 'signup' && (
            <form onSubmit={handleInitiateSignup} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Umar Shani"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="shaniumar87@gmail.com"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Mobile Phone (+92 Pakistan)</label>
                <div className="relative">
                  <Smartphone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+92 315 2643791"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-10 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {password && (
                  <div className="mt-2 space-y-1">
                    <div className="flex items-center justify-between text-[10px] text-slate-500 font-bold">
                      <span>Password Strength</span>
                      <span className="text-slate-700">{strength.text}</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden flex">
                      <div
                        className={`h-full ${strength.color} transition-all duration-300`}
                        style={{ width: `${(strength.level / 3) * 100}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-full shadow-md shadow-blue-600/20 text-xs transition-all flex items-center justify-center space-x-2"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Sign Up & Verify Email →</span>}
              </button>
            </form>
          )}

          {/* --- FORGOT PASSWORD FORM --- */}
          {authMode === 'forgot_password' && (
            <form onSubmit={handleInitiateForgotPassword} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Registered Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="shaniumar87@gmail.com"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-full shadow-md shadow-blue-600/20 text-xs transition-all flex items-center justify-center space-x-2"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Send Password Reset Link & OTP</span>}
              </button>
            </form>
          )}

          {/* --- OTP VERIFICATION FORM --- */}
          {authMode === 'otp_verify' && (
            <form onSubmit={handleVerifyOtpSubmit} className="space-y-4">
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3 text-center space-y-1 text-emerald-950 text-xs">
                <span className="font-bold flex items-center justify-center gap-1 text-emerald-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  6-Digit Email Verification Code Dispatched
                </span>
                <p className="text-[11px] text-emerald-700">
                  Please enter the code sent to <strong>{email || phone}</strong>.
                </p>
              </div>

              {/* OTP Digits Grid */}
              <div className="flex justify-between gap-2">
                {otpDigits.map((digit, idx) => (
                  <input
                    key={idx}
                    id={`otp-input-${idx}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpInputChange(idx, e.target.value)}
                    className="w-11 h-12 text-center text-lg font-black text-slate-900 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-emerald-600 focus:bg-white shadow-xs"
                  />
                ))}
              </div>

              {/* Quick Auto-Fill Demo OTP Button */}
              <div className="flex items-center justify-between text-xs pt-1">
                <button
                  type="button"
                  onClick={handleAutoFillDemoOtp}
                  className="text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 font-bold px-3 py-1 rounded-lg text-[11px] transition-colors"
                >
                  ⚡ Auto-fill Code (482195)
                </button>

                {otpResendTimer > 0 ? (
                  <span className="text-[11px] font-semibold text-slate-400">
                    Resend code in {otpResendTimer}s
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    className="text-blue-600 font-bold text-[11px] hover:underline flex items-center space-x-1"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Resend OTP</span>
                  </button>
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-full shadow-md shadow-emerald-600/20 text-xs transition-all flex items-center justify-center space-x-2"
              >
                <Check className="w-4 h-4" />
                <span>Verify OTP & Complete Sign Up</span>
              </button>
            </form>
          )}

          {/* --- SET NEW PASSWORD FORM --- */}
          {authMode === 'reset_new_password' && (
            <form onSubmit={handleSetNewPasswordSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">New Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password (min 6 chars)"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-full shadow-md shadow-blue-600/20 text-xs transition-all flex items-center justify-center space-x-2"
              >
                <span>Save New Password & Sign In</span>
              </button>
            </form>
          )}

          {/* Bottom toggle options */}
          <div className="text-center text-xs text-slate-500 border-t border-slate-100 pt-3">
            {authMode === 'signin' && (
              <div>
                <span>Don't have a VIP account?</span>{' '}
                <button
                  onClick={() => setAuthMode('signup')}
                  className="text-blue-600 font-bold hover:underline"
                >
                  Register VIP Account
                </button>
              </div>
            )}

            {authMode === 'signup' && (
              <div>
                <span>Already registered?</span>{' '}
                <button
                  onClick={() => setAuthMode('signin')}
                  className="text-blue-600 font-bold hover:underline"
                >
                  Sign In
                </button>
              </div>
            )}

            {(authMode === 'forgot_password' || authMode === 'otp_verify' || authMode === 'reset_new_password') && (
              <button
                onClick={() => setAuthMode('signin')}
                className="text-blue-600 font-bold hover:underline"
              >
                ← Back to Sign In
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

