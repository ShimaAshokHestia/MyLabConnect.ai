import { API_ENDPOINTS } from "../../../CONSTANTS/API_ENDPOINTS";
import HttpService from "../../../Services/Common/HttpService";
import type { DSOZone } from "../../Types/Setup/DsoZone.types";

export default class DSOZoneService {

    // 🔹 Get All Zones
    static async getAll(): Promise<DSOZone[]> {
        const response = await HttpService.callApi<any>(
            API_ENDPOINTS.DSO_ZONE.GET_ALL,
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

    // 🔹 Get Zone By Id
    static async getById(id: number): Promise<DSOZone> {
        const response = await HttpService.callApi<any>(
            API_ENDPOINTS.DSO_ZONE.GET_BY_ID(id),
            "GET"
        );
        console.log("getById response:", response);
        return response;
    }

    // 🔹 Create New Zone
    static async create(data: Partial<DSOZone>): Promise<DSOZone> {
        // Ensure we're sending the right payload structure
        const payload = {
            name: data.name,
            dsoMasterId: data.dsoMasterId,
            isActive: data.isActive ?? true,
            isDeleted: false
        };

        const response = await HttpService.callApi<any>(
            API_ENDPOINTS.DSO_ZONE.CREATE,
            "POST",
            payload
        );
        console.log("create response:", response);
        return response;
    }

    // 🔹 Update Zone
    static async update(id: number, data: Partial<DSOZone>): Promise<DSOZone> {
        // Prepare update payload
        const payload: Partial<DSOZone> = {
            id: id,
            ...data
        };

        const response = await HttpService.callApi<any>(
            API_ENDPOINTS.DSO_ZONE.UPDATE(id),
            "PUT",
            payload
        );
        console.log("update response:", response);
        return response;
    }

    // 🔹 Delete Zone
    static async delete(id: number): Promise<void> {
        await HttpService.callApi<void>(
            API_ENDPOINTS.DSO_ZONE.DELETE(id),
            "DELETE"
        );
        console.log(`Zone with id ${id} deleted successfully`);
    }

    // 🔹 Get Paginated Zones (Server Table)
    static async getPaginated(payload: Partial<DSOZone>): Promise<{
        data: DSOZone[];
        totalCount: number;
        totalPages?: number;
        currentPage?: number;
    }> {
        const response = await HttpService.callApi<any>(
            API_ENDPOINTS.DSO_ZONE.UPDATE_PAGINATION,
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

    // 🔹 Search Zones by Name
    static async searchZones(searchTerm: string): Promise<DSOZone[]> {
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

    // 🔹 Get Zones by DSO Master
    static async getByDSOMaster(dsoMasterId: number): Promise<DSOZone[]> {
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

    // 🔹 Get Active Zones Only
    static async getActiveZones(): Promise<DSOZone[]> {
        const zones = await this.getAll();
        return zones.filter(zone => zone.isActive === true && zone.isDeleted === false);
    }

    // 🔹 Toggle Zone Active Status
    static async toggleActiveStatus(id: number, currentStatus: boolean): Promise<DSOZone> {
        return await this.update(id, { isActive: !currentStatus });
    }

    // 🔹 Soft Delete Zone
    static async softDelete(id: number): Promise<DSOZone> {
        return await this.update(id, { isDeleted: true });
    }

    // 🔹 Restore Soft Deleted Zone
    static async restoreZone(id: number): Promise<DSOZone> {
        return await this.update(id, { isDeleted: false });
    }

    // 🔹 Get Zone by Name (exact match)
    static async getByName(name: string): Promise<DSOZone | null> {
        const payload = {
            name,
            pageNumber: 1,
            pageSize: 1,
            showDeleted: false,
            showInactive: true
        };
        
        const result = await this.getPaginated(payload);
        return result.data.length > 0 ? result.data[0] : null;
    }

    // 🔹 Check if Zone name exists (for validation)
    static async isZoneNameUnique(name: string, excludeId?: number): Promise<boolean> {
        const zones = await this.searchZones(name);
        return !zones.some(zone => 
            zone.name?.toLowerCase() === name.toLowerCase() && 
            zone.id !== excludeId &&
            !zone.isDeleted
        );
    }

    // 🔹 Bulk operations
    static async bulkDelete(ids: number[]): Promise<void> {
        for (const id of ids) {
            await this.delete(id);
        }
        console.log(`Bulk deleted zones: ${ids.join(', ')}`);
    }

    static async bulkSoftDelete(ids: number[]): Promise<void> {
        for (const id of ids) {
            await this.softDelete(id);
        }
        console.log(`Bulk soft deleted zones: ${ids.join(', ')}`);
    }

    static async bulkRestore(ids: number[]): Promise<void> {
        for (const id of ids) {
            await this.restoreZone(id);
        }
        console.log(`Bulk restored zones: ${ids.join(', ')}`);
    }

    static async bulkToggleActive(ids: number[], active: boolean): Promise<void> {
        for (const id of ids) {
            await this.update(id, { isActive: active });
        }
        console.log(`Bulk ${active ? 'activated' : 'deactivated'} zones: ${ids.join(', ')}`);
    }

    // 🔹 Get statistics
    static async getStatistics(): Promise<{
        total: number;
        active: number;
        inactive: number;
        deleted: number;
        byDSOMaster: Record<number, number>;
    }> {
        const allZones = await this.getAll();
        
        const stats = {
            total: allZones.length,
            active: allZones.filter(z => z.isActive && !z.isDeleted).length,
            inactive: allZones.filter(z => !z.isActive && !z.isDeleted).length,
            deleted: allZones.filter(z => z.isDeleted).length,
            byDSOMaster: {} as Record<number, number>
        };

        allZones.forEach(zone => {
            if (zone.dsoMasterId && !zone.isDeleted) {
                stats.byDSOMaster[zone.dsoMasterId] = (stats.byDSOMaster[zone.dsoMasterId] || 0) + 1;
            }
        });

        return stats;
    }

    // 🔹 Export zones (for Excel/CSV)
    static async exportZones(format: 'csv' | 'excel' = 'csv'): Promise<Blob> {
        const zones = await this.getAll();
        
        // Convert to appropriate format
        if (format === 'csv') {
            const headers = ['ID', 'Name', 'DSO Master', 'Status', 'Created At', 'Updated At'];
            const rows = zones.map(z => [
                z.id,
                z.name,
                z.dsoName,
                z.isActive ? 'Active' : 'Inactive',
                z.createdAt,
                z.updatedAt || ''
            ]);
            
            const csvContent = [headers, ...rows]
                .map(row => row.join(','))
                .join('\n');
            
            return new Blob([csvContent], { type: 'text/csv' });
        }
        
        // For Excel, you'd typically use a library like xlsx
        throw new Error('Excel export not implemented');
    }
}