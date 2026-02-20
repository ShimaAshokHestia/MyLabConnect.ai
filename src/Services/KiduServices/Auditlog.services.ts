import { API_ENDPOINTS } from "../../CONSTANTS/API_ENDPOINTS";
import type { AuditLogResponse, AuditTrails } from "../../Types/Auditlog.types";
import HttpService from "../Common/HttpService";

class AuditLogService {
    static async getByTableAndId(
        tableName: string,
        recordId: number | string
    ): Promise<AuditLogResponse> {
        return HttpService.callApi(
            API_ENDPOINTS.AUDIT_LOG.GET_BY_TABLE_AND_ID(tableName, Number(recordId)),
            "GET"
        );
    }

    static async getLogsFromModel(
        model: Pick<AuditTrails, "tableName" | "recordID">
    ): Promise<AuditLogResponse> {
        return HttpService.callApi(
            API_ENDPOINTS.AUDIT_LOG.GET_BY_TABLE_AND_ID(model.tableName, model.recordID),
            "GET"
        );
    }
}

export default AuditLogService;