import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router";

function LoginView() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <header className="flex items-center px-6 py-4 border-b border-slate-800">
        <span className="text-white font-bold text-lg tracking-tight">Thorongil</span>
      </header>
      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <h1 className="text-2xl font-bold text-white mb-1">Accedi</h1>
          <p className="text-slate-400 text-sm mb-8">Inserisci le tue credenziali per continuare.</p>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-lg">
                {error}
              </div>
            )}
            <div className="flex flex-col gap-1.5">
              <label className="text-slate-300 text-sm font-medium" htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                required
                autoFocus
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2.5 text-sm outline-none focus:border-blue-500 transition-colors placeholder:text-slate-500"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-slate-300 text-sm font-medium" htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2.5 text-sm outline-none focus:border-blue-500 transition-colors placeholder:text-slate-500"
              />
            </div>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-500 text-white font-medium py-2.5 rounded-lg text-sm transition-colors mt-2"
            >
              Accedi
            </button>
          </form>
          <p className="text-slate-500 text-sm text-center mt-6">
            Non hai un account?{" "}
            <a href="/register" className="text-blue-400 hover:text-blue-300 transition-colors">Registrati</a>
          </p>
        </div>
      </main>
    </div>
  );
}

export default LoginView;
