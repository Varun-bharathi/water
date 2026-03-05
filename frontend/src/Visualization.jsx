import React from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend
} from 'recharts';
import { Link, useLocation } from 'react-router-dom';
import { ArrowLeft, Activity } from 'lucide-react';

const COLORS = [
    '#3b82f6', // blue
    '#10b981', // green
    '#f59e0b', // yellow
    '#ef4444', // red
    '#8b5cf6', // purple
    '#ec4899', // pink
    '#06b6d4', // cyan
    '#f97316', // orange
    '#64748b'  // slate
];

const Visualization = () => {
    const location = useLocation();

    // Use user input data passed via link, or fallback to sensible defaults
    const formData = location.state?.formData || {
        ph: 7.2,
        hardness: 150,
        solids: 320,
        chloramines: 2.8,
        sulfate: 180,
        conductivity: 350,
        organic_carbon: 2.5,
        trihalomethanes: 45.0,
        turbidity: 0.8
    };

    const chartData = [
        { name: 'pH', value: Number(formData.ph) },
        { name: 'Hardness', value: Number(formData.hardness) },
        { name: 'Solids', value: Number(formData.solids) },
        { name: 'Chloramines', value: Number(formData.chloramines) },
        { name: 'Sulfate', value: Number(formData.sulfate) },
        { name: 'Conductivity', value: Number(formData.conductivity) },
        { name: 'Organic C.', value: Number(formData.organic_carbon) },
        { name: 'THMs', value: Number(formData.trihalomethanes) },
        { name: 'Turbidity', value: Number(formData.turbidity) }
    ];

    return (
        <div className="min-h-screen text-slate-200 py-12 px-4 flex flex-col items-center bg-[#0f0a0a] relative overflow-x-hidden">
            {/* Background Grid */}
            <style>{`
        .bg-grid-pattern {
          background-image: radial-gradient(#1a1414 1px, transparent 1px);
          background-size: 20px 20px;
        }
      `}</style>
            <div className="absolute inset-0 bg-grid-pattern pointer-events-none z-0"></div>

            <div className="w-full max-w-5xl z-10">
                <header className="w-full mb-10 flex flex-col md:flex-row items-center justify-between border-b border-orange-900/30 pb-6">
                    <div className="flex items-center gap-4 mb-4 md:mb-0">
                        <Activity className="text-orange-500 w-8 h-8" />
                        <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-yellow-600 uppercase tracking-widest">
                            Live Input Analysis
                        </h1>
                    </div>
                    <Link to="/" className="flex items-center gap-2 px-6 py-2 bg-slate-900/50 border border-slate-700 text-slate-300 font-bold uppercase tracking-[0.1em] hover:bg-slate-800 hover:text-white transition-all rounded shadow-lg">
                        <ArrowLeft size={18} /> BACK TO TERMINAL
                    </Link>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">

                    {/* Pie Chart */}
                    <div className="bg-[#1a0f0a] border border-[#451a03] p-6 shadow-2xl relative">
                        <h2 className="text-orange-500 font-bold mb-6 font-mono text-sm uppercase flex items-center gap-3">
                            <span className="h-[1px] flex-1 bg-[#451a03]"></span>
                            Component Distribution
                            <span className="h-[1px] flex-1 bg-[#451a03]"></span>
                        </h2>
                        <div className="h-[400px] w-full relative">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={chartData}
                                        cx="50%"
                                        cy="45%"
                                        innerRadius={80}
                                        outerRadius={120}
                                        paddingAngle={5}
                                        dataKey="value"
                                        stroke="none"
                                        labelLine={false}
                                    >
                                        {chartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <RechartsTooltip
                                        contentStyle={{ backgroundColor: '#0f0a0a', borderColor: '#451a03', color: '#e2e8f0', borderRadius: '4px' }}
                                        formatter={(value, name) => [`${value}`, name]}
                                    />
                                    <Legend verticalAlign="bottom" height={72} wrapperStyle={{ color: '#e2e8f0', fontSize: '11px', lineHeight: '24px' }} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Bar graph */}
                    <div className="bg-[#1a0f0a] border border-[#451a03] p-6 shadow-2xl">
                        <h2 className="text-orange-500 font-bold mb-6 font-mono text-sm uppercase flex items-center gap-3">
                            <span className="h-[1px] flex-1 bg-[#451a03]"></span>
                            Parameter Magnitudes
                            <span className="h-[1px] flex-1 bg-[#451a03]"></span>
                        </h2>
                        <div className="h-[400px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 60 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#451a03" vertical={false} />
                                    <XAxis
                                        dataKey="name"
                                        stroke="#9ca3af"
                                        tick={{ fill: '#9ca3af', fontSize: 11 }}
                                        axisLine={false}
                                        tickLine={false}
                                        angle={-45}
                                        textAnchor="end"
                                    />
                                    {/* Using scale="log" gracefully so large values like Solids don't completely hide Turbidity/Chloramines */}
                                    <YAxis
                                        scale="log"
                                        domain={['auto', 'auto']}
                                        stroke="#9ca3af"
                                        tick={{ fill: '#9ca3af', fontSize: 11 }}
                                        axisLine={false}
                                        tickLine={false}
                                    />
                                    <RechartsTooltip
                                        cursor={{ fill: '#451a03' }}
                                        contentStyle={{ backgroundColor: '#0f0a0a', borderColor: '#451a03', color: '#e2e8f0', borderRadius: '4px' }}
                                    />
                                    <Bar dataKey="value" name="Value" radius={[4, 4, 0, 0]}>
                                        {chartData.map((entry, index) => (
                                            <Cell key={`cell-bar-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Disclaimer */}
                    <div className="col-span-1 lg:col-span-2 text-center text-orange-900/50 font-mono text-xs uppercase tracking-widest mt-4">
                        * Bar chart employs a logarithmic scale due to massive relative variance in magnitudes (e.g. Total Solids vs Turbidity)
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Visualization;
