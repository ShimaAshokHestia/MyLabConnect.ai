export interface AuditChange {
    item: string;
    from: string;
    to: string;
}

export interface AuditTrails {
    logID: string;
    tableName: string;
    action: string;
    recordID: number;
    changedBy: string;
    changedAt: string;
    changeDetails: string;
    changes: AuditChange[];
}

export interface AuditLogResponse {
    statusCode: number;
    error: string | null;
    customMessage: string;
    isSucess: boolean;
    value: AuditTrails[];
}
