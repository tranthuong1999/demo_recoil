import React, { useState } from "react";
import { Radio, Input, Button, Upload, Progress, Flex, Tabs, Table, Select, Tag } from "antd";
import { SaveOutlined, SearchOutlined } from "@ant-design/icons";
import * as XLSX from 'xlsx';

interface SheetData {
    sheetName: string;
    data: any[][]; // Array of rows, where each row is an array of cells
    columns: any[]; // Columns for Ant Design Table
    dataSource: any[]; // Data source for Ant Design Table
}

enum CategoryType {
    File = 0,
    Database = 1,
}

const UploadData = () => {
    // File upload/progress
const [uploading, setUploading] = useState(false);
const [progress, setProgress] = useState(0);
const [uploadSuccess, setUploadSuccess] = useState(false);
const [fileName, setFileName] = useState("");

// Excel data
const [excelSheetsData, setExcelSheetsData] = useState<SheetData[]>([]);

// Category & form
const [category, setCategory] = useState<CategoryType>(CategoryType.File);
const [nameOfNameFile, setNameOfNameFile] = useState<string | undefined>(undefined);
const [nameOfNameDatabase, setNameOfNameDatabase] = useState<string | undefined>(undefined);

// File mode
const [activeSheetKey, setActiveSheetKey] = useState<string | undefined>(undefined);

// Database mode
const [selectedSheet, setSelectedSheet] = useState<string | undefined>(undefined);
const [createdTables, setCreatedTables] = useState<{ sheetName: string, tableName: string }[]>([]);
const [activeTableIndex, setActiveTableIndex] = useState<number | null>(null);

    const handleCategoryChange = (e: any) => {
        setCategory(Number(e.target.value));
        // Reset state when category changes
        setExcelSheetsData([]);
        setActiveSheetKey(undefined);
        setFileName("");
        setUploadSuccess(false);
        setUploading(false);
        setProgress(0);
        setSelectedSheet(undefined);
        setNameOfNameDatabase(undefined);
        setCreatedTables([]);
        setActiveTableIndex(null);
    };

    const processExcelFile = (file: File) => {
        setUploading(true);
        setFileName(file.name);
        setProgress(0);
        setUploadSuccess(false);
        setExcelSheetsData([]);
        setActiveSheetKey(undefined);
        setSelectedSheet(undefined);
        setNameOfNameDatabase(undefined);
        setCreatedTables([]);
        setActiveTableIndex(null);

        const reader = new FileReader();
        reader.onprogress = (event) => {
            if (event.lengthComputable) {
                const percentLoaded = Math.round((event.loaded / event.total) * 100);
                setProgress(percentLoaded);
            }
        };

        reader.onload = (e) => {
            try {
                const data = e.target?.result;
                const workbook = XLSX.read(data, { type: 'array' });
                const sheetNames = workbook.SheetNames;

                const sheets: SheetData[] = sheetNames.map((name: any) => {
                    const worksheet = workbook.Sheets[name];
                    const jsonData: any[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

                    let columns: any[] = [];
                    let dataSource: any[] = [];

                    if (jsonData.length > 0) {
                        columns = jsonData[0].map((header, index) => ({
                            title: header || `Column ${index + 1}`,
                            dataIndex: `col${index}`,
                            key: `col${index}`,
                            width: 150,
                        }));

                        dataSource = jsonData.slice(1).map((row, rowIndex) => {
                            const rowData: any = { key: `row${rowIndex}` };
                            row.forEach((cell, cellIndex) => {
                                rowData[`col${cellIndex}`] = cell;
                            });
                            return rowData;
                        });
                    }

                    return {
                        sheetName: name,
                        data: jsonData,
                        columns,
                        dataSource,
                    };
                });

                setExcelSheetsData(sheets);
                if (sheets.length > 0) {
                    setActiveSheetKey(sheets[0].sheetName);
                }
                setUploadSuccess(true);
            } catch (error) {
                console.error("Error processing Excel file:", error);
                // Handle error (e.g., show a notification)
                setUploadSuccess(false);
            } finally {
                setUploading(false);
                setProgress(100); // Mark as complete even if error, or handle error state differently
            }
        };

        reader.onerror = () => {
            console.error("FileReader error");
            setUploading(false);
            // Handle error
        };

        reader.readAsArrayBuffer(file);
        return false; // Prevent antd Upload component's default upload action
    };


    const handleSaveBtnClick = () => {
        console.log("Save clicked");
    };

    const handleCreateBtnClick = () => {
        if (!selectedSheet || !nameOfNameDatabase) return;
        // Prevent duplicate table names across all created tables
        const exists = createdTables.some(
            t => t.tableName === nameOfNameDatabase
        );
        if (!exists) {
            setCreatedTables(prev => [...prev, { sheetName: selectedSheet, tableName: nameOfNameDatabase! }]);
            setActiveTableIndex(createdTables.length); // set to new table
            // setShowDatabasePreview(true);
        } else {
            // Optionally, show a warning or just do nothing
            // For now, do nothing if duplicate
        }
    };

    const renderPreviewFile = () => {
        return (
            <div>
                <Flex justify="space-between" align="center">
                    <h3>Preview</h3>
                </Flex>
                <Tabs activeKey={activeSheetKey} onChange={setActiveSheetKey}>
                    {
                        excelSheetsData.map(sheet => {
                            return (
                                <Tabs.TabPane tab={sheet.sheetName} key={sheet.sheetName}>
                                    <Table
                                        columns={sheet.columns}
                                        dataSource={sheet.dataSource}
                                        bordered
                                        size="small"
                                        // scroll={{ x: 'max-content', y: category === CategoryType.Database ? "calc(100vh - 450px)" : "calc(100vh - 372px)" }}
                                        scroll={{ x: 'max-content', y: "calc(100vh - 372px)" }}

                                        pagination={false}
                                    />
                                </Tabs.TabPane>
                            )
                        }
                        )}
                </Tabs>
            </div>
        );
    };

    const renderPreviewDatabase = () => {
        return (
            <div style={{ marginTop: 24 }}>
                {/* Table name tags with close button */}
                <div style={{ marginBottom: 12, display: 'flex', gap: 8 }}>
                    {createdTables.map((tbl, idx) => (
                        <Tag
                            key={tbl.sheetName + tbl.tableName}
                            closable
                            onClose={e => {
                                e.preventDefault();
                                const newTables = createdTables.filter((_, i) => i !== idx);
                                setCreatedTables(newTables);
                                // If closing the active tag, update preview
                                if (activeTableIndex === idx) {
                                    if (newTables.length === 0) {
                                        // setShowDatabasePreview(false);
                                        setActiveTableIndex(null);
                                    } else {
                                        setActiveTableIndex(0);
                                    }
                                } else if (activeTableIndex && activeTableIndex > idx) {
                                    setActiveTableIndex(activeTableIndex - 1);
                                }
                            }}
                            style={{ fontSize: 16, padding: '4px 16px', cursor: 'pointer', background: activeTableIndex === idx ? '#e6f7ff' : undefined }}
                            onClick={() => {
                                setActiveTableIndex(idx);
                            }}
                        >
                            {tbl.tableName}
                        </Tag>
                    ))}
                </div>
                {activeTableIndex !== null && createdTables[activeTableIndex] && (
                    <>
                        <h3>Preview</h3>
                        <Table
                            columns={excelSheetsData.find(sheet => sheet.sheetName === createdTables[activeTableIndex].sheetName)?.columns || []}
                            dataSource={excelSheetsData.find(sheet => sheet.sheetName === createdTables[activeTableIndex].sheetName)?.dataSource || []}
                            bordered
                            size="small"
                            scroll={{ x: 'max-content', y: "calc(100vh - 372px)" }}
                            pagination={false}
                        />
                    </>
                )}
            </div>
        )

    }

    const renderEmptyFileMessage = () => {
        return (
            <Flex gap={8} vertical align="center" justify="center" className="empty-file-message" style={{ minHeight: 200 }}>
                <img src="" alt="replace image" />
                <p>No file selected yet or failed to load preview. Please select a file to upload it.</p>
            </Flex>
        )

    }

    const handleCancelUploadFile = () => {
        console.log("Upload cancelled");
    }

    return (
        <div className="upload-data-container">
            <Flex vertical gap={24}>
                <Flex align="center" justify="space-between" style={{ paddingTop: '32px' }}>
                    <Flex gap={8} align="center">
                        <h2>{category === CategoryType.File ? 'Upload data' : 'Table Creation'}</h2>
                        <p>Data Management</p>
                    </Flex>
                    {!uploading && uploadSuccess
                        &&
                        <Button
                            type="primary"
                            icon={<SaveOutlined />}
                            onClick={handleSaveBtnClick}
                            size="large">
                            Save
                        </Button>
                    }
                </Flex>
                <Flex align="center" className="upload-form-container">
                    <Flex gap={32} className="upload-form-controls">
                        <Flex gap={8} align="center">
                            <p style={{ margin: 0 }}>Category</p>
                            <Radio.Group
                                value={category}
                                onChange={handleCategoryChange}
                            >
                                <Radio value={CategoryType.File}>File</Radio>
                                <Radio value={CategoryType.Database}>Database</Radio>
                            </Radio.Group>
                        </Flex>
                        <Flex gap={8} align="center">
                            <p>Select file</p>
                            <Upload
                                beforeUpload={processExcelFile}
                                showUploadList={false}
                                accept=".xlsx, .xls, .csv"
                                className="select-file"
                            >
                                <Input
                                    placeholder="Search"
                                    value={fileName}
                                    readOnly
                                    suffix={<SearchOutlined />}
                                    className="upload-input"
                                />
                            </Upload>
                        </Flex>
                        {
                            category === CategoryType.File &&
                            <Flex gap={8} align="center">
                                <p style={{ margin: 0 }}>Name</p>
                                <Input
                                    placeholder="Enter a name of name"
                                    style={{ width: "100%" }}
                                    disabled={!uploadSuccess}
                                    value={nameOfNameFile}
                                    onChange={(e) => setNameOfNameFile(e.target.value)}
                                />
                            </Flex>
                        }
                    </Flex>
                </Flex>
                {
                    CategoryType.Database === category && uploadSuccess &&
                    <Flex className="upload-form-container">
                        <Flex
                            align="center"
                            justify="space-between"
                            className="upload-form-controls"
                        >
                            <Flex gap={32} align="center">
                                <Flex gap={8} align="center">
                                    <p>Select a sheet</p>
                                    <Select
                                        placeholder="Select a sheet"
                                        style={{ width: "238px" }}
                                        value={selectedSheet}
                                        onChange={(val) => {
                                            setSelectedSheet(val);
                                        }}
                                        options={excelSheetsData.map(sheet => ({
                                            label: sheet.sheetName,
                                            value: sheet.sheetName,
                                        }))}
                                    />
                                </Flex>
                                <Flex gap={8} align="center">
                                    <p>Table name</p>
                                    <Input
                                        placeholder="Enter a name of name"
                                        style={{ width: "216px" }}
                                        value={nameOfNameDatabase}
                                        onChange={(e) => {
                                            setNameOfNameDatabase(e.target.value);
                                        }}
                                    />
                                </Flex>
                            </Flex>
                            {
                                <Flex>
                                    <Button
                                        type="primary"
                                        disabled={!nameOfNameDatabase || !selectedSheet}
                                        onClick={handleCreateBtnClick}
                                    >
                                        Create
                                    </Button>
                                </Flex>
                            }
                        </Flex>
                    </Flex>
                }
                {uploading && (
                    <Flex gap={8} vertical align="center" justify="center" style={{ height: "calc(100vh - 236px)" }}>
                        <Flex gap={145} align="center" style={{ fontSize: "13px" }}>
                            <Flex gap={16}>
                                <p> Uploading</p>
                                <p>
                                    <b>70MB</b>
                                    {" / "}
                                    <span style={{ color: "#BFC1C7" }}>100MB</span>
                                </p>
                            </Flex>
                            <Flex>
                                <Button onClick={handleCancelUploadFile} className="btn_cancel_upload"> Cancel</Button>
                            </Flex>
                        </Flex>
                        <Flex style={{ width: "400px" }}>
                            <Progress
                                percent={progress}
                                size="small"
                                strokeColor="#00B288"
                                trailColor="#BFC1C7"
                            />
                        </Flex>
                    </Flex>
                )}
                {category === CategoryType.File && uploadSuccess && renderPreviewFile()}
                {category === CategoryType.Database && createdTables.length > 0 && renderPreviewDatabase()}
                {(!fileName || !uploadSuccess) && renderEmptyFileMessage()}
            </Flex>
        </div>
    );
};

export default UploadData;