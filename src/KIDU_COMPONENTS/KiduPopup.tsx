import React, { useState, useCallback, useEffect } from "react";
import { Modal, Spinner } from "react-bootstrap";
import HttpService from "../Services/Common/HttpService";
import KiduServerTable from "./KiduServerTable";
import type { CustomResponse } from "../Types/Common/ApiTypes";
import type { TableRequestParams, TableResponse } from "./KiduServerTable";

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
  searchKeys?: (keyof T)[];
  showAddButton?: boolean;
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
  showAddButton = true,
}: KiduPopupProps<T>) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [refreshKey,   setRefreshKey]   = useState(0);
  const [allData,      setAllData]      = useState<T[]>([]);
  const [loading,      setLoading]      = useState(false);

  // Fetch ALL data once when modal opens
  useEffect(() => {
    if (!show) return;

    setLoading(true);
    HttpService.callApi<CustomResponse<T[]>>(fetchEndpoint, "GET")
      .then((res) => {
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
          setAllData([]);
        }
      })
      .catch(() => setAllData([]))
      .finally(() => setLoading(false));
  }, [show, fetchEndpoint, refreshKey]);

  // ── fetchData typed as TableRequestParams to match KiduServerTable ────────
  const fetchData = useCallback(
    async (params: TableRequestParams): Promise<TableResponse<T>> => {
      let filteredData = allData;

      const search = params.searchTerm?.trim();
      if (search) {
        const lower = search.toLowerCase();
        filteredData = allData.filter((item) => {
          if (searchKeys && searchKeys.length > 0) {
            return searchKeys.some(
              (key) => item[key] && String(item[key]).toLowerCase().includes(lower)
            );
          }
          return Object.values(item).some((val) =>
            String(val).toLowerCase().includes(lower)
          );
        });
      }

      const startIndex   = (params.pageNumber - 1) * params.pageSize;
      const paginatedData = filteredData.slice(startIndex, startIndex + params.pageSize);

      return { data: paginatedData, total: filteredData.length };
    },
    [allData, searchKeys]
  );

  const handleRowClick = (item: T) => {
    onSelect?.(item);
    handleClose();
  };

  const handleAddNew = (newItem: T) => {
    setShowAddModal(false);
    setAllData((prev) => [newItem, ...prev]);
    setRefreshKey((prev) => prev + 1);
  };

  const handleModalClose = () => {
    handleClose();
    setRefreshKey((prev) => prev + 1);
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
          style={{ backgroundColor: "#f8f9fa", borderBottom: "2px solid #173a6a" }}
        >
          <Modal.Title className="fs-5 fw-bold" style={{ color: "#173a6a" }}>
            {title}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body style={{ height: "350px", overflow: "hidden", padding: 0 }}>
          {loading && allData.length === 0 ? (
            <div className="text-center py-5">
              <Spinner animation="border" />
              <span className="ms-2">Loading...</span>
            </div>
          ) : (
            <div key={refreshKey} style={{ height: "100%", overflow: "auto", padding: "15px" }}>
              <KiduServerTable
                columns={columns.map((col) => ({ key: String(col.key), label: col.label }))}
                rowKey={idKey}
                fetchData={fetchData}
                showActions={false}
                showSearch={true}
                showAddButton={showAddButton && !!AddModalComponent}
                addRoute={showAddButton && AddModalComponent ? "#" : undefined}
                addButtonLabel={title.replace("Select ", "")}
                onRowClick={handleRowClick}
                onAddClick={() => setShowAddModal(true)}
                defaultRowsPerPage={rowsPerPage}
              />
            </div>
          )}
        </Modal.Body>
      </Modal>

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