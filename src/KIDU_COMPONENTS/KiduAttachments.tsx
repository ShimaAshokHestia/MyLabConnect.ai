import React, { useState, useEffect, useCallback } from "react";
import { Modal, Form, Spinner, Alert, OverlayTrigger, Tooltip, Collapse } from "react-bootstrap";
import {
    Upload, Download, Trash2, FileText, X, FileSpreadsheet, FileImage,
    FileArchive, FileAudio, FileVideo, FileJson, FileCode, FileType,
    Paperclip, ChevronDown, ChevronUp
} from "lucide-react";
import { useDropzone } from "react-dropzone";
import type { Attachment } from "../Types/Attachment.types";
import AttachmentService from "../Services/KiduServices/Attachment.services";
import "../Styles/KiduStyles/Attachment.css";

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
        const date = new Date(dateString + 'Z');
        const istOffset = 5.5 * 60 * 60 * 1000;
        const istDate = new Date(date.getTime() + istOffset);
        const day = istDate.getUTCDate().toString().padStart(2, '0');
        const month = istDate.toLocaleString('en-GB', { month: 'short', timeZone: 'UTC' });
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
        if (bytes === 0) return "0 B";
        const k = 1024;
        const sizes = ["B", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
    };

    const getFileIcon = (fileName: string) => {
        const ext = fileName.split(".").pop()?.toLowerCase();
        switch (ext) {
            case "pdf":                        return <FileText      size={14} className="att-icon att-icon--pdf"     />;
            case "xls": case "xlsx":           return <FileSpreadsheet size={14} className="att-icon att-icon--excel" />;
            case "doc": case "docx":           return <FileText      size={14} className="att-icon att-icon--word"    />;
            case "png": case "jpg":
            case "jpeg": case "gif":           return <FileImage     size={14} className="att-icon att-icon--image"   />;
            case "zip": case "rar":            return <FileArchive   size={14} className="att-icon att-icon--archive" />;
            case "mp3": case "wav":            return <FileAudio     size={14} className="att-icon att-icon--audio"   />;
            case "mp4": case "mov": case "avi":return <FileVideo     size={14} className="att-icon att-icon--video"   />;
            case "json":                       return <FileJson      size={14} className="att-icon att-icon--json"    />;
            case "js": case "jsx": case "ts":
            case "tsx": case "html": case "css":return <FileCode    size={14} className="att-icon att-icon--code"    />;
            default:                           return <FileType      size={14} className="att-icon att-icon--default" />;
        }
    };

    return (
        <>
            {/* ── Panel ── */}
            <div className="att-panel">

                {/* Header toggle */}
                <button
                    className="att-header"
                    onClick={() => setIsOpen(!isOpen)}
                    type="button"
                    aria-expanded={isOpen}
                >
                    <div className="att-header__left">
                        <Paperclip size={13} />
                        <span className="att-header__title">Attachments</span>
                        <span className="att-header__badge">{attachments.length}</span>
                    </div>
                    <div className="att-header__right">
                        {isOpen ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                    </div>
                </button>

                {/* Collapsible body */}
                <Collapse in={isOpen}>
                    <div className="att-body">

                        <div className="att-toolbar">
                            <button
                                className="att-btn att-btn--primary"
                                type="button"
                                onClick={(e) => { e.stopPropagation(); setShowModal(true); }}
                            >
                                <Upload size={11} />
                                <span>Add File</span>
                            </button>
                        </div>

                        {loading ? (
                            <div className="att-state">
                                <Spinner animation="border" size="sm" className="att-spinner" />
                                <span>Loading...</span>
                            </div>
                        ) : error ? (
                            <Alert variant="danger" className="att-alert">{error}</Alert>
                        ) : attachments.length === 0 ? (
                            <div className="att-state att-state--empty">
                                <Paperclip size={20} className="att-state__icon" />
                                <span>No attachments yet</span>
                            </div>
                        ) : (
                            <div className="att-list">
                                {attachments.map((attachment, idx) => (
                                    <div key={attachment.attachmentId} className="att-item">
                                        <span className="att-item__num">{idx + 1}</span>
                                        <span className="att-item__icon">
                                            {getFileIcon(attachment.fileName)}
                                        </span>
                                        <div className="att-item__info">
                                            <span className="att-item__name" title={attachment.fileName}>
                                                {attachment.fileName}
                                            </span>
                                            {attachment.description && (
                                                <span className="att-item__desc" title={attachment.description}>
                                                    {attachment.description}
                                                </span>
                                            )}
                                        </div>
                                        <div className="att-item__meta">
                                            <span className="att-item__size">{attachment.fileSize}</span>
                                            <span className="att-item__date">{formatDate(attachment.uploaddedOn)}</span>
                                            <span className="att-item__by">by {attachment.uploadedBy}</span>
                                        </div>
                                        <div className="att-item__actions">
                                            <OverlayTrigger overlay={<Tooltip>Download</Tooltip>}>
                                                <button
                                                    className="att-action att-action--download"
                                                    type="button"
                                                    onClick={() => handleDownload(attachment.attachmentId, attachment.fileName)}
                                                    aria-label="Download"
                                                >
                                                    <Download size={12} />
                                                </button>
                                            </OverlayTrigger>
                                            <OverlayTrigger overlay={<Tooltip>Delete</Tooltip>}>
                                                <button
                                                    className="att-action att-action--delete"
                                                    type="button"
                                                    onClick={() => confirmDeleteAttachment(attachment.attachmentId)}
                                                    aria-label="Delete"
                                                >
                                                    <Trash2 size={12} />
                                                </button>
                                            </OverlayTrigger>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </Collapse>
            </div>

            {/* ── Upload Modal ── */}
            <Modal show={showModal} onHide={handleCloseModal} centered size="lg" className="att-modal">
                <Modal.Header closeButton className="att-modal__header">
                    <Modal.Title className="att-modal__title">
                        <Upload size={15} />
                        <span>Upload File</span>
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body className="att-modal__body">
                    {uploadError && (
                        <Alert variant="danger" dismissible onClose={() => setUploadError(null)} className="att-alert">
                            {uploadError}
                        </Alert>
                    )}

                    <div
                        {...getRootProps()}
                        className={`att-dropzone${isDragActive ? ' att-dropzone--active' : ''}`}
                    >
                        <input {...getInputProps()} />
                        <Upload size={26} className="att-dropzone__icon" />
                        {isDragActive ? (
                            <p className="att-dropzone__text">Drop it here!</p>
                        ) : (
                            <>
                                <p className="att-dropzone__text">
                                    Drag & drop or <span className="att-dropzone__link">click to browse</span>
                                </p>
                                <p className="att-dropzone__hint">Maximum file size: 10 MB</p>
                            </>
                        )}
                    </div>

                    {selectedFile && (
                        <div className="att-selected-file">
                            <div className="att-selected-file__info">
                                {getFileIcon(selectedFile.name)}
                                <div>
                                    <p className="att-selected-file__name">{selectedFile.name}</p>
                                    <p className="att-selected-file__size">{formatFileSize(selectedFile.size)}</p>
                                </div>
                            </div>
                            <button
                                className="att-action att-action--delete"
                                type="button"
                                onClick={() => setSelectedFile(null)}
                                aria-label="Remove file"
                            >
                                <X size={12} />
                            </button>
                        </div>
                    )}

                    <Form.Group className="att-form-group">
                        <Form.Label className="att-form-label">
                            Description <span className="att-form-label__opt">(optional)</span>
                        </Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={2}
                            placeholder="Add a note about this file..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            maxLength={500}
                            className="att-textarea"
                        />
                        <p className="att-char-count">{description.length} / 500</p>
                    </Form.Group>
                </Modal.Body>

                <Modal.Footer className="att-modal__footer">
                    <button className="att-btn att-btn--ghost" type="button" onClick={handleCloseModal}>
                        Cancel
                    </button>
                    <button
                        className="att-btn att-btn--primary"
                        type="button"
                        onClick={handleUpload}
                        disabled={!selectedFile || uploading}
                    >
                        {uploading ? (
                            <><Spinner size="sm" /><span>Uploading…</span></>
                        ) : (
                            <><Upload size={12} /><span>Upload</span></>
                        )}
                    </button>
                </Modal.Footer>
            </Modal>

            {/* ── Delete Confirmation Modal ── */}
            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered size="sm" className="att-modal">
                <Modal.Header closeButton className="att-modal__header">
                    <Modal.Title className="att-modal__title">
                        <Trash2 size={14} className="att-icon--pdf" />
                        <span>Confirm Delete</span>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="att-modal__body">
                    <p className="att-confirm-text">
                        Are you sure you want to delete this attachment? This cannot be undone.
                    </p>
                </Modal.Body>
                <Modal.Footer className="att-modal__footer">
                    <button className="att-btn att-btn--ghost" type="button" onClick={() => setShowDeleteModal(false)}>
                        Cancel
                    </button>
                    <button className="att-btn att-btn--danger" type="button" onClick={handleDeleteConfirmed}>
                        Delete
                    </button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default Attachments;