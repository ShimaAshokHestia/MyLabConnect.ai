import { API_ENDPOINTS } from "../../../CONSTANTS/API_ENDPOINTS";
import HttpService from "../../../Services/Common/HttpService";
import type { DSOmaster } from "../../Types/Master/Master.types";

export default class DSOmasterService {

    // 🔹 Get All
    static async getAll(): Promise<DSOmaster[]> {
        const response = await HttpService.callApi<any>(
            API_ENDPOINTS.DSO_MASTER.GET_ALL,
            "GET"
        );
        console.log("getAll response:", response);

        if (Array.isArray(response))        return response;
        if (Array.isArray(response?.value)) return response.value;
        if (Array.isArray(response?.data))  return response.data;
        if (Array.isArray(response?.items)) return response.items;
        return [];
    }

    // 🔹 Get By Id
    static async getById(id: number): Promise<DSOmaster> {
        const response = await HttpService.callApi<any>(
            API_ENDPOINTS.DSO_MASTER.GET_BY_ID(id),
            "GET"
        );
        console.log("getById response:", response);
        return response;
    }

    // 🔹 Create
    static async create(data: Partial<DSOmaster>): Promise<DSOmaster> {
        const payload = {
            name:        data.name,
            description: data.description,
            isActive:    data.isActive ?? true,
            isDeleted:   false,
        };

        const response = await HttpService.callApi<any>(
            API_ENDPOINTS.DSO_MASTER.CREATE,
            "POST",
            payload
        );
        console.log("create response:", response);
        return response;
    }

    // 🔹 Update
    static async update(id: number, data: Partial<DSOmaster>): Promise<DSOmaster> {
        const payload: Partial<DSOmaster> = {
            id: id,
            ...data,
        };

        const response = await HttpService.callApi<any>(
            API_ENDPOINTS.DSO_MASTER.UPDATE(id),
            "PUT",
            payload
        );
        console.log("update response:", response);
        return response;
    }

    // 🔹 Delete
    static async delete(id: number): Promise<void> {
        await HttpService.callApi<void>(
            API_ENDPOINTS.DSO_MASTER.DELETE(id),
            "DELETE"
        );
        console.log(`DSO Master with id ${id} deleted successfully`);
    }
}