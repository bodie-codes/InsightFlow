'use client';
import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { SessionProvider, signIn, signOut, useSession } from 'next-auth/react';

export default function Page() {
  return (
    <SessionProvider>
      <App />
    </SessionProvider>
  );
}

/* ---------- Decides which screen to show ---------- */

function App() {
  const { status } = useSession();
  const [demoMode, setDemoMode] = useState(false);

  // A link ending with ?demo=1 opens the demo directly
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('demo') === '1') setDemoMode(true);
  }, []);

  const startDemo = () => {
    setDemoMode(true);
    window.history.replaceState(null, '', '/?demo=1');
    window.scrollTo({ top: 0 });
  };

  const exitDemo = () => {
    setDemoMode(false);
    window.history.replaceState(null, '', '/');
    window.scrollTo({ top: 0 });
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA] text-slate-400 font-medium tracking-wide">
        Loading workspace...
      </div>
    );
  }

  if (status === 'authenticated') return <Dashboard isDemo={false} />;
  if (demoMode) return <Dashboard isDemo onExitDemo={exitDemo} />;
  return <Landing onTryDemo={startDemo} />;
}

/* ---------- Shared pieces ---------- */

function Logo({ size = 'text-xl' }: { size?: string }) {
  return (
    <span className={size}>
      <span className="font-extrabold tracking-tight">Insight</span>
      <span className="font-light text-slate-500">Flow</span>
    </span>
  );
}

function GitHubIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 .5C5.65.5.5 5.65.5 12a11.5 11.5 0 0 0 7.86 10.92c.58.1.79-.25.79-.56v-2c-3.2.7-3.87-1.37-3.87-1.37-.53-1.34-1.29-1.7-1.29-1.7-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.71 1.26 3.37.96.1-.75.4-1.26.73-1.55-2.56-.29-5.25-1.28-5.25-5.69 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.47.11-3.06 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.77.11 3.06.74.81 1.19 1.84 1.19 3.1 0 4.42-2.7 5.39-5.27 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
    </svg>
  );
}

/* ---------- Landing page (signed-out visitors) ---------- */

function Landing({ onTryDemo }: { onTryDemo: () => void }) {
  const steps = [
    {
      number: '01',
      title: 'Upload your reviews',
      text: 'Export reviews from any platform as a CSV file. InsightFlow finds the review column automatically.',
    },
    {
      number: '02',
      title: 'AI reads every review',
      text: 'A large language model analyzes up to 50 reviews and measures how your customers really feel.',
    },
    {
      number: '03',
      title: 'Know what to fix first',
      text: 'Get the most critical pain points and concrete recommended actions your team can act on today.',
    },
  ];

  return (
    <main className="min-h-screen bg-[#FAFAFA] text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Logo />
          <button
            onClick={() => signIn('github')}
            className="text-sm text-slate-600 hover:text-slate-900 transition-colors font-medium cursor-pointer"
          >
            Sign in
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 pt-20 pb-16 text-center">
        <span className="inline-flex items-center gap-2 text-xs font-semibold text-indigo-700 bg-indigo-50 border border-indigo-100 px-3 py-1.5 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
          AI-powered review analytics
        </span>

        <h1 className="mt-6 text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.05]">
          Turn customer reviews
          <br />
          <span className="text-indigo-600">into decisions.</span>
        </h1>

        <p className="mt-6 text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
          Upload a CSV of customer reviews. InsightFlow uses AI to measure sentiment,
          surface the biggest pain points and recommend what to fix first, in seconds.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={onTryDemo}
            className="w-full sm:w-auto bg-indigo-600 text-white px-8 py-4 rounded-2xl font-semibold hover:bg-indigo-700 transition-all shadow-sm hover:shadow-md cursor-pointer"
          >
            Try live demo →
          </button>
          <button
            onClick={() => signIn('github')}
            className="w-full sm:w-auto bg-white text-slate-900 px-8 py-4 rounded-2xl font-semibold border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <GitHubIcon />
            Sign in with GitHub
          </button>
        </div>

        <p className="mt-4 text-xs text-slate-400">No sign-up needed for the demo.</p>
      </section>

      {/* How it works */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <h2 className="text-center text-xs font-semibold tracking-[0.25em] text-slate-400 uppercase mb-8">
          How it works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((step) => (
            <div
              key={step.number}
              className="bg-white p-8 rounded-3xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-slate-100"
            >
              <span className="text-sm font-bold text-indigo-600">{step.number}</span>
              <h3 className="mt-3 text-lg font-semibold text-slate-900">{step.title}</h3>
              <p className="mt-2 text-sm text-slate-500 leading-relaxed">{step.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <span>
            Built by <span className="font-semibold text-slate-600">Bodie Codes</span>
          </span>
          <span>Next.js · TypeScript · PostgreSQL · Prisma · Groq LLM</span>
        </div>
      </footer>
    </main>
  );
}

/* ---------- Dashboard (signed-in users and demo visitors) ---------- */

function Dashboard({ isDemo, onExitDemo }: { isDemo: boolean; onExitDemo?: () => void }) {
  const { data: session, status } = useSession();
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);

  // The server knows who is signed in, so we don't send any user id
  const fetchHistory = async () => {
    if (isDemo) return;
    try {
      const res = await fetch('/api/history', { cache: 'no-store' });
      const data = await res.json();
      if (data.success) {
        setHistory(data.data);
      }
    } catch (err) {
      console.error('Error fetching analysis history.');
    }
  };

  useEffect(() => {
    if (!isDemo && status === 'authenticated') fetchHistory();
  }, [status, isDemo]);

  const processUpload = async (fileToUpload: File) => {
    setLoading(true);
    const formData = new FormData();
    formData.append('file', fileToUpload);

    try {
      const res = await fetch('/api/analyze', { method: 'POST', body: formData });
      const data = await res.json();
      if (res.ok && data.success && data.data) {
        setResult(data.data);
        fetchHistory();
      } else {
        alert(data.error || 'Failed to analyze the dataset.');
      }
    } catch (err) {
      alert('Error uploading file.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    await processUpload(file);
  };

  const handleSampleUpload = async () => {
    const sampleCsvContent = `id,Review,Rating
1,"The product arrived extremely fast, packaging was solid, and performance exceeded my expectations!",5
2,"Shipping took over two weeks, the package was dented, and customer support did not respond for days.",1
3,"Great build quality for the price. Very satisfied with overall durability.",5
4,"Software setup was confusing and crashed twice during installation. Needs better documentation.",2
5,"Clean interface and intuitive layout. Highly recommended for modern engineering teams.",5
6,"Average experience. Does what it advertises, but battery life could be improved.",3
7,"The item stopped working after two days of light usage. Requesting a full refund.",1
8,"Superb customer service! They resolved my account issue within ten minutes.",5`;

    const blob = new Blob([sampleCsvContent], { type: 'text/csv;charset=utf-8;' });
    const sampleFile = new File([blob], 'sample-ecommerce-reviews.csv', { type: 'text/csv' });

    setFile(sampleFile);
    await processUpload(sampleFile);
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();

    if (!confirm('Are you sure you want to delete this analysis?')) return;

    try {
      const res = await fetch(`/api/history/${id}`, {
        method: 'DELETE',
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setHistory((prev) => prev.filter((item) => item.id !== id));
        if (result?.id === id) {
          setResult(null);
        }
      } else {
        alert(data.error || 'Failed to delete entry.');
      }
    } catch (err) {
      console.error('Delete error:', err);
      alert('Error communicating with server.');
    }
  };

  return (
    <main className="min-h-screen bg-[#FAFAFA] font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-900 pb-20">
      {/* Top Navigation */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <h1>
            <Logo />
          </h1>

          {isDemo ? (
            <div className="flex items-center gap-3">
              <span className="hidden sm:inline text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-100 px-3 py-1.5 rounded-full">
                Demo mode
              </span>
              <button
                onClick={onExitDemo}
                className="text-sm text-slate-500 hover:text-slate-900 transition-colors font-medium cursor-pointer"
              >
                Exit demo
              </button>
              <button
                onClick={() => signIn('github')}
                className="text-sm bg-slate-900 text-white px-4 py-2 rounded-xl font-medium hover:bg-slate-800 transition-all flex items-center gap-2 cursor-pointer"
              >
                <GitHubIcon />
                <span className="hidden sm:inline">Sign in</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-slate-600 bg-slate-100 px-3 py-1.5 rounded-full">
                {session?.user?.name || session?.user?.email}
              </span>
              <button
                onClick={() => signOut()}
                className="text-sm text-slate-500 hover:text-slate-900 transition-colors font-medium cursor-pointer"
              >
                Sign out
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Demo banner */}
      {isDemo && (
        <div className="bg-indigo-50 border-b border-indigo-100">
          <div className="max-w-6xl mx-auto px-6 py-3 text-sm text-indigo-900">
            You're exploring a live demo. Run the sample data or upload your own CSV.
            Demo results aren't kept in a history.{' '}
            <button
              onClick={() => signIn('github')}
              className="font-semibold underline underline-offset-2 hover:text-indigo-700 cursor-pointer"
            >
              Sign in with GitHub
            </button>{' '}
            to save your analyses.
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-6 py-10 space-y-10">

        {/* Upload Zone */}
        <section>
          <div className="mb-4">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">New Analysis</h2>
            <p className="text-slate-500 text-sm mt-1">Upload a customer review CSV export or run instant sample data.</p>
          </div>

          <form onSubmit={handleUpload} className="bg-white p-8 rounded-3xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-slate-100 space-y-4">
            <div className="flex flex-col md:flex-row gap-6 items-center">
              <div className="flex-1 w-full relative">
                <input
                  type="file"
                  accept=".csv"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div className={`w-full border-2 border-dashed rounded-2xl p-6 text-center transition-all ${file ? 'border-indigo-500 bg-indigo-50/50' : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'}`}>
                  <p className="text-sm font-medium text-slate-700">
                    {file ? `Selected: ${file.name}` : 'Click or drag & drop a CSV file'}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">Maximum file size 5MB</p>
                </div>
              </div>

              <button
                type="submit"
                disabled={!file || loading}
                className="w-full md:w-auto md:min-w-[200px] bg-indigo-600 text-white px-8 py-4 rounded-2xl font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:hover:bg-indigo-600 transition-all shadow-sm hover:shadow h-full flex items-center justify-center cursor-pointer"
              >
                {loading ? 'Analyzing reviews...' : 'Run AI Analysis'}
              </button>
            </div>

            {/* 1-Click Sample Demo */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-100/80">
              <span className="text-xs text-slate-400 font-medium">Don't have a CSV file ready?</span>
              <button
                type="button"
                onClick={handleSampleUpload}
                disabled={loading}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100/80 px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 disabled:opacity-50 cursor-pointer group"
              >
                <span>Load sample data</span>
                <svg className="w-3.5 h-3.5 opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </form>
        </section>

        {/* Results Section */}
        {result && (
          <section className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-6">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">Analysis Results</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              <div className="bg-white p-8 rounded-3xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-slate-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center">
                    <span className="text-rose-600 font-bold text-sm">!</span>
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900">Critical Pain Points</h3>
                </div>
                <ul className="space-y-3">
                  {result.topComplaints?.map((c: string, i: number) => (
                    <li key={i} className="flex gap-3 text-slate-700 text-sm leading-relaxed">
                      <span className="text-rose-500 mt-0.5">•</span> {c}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white p-8 rounded-3xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-slate-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                    <span className="text-emerald-600 font-bold text-sm">✓</span>
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900">Recommended Actions</h3>
                </div>
                <ul className="space-y-3">
                  {result.actionItems?.map((a: string, i: number) => (
                    <li key={i} className="flex gap-3 text-slate-700 text-sm leading-relaxed">
                      <span className="text-emerald-500 mt-0.5">•</span> {a}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white p-8 rounded-3xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-slate-100 md:col-span-2">
                <h3 className="text-lg font-semibold text-slate-900 mb-6">Sentiment Breakdown</h3>
                <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Positive', value: result.positivePct || 0, color: '#10b981' },
                          { name: 'Neutral', value: result.neutralPct || 0, color: '#94a3b8' },
                          { name: 'Negative', value: result.negativePct || 0, color: '#f43f5e' }
                        ]}
                        cx="50%"
                        cy="50%"
                        innerRadius={80}
                        outerRadius={100}
                        paddingAngle={2}
                        stroke="none"
                        dataKey="value"
                      >
                        {
                          [
                            { color: '#10b981' },
                            { color: '#94a3b8' },
                            { color: '#f43f5e' }
                          ].map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))
                        }
                      </Pie>
                      <Tooltip
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                        formatter={(value) => `${value} %`}
                      />
                      <Legend iconType="circle" />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* History Section (signed-in users only) */}
        {!isDemo && history.length > 0 && (
          <section className="animate-in fade-in duration-700 space-y-6 pt-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold tracking-tight text-slate-900">Analysis History</h2>
              <span className="text-sm font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                {history.length} {history.length === 1 ? 'record' : 'records'}
              </span>
            </div>

            <div className="bg-white rounded-3xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-slate-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-600">
                  <thead className="bg-slate-50/80 border-b border-slate-100 text-slate-500">
                    <tr>
                      <th className="px-6 py-4 font-medium">File</th>
                      <th className="px-6 py-4 font-medium">Total Reviews</th>
                      <th className="px-6 py-4 font-medium">Positive</th>
                      <th className="px-6 py-4 font-medium">Negative</th>
                      <th className="px-6 py-4 font-medium">Date</th>
                      <th className="px-6 py-4 font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {history.map((item) => (
                      <tr
                        key={item.id}
                        onClick={() => {
                          setResult(item);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="group cursor-pointer hover:bg-slate-50/80 transition-all duration-300"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-slate-100 text-slate-400 rounded-xl group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                              </svg>
                            </div>
                            <p className="font-semibold text-slate-900 group-hover:text-indigo-900 transition-colors">{item.filename}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-slate-600">{item.totalReviews}</td>
                        <td className="px-6 py-4">
                          <span className="text-emerald-700 font-medium bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-100/50">
                            {item.positivePct}%
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-rose-700 font-medium bg-rose-50 px-2.5 py-1 rounded-md border border-rose-100/50">
                            {item.negativePct}%
                          </span>
                        </td>
                        <td className="px-6 py-4 text-slate-400">
                          {new Date(item.createdAt).toLocaleDateString('en-US', {
                            month: 'short', day: 'numeric', year: 'numeric'
                          })}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-4">
                            <div className="flex items-center gap-1 text-indigo-600 font-medium">
                              <span className="text-xs font-semibold">View</span>
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </div>

                            <span className="h-4 w-px bg-slate-200" />

                            <button
                              onClick={(e) => handleDelete(item.id, e)}
                              title="Delete analysis"
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}

      </div>
    </main>
  );
}