import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Radiation, Download, Activity } from 'lucide-react';
import remarkGfm from 'remark-gfm';
import html2pdf from 'html2pdf.js';
import { Link } from 'react-router-dom';

const Home = () => {
  // State for form data
  const [formData, setFormData] = useState({
    ph: 7.2,
    hardness: 150,
    solids: 320,
    chloramines: 2.8,
    sulfate: 180,
    conductivity: 350,
    organic_carbon: 2.5,
    trihalomethanes: 45.0,
    turbidity: 0.8
  });

  // State for UI handling
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null); // { prediction: string, analysis: string }
  const [error, setError] = useState(false);

  // Field definitions
  const fields = [
    { id: 'ph', label: 'pH Level' },
    { id: 'hardness', label: 'Hardness' },
    { id: 'solids', label: 'Total Solids' },
    { id: 'chloramines', label: 'Chloramines' },
    { id: 'sulfate', label: 'Sulfate' },
    { id: 'conductivity', label: 'Conductivity' },
    { id: 'organic_carbon', label: 'Organic Carbon' },
    { id: 'trihalomethanes', label: 'THM Level' },
    { id: 'turbidity', label: 'Turbidity' }
  ];

  // Handle Input Change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(false);
    setResult(null);

    // Convert inputs to floats
    const payload = Object.fromEntries(
      Object.entries(formData).map(([k, v]) => [k, parseFloat(v)])
    );

    try {
      const response = await fetch('http://localhost:5000/analyze-water', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error('Network response was not ok');

      const data = await response.json();
      setResult(data);

      // Smooth scroll to results
      setTimeout(() => {
        document.getElementById('results-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);

    } catch (err) {
      setError(true);
      alert("Comm-Link Failure.");
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = () => {
    const element = document.createElement('div');
    const originalContent = document.getElementById('pdf-content');
    element.innerHTML = originalContent.outerHTML;

    // Set some styles on cloned element to ensure correct rendering in PDF
    element.style.padding = '20px';
    element.style.backgroundColor = '#0f0a0a';
    element.style.color = '#e2e8f0';

    const isHazardReport = result?.prediction?.includes("NON-POTABLE");
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = isHazardReport ? `hazard-report-${timestamp}.pdf` : `potable-report-${timestamp}.pdf`;

    const opt = {
      margin: 0.3,
      filename: filename,
      image: { type: 'jpeg', quality: 1.0 },
      html2canvas: { scale: 2, useCORS: true, backgroundColor: '#0f0a0a', windowWidth: 1000 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(element).save();
  };

  // Determine Theme Class based on prediction
  const isHazard = result?.prediction?.includes("NON-POTABLE");
  const themeClass = result ? (isHazard ? 'theme-hazard' : 'theme-potable') : '';

  return (
    <div className="min-h-screen text-slate-200 py-12 px-4 flex flex-col items-center bg-[#0f0a0a] relative overflow-x-hidden">

      {/* --- Custom Styles for Theme & Animations --- */}
      <style>{`
        .bg-grid-pattern {
          background-image: radial-gradient(#1a1414 1px, transparent 1px);
          background-size: 20px 20px;
        }

        /* --- THEME: HAZARD (RED/RUST) --- */
        .theme-hazard .analysis-box { background-color: #1e110b; border-color: #451a03; }
        .theme-hazard .status-border { border-color: #dc2626; background-color: rgba(69, 26, 3, 0.4); color: #f87171; }
        .theme-hazard .prose h3 { color: #f97316; border-bottom: 1px solid #451a03; }
        .theme-hazard .prose strong { color: #f87171; }
        .theme-hazard .prose th { background-color: #451a03; color: #fca5a5; }
        .theme-hazard .scanline { background-color: rgba(220, 38, 38, 0.15); }
        .theme-hazard .report-icon { color: #dc2626; }

        /* --- THEME: POTABLE (GREEN/EMERALD) --- */
        .theme-potable .analysis-box { background-color: #0b1e15; border-color: #064e3b; }
        .theme-potable .status-border { border-color: #10b981; background-color: rgba(6, 78, 59, 0.4); color: #6ee7b7; }
        .theme-potable .prose h3 { color: #34d399; border-bottom: 1px solid #064e3b; }
        .theme-potable .prose strong { color: #6ee7b7; }
        .theme-potable .prose th { background-color: #064e3b; color: #a7f3d0; }
        .theme-potable .scanline { background-color: rgba(16, 185, 129, 0.15); }
        .theme-potable .report-icon { color: #10b981; }

        /* Animation */
        @keyframes scanline {
            0% { transform: translateY(-100%); }
            100% { transform: translateY(800%); }
        }
        .scanline-anim { animation: scanline 6s linear infinite; }
        .rust-gradient { background: linear-gradient(135deg, #b22222 0%, #8b4513 100%); }
      `}</style>

      {/* Background Grid */}
      <div className="absolute inset-0 bg-grid-pattern pointer-events-none z-0"></div>

      <div className="w-full max-w-3xl z-10">

        {/* Header */}
        <header className="text-center mb-10 w-full relative">
          <div className="inline-block p-1 px-3 mb-4 border border-red-900 bg-red-950/50 text-red-500 font-mono text-[10px] uppercase tracking-[0.3em] animate-pulse">
            Terminal Auth: Established
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-red-500 via-orange-500 to-yellow-600 italic tracking-tighter uppercase mb-4">
            Aqua Hazard
          </h1>
          <p className="text-orange-200/40 font-mono mb-6 uppercase text-[10px] tracking-[0.4em]">
            Neural Toxicity Detection Protocol
          </p>

          <Link to="/visualization" state={{ formData }} className="inline-flex items-center gap-2 px-6 py-2 bg-slate-900 border border-slate-700 text-slate-300 font-bold uppercase tracking-[0.1em] hover:bg-slate-800 hover:text-white transition-all rounded shadow-lg">
            <Activity size={18} />
            Visualization
          </Link>
        </header>

        {/* Input Form */}
        <div className="flex justify-center mb-10">
          <form onSubmit={handleSubmit} className="w-full bg-[#1a0f0a] p-8 border border-[#451a03] shadow-2xl relative">
            <h2 className="text-orange-700 font-black mb-8 text-center tracking-[0.3em] text-xs uppercase flex items-center justify-center gap-4">
              <span className="h-[1px] w-8 bg-[#451a03]"></span>
              Manual Data Entry
              <span className="h-[1px] w-8 bg-[#451a03]"></span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
              {fields.map((f) => (
                <div key={f.id} className="flex flex-col">
                  <label htmlFor={f.id} className="text-[9px] font-bold text-orange-900 uppercase tracking-widest mb-1 ml-1">
                    {f.label}
                  </label>
                  <input
                    type="number"
                    step="any"
                    id={f.id}
                    required
                    value={formData[f.id]}
                    onChange={handleChange}
                    className="bg-black/40 border border-[#451a03] px-4 py-2.5 text-orange-100 focus:border-red-600 focus:outline-none transition-all font-mono text-sm"
                  />
                </div>
              ))}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-10 rust-gradient hover:brightness-110 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed text-white font-black py-4 uppercase tracking-[0.2em] transition-all"
            >
              {loading ? "Processing Neural Nodes..." : "Initiate Molecular Scan"}
            </button>
          </form>
        </div>

        {/* Results Section */}
        {result && (
          <div id="results-section" className={`space-y-8 animate-in fade-in duration-1000 ${themeClass}`}>

            <div id="pdf-content" className="space-y-8">
              {/* Verdict Card */}
              <div className="p-8 border-2 text-center status-border transition-colors duration-500">
                <p className="text-[10px] font-mono uppercase opacity-60 tracking-widest mb-1">System Verdict</p>
                <h2 className="text-4xl font-black italic tracking-tight">
                  {isHazard ? "CRITICAL HAZARD DETECTED" : "POTABLE / SYSTEM NOMINAL"}
                </h2>
              </div>

              {/* Analysis Box */}
              <div className="analysis-box border relative overflow-hidden transition-colors duration-500">
                <div className="absolute top-0 left-0 w-full h-1 scanline scanline-anim"></div>
                <div className="p-8">
                  <h2 className="text-xl font-black mb-8 flex items-center gap-3 border-b border-white/5 pb-4">
                    <span className="report-icon">
                      <Radiation size={24} />
                    </span>
                    <span className="uppercase tracking-widest text-slate-100">Toxicity Report</span>
                  </h2>

                  {/* Markdown Content */}
                  <div className="prose prose-invert max-w-none text-sm md:text-base leading-relaxed opacity-90">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]} // <-- ADD THIS PROP
                      components={{
                        h3: ({ node, ...props }) => <h3 className="font-extrabold text-lg mt-6 uppercase pb-1" {...props} />,
                        ul: ({ node, ...props }) => <ul className="list-square ml-6 text-gray-300 mb-4" {...props} />,
                        // Table components
                        table: ({ node, ...props }) => <table className="w-full border-collapse my-6 text-sm" {...props} />,
                        th: ({ node, ...props }) => <th className="border border-white/5 p-3 text-left bg-black/20" {...props} />,
                        td: ({ node, ...props }) => <td className="border border-white/5 p-3 text-left" {...props} />,
                      }}
                    >
                      {result.analysis}
                    </ReactMarkdown>
                  </div>
                </div>
              </div>
            </div>

            <footer className="text-center pt-8 pb-12 flex flex-col items-center gap-5">
              <button
                onClick={downloadPDF}
                className="flex items-center justify-center gap-3 px-8 py-3 bg-slate-900 border border-slate-700 hover:border-slate-500 hover:bg-slate-800 text-slate-300 font-bold uppercase tracking-[0.1em] transition-all rounded shadow-lg"
              >
                <Download size={18} />
                Download Report as PDF
              </button>

              <button
                onClick={() => {
                  setResult(null);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="text-[10px] font-mono text-slate-600 hover:text-orange-500 uppercase tracking-widest transition-colors mt-4"
              >
                [ Clear Buffer ]
              </button>
            </footer>
          </div>
        )}

      </div>
    </div>
  );
};

export default Home;