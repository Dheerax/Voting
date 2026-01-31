import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import * as faceapi from 'face-api.js';

const RegistrationPage = () => {
  const [formData, setFormData] = useState({ name: '', aadhaarNumber: '', phoneNumber: '' });
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const startCamera = async () => {
    setIsCameraOpen(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: {} });
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (err) {
      console.error(err);
      alert('Could not access camera');
    }
  };

  const capturePhoto = async () => {
    if (!videoRef.current || !canvasRef.current) return;
    const context = canvasRef.current.getContext('2d');
    if (!context) return;
    
    context.drawImage(videoRef.current, 0, 0, 320, 240);
    const dataUrl = canvasRef.current.toDataURL('image/jpeg');
    setCapturedImage(dataUrl);
    
    // Stop camera
    const stream = videoRef.current.srcObject as MediaStream;
    stream?.getTracks().forEach(track => track.stop());
    setIsCameraOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!capturedImage) return alert('Please capture a photo');
    
    // Validate form fields
    if (!formData.name || !formData.aadhaarNumber || !formData.phoneNumber) {
      alert('Please fill all fields');
      return;
    }
    
    setLoading(true);

    try {
      // Create FormData
      // Convert DataURL to Blob
      const res = await fetch(capturedImage);
      const blob = await res.blob();
      const faceFile = new File([blob], "face.jpg", { type: "image/jpeg" });

      // Mock Face Descriptor for now (Since face-api models need to be loaded)
      // In production, load models here and detect
      const mockDescriptor = JSON.stringify(new Array(128).fill(0.1));

      const payload = new FormData();
      payload.append('name', formData.name);
      payload.append('aadhaarNumber', formData.aadhaarNumber);
      payload.append('phoneNumber', formData.phoneNumber);
      payload.append('faceImage', faceFile);
      payload.append('faceDescriptor', mockDescriptor);

      console.log('Sending registration data:', {
        name: formData.name,
        aadhaarNumber: formData.aadhaarNumber,
        phoneNumber: formData.phoneNumber,
        hasImage: !!faceFile,
        descriptorLength: mockDescriptor.length
      });

      // Don't set Content-Type header - let axios set it with boundary
      const response = await axios.post('http://localhost:5000/api/auth/register', payload);
      
      console.log('Registration response:', response.data);
      alert('Registration Successful!');
      navigate('/login');
    } catch (err: any) {
      console.error('Registration error:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Registration failed';
      console.error('Error details:', err.response?.data);
      alert(`Registration failed: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  function itemsCamera() {
    return isCameraOpen ? (
        <div className="relative overflow-hidden rounded-xl border border-cyan-500/30">
          <video ref={videoRef} autoPlay muted className="w-full object-cover" />
          <canvas ref={canvasRef} width="320" height="240" className="hidden" />
          <div className="absolute bottom-4 left-0 right-0 flex justify-center">
            <button type="button" onClick={capturePhoto} className="w-12 h-12 bg-white rounded-full border-4 border-cyan-500 flex items-center justify-center transform hover:scale-110 transition-transform shadow-[0_0_20px_rgba(6,182,212,0.5)]"></button>
          </div>
          <div className="absolute top-2 right-2 flex gap-1">
             <span className="px-2 py-0.5 bg-red-500 text-white text-[10px] uppercase font-bold rounded animate-pulse">Live</span>
          </div>
        </div>
      ) : (
        <button type="button" onClick={startCamera} className="w-full py-12 border-2 border-dashed border-slate-700 rounded-xl text-slate-400 hover:border-cyan-500 hover:text-cyan-400 hover:bg-cyan-500/5 transition-all flex flex-col items-center gap-2 group">
          <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center group-hover:bg-cyan-500/20 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <span>Open Camera</span>
        </button>
      )
  }

  return (
    <div className="flex justify-center items-center md:py-10">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }} 
        animate={{ opacity: 1, scale: 1 }} 
        className="glass-card w-full max-w-lg p-8 rounded-3xl relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600" />
        
        <h2 className="text-3xl font-bold mb-2 text-center bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">Identity Registration</h2>
        <p className="text-slate-400 text-center mb-8 text-sm">Secure your vote on the Blockchain</p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-cyan-400 uppercase tracking-wider ml-1 mb-1 block">Full Name</label>
              <input 
                name="name" 
                type="text" 
                className="input-field"
                placeholder="Ex. John Doe"
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-cyan-400 uppercase tracking-wider ml-1 mb-1 block">Aadhaar Number</label>
              <input 
                name="aadhaarNumber" 
                type="text" 
                className="input-field"
                placeholder="xxxx xxxx xxxx"
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-cyan-400 uppercase tracking-wider ml-1 mb-1 block">Phone Number</label>
              <input 
                name="phoneNumber" 
                type="text" 
                className="input-field"
                placeholder="+91 xxxxx xxxxx"
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="bg-slate-950/30 rounded-2xl p-4 border border-white/5">
            <label className="text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-3 block text-center">Biometric Verification</label>
            {capturedImage ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative group">
                  <img src={capturedImage} alt="Captured" className="rounded-xl w-full object-cover border-2 border-cyan-500/50 shadow-lg shadow-cyan-500/20" />
                  <button type="button" onClick={() => setCapturedImage(null)} className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white font-medium transition-all rounded-xl backdrop-blur-sm">
                    Retake Photo
                  </button>
              </motion.div>
            ) : (
              itemsCamera()
            )}
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="btn-primary"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : 'Complete Registration'}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
export default RegistrationPage;