import { API_ENDPOINTS } from "../../../CONSTANTS/API_ENDPOINTS";
import HttpService from "../../../Services/Common/HttpService";
import type { User } from "../../Types/User/User.types";

export default class UserService {

    // 🔹 Get All
    static async getAll(): Promise<User[]> {
        const response = await HttpService.callApi<any>(
            API_ENDPOINTS.USER.GET_ALL,
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
    static async getById(id: number): Promise<User> {
        const response = await HttpService.callApi<any>(
            API_ENDPOINTS.USER.GET_BY_ID(id),
            "GET"
        );
        console.log("getById response:", response);
        return response;
    }

    // 🔹 Create
    static async create(data: Partial<User>): Promise<User> {
        const payload = {
            userName:           data.userName,
            userEmail:          data.userEmail,
            phoneNumber:        data.phoneNumber,
            address:            data.address,
            passwordHash:       data.passwordHash,
            userTypeId:         data.userTypeId,
            companyId:          data.companyId,
            authenticationType: data.authenticationType ?? 0,
            islocked:           data.islocked           ?? false,
            isActive:           data.isActive           ?? true,
            isDeleted:          data.isDeleted          ?? false,
        };

        const response = await HttpService.callApi<any>(
            API_ENDPOINTS.USER.CREATE,
            "POST",
            payload
        );
        console.log("create response:", response);
        return response;
    }

    // 🔹 Update
    static async update(id: number, data: Partial<User>): Promise<User> {
        const payload: Partial<User> = {
            id: id,
            ...data,
        };

        const response = await HttpService.callApi<any>(
            API_ENDPOINTS.USER.UPDATE(id),
            "PUT",
            payload
        );
        console.log("update response:", response);
        return response;
    }

    // 🔹 Delete
    static async delete(id: number): Promise<void> {
        await HttpService.callApi<void>(
            API_ENDPOINTS.USER.DELETE(id),
            "DELETE"
        );
        console.log(`User with id ${id} deleted successfully`);
    }

    // 🔹 Change Password
    // static async changePassword(id: number, data: UserPasswordChange): Promise<void> {
    //     const payload: UserPasswordChange = {
    //         userId:      id,
    //         oldPassword: data.oldPassword,
    //         newPassword: data.newPassword,
    //     };

        // await HttpService.callApi<void>(
        //     API_ENDPOINTS.USER.CHANGE_PASSWORD(id),
        //     "PUT",
        //     payload
        // );
    //     console.log(`Password changed for user id ${id}`);
    // }
}