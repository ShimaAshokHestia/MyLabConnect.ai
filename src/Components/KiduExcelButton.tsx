import { Button } from "react-bootstrap";
import { FaFileExcel } from "react-icons/fa6";

interface ExportToExcelButtonProps<T> {
  data: T[];
  title: string;
  filename?: string;
  disabled?: boolean;
}

const KiduExcelButton = <T extends Record<string, any>>({
  data,
  title,
  filename,
  disabled = false,
}: ExportToExcelButtonProps<T>) => {
  const handleExport = () => {
    if (!data || data.length === 0) return;

    const exportData = [...data].reverse().map((row, idx) => ({
      "Sl No": idx + 1,
      ...row,
    }));

    const headers = Object.keys(exportData[0]);
    const csvContent = [
      headers.join(","),
      ...exportData.map(row =>
        headers
          .map(header => {
            const value = row[header as keyof typeof row];
            const escaped = String(value ?? "").replace(/"/g, '""');
            return `"${escaped}"`;
          })
          .join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const fileTitle =
      filename ||
      `${title.replace(/\s+/g, "_")}_${new Date().toISOString().split("T")[0]}`;
    link.setAttribute("href", URL.createObjectURL(blob));
    link.setAttribute("download", `${fileTitle}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Button
      className="fw-bold d-flex justify-content-center align-items-center text-white border border-success"
      style={{
        backgroundColor: "#ffffff",
        border: "none",
      }}
      onClick={handleExport}
      disabled={disabled || data.length === 0}
      title="Export to Excel"
    >
      <FaFileExcel className="fw-bold text-success fs-6" />
    </Button>
  );
};

export default KiduExcelButton;
