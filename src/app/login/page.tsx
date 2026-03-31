"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Music, ArrowRight, Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth.hook";
import { motion } from "framer-motion";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const result = await login(email, password);
    
    if (result.success) {
      router.push("/");
    } else {
      setError(result.message || "Credenciais inválidas");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020202] flex items-center justify-center px-6 py-12">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-lg h-[400px] bg-yellow-500/5 blur-[120px] rounded-full pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center gap-2.5 mb-8 group">
            <div className="w-10 h-10 bg-yellow-500 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105">
              <Music className="w-6 h-6 text-black" strokeWidth={2.5} />
            </div>
            <span className="text-2xl font-bold font-outfit tracking-tight text-white">Harmoniq</span>
          </Link>
          <h1 className="text-3xl font-semibold font-outfit text-white mb-2 tracking-tight">Bem-vindo de volta</h1>
          <p className="text-zinc-500 font-medium">Faça login para acessar seus repertórios</p>
        </div>

        <div className="bg-zinc-900/40 backdrop-blur-xl border border-white/5 rounded-2xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-center gap-3 text-red-500 text-sm font-medium animate-in fade-in slide-in-from-top-2">
                <AlertCircle className="w-5 h-5 shrink-0" />
                {error}
              </div>
            )}
            
            <div className="space-y-2">
              <label className="text-[13px] font-semibold text-zinc-400 uppercase tracking-widest ml-1">E-mail</label>
              <input 
                type="email" 
                required
                className="w-full bg-zinc-900/50 border border-white/5 rounded-xl px-4 py-3 text-white outline-none focus:border-yellow-500/50 focus:ring-1 focus:ring-yellow-500/20 transition-all placeholder:text-zinc-700"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-[13px] font-semibold text-zinc-400 uppercase tracking-widest">Senha</label>
                <Link href="#" className="text-[11px] font-bold text-yellow-500/60 hover:text-yellow-500 transition-colors uppercase tracking-wider">Esqueceu a senha?</Link>
              </div>
              <input 
                type="password" 
                required
                className="w-full bg-zinc-900/50 border border-white/5 rounded-xl px-4 py-3 text-white outline-none focus:border-yellow-500/50 focus:ring-1 focus:ring-yellow-500/20 transition-all placeholder:text-zinc-700"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full h-12 bg-yellow-500 hover:bg-yellow-400 text-black font-bold text-base rounded-xl transition-all shadow-xl shadow-yellow-500/10 flex items-center justify-center gap-2 group"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>Entrar <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></>
              )}
            </Button>
          </form>

          <div className="mt-8 pt-8 border-t border-white/5 text-center">
            <p className="text-zinc-500 text-sm font-medium">
              Não tem uma conta?{" "}
              <Link href="/register" className="text-yellow-500 hover:text-yellow-400 font-bold transition-colors">
                Criar conta gratuitamente
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
