export enum AgentId {
    DOC_GEN = 'doc_gen',
    MED_INFO = 'med_info',
    PATIENT_INFO = 'patient_info',
    SCHEDULER = 'scheduler',
    UNKNOWN = 'unknown'
}

export interface RoutingResponse {
    agentId: string;
    reasoning: string;
    simulatedResponse: string;
}

export interface SubagentConfig {
    id: AgentId;
    title: string;
    description: string;
    complianceNote: string;
    colorClass: string;
    borderColorClass: string;
    iconName: string;
}