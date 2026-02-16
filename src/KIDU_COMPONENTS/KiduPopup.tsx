// KiduPopup.tsx - Fixed to match POS project (client-side filtering)
import React, { useState, useCallback, useEffect } from "react";
import { Modal, Spinner } from "react-bootstrap";
import type { CustomResponse } from "../Types/ApiTypes";
import HttpService from "../Services/Common/HttpService";
import KiduServerTable from "./KiduServerTable";

interface KiduPopupProps<T> {
  show: boolean;
  handleClose: () => void;
  title: string;
  fetchEndpoint: string;
  columns: { key: keyof T; label: string }[];
  onSelect?: (item: T) => void;
  AddModalComponent?: React.ComponentType<{
    show: boolean;
    handleClose: () => void;
    onAdded: (newItem: T) => void;
  }>;
  idKey?: string;
  rowsPerPage?: number;
  searchKeys?: (keyof T)[]; // Keys to search in
  showAddButton?: boolean; // Control whether to show add button in empty state
}

function KiduPopup<T extends Record<string, any>>({
  show,
  handleClose,
  title,
  fetchEndpoint,
  columns,
  onSelect,
  AddModalComponent,
  idKey = "id",
  rowsPerPage = 10,
  searchKeys,
  showAddButton = true // Default to true for backward compatibility
}: KiduPopupProps<T>) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [allData, setAllData] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch ALL data once when modal opens
  useEffect(() => {
    if (!show) return;
    
    setLoading(true);
    HttpService.callApi<CustomResponse<T[]>>(fetchEndpoint, "GET")
      .then((res) => {
        console.log("✅ Fetched all data:", res);
        
        if (Array.isArray(res)) {
          setAllData(res);
        } else if ((res.isSuccess || res.isSucess) && res.value) {
          if (Array.isArray(res.value)) {
            setAllData(res.value);
          } else if (typeof res.value === "object" && "data" in res.value) {
            const valueObj = res.value as any;
            setAllData(Array.isArray(valueObj.data) ? valueObj.data : []);
          }
        } else {
          console.warn("⚠️ Unexpected API format:", res);
          setAllData([]);
        }
      })
      .catch((err) => {
        console.error("❌ Error fetching popup data:", err);
        setAllData([]);
      })
      .finally(() => setLoading(false));
  }, [show, fetchEndpoint, refreshKey]);

  // Client-side fetch function for KiduServerTable
  const fetchData = useCallback(async (params: {
    pageNumber: number;
    pageSize: number;
    searchTerm: string;
  }) => {
    // Filter data client-side
    let filteredData = allData;
    
    if (params.searchTerm && params.searchTerm.trim()) {
      const searchLower = params.searchTerm.toLowerCase();
      
      filteredData = allData.filter(item => {
        // If searchKeys provided, search only in those fields
        if (searchKeys && searchKeys.length > 0) {
          return searchKeys.some(key => 
            item[key] && String(item[key]).toLowerCase().includes(searchLower)
          );
        }
        
        // Otherwise search in all fields
        return Object.values(item).some(val => 
          String(val).toLowerCase().includes(searchLower)
        );
      });
    }
    
    // Client-side pagination
    const startIndex = (params.pageNumber - 1) * params.pageSize;
    const endIndex = startIndex + params.pageSize;
    const paginatedData = filteredData.slice(startIndex, endIndex);
    
    return { 
      data: paginatedData, 
      total: filteredData.length 
    };
  }, [allData, searchKeys]);

  const handleRowClick = (item: T) => {
    onSelect?.(item);
    handleClose();
  };

  const handleAddNew = (newItem: T) => {
    setShowAddModal(false);
    // Add new item to data
    setAllData(prev => [newItem, ...prev]);
    // Trigger refresh to reload the table
    setRefreshKey(prev => prev + 1);
  };

  const handleModalClose = () => {
    handleClose();
    // Reset search when closing
    setRefreshKey(prev => prev + 1);
  };

  return (
    <>
      <Modal 
        show={show} 
        onHide={handleModalClose} 
        size="lg" 
        centered 
        className="head-font"
      >
        <Modal.Header 
          closeButton 
          style={{ 
            backgroundColor: "#f8f9fa",
            borderBottom: "2px solid #173a6a"
          }}
        >
          <Modal.Title className="fs-5 fw-bold" style={{ color: "#173a6a" }}>
            {title}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body style={{ height: '350px', overflow: 'hidden', padding: 0 }}>
          {loading && allData.length === 0 ? (
            <div className="text-center py-5">
              <Spinner animation="border" /> <span className="ms-2">Loading...</span>
            </div>
          ) : (
            <div key={refreshKey} style={{ height: '100%', overflow: 'auto', padding: '15px' }}>
              <KiduServerTable
                columns={columns.map(col => ({ 
                  key: String(col.key), 
                  label: col.label 
                }))}
                idKey={idKey}
                fetchData={fetchData}
                showActions={false}
                showSearch={true}
                showTitle={false}
                showKiduPopupButton={showAddButton && !!AddModalComponent} // Only show if both enabled
                addRoute={showAddButton && AddModalComponent ? "#" : undefined}
                addButtonLabel={title.replace("Select ", "")}
                onRowClick={handleRowClick}
                onAddClick={() => setShowAddModal(true)}
                rowsPerPage={rowsPerPage}
              />
            </div>
          )}
        </Modal.Body>
      </Modal>

      {/* Add Modal */}
      {AddModalComponent && (
        <AddModalComponent
          show={showAddModal}
          handleClose={() => setShowAddModal(false)}
          onAdded={handleAddNew}
        />
      )}
    </>
  );
}

export default KiduPopup;