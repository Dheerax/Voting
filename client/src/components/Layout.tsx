import { Outlet, Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const Layout = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen relative">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-500/10 rounded-full blur-[120px]" />
      </div>

      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-slate-950/50 backdrop-blur-md"
      >
        <div className="container mx-auto px-6 h-20 flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-white group-hover:scale-110 transition-transform">
              V
            </div>
            <span className="bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">SecureVote</span>
          </Link>
          <div className="flex bg-slate-900/50 p-1 rounded-full border border-white/5">
            {[
               { path: '/', label: 'Register' },
               { path: '/login', label: 'Login' }
            ].map((link) => (
              <Link 
                key={link.path}
                to={link.path} 
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                  location.pathname === link.path 
                    ? 'bg-slate-800 text-white shadow-lg' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </motion.nav>

      <main className="container mx-auto px-6 pt-32 pb-12 relative z-10">
        <Outlet />
      </main>

      <footer className="relative z-10 py-8 text-center text-slate-600 text-sm border-t border-white/5">
        <p>Built for the Future of Democracy. Powered by Blockchain.</p>
      </footer>
    </div>
  );
};

export default Layout;
