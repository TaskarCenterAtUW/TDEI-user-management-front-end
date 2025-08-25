import React, { useEffect, useState } from "react";
import { Row, Col, Form } from "react-bootstrap";
import Select from "react-select";
import dayjs from "dayjs";
import style from "./FeedbackFilter.module.css";
import DatasetAutocomplete from "../DatasetAutocomplete/DatasetAutocomplete";
import DatePicker from "../../components/DatePicker/DatePicker";
import FeedbackSortRefresh from "../FeedbackSortRefresh/FeedbackSortRefresh";
import ResponseToast from "../../components/ToastMessage/ResponseToast";

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
    if (validFromIso && validToIso && dayjs(validToIso).isBefore(dayjs(validFromIso))) {
      return;
    }
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

useEffect(() => {
  if (validFromIso && validToIso && dayjs(validToIso).isBefore(dayjs(validFromIso))) {
    setValidToIso(null); 
  }
}, [validFromIso, validToIso]);

  return (
    <div className={style.filterContainer}>
     <Row className="g-3 mb-2 align-items-end">
        <Col xs={12} md={8} lg={9}>
          <Form.Group>
            <div className={style.labelWithClear}>
              <Form.Label>Search Feedback By Dataset</Form.Label>
            </div>
            <DatasetAutocomplete
              selectedDatasetId={selectedDatasetId}
              datasetSearchText={datasetSearchText}
              setDatasetSearchText={setDatasetSearchText}
              onSelectDataset={(id) => { handleSelectDataset(id); }}
              placeholder="Enter dataset name to search feedback…"
            />
          </Form.Group>
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
            <Form.Label>Submitted After</Form.Label>
            <span className={style.clearButton} onClick={clearValidFrom}>Clear</span>
          </div>
          <DatePicker
            label="Submitted After"
            onChange={(dateIso) => { setValidFromIso(dateIso); refreshData?.(); }}
            dateValue={validFromIso}
            isFilter={true}
            maxDate={validToIso ? dayjs(validToIso) : null}
          />
        </Col>
        <Col xs={12} md={4}>
          <div className={style.labelWithClear}>
            <Form.Label>Submitted Before</Form.Label>
            <span className={style.clearButton} onClick={clearValidTo}>Clear</span>
          </div>
          <DatePicker
            label="Submitted Before"
            onChange={(dateIso) => { setValidToIso(dateIso); refreshData?.(); }}
            dateValue={validToIso}
            isFilter={true}
            minDate={validFromIso ? dayjs(validFromIso) : null}
          />
        </Col>
      </Row>
    </div>
  );
};

export default FeedbackFilter;
