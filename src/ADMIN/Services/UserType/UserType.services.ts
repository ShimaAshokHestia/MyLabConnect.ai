import { API_ENDPOINTS } from "../../../CONSTANTS/API_ENDPOINTS";
import HttpService from "../../../Services/Common/HttpService";
import type { UserType } from "../../Types/UserType/UserType.types";

export default class UserTypeService {

    // 🔹 Get All
    static async getAll(): Promise<UserType[]> {
        const response = await HttpService.callApi<any>(
            API_ENDPOINTS.USER_TYPE.GET_ALL,
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
    static async getById(id: number): Promise<UserType> {
        const response = await HttpService.callApi<any>(
            API_ENDPOINTS.USER_TYPE.GET_BY_ID(id),
            "GET"
        );
        console.log("getById response:", response);
        return response;
    }

    // 🔹 Create
    static async create(data: Partial<UserType>): Promise<UserType> {
        const payload = {
            userTypeName:    data.userTypeName,
            isAdminAdable:   data.isAdminAdable   ?? false,
            isDSOAddable:    data.isDSOAddable     ?? false,
            isLabAddable:    data.isLabAddable     ?? false,
            isDoctorAddable: data.isDoctorAddable  ?? false,
            isPMAddable:     data.isPMAddable      ?? false,
            isActive:        data.isActive         ?? true,
            isDeleted:       data.isDeleted        ?? false,
        };

        const response = await HttpService.callApi<any>(
            API_ENDPOINTS.USER_TYPE.CREATE,
            "POST",
            payload
        );
        console.log("create response:", response);
        return response;
    }

    // 🔹 Update
    static async update(id: number, data: Partial<UserType>): Promise<UserType> {
        const payload: Partial<UserType> = {
            id: id,
            ...data,
        };

        const response = await HttpService.callApi<any>(
            API_ENDPOINTS.USER_TYPE.UPDATE(id),
            "PUT",
            payload
        );
        console.log("update response:", response);
        return response;
    }

    // 🔹 Delete
    static async delete(id: number): Promise<void> {
        await HttpService.callApi<void>(
            API_ENDPOINTS.USER_TYPE.DELETE(id),
            "DELETE"
        );
        console.log(`UserType with id ${id} deleted successfully`);
    }
}