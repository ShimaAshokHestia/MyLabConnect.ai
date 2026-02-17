import { API_ENDPOINTS } from "../../../CONSTANTS/API_ENDPOINTS";
import HttpService from "../../../Services/Common/HttpService";
import type { DSODoctor } from "../../Types/Masters/DsoDoctor.types";

export default class DSODoctorService {

    // 🔹 Get All Doctors
    static async getAll(): Promise<DSODoctor[]> {
        const response = await HttpService.callApi<any>(
            API_ENDPOINTS.DSO_DOCTOR.GET_ALL,
            "GET"
        );
        console.log("getAll response:", response);

        // Handle all possible response shapes
        if (Array.isArray(response)) return response;
        if (Array.isArray(response?.value)) return response.value;
        if (Array.isArray(response?.data)) return response.data;
        if (Array.isArray(response?.items)) return response.items;
        return [];
    }

    // 🔹 Get Doctor By Id
    static async getById(id: number): Promise<DSODoctor> {
        const response = await HttpService.callApi<any>(
            API_ENDPOINTS.DSO_DOCTOR.GET_BY_ID(id),
            "GET"
        );
        console.log("getById response:", response);
        return response;
    }

    // 🔹 Create New Doctor
    static async create(data: Partial<DSODoctor>): Promise<DSODoctor> {
        // Ensure we're sending the right payload structure
        const payload = {
            firstName: data.firstName,
            lastName: data.lastName,
            fullName: data.firstName && data.lastName ? `${data.firstName} ${data.lastName}` : undefined,
            email: data.email,
            phoneNumber: data.phoneNumber,
            address: data.address,
            licenseNo: data.licenseNo,
            doctorCode: data.doctorCode,
            info: data.info,
            dsoMasterId: data.dsoMasterId,
            isActive: data.isActive ?? true,
            isDeleted: false
        };

        const response = await HttpService.callApi<any>(
            API_ENDPOINTS.DSO_DOCTOR.CREATE,
            "POST",
            payload
        );
        console.log("create response:", response);
        return response;
    }

    // 🔹 Update Doctor
    static async update(id: number, data: Partial<DSODoctor>): Promise<DSODoctor> {
        // Prepare update payload
        const payload: Partial<DSODoctor> = {
            id: id,
            ...data
        };

        // If both firstName and lastName are provided, update fullName
        if (data.firstName && data.lastName) {
            payload.fullName = `${data.firstName} ${data.lastName}`;
        }

        const response = await HttpService.callApi<any>(
            API_ENDPOINTS.DSO_DOCTOR.UPDATE(id),
            "PUT",
            payload
        );
        console.log("update response:", response);
        return response;
    }

    // 🔹 Delete Doctor
    static async delete(id: number): Promise<void> {
        await HttpService.callApi<void>(
            API_ENDPOINTS.DSO_DOCTOR.DELETE(id),
            "DELETE"
        );
        console.log(`Doctor with id ${id} deleted successfully`);
    }

    // 🔹 Get Paginated Doctors (Server Table)
    static async getPaginated(payload: Partial<DSODoctor>): Promise<{
        data: DSODoctor[];
        totalCount: number;
        totalPages?: number;
        currentPage?: number;
    }> {
        const response = await HttpService.callApi<any>(
            API_ENDPOINTS.DSO_DOCTOR.UPDATE_PAGINATION,
            "POST",
            payload
        );
        console.log("getPaginated response:", response);

        // Handle different response structures
        return {
            data: response.data ?? response.items ?? response.results ?? [],
            totalCount: response.totalCount ?? response.totalRecords ?? response.total ?? 0,
            totalPages: response.totalPages,
            currentPage: response.currentPage ?? response.pageNumber
        };
    }

    // 🔹 Search Doctors
    static async searchDoctors(searchTerm: string): Promise<DSODoctor[]> {
        const payload = {
            searchTerm,
            pageNumber: 1,
            pageSize: 100,
            showDeleted: false,
            showInactive: true
        };
        
        const result = await this.getPaginated(payload);
        return result.data;
    }

    // 🔹 Get Doctors by DSO Master
    static async getByDSOMaster(dsoMasterId: number): Promise<DSODoctor[]> {
        const payload = {
            dsoMasterId,
            pageNumber: 1,
            pageSize: 100,
            showDeleted: false,
            showInactive: true
        };
        
        const result = await this.getPaginated(payload);
        return result.data;
    }

    // 🔹 Get Active Doctors Only
    static async getActiveDoctors(): Promise<DSODoctor[]> {
        const doctors = await this.getAll();
        return doctors.filter(doctor => doctor.isActive === true && doctor.isDeleted === false);
    }

    // 🔹 Toggle Doctor Active Status
    static async toggleActiveStatus(id: number, currentStatus: boolean): Promise<DSODoctor> {
        return await this.update(id, { isActive: !currentStatus });
    }

    // 🔹 Soft Delete Doctor
    static async softDelete(id: number): Promise<DSODoctor> {
        return await this.update(id, { isDeleted: true });
    }

    // 🔹 Restore Soft Deleted Doctor
    static async restoreDoctor(id: number): Promise<DSODoctor> {
        return await this.update(id, { isDeleted: false });
    }

    // 🔹 Get Doctor by License Number
    static async getByLicenseNo(licenseNo: string): Promise<DSODoctor | null> {
        const payload = {
            licenseNo,
            pageNumber: 1,
            pageSize: 1,
            showDeleted: false,
            showInactive: true
        };
        
        const result = await this.getPaginated(payload);
        return result.data.length > 0 ? result.data[0] : null;
    }

    // 🔹 Get Doctor by Doctor Code
    static async getByDoctorCode(doctorCode: string): Promise<DSODoctor | null> {
        const payload = {
            doctorCode,
            pageNumber: 1,
            pageSize: 1,
            showDeleted: false,
            showInactive: true
        };
        
        const result = await this.getPaginated(payload);
        return result.data.length > 0 ? result.data[0] : null;
    }

    // 🔹 Bulk operations
    static async bulkDelete(ids: number[]): Promise<void> {
        for (const id of ids) {
            await this.delete(id);
        }
        console.log(`Bulk deleted doctors: ${ids.join(', ')}`);
    }

    static async bulkSoftDelete(ids: number[]): Promise<void> {
        for (const id of ids) {
            await this.softDelete(id);
        }
        console.log(`Bulk soft deleted doctors: ${ids.join(', ')}`);
    }

    static async bulkRestore(ids: number[]): Promise<void> {
        for (const id of ids) {
            await this.restoreDoctor(id);
        }
        console.log(`Bulk restored doctors: ${ids.join(', ')}`);
    }

    // 🔹 Get statistics
    static async getStatistics(): Promise<{
        total: number;
        active: number;
        inactive: number;
        deleted: number;
        byDSOMaster: Record<number, number>;
    }> {
        const allDoctors = await this.getAll();
        
        const stats = {
            total: allDoctors.length,
            active: allDoctors.filter(d => d.isActive && !d.isDeleted).length,
            inactive: allDoctors.filter(d => !d.isActive && !d.isDeleted).length,
            deleted: allDoctors.filter(d => d.isDeleted).length,
            byDSOMaster: {} as Record<number, number>
        };

        allDoctors.forEach(doctor => {
            if (doctor.dsoMasterId && !doctor.isDeleted) {
                stats.byDSOMaster[doctor.dsoMasterId] = (stats.byDSOMaster[doctor.dsoMasterId] || 0) + 1;
            }
        });

        return stats;
    }
}