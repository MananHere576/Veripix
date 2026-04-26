import React from "react";
import { useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  Activity,
  Cpu,
  Layers,
  Database,
  Server,
  Code,
  ArrowRight,
} from "lucide-react";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">

      {/* HERO */}
      <div className="relative overflow-hidden border-b border-slate-800">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-orange-500/10 blur-3xl"></div>

        <div className="relative max-w-6xl mx-auto px-6 py-28 text-center">
          <ShieldCheck className="mx-auto w-14 h-14 text-cyan-400 drop-shadow-[0_0_15px_rgba(6,182,212,0.5)] mb-6" />

          <h1 className="text-5xl md:text-6xl font-black tracking-tight mb-6">
            VeriPix <span className="text-cyan-400"></span>
          </h1>

          <p className="text-slate-400 max-w-2xl mx-auto text-lg">
            AI-powered digital image forensic system capable of detecting forgery,
            splicing, and manipulation with pixel-level intelligence.
          </p>

          <button
            onClick={() => navigate("/tool")}
            className="mt-10 inline-flex items-center gap-3 bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold px-8 py-4 rounded-xl shadow-xl transition-all duration-300 hover:scale-105"
          >
            Launch Analysis Tool
            <ArrowRight size={18} />
          </button>
        </div>
      </div>

      {/* HOW IT WORKS */}
      <div className="max-w-6xl mx-auto px-6 py-24">
        <h2 className="text-3xl font-bold text-center mb-16 tracking-tight">
          How It Works
        </h2>

        <div className="grid md:grid-cols-3 gap-10">

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-xl">
            <Activity className="text-cyan-400 mb-6" size={28} />
            <h3 className="text-xl font-bold mb-3">Noise Extraction</h3>
            <p className="text-slate-400 text-sm">
              Separates image content from its digital noise floor using adaptive thresholding.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-xl">
            <Cpu className="text-orange-400 mb-6" size={28} />
            <h3 className="text-xl font-bold mb-3">AI Analysis</h3>
            <p className="text-slate-400 text-sm">
              ResNet + CNN + Vision Transformer backbone scans for forgery signatures.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-xl">
            <ShieldCheck className="text-emerald-400 mb-6" size={28} />
            <h3 className="text-xl font-bold mb-3">Forensic Heatmap</h3>
            <p className="text-slate-400 text-sm">
              High-contrast visualization highlights manipulated regions.
            </p>
          </div>

        </div>
      </div>

      {/* TECH STACK */}
      <div className="border-t border-slate-800 bg-slate-900/40">
        <div className="max-w-6xl mx-auto px-6 py-24">

          <h2 className="text-3xl font-bold text-center mb-16">
            Technology Stack
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

            {/* AI */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <Layers className="text-cyan-400 mb-4" />
              <h3 className="font-bold mb-3">AI & Deep Learning</h3>
              <ul className="text-slate-400 text-sm space-y-2">
                <li>• PyTorch</li>
                <li>• Segmentation Models PyTorch (SMP)</li>
                <li>• ResNet Architecture</li>
                <li>• CNN + Vision Transformer Backbone</li>
                <li>• Torchvision (ImageNet Normalization)</li>
              </ul>
            </div>

            {/* Image Processing */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <Cpu className="text-orange-400 mb-4" />
              <h3 className="font-bold mb-3">Image Processing</h3>
              <ul className="text-slate-400 text-sm space-y-2">
                <li>• OpenCV (Otsu Thresholding)</li>
                <li>• NumPy (Pixel Processing)</li>
                <li>• Matplotlib (Heatmap Rendering)</li>
                <li>• Pillow (High-Quality Resampling)</li>
              </ul>
            </div>

            {/* Backend */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <Server className="text-emerald-400 mb-4" />
              <h3 className="font-bold mb-3">Backend API</h3>
              <ul className="text-slate-400 text-sm space-y-2">
                <li>• FastAPI</li>
                <li>• Uvicorn ASGI Server</li>
                <li>• RESTful Endpoint (/analyze)</li>
              </ul>
            </div>

            {/* Frontend */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <Code className="text-cyan-400 mb-4" />
              <h3 className="font-bold mb-3">Frontend UI</h3>
              <ul className="text-slate-400 text-sm space-y-2">
                <li>• React.js</li>
                <li>• React Router</li>
                <li>• TailwindCSS</li>
                <li>• Recharts</li>
              </ul>
            </div>

            {/* Dataset */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <Database className="text-orange-400 mb-4" />
              <h3 className="font-bold mb-3">Dataset & Training</h3>
              <ul className="text-slate-400 text-sm space-y-2">
                <li>• CASIA v2 Dataset</li>
                <li>• GPU Acceleration (CUDA)</li>
                <li>• Fine-tuned on Real-world Splicing Patterns</li>
              </ul>
            </div>

          </div>

        </div>
      </div>

      {/* TECH NOTE */}
      <div className="border-t border-slate-800 py-16 text-center text-slate-400 text-sm px-6">
        Analyzed evidence images may appear darker due to 
        <span className="text-orange-400 font-semibold"> Contrast Suppression</span>.
        This forensic visualization enhances manipulation signatures.
      </div>

      {/* FOOTER */}
      <div className="border-t border-slate-800 py-8 text-center text-slate-500 text-xs">
        © {new Date().getFullYear()} VeriPix PRO • Neural Forensic Intelligence
      </div>

    </div>
  );
};

export default LandingPage;
