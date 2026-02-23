import { API_ENDPOINTS } from "../../../CONSTANTS/API_ENDPOINTS";
import type { TableRequestParams, TableResponse } from "../../../KIDU_COMPONENTS/KiduServerTable";
import HttpService from "../../../Services/Common/HttpService";
import type { DSOmaster } from "../../Types/Master/Master.types";

export default class DSOmasterService {

    // 🔹 Get Paginated List (matches DSO Doctor pattern)
    static async getPaginatedList(params: TableRequestParams): Promise<TableResponse<DSOmaster>> {
        
        // Map "Active"/"Inactive" select filter to showInactive boolean
        let showInactive: boolean | undefined = undefined;
        const statusFilter = params["isActive"];
        if (statusFilter === "Active") showInactive = true;
        if (statusFilter === "Inactive") showInactive = false;

        const payload = {
            pageNumber: params.pageNumber,
            pageSize: params.pageSize,
            searchTerm: params.searchTerm ?? "",
            sortBy: params.sortBy ?? "",
            sortDescending: params.sortDescending ?? false,
            showDeleted: false,
            showInactive: showInactive,

            // Column filters
            name: params["name"] ?? "",
            description: params["description"] ?? "",
            id: params["id"] ? Number(params["id"]) : undefined,
        };

        const response = await HttpService.callApi<any>(
            API_ENDPOINTS.DSO_MASTER.UPDATE_PAGINATION,
            "POST",
            payload
        );

        const result = response?.value ?? response;

        return {
            data: result.data ?? result.items ?? [],
            total: result.totalRecords ?? result.total ?? 0,
            totalPages: result.totalPages,
        };
    }

    // 🔹 Get All (keep existing for popups/dropdowns)
    static async getAll(): Promise<DSOmaster[]> {
        const response = await HttpService.callApi<any>(
            API_ENDPOINTS.DSO_MASTER.GET_ALL,
            "GET"
        );

        if (Array.isArray(response)) return response;
        if (Array.isArray(response?.value)) return response.value;
        if (Array.isArray(response?.data)) return response.data;
        if (Array.isArray(response?.items)) return response.items;
        return [];
    }

    // 🔹 Get By Id
    static async getById(id: number): Promise<any> {
        return await HttpService.callApi<any>(
            API_ENDPOINTS.DSO_MASTER.GET_BY_ID(id),
            "GET"
        );
    }

    // 🔹 Create
    static async create(data: Partial<DSOmaster>): Promise<any> {
        const payload = {
            name: data.name,
            description: data.description,
            isActive: data.isActive ?? true,
            isDeleted: false,
        };

        return await HttpService.callApi<any>(
            API_ENDPOINTS.DSO_MASTER.CREATE,
            "POST",
            payload
        );
    }

    // 🔹 Update
    static async update(id: number, data: Partial<DSOmaster>): Promise<any> {
        const payload = {
            id,
            name: data.name,
            description: data.description,
            isActive: data.isActive ?? true,
        };

        return await HttpService.callApi<any>(
            API_ENDPOINTS.DSO_MASTER.UPDATE(id),
            "PUT",
            payload
        );
    }

    // 🔹 Delete
    static async delete(id: number): Promise<void> {
        await HttpService.callApi<void>(
            API_ENDPOINTS.DSO_MASTER.DELETE(id),
            "DELETE"
        );
    }
}