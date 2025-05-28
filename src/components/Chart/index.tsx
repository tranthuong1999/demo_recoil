import React, { useState } from "react";
import {
  Radio, Input, Button, Upload, Progress, Flex, Tabs, Table, Select
} from "antd";
import { SaveOutlined, SearchOutlined } from "@ant-design/icons";
// import { useTranslation } from "react-i18next";
import * as XLSX from 'xlsx';
import EmptyFileIllustration from '../../../images/empty_file_illustration.png';

const { TabPane } = Tabs;

enum CategoryType {
  File = 0,
  Database = 1,
}

const UploadData = () => {
  // const { t } = useTranslation();

  const [category, setCategory] = useState(CategoryType.File);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [fileName, setFileName] = useState("");

  // const [excelSheetsData, setExcelSheetsData] = useState<SheetData[]>([]);
  const [excelSheetsData, setExcelSheetsData] = useState<any[]>([]);
  const [activeSheetKey, setActiveSheetKey] = useState<string>();
  const [selectedSheet, setSelectedSheet] = useState<string>();
  const [fileTableName, setFileTableName] = useState<string>();
  const [dbTableName, setDbTableName] = useState<string>();

  const currentSheetData = excelSheetsData.find(s => s.sheetName === selectedSheet);

  const resetState = () => {
    setExcelSheetsData([]);
    setFileName("");
    setActiveSheetKey(undefined);
    setSelectedSheet(undefined);
    setUploadSuccess(false);
    setProgress(0);
    setUploading(false);
  };

  const handleCategoryChange = (e: any) => {
    setCategory(Number(e.target.value));
    resetState();
  };

  const handleFileUpload = (file: File) => {
    setUploading(true);
    setFileName(file.name);
    setProgress(0);
    setUploadSuccess(false);
    setExcelSheetsData([]);
    setActiveSheetKey(undefined);

    const reader = new FileReader();

    reader.onprogress = (e) => {
      if (e.lengthComputable) {
        setProgress(Math.round((e.loaded / e.total) * 100));
      }
    };

    reader.onload = (e) => {
      try {
        const workbook = XLSX.read(e.target?.result, { type: 'array' });
        const sheets = workbook.SheetNames.map(name => {
          const rows = XLSX.utils.sheet_to_json<any[]>(workbook.Sheets[name], { header: 1 });
          const columns = rows[0]?.map((col, i) => ({
            title: col || `Column ${i + 1}`,
            dataIndex: `col${i}`,
            key: `col${i}`,
            width: 150,
          })) || [];

          const dataSource = rows.slice(1).map((row, i) => {
            const item: any = { key: i.toString() };
            row.forEach((val, j) => item[`col${j}`] = val);
            return item;
          });

          return { sheetName: name, data: rows, columns, dataSource };
        });

        setExcelSheetsData(sheets);
        if (sheets.length > 0) setActiveSheetKey(sheets[0].sheetName);
        setUploadSuccess(true);
      } catch (err) {
        console.error("Error processing Excel:", err);
      } finally {
        setUploading(false);
        setProgress(100);
      }
    };

    reader.onerror = () => {
      console.error("Reader error");
      setUploading(false);
    };

    reader.readAsArrayBuffer(file);
    return false; // Prevent antd auto-upload
  };

  const renderFileUploadPreview = () => {
    if (!uploadSuccess || excelSheetsData.length === 0) {
      return (
        <Flex vertical align="center" className="empty-file-message">
          <img src={EmptyFileIllustration} alt="Empty file" />
          <p>No file selected yet or failed to load preview. Please select a file to upload it.</p>
        </Flex>
      );
    }

    if (category === CategoryType.File) {
      return (
        <Tabs activeKey={activeSheetKey} onChange={setActiveSheetKey}>
          {excelSheetsData.map(sheet => (
            <TabPane tab={sheet.sheetName} key={sheet.sheetName}>
              <Table
                columns={sheet.columns}
                dataSource={sheet.dataSource}
                pagination={false}
                bordered
                size="small"
                scroll={{ x: 'max-content', y: "calc(100vh - 372px)" }}
              />
            </TabPane>
          ))}
        </Tabs>
      );
    }

    if (category === CategoryType.Database && currentSheetData && dbTableName) {
      return (
        <Table
          columns={currentSheetData.columns}
          dataSource={currentSheetData.dataSource}
          pagination={false}
          bordered
          size="small"
          scroll={{ x: 'max-content', y: "calc(100vh - 372px)" }}
        />
      );
    }

    return null;
  };

  return (
    <div className="upload-data-container">
      <Flex vertical gap={24}>
        <Flex align="center" justify="space-between" style={{ paddingTop: 32 }}>
          <Flex gap={8} align="center">
            <h2>{category === CategoryType.File ? 'Upload data' : 'Table Creation'}</h2>
            <p>Data Management</p>
          </Flex>
          {!uploading && uploadSuccess && (
            <Button type="primary" icon={<SaveOutlined />} size="large" onClick={() => console.log("Save clicked")}>
              Save
            </Button>
          )}
        </Flex>

        {/* Upload controls */}
        <Flex align="center" className="upload-form-container">
          <Flex gap={32} className="upload-form-controls">
            <Flex gap={8} align="center">
              <p>Category</p>
              <Radio.Group value={category} onChange={handleCategoryChange}>
                <Radio value={CategoryType.File}>File</Radio>
                <Radio value={CategoryType.Database}>Database</Radio>
              </Radio.Group>
            </Flex>
            <Flex gap={8} align="center">
              <p>Select file</p>
              <Upload beforeUpload={handleFileUpload} showUploadList={false} accept=".xlsx, .xls, .csv">
                <Input
                  placeholder="Choose file"
                  value={fileName}
                  readOnly
                  suffix={<SearchOutlined />}
                />
              </Upload>
            </Flex>
            {category === CategoryType.File && (
              <Flex gap={8} align="center">
                <p>Name</p>
                <Input
                  placeholder="Enter table name"
                  value={fileTableName}
                  disabled={!uploadSuccess}
                  onChange={e => setFileTableName(e.target.value)}
                />
              </Flex>
            )}
          </Flex>
        </Flex>

        {/* Database-specific form */}
        {category === CategoryType.Database && uploadSuccess && (
          <Flex className="upload-form-container">
            <Flex align="center" justify="space-between" className="upload-form-controls">
              <Flex gap={32} align="center">
                <Flex gap={8} align="center">
                  <p>Select a sheet</p>
                  <Select
                    placeholder="Select a sheet"
                    value={selectedSheet}
                    onChange={setSelectedSheet}
                    style={{ width: 238 }}
                    options={excelSheetsData.map(s => ({ label: s.sheetName, value: s.sheetName }))}
                  />
                </Flex>
                <Flex gap={8} align="center">
                  <p>Table name</p>
                  <Input
                    placeholder="Enter table name"
                    value={dbTableName}
                    onChange={e => setDbTableName(e.target.value)}
                    style={{ width: 216 }}
                  />
                </Flex>
              </Flex>
              <Button
                type="primary"
                disabled={!dbTableName || !selectedSheet}
              >
                Create
              </Button>
            </Flex>
          </Flex>
        )}

        {/* Uploading progress */}
        {uploading && (
          <Flex vertical align="center" style={{ height: "calc(100vh - 236px)" }}>
            <Flex gap={145} align="center" style={{ fontSize: 13 }}>
              <Flex gap={16}>
                <p>Uploading</p>
                <p><b>{progress}MB</b> / <span style={{ color: "#BFC1C7" }}>100MB</span></p>
              </Flex>
              <Button onClick={() => console.log("Cancel upload")} className="btn_cancel_upload">Cancel</Button>
            </Flex>
            <Progress percent={progress} style={{ width: "70%" }} />
          </Flex>
        )}

        {/* Preview section */}
        {renderFileUploadPreview()}
      </Flex>
    </div>
  )
};

export default UploadData;
