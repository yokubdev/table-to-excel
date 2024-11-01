import React from 'react';
import * as XLSX from 'xlsx-js-style';
import { saveAs } from 'file-saver';

type DataRowItem = Record<string, string | number | Date>;

interface Header {
    label: string;
    key: keyof DataRowItem;
}

interface IProps {
    headers: Header[];
    dataRows: DataRowItem[];
    name?: string;
}

const TableToExcel: React.FC<IProps> = ({ headers, dataRows, name }) => {
    const date = new Date().toISOString().slice(0, 10);
    const tableName = name ? name : 'Таблица';

    const exportToExcel = () => {
        const formattedData = dataRows.map(item =>
            headers.reduce((acc, header) => {
                acc[header.label] = item[header.key];
                return acc;
            }, {} as Record<string, string | number | Date>)
        );

        const worksheet = XLSX.utils.json_to_sheet(formattedData) || {}; // Create worksheet

        // Set column widths for all columns
        worksheet['!cols'] = headers.map(() => ({ wch: 30 }));

        // Apply styles to header row
        headers.forEach((_, index) => {
            const cellRef = `${String.fromCharCode(65 + index)}1`; // Cell references like A1, B1, etc.
            if (!worksheet[cellRef]) return;
            // Apply styles to header cells
            worksheet[cellRef].s = {
                fill: { fgColor: { rgb: "FFFF00" } }, // Yellow background
                font: { bold: true, color: { rgb: "000000" }, sz: 16 }, // Bold, black, font size 14
                alignment: { horizontal: "center", vertical: "center" } // Centered alignment
            };
        });

        // Apply styling to data cells if desired
        const startRow = 2; // Data starts from the second row
        dataRows.forEach((_, rowIndex) => {
            headers.forEach((_, colIndex) => {
                const cellRef = `${String.fromCharCode(65 + colIndex)}${startRow + rowIndex}`;
                if (worksheet[cellRef]) {
                    // Apply styles to data cells
                    worksheet[cellRef].s = {
                        font: { color: { rgb: "000000" } }, // Black text
                        alignment: { horizontal: "center", vertical: "center" } // Left-aligned, center-vertical
                    };
                }
            });
        });


        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
            saveAs(blob, `${tableName}-${date}.xlsx`);
    };

    return (
        <>
            <button onClick={exportToExcel}>Export to Excel</button>
        </>
    );
};

export default TableToExcel;
