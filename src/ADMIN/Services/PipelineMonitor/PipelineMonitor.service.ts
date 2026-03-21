// src/Services/PipelineMonitor/PipelineMonitor.service.ts
import HttpService from "../../../Services/Common/HttpService";
import { API_BASE_URL } from "../../../CONSTANTS/API_ENDPOINTS";
import type { PipelineDashboard, PipelineAlert, PipelineRunLog, StuckCase, ErrorGroup, DeadLetter, AutoCreatedDoctor } from "../../Types/PipelineMonitor/PipelineMonitor.types";

const BASE = `${API_BASE_URL}/pipeline-monitor`;

export default class PipelineMonitorService {

  static async getDashboard(): Promise<PipelineDashboard> {
    const response = await HttpService.callApi<any>(`${BASE}/dashboard`, "GET");
    return response?.value ?? response;
  }

  static async getRecentRuns(count = 50): Promise<PipelineRunLog[]> {
    const response = await HttpService.callApi<any>(`${BASE}/runs?count=${count}`, "GET");
    const result = response?.value ?? response;
    return Array.isArray(result) ? result : [];
  }

  static async getActiveAlerts(): Promise<PipelineAlert[]> {
    const response = await HttpService.callApi<any>(`${BASE}/alerts`, "GET");
    const result = response?.value ?? response;
    return Array.isArray(result) ? result : [];
  }

  static async resolveAlert(id: number, note?: string): Promise<void> {
    await HttpService.callApi<void>(`${BASE}/alerts/${id}/resolve`, "PATCH", { note: note ?? "" });
  }

  static async getStuckCases(hoursThreshold = 2): Promise<StuckCase[]> {
    const response = await HttpService.callApi<any>(`${BASE}/stuck-cases?hoursThreshold=${hoursThreshold}`, "GET");
    const result = response?.value ?? response;
    return Array.isArray(result) ? result : [];
  }

  static async getErrorGroups(): Promise<ErrorGroup[]> {
    const response = await HttpService.callApi<any>(`${BASE}/error-groups`, "GET");
    const result = response?.value ?? response;
    return Array.isArray(result) ? result : [];
  }

  static async getDeadLetter(): Promise<DeadLetter> {
    const response = await HttpService.callApi<any>(`${BASE}/dead-letter`, "GET");
    return response?.value ?? response;
  }

  static async getAutoCreatedDoctors(): Promise<AutoCreatedDoctor[]> {
    const response = await HttpService.callApi<any>(`${BASE}/auto-created-doctors`, "GET");
    const result = response?.value ?? response;
    return Array.isArray(result) ? result : [];
  }
}
