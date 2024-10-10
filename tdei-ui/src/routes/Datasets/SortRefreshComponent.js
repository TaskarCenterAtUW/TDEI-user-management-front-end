import React, { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import RefreshIcon from '@mui/icons-material/Refresh';
import SortIcon from '@mui/icons-material/Sort';
import Select from 'react-select';
import style from "./Datasets.module.css";
import { Form, Row, Col } from "react-bootstrap";

const SortRefreshComponent = ({ handleRefresh, handleSortChange, sortField, sortOrder }) => {
  const [order, setOrder] = useState(sortOrder);

  const sortOptions = [
    { value: 'uploaded_timestamp', label: 'Last Updated' },
    { value: 'project_group_name', label: 'Project Group Name' },
    { value: 'status', label: 'Status' },
    { value: 'valid_from', label: 'Valid From' },
    { value: 'valid_to', label: 'Valid To' },
  ];

  const toggleSortOrder = () => {
    const newOrder = order === 'ASC' ? 'DESC' : 'ASC';
    setOrder(newOrder);
    handleSortChange(sortField, newOrder);
  };

  const handleSelectSortField = (selectedOption) => {
    handleSortChange(selectedOption.value, order);
  };

  const selectedSortOption = sortOptions.find(option => option.value === sortField);

  return (
    <Row className="align-items-center">
      <Col className="d-flex align-items-center" md={10}>
        <div className={style.sortByField}>
          <Form.Label>Sort By</Form.Label>
          <Select
            placeholder={"Sort By"}
            isSearchable={false}
            value={selectedSortOption}
            onChange={handleSelectSortField}
            options={sortOptions}
            className={style.customSelect}
            classNamePrefix="react-select"
            components={{
              IndicatorSeparator: () => null
            }}
          />
        </div>
        <IconButton className={style.iconBtn} onClick={toggleSortOrder} style={{marginTop:'30px'}}>
          <SortIcon style={{ transform: `rotate(${order === 'DESC' ? 0 : 180}deg)` }} />
        </IconButton>
      </Col>
      <Col className="d-flex justify-content-end" md={2} style={{marginTop:'30px'}}>
        <IconButton className={style.iconBtn} onClick={handleRefresh}>
          <RefreshIcon style={{ fontSize: 20 }} />
        </IconButton>
      </Col>
    </Row>
  );
};

export default SortRefreshComponent;
