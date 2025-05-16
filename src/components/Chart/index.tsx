import React, { useState } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';

ModuleRegistry.registerModules([AllCommunityModule]);

const DenoChart = () => {
  const rowData = [
    {
      uuid: "nkaka1010",
      sheetName: "Sheet 1",
      rowCount: 101,
      columnCount: 8,
      data: [
        { type: 1, name: "single", value: 100 },
        { type: 2, name: "double", value: 200 },
        { type: 3, name: "triple", value: 300 },
      ]
    },
    {
      uuid: "nkaka1010",
      sheetName: "Sheet 2",
      rowCount: 10,
      columnCount: 2,
      data: [
        { type: 4, name: "name one" },
        { type: 5, name: "name two" },
        { type: 6, name: "name three" },
      ]
    },
  ];

  const colDefs = [
    { field: "sheetName", headerName: "Sheet Name", flex: 1 },
    { field: "rowCount", headerName: "Row count", flex: 1 },
    { field: "columnCount", headerName: "Column count", flex: 1 },
  ];

  // State to track selected sheet
  const [selectedSheet, setSelectedSheet] = useState<any>(rowData[0]);

  // Data table columns
  const dataColDefs = [
    { field: "type", headerName: "Type", flex: 1 },
    { field: "name", headerName: "Name", flex: 1 },
    { field: "value", headerName: "Value", flex: 1 },
  ];

  console.log("selectedSheet", selectedSheet)

  return (
    <div>
      <div className="ag-theme-alpine" style={{ width: "100%" }}>
        <AgGridReact
          rowData={rowData}
          columnDefs={colDefs as any}
          domLayout="autoHeight"
          onRowClicked={params => setSelectedSheet(params.data)}
        />
      </div>
      {selectedSheet && (
        <div style={{ marginTop: 24 }}>
          <h3>Data for {selectedSheet.sheetName}</h3>
          <div className="ag-theme-alpine" style={{ width: "100%" }}>
            <AgGridReact
              rowData={selectedSheet.data}
              columnDefs={dataColDefs}
              domLayout="autoHeight"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default DenoChart;

