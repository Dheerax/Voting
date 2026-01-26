import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ethers } from 'ethers';
import { useNavigate } from 'react-router-dom';
import FaceAuthStep from '../components/FaceAuthStep';
import contractConfig from '../contractConfig.json';

interface Candidate {
  id: number;
  name: string;
  voteCount: number;
}

const VotingPage = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasVoted, setHasVoted] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<number | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  // Hardhat Provider
  // In a real app, use window.ethereum (MetaMask)
  const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545"); 
  // We need a signer. In Hardhat, we can use the first account.
  // BUT the user in the browser doesn't have the private key unless we uses MetaMask.
  // For this demo, assuming local hardhat network, we'll pick a random account from the node to simulate users.
  // In production, user connects wallet.
  
  useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate('/login');
      return;
    }
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    try {
      const contract = new ethers.Contract(contractConfig.address, contractConfig.abi, provider);
      const data = await contract.getAllCandidates();
      
      const formatted = data.map((c: any) => ({
        id: Number(c.id),
        name: c.name,
        voteCount: Number(c.voteCount)
      }));
      setCandidates(formatted);

      // Check if voted? 
      // Need a signer address to check mapping(address => bool) voters.
      // Since we don't have a wallet connection flow here, we'll check localStorage or just let the contract revert.
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const initiateVote = (id: number) => {
    setSelectedCandidate(id);
    setIsAuthModalOpen(true);
  };

  const handleFaceAuthSuccess = async () => {
    setIsAuthModalOpen(false);
    if (selectedCandidate === null) return;

    try {
      setLoading(true);
      // Get a signer. For demo, we use the first account from Hardhat node.
      // Ideally, each user has their own wallet.
      const signer = await provider.getSigner(); 
      const contract = new ethers.Contract(contractConfig.address, contractConfig.abi, signer);

      const tx = await contract.vote(selectedCandidate);
      await tx.wait();
      
      alert('Vote cast successfully!');
      setHasVoted(true);
      fetchCandidates();
    } catch (err: any) {
      console.error(err);
      alert('Voting failed: ' + (err.reason || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <header className="flex flex-col md:flex-row justify-between items-end mb-12 border-b border-white/5 pb-6">
        <div>
           <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent mb-2">Election 2026</h1>
           <p className="text-slate-400">Welcome, <span className="text-white font-semibold">{user.name}</span></p>
        </div>
        <div className={`mt-4 md:mt-0 px-6 py-2 rounded-full border flex items-center gap-3 backdrop-blur-md ${hasVoted ? 'bg-green-500/10 border-green-500/50 text-green-400' : 'bg-amber-500/10 border-amber-500/50 text-amber-400'}`}>
            <span className={`w-2 h-2 rounded-full ${hasVoted ? 'bg-green-500 animate-pulse' : 'bg-amber-500'}`}></span>
            {hasVoted ? 'Vote Casted Successfully' : 'Action Required: Cast Vote'}
        </div>
      </header>

      {loading && (
        <div className="flex justify-center py-20">
           <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
        </div>
      )}
      
      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {candidates.map((candidate) => (
            <motion.div 
              key={candidate.id}
              whileHover={{ y: -5 }}
              className={`glass-card p-6 rounded-3xl border transition-all relative overflow-hidden group ${selectedCandidate === candidate.id ? 'border-cyan-500/50 shadow-[0_0_30px_rgba(6,182,212,0.15)]' : 'border-white/5 hover:border-white/10'}`}
            >
              <div className="absolute top-0 right-0 p-4 opacity-50 text-6xl font-black text-slate-800 pointer-events-none group-hover:opacity-20 transition-opacity">
                {String(candidate.id).padStart(2, '0')}
              </div>
              
              <div className="relative z-10">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 mb-6 flex items-center justify-center text-2xl border border-white/5 shadow-inner">
                   {candidate.name.charAt(0)}
                </div>
                
                <h3 className="text-2xl font-bold mb-2 group-hover:text-cyan-400 transition-colors">{candidate.name}</h3>
                
                <div className="mb-8 p-4 bg-slate-950/50 rounded-2xl border border-white/5">
                  <div className="text-slate-500 text-xs uppercase tracking-wider mb-1">Live Count</div>
                  <div className="text-3xl font-mono text-white tracking-tight flex items-center gap-2">
                    {candidate.voteCount}
                    <span className="text-xs text-slate-600 font-sans font-normal py-1 px-2 bg-slate-900 rounded-lg">Votes</span>
                  </div>
                </div>

                <button
                  onClick={() => initiateVote(candidate.id)}
                  disabled={hasVoted}
                  className={`w-full py-4 rounded-xl font-bold transition-all ${
                        hasVoted 
                            ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700' 
                            : 'bg-white text-slate-950 hover:bg-cyan-400 hover:text-white hover:shadow-[0_0_20px_rgba(6,182,212,0.4)]'
                    }`}
                >
                  {hasVoted ? 'Voted' : 'Vote Candidate'}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {isAuthModalOpen && (
        <FaceAuthStep 
            onSuccess={handleFaceAuthSuccess} 
            onCancel={() => setIsAuthModalOpen(false)} 
            userFaceDescriptor={user.faceDescriptor}
        />
      )}
    </div>
  );
};

export default VotingPage;
