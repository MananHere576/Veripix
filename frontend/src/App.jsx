import React, { useState } from 'react';
import { Upload, ShieldCheck, Activity, RefreshCcw, Fingerprint, Camera, Cpu, Clock } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import axios from 'axios';

function App() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);

  const handleUpload = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    setLoading(true);
    setPreview(URL.createObjectURL(selectedFile));

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await axios.post(
        'https://veripix.onrender.com/analyze/',
        formData
      );
      setResult(response.data);
    } catch (err) {
      alert("System Offline: Backend not reachable.");
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
                VeriPix
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

          <div className="space-y-8">

            {/* SIDE BY SIDE IMAGE SECTION */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* ORIGINAL IMAGE */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-2xl">
                <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                  <Camera size={14} /> Original Image
                </p>
                <img
                  src={
                    preview ||
                    (result.filename &&
                      `https://veripix.onrender.com/files/${encodeURIComponent(result.filename)}`)
                  }
                  className="w-full h-[400px] object-contain rounded-xl border border-emerald-500/20 bg-black"
                  alt="Original"
                />
              </div>

              {/* HEATMAP IMAGE */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-2xl">
                <p className="text-[10px] font-bold text-orange-500 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                  <Activity size={14} /> Neural Forgery Map
                </p>
                <img
                  src={`https://veripix.onrender.com/files/${result.heatmap_filename}`}
                  className="w-full h-[400px] object-contain rounded-xl border border-orange-500/20 bg-black"
                  alt="Analysis"
                />
              </div>

            </div>

            {/* METADATA + STATS SECTION */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

              {/* PROBABILITY CHART */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                <p className="text-[10px] font-bold text-cyan-500 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                  <Cpu size={14} /> Probability Distribution (%)
                </p>
                <div className="h-40 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={result.metadata.stats}>
                      <XAxis dataKey="name" fontSize={9} tick={{ fill: '#475569' }} />
                      <YAxis domain={[0, 100]} fontSize={9} tick={{ fill: '#475569' }} />
                      <Tooltip formatter={(val) => `${val}%`} />
                      <Bar dataKey="val">
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
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                  <Camera size={14} /> Hardware Profile
                </p>
                <div className="space-y-3 text-xs font-mono">
                  <div className="flex justify-between">
                    <span>MAKE</span>
                    <span>{result.metadata.make}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>MODEL</span>
                    <span>{result.metadata.model}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>SIZE</span>
                    <span>{result.metadata.file_size}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>SOFTWARE</span>
                    <span>{result.metadata.software}</span>
                  </div>
                </div>
              </div>

              {/* FORENSIC TIMELINE */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                  <Fingerprint size={14} /> Forensic Timeline
                </p>
                <div className="space-y-4 text-xs">
                  <div>
                    <p className="text-slate-500">Acquisition Date</p>
                    <p>{result.metadata.creation_date}</p>
                  </div>
                  <div>
                    <p className="text-slate-500">Tamper Date</p>
                    <p>{result.metadata.tamper_date}</p>
                  </div>
                  <div>
                    <p className="text-slate-500">Verdict</p>
                    <p className={result.metadata.is_suspicious ? "text-red-400" : "text-emerald-400"}>
                      {result.metadata.is_suspicious ? 'FORGERY DETECTED' : 'AUTHENTIC ORIGINAL'}
                    </p>
                  </div>
                </div>
              </div>

            </div>

            {/* RESET BUTTON */}
            <div className="text-center">
              <button
                onClick={() => {
                  setResult(null);
                  setPreview(null);
                }}
                className="mt-6 px-6 py-3 bg-slate-800 hover:bg-cyan-600 rounded-xl font-bold uppercase tracking-widest transition-all"
              >
                <RefreshCcw size={16} className="inline mr-2" />
                Reset Scan
              </button>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}

export default App;