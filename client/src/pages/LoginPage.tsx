import React, { useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [aadhaarNumber, setAadhaarNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'aadhaar' | 'otp'>('aadhaar');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('http://localhost:5000/api/auth/send-otp', { aadhaarNumber });
      setStep('otp');
      alert(`OTP Sent! (Mock: Check server console)`);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/auth/verify-otp', { aadhaarNumber, otp });
      const { token, user } = res.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      navigate('/vote');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card w-full max-w-md p-8 rounded-3xl"
      >
        <h2 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Voter Login</h2>
        
        {step === 'aadhaar' ? (
          <form onSubmit={handleSendOtp} className="space-y-6">
            <div>
              <label className="text-xs font-semibold text-cyan-400 uppercase tracking-wider ml-1 mb-1 block">Aadhaar Number</label>
              <input
                type="text"
                value={aadhaarNumber}
                onChange={(e) => setAadhaarNumber(e.target.value)}
                className="input-field"
                placeholder="Enter your Aadhaar Number"
                required
              />
            </div>
            <button 
              type="submit" 
              disabled={loading}
              className="btn-primary"
            >
              {loading ? 'Sending OTP...' : 'Send OTP'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-8">
            <div className="text-center">
               <p className="text-slate-400 text-sm mb-2">OTP sent to registered mobile linked to</p>
               <div className="text-cyan-400 font-mono text-lg bg-cyan-500/10 inline-block px-3 py-1 rounded-lg">{aadhaarNumber}</div>
            </div>
            
            <div>
              <label className="block text-center text-slate-500 text-xs uppercase tracking-widest mb-4">Enter Verification Code</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700/50 rounded-2xl p-4 text-white text-center text-4xl tracking-[1em] font-mono focus:outline-none focus:border-cyan-500/50 focus:shadow-[0_0_30px_rgba(6,182,212,0.15)] transition-all"
                placeholder="••••"
                maxLength={4}
                required
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-4 rounded-xl font-bold text-white bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 shadow-lg shadow-green-500/20 transform hover:scale-[1.02] transition-all"
            >
              {loading ? 'Verifying...' : 'Secure Login'}
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
};

export default LoginPage;
