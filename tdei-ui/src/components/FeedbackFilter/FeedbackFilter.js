import React, { useEffect, useState } from "react";
import { Row, Col, Form } from "react-bootstrap";
import Select from "react-select";
import dayjs from "dayjs";
import style from "./FeedbackFilter.module.css";
import DatasetAutocomplete from "../DatasetAutocomplete/DatasetAutocomplete";
import DatePicker from "../../components/DatePicker/DatePicker";
import FeedbackSortRefresh from "../FeedbackSortRefresh/FeedbackSortRefresh";

const FeedbackFilter = ({ refreshData, onFiltersChange, isAdmin = false }) => {
  const [selectedDatasetId, setSelectedDatasetId] = useState(null);
  const [datasetSearchText, setDatasetSearchText] = useState("");
  const [validFromIso, setValidFromIso] = useState(null);
  const [validToIso, setValidToIso] = useState(null);
  const [status, setStatus] = useState("");
  const [sortField, setSortField] = useState("created_at");
  const [sortOrder, setSortOrder] = useState("desc");

  const statusOptions = [
  { value: "",           label: "All Status" },
  { value: "open",       label: "Open" },
  { value: "resolved",   label: "Resolved" }
];
const handleSortChange = (field, order) => {
    setSortField(field);
    setSortOrder(order);
  };

  useEffect(() => {
    onFiltersChange?.({
      datasetId: selectedDatasetId,
      from_date: validFromIso,  
      to_date: validToIso,      
      status,                   
      searchText: "",
      sort_by: sortField,
      sort_order: sortOrder,
    });
  }, [selectedDatasetId, validFromIso, validToIso, status, onFiltersChange,sortField, sortOrder]);

  const clearValidFrom = () => {
    setValidFromIso(null);
    refreshData?.();
  };
  const clearValidTo = () => {
    setValidToIso(null);
    refreshData?.();
  };
    const clearStatus = () => {
    setStatus("");
    refreshData?.();
  };

  const handleSelectDataset = (id) => {
    setSelectedDatasetId(id);
  };

  return (
    <div className={style.filterContainer}>
     <Row className="g-3 mb-2 align-items-end">
        <Col xs={12} md={8} lg={9}>
          <Form.Group>
            <div className={style.labelWithClear}>
              <Form.Label>Search by Dataset Name</Form.Label>
            </div>
            <DatasetAutocomplete
              selectedDatasetId={selectedDatasetId}
              datasetSearchText={datasetSearchText}
              setDatasetSearchText={setDatasetSearchText}
              onSelectDataset={(id) => { handleSelectDataset(id); }}
              placeholder="Search by Dataset Name"
            />
          </Form.Group>
        </Col>

        <Col xs={16} md={4} lg={3}>
        <div className="d-flex justify-content-end align-items-end h-100">
          <FeedbackSortRefresh
            sortField={sortField}
            sortOrder={sortOrder}
            onSortChange={handleSortChange}
            onRefresh={() => refreshData?.()}
          />
          </div>
        </Col>
      </Row>
      <Row className="g-3 mb-3 align-items-end">
        <Col xs={12} md={4}>
          <Form.Group>
            <div className={style.labelWithClear}>
              <Form.Label>Status</Form.Label>
              <span className={style.clearButton} onClick={clearStatus}>Clear</span>
            </div>
            <Select
              isSearchable={false}
              value={statusOptions.find((o) => o.value === status)}
              onChange={(opt) => {
                setStatus(opt?.value ?? "");
                refreshData?.();
              }}
              options={statusOptions}
              components={{ IndicatorSeparator: () => null }}
            />
          </Form.Group>
        </Col>
        <Col xs={12} md={4}>
          <div className={style.labelWithClear}>
            <Form.Label>Valid From</Form.Label>
            <span className={style.clearButton} onClick={clearValidFrom}>Clear</span>
          </div>
          <DatePicker
            label="Valid From"
            onChange={(dateIso) => { setValidFromIso(dateIso); refreshData?.(); }}
            dateValue={validFromIso}
            isFilter={true}
          />
        </Col>
        <Col xs={12} md={4}>
          <div className={style.labelWithClear}>
            <Form.Label>Valid To</Form.Label>
            <span className={style.clearButton} onClick={clearValidTo}>Clear</span>
          </div>
          <DatePicker
            label="Valid To"
            onChange={(dateIso) => { setValidToIso(dateIso); refreshData?.(); }}
            dateValue={validToIso}
            isFilter={true}
          />
        </Col>
      </Row>
    </div>
  );
};

export default FeedbackFilter;
