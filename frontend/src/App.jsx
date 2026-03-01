import React, { useState } from 'react';
import { Upload, ShieldCheck, Activity, RefreshCcw, Fingerprint, Camera, Cpu, Clock } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import axios from 'axios';

function App() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null); // for instant preview

  const handleUpload = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    setLoading(true);
    setPreview(URL.createObjectURL(selectedFile)); // show instantly

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await axios.post('https://veripix.onrender.com/analyze/', formData);
      setResult(response.data);
    } catch (err) {
      alert("System Offline: Ensure Python Backend is running on Port 8000");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 font-sans tracking-tight">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <header className="flex items-center justify-between mb-8 border-b border-slate-900 pb-6">
          <div className="flex items-center gap-4">
            <ShieldCheck className="w-10 h-10 text-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.5)]" />
            <div>
              <h1 className="text-2xl font-black uppercase italic tracking-tighter">
                VeriPix <span className="text-cyan-500 text-3xl"></span>
              </h1>
              <p className="text-[9px] font-mono text-slate-500 uppercase tracking-[0.2em]">
                Forensic Authentication Suite
              </p>
            </div>
          </div>
        </header>

        {!result ? (
          <div
            className="flex flex-col items-center justify-center border border-slate-800 rounded-3xl p-32 bg-slate-900/20 hover:bg-slate-900/40 hover:border-cyan-500/50 transition-all cursor-pointer group"
            onClick={() => document.getElementById('dropzone').click()}
          >
            <input id="dropzone" type="file" hidden onChange={handleUpload} />
            <Upload className={`w-12 h-12 mb-6 ${loading ? 'animate-bounce text-cyan-400' : 'text-slate-700 group-hover:text-cyan-400'}`} />
            <h2 className="text-lg font-bold text-slate-400 group-hover:text-slate-200 uppercase tracking-widest">
              {loading ? "Scanning Digital DNA..." : "Load Digital Evidence"}
            </h2>
          </div>
        ) : (

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

            {/* LEFT SECTION */}
            <div className="lg:col-span-8 space-y-6">

              {/* ORIGINAL IMAGE */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-2xl">
                <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                  <Camera size={14} /> Original Image
                </p>
                <img
                  src={
                    preview ||
                    (result.original_filename &&
                      `http://127.0.0.1:8000/files/${encodeURIComponent(result.original_filename)}`)
                  }
                  className="w-full rounded-xl border border-emerald-500/20"
                  alt="Original"
                />
              </div>

              {/* HEATMAP IMAGE */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-2xl">
                <p className="text-[10px] font-bold text-orange-500 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                  <Activity size={14} /> Neural Forgery Map
                </p>
                <img
                  src={`http://127.0.0.1:8000/files/${result.heatmap_filename}`}
                  className="w-full rounded-xl border border-orange-500/20"
                  alt="Analysis"
                />
              </div>

              {/* CHART + HARDWARE */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* PROBABILITY CHART */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                  <p className="text-[10px] font-bold text-cyan-500 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                    <Cpu size={14} /> Probability Distribution (%)
                  </p>

                  <div className="h-40 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={result.metadata.stats} margin={{ left: -30 }}>
                        <XAxis dataKey="name" fontSize={9} tick={{ fill: '#475569' }} axisLine={false} tickLine={false} />
                        <YAxis domain={[0, 100]} fontSize={9} tick={{ fill: '#475569' }} axisLine={false} tickLine={false} />
                        <Tooltip formatter={(val) => `${val}%`} contentStyle={{ backgroundColor: '#0f172a', border: 'none', fontSize: '10px' }} />
                        <Bar dataKey="val" radius={[4, 4, 0, 0]}>
                          {result.metadata.stats.map((e, i) => (
                            <Cell key={i} fill={e.val > 70 ? '#f97316' : '#06b6d4'} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* HARDWARE PROFILE */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                    <Camera size={14} /> Hardware Profile
                  </p>
                  <div className="space-y-4 text-[11px] font-mono">
                    <div className="flex justify-between border-b border-slate-800/50 pb-2">
                      <span className="text-slate-500">MAKE</span>
                      <span className="text-slate-200">{result.metadata.make}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-800/50 pb-2">
                      <span className="text-slate-500">MODEL</span>
                      <span className="text-slate-200">{result.metadata.model}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-800/50 pb-2">
                      <span className="text-slate-500">SIZE</span>
                      <span className="text-cyan-400">{result.metadata.file_size}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">SOFTWARE</span>
                      <span className="text-slate-200 truncate ml-4">{result.metadata.software}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT PANEL */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl sticky top-8">

                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 border-b border-slate-800 pb-4 mb-6 flex items-center gap-2">
                  <Fingerprint size={16} className="text-cyan-400" /> Forensic Timeline
                </h3>

                <div className="space-y-4">

                  <div className="bg-slate-950 p-4 rounded-xl border-l-2 border-slate-700">
                    <p className="text-[9px] text-slate-500 uppercase font-black mb-1">Acquisition Date</p>
                    <p className="text-xs font-mono text-slate-300">{result.metadata.creation_date}</p>
                  </div>

                  <div className={`p-4 rounded-xl border-l-2 ${result.metadata.tamper_date !== "None Detected" ? 'bg-orange-500/10 border-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.1)]' : 'bg-slate-950 border-emerald-500/30'}`}>
                    <p className="text-[9px] text-orange-500 uppercase font-black mb-1 flex items-center gap-1">
                      <Clock size={10} /> Suspected Tamper Date
                    </p>
                    <p className={`text-xs font-mono ${result.metadata.tamper_date !== "None Detected" ? 'text-orange-200' : 'text-emerald-400'}`}>
                      {result.metadata.tamper_date}
                    </p>
                  </div>

                  <div className={`p-4 rounded-xl border-l-2 ${result.metadata.is_suspicious ? 'bg-red-500/10 border-red-500' : 'bg-emerald-500/10 border-emerald-500'}`}>
                    <p className="text-[9px] uppercase font-black mb-1 text-slate-500">Final Verdict</p>
                    <p className={`text-xs font-bold ${result.metadata.is_suspicious ? 'text-red-400' : 'text-emerald-400'}`}>
                      {result.metadata.is_suspicious ? 'FORGERY DETECTED' : 'AUTHENTIC ORIGINAL'}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setResult(null);
                    setPreview(null);
                  }}
                  className="w-full mt-8 flex items-center justify-center gap-2 bg-slate-800 hover:bg-cyan-600 p-4 rounded-xl transition-all font-black text-[10px] uppercase tracking-[0.2em] group"
                >
                  <RefreshCcw size={14} className="group-hover:rotate-180 transition-all duration-500" />
                  Reset Scan
                </button>

              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}

export default App;