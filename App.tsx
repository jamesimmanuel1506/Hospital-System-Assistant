import React, { useState } from 'react';
import { Network, Server, ArrowRight, ShieldCheck, Database, FileCheck } from 'lucide-react';
import { routeRequestToAgent } from './services/geminiService.ts';
import { AgentId, RoutingResponse, SubagentConfig } from './types.ts';
import { SubagentCard } from './components/SubagentCard.tsx';

const SUBAGENTS: SubagentConfig[] = [
    {
        id: AgentId.DOC_GEN,
        title: "1. Medical Doc Generator",
        description: "Menghasilkan dokumen medis formal (Resep, Laporan, Ringkasan). Output: PDF/DOCX.",
        complianceNote: "Standar dokumentasi medis & audit trail.",
        colorClass: "bg-red-50",
        borderColorClass: "border-red-500",
        iconName: "FileText"
    },
    {
        id: AgentId.MED_INFO,
        title: "2. Medical Info Agent",
        description: "Menjawab pertanyaan umum & edukasi. Tidak memberikan diagnosis.",
        complianceNote: "Batasan etika AI kesehatan & disclaimer wajib.",
        colorClass: "bg-cyan-50",
        borderColorClass: "border-cyan-500",
        iconName: "Activity"
    },
    {
        id: AgentId.PATIENT_INFO,
        title: "3. Patient Info Agent",
        description: "Akses data pasien rahasia (RM, Status, Kontak).",
        complianceNote: "Privasi Data (COBIT DSS04/BAI09) & Keamanan.",
        colorClass: "bg-yellow-50",
        borderColorClass: "border-yellow-500",
        iconName: "User"
    },
    {
        id: AgentId.SCHEDULER,
        title: "4. Appointment Scheduler",
        description: "Manajemen janji temu (Buat, Reschedule, Batal).",
        complianceNote: "Integrasi Revenue Cycle Management (RCM).",
        colorClass: "bg-green-50",
        borderColorClass: "border-green-500",
        iconName: "Calendar"
    }
];

const App: React.FC = () => {
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<RoutingResponse | null>(null);

    const handleRouting = async () => {
        if (!query.trim()) return;
        
        setLoading(true);
        setResult(null);
        
        const response = await routeRequestToAgent(query);
        
        setResult(response);
        setLoading(false);
    };

    return (
        <div className="min-h-screen pb-12">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
                <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="bg-blue-600 p-2 rounded-lg text-white">
                            <Network size={24} />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-slate-800">Hospital System Assistant</h1>
                            <p className="text-xs text-slate-500">AIS & IT Governance Architecture Demo</p>
                        </div>
                    </div>
                    <div className="hidden md:flex gap-4 text-xs text-slate-400 font-medium">
                        <span className="flex items-center gap-1"><ShieldCheck size={14}/> COBIT 5 Compliant</span>
                        <span className="flex items-center gap-1"><Database size={14}/> SIMRS Integrated</span>
                    </div>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-4 mt-8">
                
                {/* Introduction */}
                <div className="mb-8 text-slate-600 max-w-3xl">
                    <p>
                        Sistem ini mendemonstrasikan prinsip <strong>Pemisahan Tugas (Segregation of Duties)</strong> dan modularitas dalam arsitektur SIMRS modern. 
                        Agen Induk bertindak sebagai router cerdas untuk memastikan integritas data dan efisiensi operasional.
                    </p>
                </div>

                {/* Main Agent Section */}
                <section className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-12">
                    <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center gap-3">
                        <Server className="text-blue-600" />
                        <div>
                            <h2 className="font-bold text-slate-800">Manajer Operasional (Agen Induk)</h2>
                            <p className="text-xs text-slate-500">Peran: Routing & Orchestration. Tidak memproses data sensitif secara langsung.</p>
                        </div>
                    </div>
                    
                    <div className="p-6">
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Masukkan Permintaan Operasional / Medis
                        </label>
                        <div className="relative">
                            <textarea 
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Contoh: 'Buatkan resep Paracetamol untuk pasien R-405' atau 'Cek ketersediaan Dokter Sita tanggal 25'"
                                className="w-full p-4 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none resize-none h-32 text-slate-700 placeholder:text-slate-400"
                            />
                            <button 
                                onClick={handleRouting}
                                disabled={loading || !query.trim()}
                                className="absolute bottom-4 right-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {loading ? (
                                    <>Processing...</>
                                ) : (
                                    <>
                                        Proses Routing <ArrowRight size={16} />
                                    </>
                                )}
                            </button>
                        </div>

                        {/* Output Area */}
                        {(result || loading) && (
                            <div className={`mt-6 p-4 rounded-lg border ${loading ? 'bg-gray-50 border-gray-200' : 'bg-blue-50 border-blue-200'}`}>
                                {loading ? (
                                    <div className="flex items-center gap-3 text-gray-500 animate-pulse">
                                        <div className="w-4 h-4 bg-gray-400 rounded-full"></div>
                                        <span className="text-sm font-mono">Menganalisis permintaan untuk routing yang tepat...</span>
                                    </div>
                                ) : (
                                    <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
                                        <div className="flex items-center gap-2 text-blue-800 font-semibold border-b border-blue-100 pb-2">
                                            <Network size={18} />
                                            <span>Keputusan Routing: {SUBAGENTS.find(a => a.id === result?.agentId)?.title || "Unknown Agent"}</span>
                                        </div>
                                        <div className="grid md:grid-cols-2 gap-4 text-sm">
                                            <div>
                                                <span className="block text-blue-500 font-bold text-xs uppercase mb-1">Logika Sistem (Reasoning)</span>
                                                <p className="text-slate-700">{result?.reasoning}</p>
                                            </div>
                                            <div>
                                                <span className="block text-green-600 font-bold text-xs uppercase mb-1">Simulasi Output Sub-Agen</span>
                                                <p className="text-slate-700 italic bg-white/50 p-2 rounded border border-blue-100">"{result?.simulatedResponse}"</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </section>

                {/* Subagents Grid */}
                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <FileCheck size={20} className="text-slate-400"/>
                    Modul Subagen Terintegrasi
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {SUBAGENTS.map((agent) => (
                        <SubagentCard 
                            key={agent.id} 
                            config={agent} 
                            isActive={result?.agentId === agent.id}
                        />
                    ))}
                </div>

                {/* Footer / Disclaimer */}
                <footer className="text-center text-xs text-slate-400 border-t border-slate-200 pt-6 pb-12">
                    <p>Kerangka ini menjamin efisiensi alur kerja (DSS04 Manage Continuity) dan integritas data (APO11 Manage Quality).</p>
                    <p className="mt-1">© 2024 Dept. Accounting Information Systems - Prototype v1.0</p>
                </footer>
            </main>
        </div>
    );
};

export default App;