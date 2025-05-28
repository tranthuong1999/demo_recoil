import React, { useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
ModuleRegistry.registerModules([AllCommunityModule]);

interface AnChartProps {
  rowData: any[]; // Assuming rowData is an array of objects
}

const AnChart: React.FC<AnChartProps> = ({ rowData }) => {
  // Automatically generate column definitions from the first row of data
  const columnDefs = useMemo(() => {
    if (!rowData || rowData.length === 0) {
      return [];
    }
    const firstRow = rowData[0];
    return Object.keys(firstRow).map(key => ({
      field: key,
      headerName: key.charAt(0).toUpperCase() + key.slice(1), // Capitalize header names
      sortable: true,
      filter: true,
      resizable: true,
      minWidth: 100,
      flex: 1,
    }));
  }, [rowData]);

  const defaultColDef = useMemo(() => ({
    resizable: true,
    sortable: true,
    filter: true,
    floatingFilter: true,
    minWidth: 100,
    flex: 1,
  }), []);

  return (
    <div className="ag-theme-alpine" style={{ width: '100%', height: '100%' }}>
      <AgGridReact
        rowData={rowData}
        columnDefs={columnDefs}
        // defaultColDef={defaultColDef}
        pagination={true}
        paginationPageSize={20}
        cacheBlockSize={20}
        // cacheBlockSize: Used with server-side row models (infinite, viewport). Determines how many rows the grid fetches in each request to the server. A larger block size means fewer requests but more data transferred per request.
        animateRows={true}
        enableCellTextSelection={true}
        suppressRowClickSelection={true}
        enableRangeSelection={true}
        rowBuffer={10}
        debounceVerticalScrollbar={true}
        //  rowModelType='viewport'
         alwaysShowHorizontalScroll={true}
         alwaysShowVerticalScroll={true}
      />
    </div>
  );
};

export default AnChart;
