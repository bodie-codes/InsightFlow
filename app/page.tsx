'use client';
import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { SessionProvider, signIn, signOut, useSession } from 'next-auth/react';

export default function Page() {
  return (
    <SessionProvider>
      <Dashboard />
    </SessionProvider>
  );
}

function Dashboard() {
  const { data: session, status } = useSession();
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);

  // The server knows who is signed in, so we don't send any user id
  const fetchHistory = async () => {
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
    if (status === 'authenticated') fetchHistory();
  }, [status]);

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

  if (status === "loading") {
    return <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA] text-slate-400 font-medium tracking-wide">Loading workspace...</div>;
  }

  if (status === "unauthenticated") {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex flex-col items-center justify-center p-4">
        <div className="bg-white p-10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 max-w-md w-full text-center">
          <h1 className="text-3xl text-slate-900 mb-2">
            <span className="font-extrabold tracking-tight">Insight</span>
            <span className="font-light text-slate-500">Flow</span>
          </h1>
          <p className="text-slate-500 mb-10 text-sm">AI-powered customer review analytics platform.</p>
          <button
            onClick={() => signIn('github')}
            className="w-full bg-slate-900 text-white px-6 py-3.5 rounded-xl font-medium hover:bg-slate-800 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-3 cursor-pointer"
          >
            Sign in with GitHub
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#FAFAFA] font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-900 pb-20">
      {/* Top Navigation */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <h1 className="text-xl">
            <span className="font-extrabold tracking-tight">Insight</span>
            <span className="font-light text-slate-500">Flow</span>
          </h1>
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
        </div>
      </nav>

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

        {/* History Section */}
        {history.length > 0 && (
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