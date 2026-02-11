import React from "react";
import { Row, Col, Button, Dropdown, ButtonGroup } from "react-bootstrap";
import { BsPrinter, BsFiletypeCsv, BsFiletypePdf } from "react-icons/bs";
import { FaCopy, FaFileExcel } from "react-icons/fa";
import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

// ✅ Toastify imports
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface KiduServerTableNavbarProps {
  data?: any[];
  columns?: Array<{ key: string; label: string; type?: string }>;
  title?: string;
  showExportButtons?: boolean;
  showRowsPerPageSelector?: boolean;
  rowsPerPage?: number;
  onRowsPerPageChange?: (rows: number) => void;
  rowsPerPageOptions?: number[];
  additionalButtons?: React.ReactNode;
}

const KiduServerTableNavbar: React.FC<KiduServerTableNavbarProps> = ({
  data = [],
  columns = [],
  title = "Data",
  showExportButtons = true,
  showRowsPerPageSelector = true,
  rowsPerPage = 10,
  onRowsPerPageChange,
  rowsPerPageOptions = [10, 25, 50, 100],
  additionalButtons,
}) => {
  const cleanCellValue = (value: any, columnType?: string): string => {
    if (value === null || value === undefined || value === "") return "";
    if (typeof value === "boolean") return value ? "Yes" : "No";

    if (columnType === "checkbox") {
      const boolValue =
        typeof value === "boolean"
          ? value
          : typeof value === "string"
          ? value.toLowerCase() === "true" || value === "1"
          : typeof value === "number"
          ? value !== 0
          : false;
      return boolValue ? "Yes" : "No";
    }

    if (columnType === "image") return "";
    if (value instanceof Date) return value.toLocaleDateString();
    return String(value).trim();
  };

  // ✅ Copy to clipboard with Toastify
  const handleCopy = () => {
    if (data.length === 0) return;

    const headers = columns
      .filter((col) => col.type !== "image")
      .map((col) => col.label)
      .join("\t");

    const rows = data
      .map((row) =>
        columns
          .filter((col) => col.type !== "image")
          .map((col) => cleanCellValue(row[col.key], col.type))
          .join("\t")
      )
      .join("\n");

    const textToCopy = `${headers}\n${rows}`;

    navigator.clipboard
      .writeText(textToCopy)
      .then(() => {
        toast.success("Data copied to clipboard", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: true,
        });
      })
      .catch((err) => {
        console.error("Failed to copy:", err);
        toast.error("Failed to copy data", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: true,
        });
      });
  };

  const handleCSV = () => {
    if (data.length === 0) return;

    const headers = columns
      .filter((col) => col.type !== "image")
      .map((col) => col.label)
      .join(",");

    const rows = data
      .map((row) =>
        columns
          .filter((col) => col.type !== "image")
          .map((col) => {
            let value = cleanCellValue(row[col.key], col.type);
            if (value.includes(",") || value.includes('"') || value.includes("\n")) {
              return `"${value.replace(/"/g, '""')}"`;
            }
            return value;
          })
          .join(",")
      )
      .join("\n");

    const csv = `${headers}\n${rows}`;
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${title}_${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
  };

  const handleExcel = () => {
    if (data.length === 0) return;

    const worksheet = XLSX.utils.json_to_sheet(
      data.map((row) => {
        const obj: any = {};
        columns
          .filter((col) => col.type !== "image")
          .forEach((col) => {
            obj[col.label] = cleanCellValue(row[col.key], col.type);
          });
        return obj;
      })
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(
      workbook,
      `${title}_${new Date().toISOString().split("T")[0]}.xlsx`
    );
  };

  const handlePDF = () => {
    if (data.length === 0) return;

    const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
    doc.setFontSize(16);
    doc.text(title, 14, 15);

    const exportColumns = columns.filter(
      (col) => col.type !== "image" && col.type !== "checkbox"
    );

    autoTable(doc, {
      head: [exportColumns.map((c) => c.label)],
      body: data.map((row) =>
        exportColumns.map((c) => cleanCellValue(row[c.key], c.type) || "-")
      ),
      startY: 25,
      styles: { fontSize: 9 },
    });

    doc.save(`${title}_${new Date().toISOString().split("T")[0]}.pdf`);
  };

  const handlePrint = () => {
    if (data.length === 0) return;
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const cols = columns.filter((c) => c.type !== "image");
    printWindow.document.write(`
      <html>
        <head><title>${title}</title></head>
        <body onload="window.print();window.close();">
          <h2>${title}</h2>
          <table border="1" width="100%" cellspacing="0" cellpadding="5">
            <thead>
              <tr>${cols.map((c) => `<th>${c.label}</th>`).join("")}</tr>
            </thead>
            <tbody>
              ${data
                .map(
                  (row) =>
                    `<tr>${cols
                      .map(
                        (c) =>
                          `<td>${cleanCellValue(row[c.key], c.type) || "-"}</td>`
                      )
                      .join("")}</tr>`
                )
                .join("")}
            </tbody>
          </table>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <>
      <Row className="mb-3 align-items-center">
        <Col xs="auto">
          <div className="d-flex gap-2 flex-wrap align-items-center">
            {showRowsPerPageSelector && (
              <Dropdown as={ButtonGroup}>
                <Dropdown.Toggle size="sm" variant="secondary">
                  Show {rowsPerPage} rows
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  {rowsPerPageOptions.map((opt) => (
                    <Dropdown.Item
                      key={opt}
                      active={rowsPerPage === opt}
                      onClick={() => onRowsPerPageChange?.(opt)}
                    >
                      {opt} rows
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
            )}

            {showExportButtons && (
              <>
                <Button size="sm" variant="secondary" onClick={handleCopy}>
                  <FaCopy /> Copy
                </Button>
                <Button size="sm" variant="secondary" onClick={handleCSV}>
                  <BsFiletypeCsv /> CSV
                </Button>
                <Button size="sm" variant="secondary" onClick={handleExcel}>
                  <FaFileExcel /> Excel
                </Button>
                <Button size="sm" variant="secondary" onClick={handlePDF}>
                  <BsFiletypePdf /> PDF
                </Button>
                <Button size="sm" variant="secondary" onClick={handlePrint}>
                  <BsPrinter /> Print
                </Button>
              </>
            )}
          </div>
        </Col>

        {additionalButtons && (
          <Col xs="auto" className="ms-auto">
            {additionalButtons}
          </Col>
        )}
      </Row>

      {/* ✅ Toast container */}
      <ToastContainer />
    </>
  );
};

export default KiduServerTableNavbar;
