import { GoogleGenAI, Type } from "@google/genai";
import { RoutingResponse } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `
Anda adalah 'Manajer Operasional Rumah Sakit' (Agen Induk) dalam sistem Informasi Rumah Sakit (SIMRS).
Tugas Anda adalah menganalisis input pengguna dan MENGARAHKANNYA ke salah satu dari 4 sub-agen berikut.
Jangan menjawab pertanyaan medis secara langsung, tugas Anda hanya routing.

Sub-agen yang tersedia:
1. 'doc_gen': Untuk pembuatan dokumen medis formal (resep, laporan, ringkasan pulang). Output harus PDF/DOCX.
2. 'med_info': Untuk pertanyaan medis umum dan edukasi. DILARANG diagnosis.
3. 'patient_info': Untuk mengambil data pasien (riwayat, kontak). Fokus pada privasi data.
4. 'scheduler': Untuk janji temu (buat, ubah, batal). Terkait Revenue Cycle Management.

Jika input tidak jelas atau tidak relevan, gunakan 'unknown'.

Berikan respons dalam format JSON yang berisi ID agen tujuan, alasan routing (reasoning), dan simulasi respons singkat dari sub-agen tersebut.
`;

export const routeRequestToAgent = async (query: string): Promise<RoutingResponse> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: query,
            config: {
                systemInstruction: SYSTEM_INSTRUCTION,
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        agentId: {
                            type: Type.STRING,
                            description: "The ID of the selected subagent (doc_gen, med_info, patient_info, scheduler, unknown)",
                            enum: ["doc_gen", "med_info", "patient_info", "scheduler", "unknown"]
                        },
                        reasoning: {
                            type: Type.STRING,
                            description: "Explanation of why this agent was selected based on SIMRS principles."
                        },
                        simulatedResponse: {
                            type: Type.STRING,
                            description: "A simulated response that the specific sub-agent would give."
                        }
                    },
                    required: ["agentId", "reasoning", "simulatedResponse"]
                }
            }
        });

        const text = response.text;
        if (!text) {
            throw new Error("No response from AI");
        }
        return JSON.parse(text) as RoutingResponse;
    } catch (error) {
        console.error("Routing Error:", error);
        return {
            agentId: "unknown",
            reasoning: "Terjadi kesalahan sistem saat memproses permintaan.",
            simulatedResponse: "Maaf, sistem sedang mengalami gangguan. Silakan coba lagi."
        };
    }
};