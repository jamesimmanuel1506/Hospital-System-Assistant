import React from 'react';
import { SubagentConfig, AgentId } from '../types';
import { FileText, Stethoscope, User, Calendar, Activity } from 'lucide-react';

interface SubagentCardProps {
    config: SubagentConfig;
    isActive: boolean;
}

export const SubagentCard: React.FC<SubagentCardProps> = ({ config, isActive }) => {
    const getIcon = () => {
        switch (config.id) {
            case AgentId.DOC_GEN: return <FileText className="w-6 h-6" />;
            case AgentId.MED_INFO: return <Activity className="w-6 h-6" />;
            case AgentId.PATIENT_INFO: return <User className="w-6 h-6" />;
            case AgentId.SCHEDULER: return <Calendar className="w-6 h-6" />;
            default: return <Stethoscope className="w-6 h-6" />;
        }
    };

    return (
        <div 
            className={`
                relative p-5 rounded-lg border transition-all duration-500
                ${config.borderColorClass} border-l-4
                ${isActive ? 'scale-105 shadow-xl ring-2 ring-offset-2 ring-blue-400 bg-white' : `${config.colorClass} opacity-80 hover:opacity-100`}
            `}
        >
            {isActive && (
                <div className="absolute -top-3 -right-3 bg-blue-600 text-white text-xs px-2 py-1 rounded-full shadow animate-pulse">
                    Active Agent
                </div>
            )}
            
            <div className="flex items-center gap-3 mb-3">
                <div className={`p-2 rounded-full bg-white shadow-sm text-gray-700`}>
                    {getIcon()}
                </div>
                <h3 className="font-bold text-lg text-gray-800 leading-tight">{config.title}</h3>
            </div>
            
            <p className="text-sm text-gray-700 mb-3 font-medium">
                {config.description}
            </p>
            
            <div className="text-xs text-gray-500 italic border-t border-gray-200 pt-2 mt-auto">
                <span className="font-semibold text-gray-600">Compliance:</span> {config.complianceNote}
            </div>
        </div>
    );
};