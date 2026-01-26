import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
// import * as faceapi from 'face-api.js';

interface Props {
    onSuccess: () => void;
    onCancel: () => void;
    userFaceDescriptor: number[];
}

const FaceAuthStep: React.FC<Props> = ({ onSuccess, onCancel, userFaceDescriptor }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [status, setStatus] = useState('Initializing camera...');
    const [progress, setProgress] = useState(0);

    const startVideo = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: {} });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
            setStatus('Please look at the camera. Verifying...');
            
            // Mock verification process for now
            // In real app: loop detectFace, extract descriptor, distance(current, registered) < 0.6
            simulateVerification();
        } catch (err) {
            console.error("Camera Error:", err);
            setStatus("Camera access failed");
        }
    };

    const simulateVerification = () => {
        let p = 0;
        const interval = setInterval(() => {
            p += 10;
            setProgress(p);
            
            // Random Challenges
            if (p === 30) setStatus('Turn your head slightly to the left.');
            if (p === 60) setStatus('Smile!');
            if (p === 80) setStatus('Blink your eyes.');

            if (p >= 100) {
                clearInterval(interval);
                setStatus('Verified!');
                setTimeout(onSuccess, 1000);
            }
        }, 500);
    };

    useEffect(() => {
        startVideo();
        return () => {
            if (videoRef.current && videoRef.current.srcObject) {
                const stream = videoRef.current.srcObject as MediaStream;
                stream.getTracks().forEach(track => track.stop());
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
            <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="glass-card p-8 rounded-3xl max-w-sm w-full relative"
            >
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 via-amber-500 to-green-500" />
                
                <h3 className="text-xl font-bold mb-6 text-center text-white">Liveness Check</h3>
                
                <div className="relative mb-6 rounded-2xl overflow-hidden border-2 border-cyan-500/30 shadow-[0_0_30px_rgba(6,182,212,0.2)]">
                    <video ref={videoRef} autoPlay muted className="w-full aspect-video object-cover" />
                    
                    {/* Face Scannner Overlay */}
                    <div className="absolute inset-0 border-2 border-cyan-400/30 rounded-2xl m-4">
                         <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-cyan-400"></div>
                         <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-cyan-400"></div>
                         <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-cyan-400"></div>
                         <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-cyan-400"></div>
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-slate-800">
                        <motion.div 
                            className="h-full bg-gradient-to-r from-cyan-500 to-blue-500" 
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                        />
                    </div>
                </div>

                <div className="text-center bg-slate-950/50 p-4 rounded-xl border border-white/5 mb-6">
                   <p className="text-cyan-400 font-medium animate-pulse">{status}</p>
                </div>

                <div className="flex gap-3">
                   <button onClick={onCancel} className="flex-1 py-3 rounded-xl font-semibold text-slate-400 hover:bg-white/5 transition-colors">Cancel</button>
                </div>
            </motion.div>
        </div>
    );
};

export default FaceAuthStep;
