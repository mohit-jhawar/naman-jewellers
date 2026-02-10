import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RegisterPage: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [step, setStep] = useState<'register' | 'otp'>('register');
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { requestOtp, verifyOtp } = useAuth();

    const handleRegisterSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (password.length < 4) {
            setError('Password must be at least 4 characters');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setIsLoading(true);
        const result = await requestOtp(username, password);
        setIsLoading(false);

        if (result.success) {
            setStep('otp');
            setSuccessMsg('OTP has been sent to the admin for verification.');
        } else {
            setError(result.message || 'Registration failed');
        }
    };

    const handleOtpSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (otp.length !== 6) {
            setError('Please enter a valid 6-digit OTP');
            return;
        }

        setIsLoading(true);
        const result = await verifyOtp(username, otp);
        setIsLoading(false);

        if (result.success) {
            navigate('/home');
        } else {
            setError(result.message || 'Verification failed');
        }
    };

    const handleResendOtp = async () => {
        setError('');
        setSuccessMsg('');
        setIsLoading(true);
        const result = await requestOtp(username, password);
        setIsLoading(false);

        if (result.success) {
            setSuccessMsg('A new OTP has been sent.');
        } else {
            setError(result.message || 'Failed to resend OTP');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gold-900 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(235,162,11,0.1),transparent_50%)]"></div>

            <div className="relative w-full max-w-md">
                {/* Logo and Branding */}
                <div className="text-center mb-8">
                    <img
                        src="/logo.png"
                        alt="Naman Jewellers"
                        className="w-64 h-auto mx-auto mb-4 drop-shadow-2xl"
                    />
                    <p className="text-gray-400 text-lg">Luxury Jewelry Management</p>
                </div>

                {/* Register Card */}
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20">
                    {step === 'register' ? (
                        <>
                            <h2 className="text-3xl font-display font-bold text-white mb-6 text-center">
                                Create Account
                            </h2>

                            <form onSubmit={handleRegisterSubmit} className="space-y-5">
                                <div>
                                    <label htmlFor="username" className="block text-sm font-semibold text-gray-300 mb-2">
                                        Username
                                    </label>
                                    <input
                                        id="username"
                                        type="text"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent transition-all duration-200"
                                        placeholder="Choose a username"
                                        required
                                    />
                                </div>

                                <div>
                                    <label htmlFor="password" className="block text-sm font-semibold text-gray-300 mb-2">
                                        Password
                                    </label>
                                    <input
                                        id="password"
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent transition-all duration-200"
                                        placeholder="Create a password"
                                        required
                                        minLength={4}
                                    />
                                </div>

                                <div>
                                    <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-300 mb-2">
                                        Confirm Password
                                    </label>
                                    <input
                                        id="confirmPassword"
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent transition-all duration-200"
                                        placeholder="Confirm your password"
                                        required
                                    />
                                </div>

                                {error && (
                                    <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg text-sm">
                                        {error}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full bg-gradient-gold text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:opacity-60 disabled:hover:scale-100"
                                >
                                    {isLoading ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                            </svg>
                                            Sending OTP...
                                        </span>
                                    ) : 'Send OTP'}
                                </button>
                            </form>
                        </>
                    ) : (
                        <>
                            <h2 className="text-3xl font-display font-bold text-white mb-2 text-center">
                                Verify OTP
                            </h2>
                            <p className="text-gray-400 text-sm text-center mb-6">
                                Ask the admin for the OTP sent to their email
                            </p>

                            {successMsg && (
                                <div className="bg-green-500/20 border border-green-500/50 text-green-200 px-4 py-3 rounded-lg text-sm mb-4">
                                    {successMsg}
                                </div>
                            )}

                            <form onSubmit={handleOtpSubmit} className="space-y-5">
                                <div>
                                    <label htmlFor="otp" className="block text-sm font-semibold text-gray-300 mb-2">
                                        Enter 6-digit OTP
                                    </label>
                                    <input
                                        id="otp"
                                        type="text"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                        className="w-full px-4 py-4 bg-white/5 border border-white/20 rounded-lg text-white text-center text-2xl tracking-[0.5em] font-bold placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent transition-all duration-200"
                                        placeholder="000000"
                                        maxLength={6}
                                        required
                                        autoFocus
                                    />
                                </div>

                                {error && (
                                    <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg text-sm">
                                        {error}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={isLoading || otp.length !== 6}
                                    className="w-full bg-gradient-gold text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:opacity-60 disabled:hover:scale-100"
                                >
                                    {isLoading ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                            </svg>
                                            Verifying...
                                        </span>
                                    ) : 'Verify & Create Account'}
                                </button>

                                <button
                                    type="button"
                                    onClick={handleResendOtp}
                                    disabled={isLoading}
                                    className="w-full text-gold-400 text-sm font-semibold hover:text-gold-300 transition-colors disabled:opacity-50"
                                >
                                    Resend OTP
                                </button>

                                <button
                                    type="button"
                                    onClick={() => { setStep('register'); setError(''); setSuccessMsg(''); setOtp(''); }}
                                    className="w-full text-gray-500 text-sm hover:text-gray-300 transition-colors"
                                >
                                    ← Back to Registration
                                </button>
                            </form>
                        </>
                    )}

                    <div className="mt-6 text-center">
                        <p className="text-gray-400 text-sm">
                            Already have an account?{' '}
                            <Link to="/" className="text-gold-400 font-semibold hover:text-gold-300 transition-colors">
                                Sign In
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Decorative elements */}
                <div className="absolute -top-4 -left-4 w-24 h-24 bg-gold-500/20 rounded-full blur-2xl"></div>
                <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-gold-400/20 rounded-full blur-2xl"></div>
            </div>
        </div>
    );
};

export default RegisterPage;
