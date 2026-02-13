import React, { useState, useEffect } from "react";
import { Card, Table, Image, Button, Modal, Spinner } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import KiduLoader from "./KiduLoader";
import KiduPrevious from "./KiduPrevious";
import KiduAuditLogs from "./KiduAuditLogs";
import { Toaster } from "react-hot-toast";
import Attachments from "./KiduAttachments";


// ==================== TYPES ====================
export interface ViewField {
  key: string;
  label: string;
  icon?: string;
  isBoolean?: boolean;
  isDate?: boolean;
  formatter?: (value: any) => string;
}

export interface ImageConfig {
  fieldName: string;
  defaultImage: string;
  showNameField?: string;
  showIdField?: string;
  isCircle?: boolean;
}

export interface AuditLogConfig {
  tableName: string;
  recordIdField: string;
}

export interface AttachmentConfig  {
  tableName: string;
  recordIdField: string;
}

export interface KiduViewProps {
  title: string;
  fields: ViewField[];
  onFetch: (id: string) => Promise<any>;
  onDelete?: (id: string) => Promise<void>;
  editRoute?: string;
  listRoute: string;
  paramName?: string;
  imageConfig?: ImageConfig;
  auditLogConfig?: AuditLogConfig;
  attachmentConfig?:AttachmentConfig;
  themeColor?: string;
  loadingText?: string;
  showEditButton?: boolean;
  showDeleteButton?: boolean;
  deleteConfirmMessage?: string;
}

// ==================== COMPONENT ====================
const KiduView: React.FC<KiduViewProps> = ({
  title,
  fields,
  onFetch,
  onDelete,
  editRoute,
  listRoute,
  paramName = "id",
  imageConfig,
  auditLogConfig,
  attachmentConfig,
  themeColor = "#882626ff",
  loadingText = "Loading details...",
  showEditButton = true,
  showDeleteButton = true,
  deleteConfirmMessage = "Are you sure you want to delete this record?",
}) => {
  const navigate = useNavigate();
  const params = useParams();
  const recordId = params[paramName];

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);

  // ==================== FETCH DATA ====================
  useEffect(() => {
    const loadData = async () => {
      try {
        if (!recordId) {
          toast.error("No record ID provided");
          navigate(listRoute);
          return;
        }

        const response = await onFetch(recordId);

        if (!response || !response.isSucess) {
          throw new Error(
            response?.customMessage || response?.error || "Failed to load data"
          );
        }

        setData(response.value);
      } catch (error: any) {
        console.error("Failed to load data:", error);
        toast.error(`Error: ${error.message}`);
        navigate(listRoute);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [recordId, onFetch, listRoute, navigate]);

  // ==================== HANDLERS ====================
  const handleEdit = () => {
    if (editRoute && recordId) {
      navigate(`${editRoute}/${recordId}`);
    }
  };

  const handleDelete = async () => {
    if (!onDelete || !recordId) return;

    setLoadingDelete(true);
    try {
      await onDelete(recordId);
      toast.success("Deleted successfully");
      setTimeout(() => navigate(listRoute), 600);
    } catch (error: any) {
      console.error("Delete failed:", error);
      toast.error(`Error: ${error.message}`);
    } finally {
      setLoadingDelete(false);
      setShowConfirm(false);
    }
  };

  // ==================== FORMAT VALUE ====================
  const formatValue = (field: ViewField, value: any): string => {
    if (value === null || value === undefined || value === "") return "N/A";

    // Custom formatter
    if (field.formatter) {
      return field.formatter(value);
    }

    // Boolean
    if (field.isBoolean) {
      return value ? "Yes" : "No";
    }

    // Date
    if (field.isDate) {
      try {
        const date = new Date(value);
        if (!isNaN(date.getTime())) {
          return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          });
        }
      } catch (e) {
        return String(value);
      }
    }

    return String(value);
  };

  // ==================== GET IMAGE URL ====================
  const getImageUrl = (): string => {
    if (!imageConfig || !data) return "";

    const imageValue = data[imageConfig.fieldName];
    return imageValue || imageConfig.defaultImage;
  };

  // ==================== RENDER ====================
  if (loading) return <KiduLoader type={loadingText} />;

  if (!data) {
    return (
      <div className="text-center mt-5">
        <h5>No details found.</h5>
        <Button className="mt-3" onClick={() => navigate(listRoute)}>
          Back to List
        </Button>
      </div>
    );
  }

  const displayName = imageConfig?.showNameField
    ? data[imageConfig.showNameField]
    : null;
  const displayId = imageConfig?.showIdField
    ? data[imageConfig.showIdField]
    : auditLogConfig?.recordIdField
    ? data[auditLogConfig.recordIdField]
    : null;

  return (
    <div
      className="container-fluid d-flex justify-content-center align-items-center "
      style={{ fontFamily: "Urbanist" }}
    >
      <Card
        className="shadow-lg px-3 py-3 w-100"
        style={{
          maxWidth: "1450px",
          borderRadius: "5px",
          border: "none",
        }}
      >
        {/* HEADER */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div className="d-flex align-items-center">
            <KiduPrevious />
            <h5 className="fw-bold m-0 ms-2" style={{ color: themeColor }}>
              {title}
            </h5>
          </div>

          <div className="d-flex gap-2">
            {showEditButton && editRoute && (
              <Button
                className="d-flex align-items-center gap-2"
                style={{
                  backgroundColor: themeColor,
                  border: "none",
                  fontWeight: 500,
                }}
                onClick={handleEdit}
              >
                <FaEdit /> Edit
              </Button>
            )}

            {showDeleteButton && onDelete && (
              <Button
                variant="danger"
                className="d-flex align-items-center gap-2"
                style={{ fontWeight: 500 }}
                onClick={() => setShowConfirm(true)}
              >
                <FaTrash size={12} /> Delete
              </Button>
            )}
          </div>
        </div>

        {/* IMAGE & INFO SECTION */}
        {imageConfig ? (
          <div className="text-center mb-4">
            <Image
              src={getImageUrl()}
              alt={displayName || "Image"}
              roundedCircle={imageConfig.isCircle !== false}
              width={120}
              height={120}
              className="mb-3"
              style={{
                border: `3px solid ${themeColor}`,
                objectFit: "cover",
              }}
              onError={(e: any) => {
                e.target.src = imageConfig.defaultImage;
              }}
            />
            {displayName && (
              <h5 className="fw-bold mb-1">{displayName}</h5>
            )}
            {displayId && (
              <p className="small mb-0 fw-bold" style={{ color: themeColor }}>
                ID: {displayId}
              </p>
            )}
          </div>
        ) : (
          <div className="text-center mb-4">
            {displayName && (
              <h5 className="fw-bold mb-1">{displayName}</h5>
            )}
            {displayId && (
              <p className="small mb-0 fw-bold text-danger fs-5">
                ID: {displayId}
              </p>
            )}
          </div>
        )}

        {/* DETAILS TABLE */}
        <div className="table-responsive">
          <Table
            bordered
            hover
            responsive
            className="align-middle mb-0"
            style={{ fontFamily: "Urbanist", fontSize: "13px" }}
          >
            <tbody>
              {fields.map((field, index) => {
                const value = data[field.key];
                const formattedValue = formatValue(field, value);

                return (
                  <tr
                    key={field.key}
                    style={{
                      lineHeight: "1.2",
                      backgroundColor: index % 2 === 1 ? "#ffe8e8" : "",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#ffe6e6";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor =
                        index % 2 === 1 ? "#ffe8e8" : "";
                    }}
                  >
                    <td
                      style={{
                        width: "40%",
                        padding: "8px 6px",
                        color: themeColor,
                        fontWeight: 600,
                      }}
                    >
                      {field.icon && (
                        <i className={`bi ${field.icon} me-2`}></i>
                      )}
                      {field.label}
                    </td>
                    <td style={{ padding: "8px 6px" }}>{formattedValue}</td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </div>

        {/* ATTACHMENTS SECTION */}
        {attachmentConfig && data[attachmentConfig.recordIdField] && (
          <div className="mt-4">
            <Attachments
              tableName={attachmentConfig.tableName}
              recordId={data[attachmentConfig.recordIdField]}
            />
          </div>
        )}

        {/* AUDIT LOGS */}
        {auditLogConfig && data[auditLogConfig.recordIdField] && (
          <KiduAuditLogs
            tableName={auditLogConfig.tableName}
            recordId={data[auditLogConfig.recordIdField].toString()}
          />
        )}
      </Card>

      {/* DELETE CONFIRMATION MODAL */}
      <Modal show={showConfirm} onHide={() => setShowConfirm(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>{deleteConfirmMessage}</Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowConfirm(false)}
            disabled={loadingDelete}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={handleDelete}
            disabled={loadingDelete}
          >
            {loadingDelete ? (
              <>
                <Spinner animation="border" size="sm" /> Deleting...
              </>
            ) : (
              "Delete"
            )}
          </Button>
        </Modal.Footer>
      </Modal>

      <Toaster position="top-right" />
    </div>
  );
};

export default KiduView;