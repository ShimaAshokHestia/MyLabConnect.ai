import { API_ENDPOINTS } from "../../../CONSTANTS/API_ENDPOINTS";
import HttpService from "../../../Services/Common/HttpService";
import type { DSOProductGroup } from "../../Types/Masters/DsoProductGroup.types";

export default class DSOProductGroupService {

    // 🔹 Get All
    static async getAll(): Promise<DSOProductGroup[]> {
        const response = await HttpService.callApi<any>(
            API_ENDPOINTS.DSO_PRODUCT_GROUP.GET_ALL,
            "GET"
        );
        console.log("getAll response:", response);

        // ✅ handle all possible shapes
        if (Array.isArray(response)) return response;
        if (Array.isArray(response?.value)) return response.value;
        if (Array.isArray(response?.data)) return response.data;
        return [];
    }

    // 🔹 Get By Id
  static async getById(id: number): Promise<any> {  // ✅ change return type to any
  return await HttpService.callApi<any>(
    API_ENDPOINTS.DSO_PRODUCT_GROUP.GET_BY_ID(id),
    "GET"
  );
}

    // 🔹 Create
    static async create(data: DSOProductGroup): Promise<DSOProductGroup> {
        const response = await HttpService.callApi<any>(
            API_ENDPOINTS.DSO_PRODUCT_GROUP.CREATE,
            "POST",
            data
        );
        console.log("create response:", response);
        return response;
    }

    // 🔹 Update
    static async update(id: number, data: DSOProductGroup): Promise<DSOProductGroup> {
        return await HttpService.callApi<DSOProductGroup>(
            API_ENDPOINTS.DSO_PRODUCT_GROUP.UPDATE(id),
            "PUT",
            data
        );
    }

    // 🔹 Delete
    static async delete(id: number): Promise<void> {
        await HttpService.callApi<void>(
            API_ENDPOINTS.DSO_PRODUCT_GROUP.DELETE(id),
            "DELETE"
        );
    }

    // 🔹 Pagination (Server Table)
    static async getPaginated(payload: DSOProductGroup): Promise<{
        data: DSOProductGroup[];
        totalCount: number;
    }> {

        const response = await HttpService.callApi<any>(
            API_ENDPOINTS.DSO_PRODUCT_GROUP.UPDATE_PAGINATION,
            "POST",
            payload
        );

        return {
            data: response.data ?? response.items ?? [],
            totalCount: response.totalCount ?? response.totalRecords ?? 0,
        };
    }
}
