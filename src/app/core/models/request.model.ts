export enum WasteType {
    PLASTIC = 'plastic',
    GLASS = 'glass',
    PAPER = 'paper',
    METAL = 'metal'
}

export enum RequestStatus {
    PENDING = 'pending',
    OCCUPIED = 'occupied',
    IN_PROGRESS = 'in_progress',
    VALIDATED = 'validated',
    REJECTED = 'rejected'
}

export interface WasteDetail {
    wasteType: WasteType;
    estimatedWeight: number; 
}

export interface CollectionRequest {
    id: string;
    userId: string;
    wasteDetails: WasteDetail[];
    collectAddress: string;
    scheduledDate: Date;
    scheduledTimeSlot: string; 
    additionalNotes?: string;
    status: RequestStatus;
    photos?: string[]; 
    
}