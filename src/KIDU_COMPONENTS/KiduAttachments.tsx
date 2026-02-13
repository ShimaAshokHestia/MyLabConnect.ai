import React, { useState, useEffect, useCallback } from "react";
import { Button, Modal, Form, Table, Spinner, Alert, OverlayTrigger, Tooltip, Card, Collapse } from "react-bootstrap";
import { Upload, Download, Trash2, FileText, X, FileSpreadsheet, FileImage, FileArchive, FileAudio, FileVideo, FileJson, FileCode, FileType, Paperclip, ChevronDown, ChevronUp } from "lucide-react";
import { useDropzone } from "react-dropzone";
import type { Attachment } from "../Types/Attachment.types";
import AttachmentService from "../Services/Attachment.services";


interface AttachmentsProps {
    tableName: string;
    recordId: string | number;
}

const Attachments: React.FC<AttachmentsProps> = ({ tableName, recordId }) => {
    const [attachments, setAttachments] = useState<Attachment[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [description, setDescription] = useState<string>("");
    const [uploading, setUploading] = useState<boolean>(false);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
    const [attachmentToDelete, setAttachmentToDelete] = useState<number | null>(null);
    const [isOpen, setIsOpen] = useState<boolean>(false);

    useEffect(() => {
        if (tableName && recordId) fetchAttachments();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tableName, recordId]);

    const fetchAttachments = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await AttachmentService.getByTableAndId(tableName, recordId);
            setAttachments(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Failed to fetch attachments:", err);
            setError("Failed to load attachments. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            setSelectedFile(acceptedFiles[0]);
            setUploadError(null);
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        multiple: false,
        maxSize: 10485760,
        onDropRejected: (fileRejections) => {
            setUploadError(fileRejections[0]?.errors[0]?.message || "File rejected");
        }
    });

    const formatDate = (dateString: string): string => {
        // Add 'Z' to force JavaScript to treat it as UTC
        const date = new Date(dateString + 'Z');

        const istOffset = 5.5 * 60 * 60 * 1000; // IST offset
        const istDate = new Date(date.getTime() + istOffset);

        const day = istDate.getUTCDate().toString().padStart(2, '0');
        const month = istDate.toLocaleString('en-GB', { month: 'long', timeZone: 'UTC' });
        const year = istDate.getUTCFullYear();

        let hours = istDate.getUTCHours();
        const minutes = istDate.getUTCMinutes().toString().padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12;

        return `${day} ${month} ${year}, ${hours}:${minutes} ${ampm}`;
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            setUploadError("Please select a file to upload");
            return;
        }

        try {
            setUploading(true);
            setUploadError(null);

            const formData = new FormData();
            formData.append("File", selectedFile);
            formData.append("TableName", tableName);
            formData.append("RecordId", Number(recordId).toString());
            if (description) formData.append("Description", description);

            await AttachmentService.uploadAttachment(formData);
            await fetchAttachments();
            handleCloseModal();
        } catch (err) {
            console.error("Upload failed:", err);
            setUploadError("Failed to upload file. Please try again.");
        } finally {
            setUploading(false);
        }
    };

    const confirmDeleteAttachment = (attachmentId: number) => {
        setAttachmentToDelete(attachmentId);
        setShowDeleteModal(true);
    };

    const handleDeleteConfirmed = async () => {
        if (!attachmentToDelete) return;
        const deletedBy = localStorage.getItem("userName") || "Unknown User";

        try {
            await AttachmentService.deleteAttachment(attachmentToDelete, deletedBy);
            await fetchAttachments();
        } catch (err) {
            console.error("Delete failed:", err);
            alert("Failed to delete attachment. Please try again.");
        } finally {
            setShowDeleteModal(false);
            setAttachmentToDelete(null);
        }
    };

    const handleDownload = async (attachmentId: number, fileName: string) => {
        try {
            await AttachmentService.downloadAttachment(attachmentId, fileName);
        } catch (err) {
            console.error("Download failed:", err);
            alert("Failed to download file. Please try again.");
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedFile(null);
        setDescription("");
        setUploadError(null);
    };

    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return "0 Bytes";
        const k = 1024;
        const sizes = ["Bytes", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
    };

    // const formatDate = (dateString: string): string => {
    //     const date = new Date(dateString);
    //     return date.toLocaleDateString("en-GB", {
    //         day: "2-digit",
    //         month: "short",
    //         year: "numeric",
    //         hour: "2-digit",
    //         minute: "2-digit"
    //     });
    // };

    const getFileIcon = (fileName: string) => {
        const ext = fileName.split(".").pop()?.toLowerCase();

        switch (ext) {
            case "pdf": return <FileText size={18} className="text-danger" />;
            case "xls":
            case "xlsx": return <FileSpreadsheet size={18} className="text-success" />;
            case "doc":
            case "docx": return <FileText size={18} className="text-primary" />;
            case "png":
            case "jpg":
            case "jpeg":
            case "gif": return <FileImage size={18} className="text-warning" />;
            case "zip":
            case "rar": return <FileArchive size={18} className="text-secondary" />;
            case "mp3":
            case "wav": return <FileAudio size={18} className="text-info" />;
            case "mp4":
            case "mov":
            case "avi": return <FileVideo size={18} className="text-info" />;
            case "json": return <FileJson size={18} className="text-muted" />;
            case "js":
            case "jsx":
            case "ts":
            case "tsx":
            case "html":
            case "css": return <FileCode size={18} className="text-purple-600" />;
            default: return <FileType size={18} className="text-dark" />;
        }
    };

    return (
        <>
            <Card className="mt-1 shadow-sm border-0" style={{ overflow: "hidden" }}>
                <Card.Header
                    className="d-flex justify-content-between align-items-center py-3 px-4"
                    style={{
                        backgroundColor: "#173a6a",
                        borderBottom: "2px solid #e9ecef",
                        cursor: "pointer"
                    }}
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <div className="d-flex align-items-center gap-2">
                        <Paperclip size={18} className="text-white" />
                        <h6 className="mb-0 fw-semibold text-white" style={{ fontSize: '0.95rem' }}>
                            Attachments
                        </h6>
                        <span
                            className="badge rounded-pill"
                            style={{
                                backgroundColor: '#ffffff',
                                color: '#0d6efd',
                                fontSize: '0.75rem',
                                padding: '0.25rem 0.5rem'
                            }}
                        >
                            {attachments.length}
                        </span>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                        {isOpen ? <ChevronUp size={18} className="text-white" /> : <ChevronDown size={18} className="text-white" />}
                    </div>
                </Card.Header>

                <Collapse in={isOpen}>

                    <Card.Body className="p-3">
                        <div className="d-flex justify-content-end">
                            <Button
                                size="sm"
                                className="d-flex align-items-center gap-1"
                                style={{ fontSize: '0.85rem', padding: '0.375rem 0.75rem', backgroundColor: "#173a6a" }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setShowModal(true);
                                }}
                            >
                                <Upload size={12} /> Add
                            </Button>
                        </div>
                        {loading ? (
                            <div className="text-center py-4">
                                <Spinner animation="border" variant="primary" size="sm" />
                                <p className="mt-3 text-muted mb-0 small">Loading attachments...</p>
                            </div>
                        ) : error ? (
                            <Alert variant="danger" className="mb-0 small">{error}</Alert>
                        ) : attachments.length === 0 ? (
                            <div className="text-center py-4">
                                <FileText size={40} className="text-muted mb-2" style={{ opacity: 0.3 }} />
                                <p className="text-muted mb-1 small">No attachments found</p>
                                <p className="text-muted mb-0" style={{ fontSize: '0.8rem' }}>
                                    Click "Add" to upload files
                                </p>
                            </div>
                        ) : (
                            <div className="table-responsive">
                                <Table hover className="mb-0 align-middle" style={{ fontSize: '0.875rem' }}>
                                    <thead className="bg-light">
                                        <tr>
                                            <th style={{ width: "5%", padding: '0.5rem' }} className="text-center">#</th>
                                            <th style={{ width: "35%", padding: '0.5rem' }}>File Name</th>
                                            <th style={{ width: "25%", padding: '0.5rem' }}>Description</th>
                                            <th style={{ width: "10%", padding: '0.5rem' }} className="text-center">Size</th>
                                            <th style={{ width: "20%", padding: '0.5rem' }}>Uploaded</th>
                                            <th style={{ width: "5%", padding: '0.5rem' }} className="text-center">Actions</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {attachments.map((attachment, idx) => (
                                            <tr key={attachment.attachmentId}>
                                                <td className="text-center text-muted" style={{ padding: '0.5rem', fontSize: '0.8rem' }}>
                                                    {idx + 1}
                                                </td>
                                                <td style={{ padding: '0.5rem' }}>
                                                    <div className="d-flex align-items-center gap-2">
                                                        {getFileIcon(attachment.fileName)}
                                                        <span
                                                            className="text-truncate"
                                                            style={{ maxWidth: "280px" }}
                                                            title={attachment.fileName}
                                                        >
                                                            {attachment.fileName}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td style={{ padding: '0.5rem' }}>
                                                    <span
                                                        className="text-muted text-truncate d-inline-block"
                                                        style={{ maxWidth: "200px", fontSize: '0.85rem' }}
                                                        title={attachment.description || "-"}
                                                    >
                                                        {attachment.description || "-"}
                                                    </span>
                                                </td>
                                                <td className="text-center" style={{ padding: '0.5rem', fontSize: '0.85rem' }}>
                                                    {attachment.fileSize}
                                                </td>
                                                <td style={{ padding: '0.5rem' }}>
                                                    <div style={{ fontSize: '0.8rem' }}>
                                                        <div className="text-muted">{formatDate(attachment.uploaddedOn)}</div>
                                                        <div className="text-muted" style={{ fontSize: '0.75rem' }}>
                                                            by {attachment.uploadedBy}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td style={{ padding: '0.5rem' }}>
                                                    <div className="d-flex gap-1 justify-content-center">
                                                        <OverlayTrigger overlay={<Tooltip>Download</Tooltip>}>
                                                            <Button
                                                                variant="outline-primary"
                                                                size="sm"
                                                                className="d-flex align-items-center justify-content-center"
                                                                style={{ width: '30px', height: '30px', padding: 0 }}
                                                                onClick={() => handleDownload(attachment.attachmentId, attachment.fileName)}
                                                            >
                                                                <Download size={13} />
                                                            </Button>
                                                        </OverlayTrigger>

                                                        <OverlayTrigger overlay={<Tooltip>Delete</Tooltip>}>
                                                            <Button
                                                                variant="outline-danger"
                                                                size="sm"
                                                                className="d-flex align-items-center justify-content-center"
                                                                style={{ width: '30px', height: '30px', padding: 0 }}
                                                                onClick={() => confirmDeleteAttachment(attachment.attachmentId)}
                                                            >
                                                                <Trash2 size={13} />
                                                            </Button>
                                                        </OverlayTrigger>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </div>
                        )}
                    </Card.Body>
                </Collapse>
            </Card>

            {/* Upload Modal */}
            <Modal show={showModal} onHide={handleCloseModal} centered size="lg">
                <Modal.Header closeButton className="border-0 pb-2">
                    <Modal.Title className="d-flex align-items-center gap-2" style={{ fontSize: '1.1rem' }}>
                        <Upload size={22} className="text-primary" />
                        <span>Upload Attachment</span>
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body className="px-4 pb-3">
                    {uploadError && (
                        <Alert variant="danger" dismissible onClose={() => setUploadError(null)} className="py-2">
                            {uploadError}
                        </Alert>
                    )}

                    <div
                        {...getRootProps()}
                        className="border rounded p-4 text-center"
                        style={{
                            borderStyle: 'dashed',
                            borderWidth: '2px',
                            borderColor: isDragActive ? '#0d6efd' : '#dee2e6',
                            backgroundColor: isDragActive ? '#f0f8ff' : '#f8f9fa',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease'
                        }}
                    >
                        <input {...getInputProps()} />
                        <Upload size={40} className="mb-2" style={{ color: '#6c757d', opacity: 0.5 }} />
                        {isDragActive ? (
                            <p className="mb-0 text-primary fw-medium small">Drop the file here...</p>
                        ) : (
                            <>
                                <p className="mb-1 fw-medium small">Drag & drop a file here, or click to browse</p>
                                <p className="text-muted mb-0" style={{ fontSize: '0.8rem' }}>Maximum file size: 10MB</p>
                            </>
                        )}
                    </div>

                    {selectedFile && (
                        <div className="mt-3 p-2 bg-light rounded border">
                            <div className="d-flex justify-content-between align-items-center">
                                <div className="d-flex align-items-center gap-2">
                                    {getFileIcon(selectedFile.name)}
                                    <div>
                                        <p className="mb-0 fw-medium" style={{ fontSize: '0.9rem' }}>
                                            {selectedFile.name}
                                        </p>
                                        <small className="text-muted">{formatFileSize(selectedFile.size)}</small>
                                    </div>
                                </div>
                                <Button
                                    variant="outline-danger"
                                    size="sm"
                                    onClick={() => setSelectedFile(null)}
                                    className="d-flex align-items-center justify-content-center"
                                    style={{ width: '28px', height: '28px', padding: 0 }}
                                >
                                    <X size={14} />
                                </Button>
                            </div>
                        </div>
                    )}

                    <Form.Group className="mt-3 mb-0">
                        <Form.Label className="fw-semibold small mb-1">Description (Optional)</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            placeholder="Enter a description for this file..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            maxLength={500}
                            style={{ fontSize: '0.9rem' }}
                        />
                        <Form.Text className="text-muted" style={{ fontSize: '0.8rem' }}>
                            {description.length}/500 characters
                        </Form.Text>
                    </Form.Group>
                </Modal.Body>

                <Modal.Footer className="border-0 pt-0">
                    <Button
                        variant="outline-secondary"
                        onClick={handleCloseModal}
                        size="sm"
                        style={{ fontSize: '0.875rem' }}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="primary"
                        onClick={handleUpload}
                        disabled={!selectedFile || uploading}
                        size="sm"
                        className="d-flex align-items-center gap-2"
                        style={{ fontSize: '0.875rem' }}
                    >
                        {uploading ? (
                            <>
                                <Spinner size="sm" /> Uploading...
                            </>
                        ) : (
                            <>
                                <Upload size={14} /> Upload
                            </>
                        )}
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered size="sm">
                <Modal.Header closeButton className="border-0 pb-2">
                    <Modal.Title style={{ fontSize: '1rem' }}>Confirm Delete</Modal.Title>
                </Modal.Header>
                <Modal.Body className="px-4 py-3">
                    <p className="mb-0 small">Are you sure you want to delete this attachment?</p>
                </Modal.Body>
                <Modal.Footer className="border-0 pt-0">
                    <Button
                        variant="outline-secondary"
                        onClick={() => setShowDeleteModal(false)}
                        size="sm"
                        style={{ fontSize: '0.875rem' }}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="danger"
                        onClick={handleDeleteConfirmed}
                        size="sm"
                        style={{ fontSize: '0.875rem' }}
                    >
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default Attachments;