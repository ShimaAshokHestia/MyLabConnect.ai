// src/Components/ClaimsTable/ClaimsTable.tsx
import React from "react";
import { Card, Table } from "react-bootstrap";
import "../../Style/Claims.css";

interface ClaimsTableRow {
  name: string;
  yearlyData: Record<string, number>;
  total: number;
}

interface ClaimsTableProps {
  title: string;
  data: ClaimsTableRow[];
  years: string[];
}

const ClaimsTable: React.FC<ClaimsTableProps> = ({ title, data, years }) => {

   //  Calculate column-wise totals
  const columnTotals: Record<string, number> = {};
  let grandTotal = 0;

  years.forEach((year) => {
    columnTotals[year] = data.reduce(
      (sum, row) => sum + (row.yearlyData[year] || 0),
      0
    );
    grandTotal += columnTotals[year];
  });

  return (
    <Card className="claims-table-card">
      <Card.Body>
        <h5 className="claims-table-title">{title}</h5>
        <div className="claims-table-wrapper">
          <Table bordered hover responsive size="sm" className="claims-table">
            <thead>
              <tr>
                <th>Name</th>
                {years.map((year) => (
                  <th key={year}>{year}</th>
                ))}
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {data.length === 0 ? (
                <tr>
                  <td colSpan={years.length + 2} className="text-center">
                    No data available
                  </td>
                </tr>
              ) : (
                 <>
                  {/* Existing rows */}
                  {data.map((row, idx) => (
                    <tr key={idx}>
                      <td className="fw-medium">{row.name}</td>
                      {years.map((year) => (
                        <td key={year}>{row.yearlyData[year] ?? ""}</td>
                      ))}
                      <td className="fw-bold">{row.total}</td>
                    </tr>
                  ))}

                  {/* TOTAL ROW */}
                  <tr className="fw-bold">
                    <td>Total</td>
                    {years.map((year) => (
                      <td key={year}>{columnTotals[year] || 0}</td>
                    ))}
                    <td>{grandTotal}</td>
                  </tr>
                </>
              )}
            </tbody>
          </Table>
        </div>
      </Card.Body>
    </Card>
  );
};

export default ClaimsTable;