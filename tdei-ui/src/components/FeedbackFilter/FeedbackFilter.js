import React, { useState } from 'react';
import { Row, Col, Form, InputGroup } from 'react-bootstrap';
import Select from 'react-select';
import style from './FeedbackFilter.module.css';


const FeedbackFilter = () => {
  // State for search query
  const [searchQuery, setSearchQuery] = useState('');
  
  // State for dropdown filters
  const [selectedDataset, setSelectedDataset] = useState(null);
  const [selectedProjectGroup, setSelectedProjectGroup] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);

  // Dummy data for dropdowns
  const datasetOptions = [
    { value: '', label: 'All Datasets' },
    { value: 'dataset1', label: 'Portland Transit Data' },
    { value: 'dataset2', label: 'Seattle Walking Paths' },
    { value: 'dataset3', label: 'Vancouver Bike Routes' },
    { value: 'dataset4', label: 'Tacoma Bus Network' }
  ];

  const projectGroupOptions = [
    { value: '', label: 'All Project Groups' },
    { value: 'group1', label: 'Urban Mobility' },
    { value: 'group2', label: 'Public Transit' },
    { value: 'group3', label: 'Accessibility Research' },
    { value: 'group4', label: 'Data Collection' }
  ];

  const statusOptions = [
    { value: '', label: 'All Status' },
    { value: 'open', label: 'Open' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'resolved', label: 'Resolved' }
  ];

  // Handler functions
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleDatasetChange = (selectedOption) => {
    setSelectedDataset(selectedOption);
  };

  const handleProjectGroupChange = (selectedOption) => {
    setSelectedProjectGroup(selectedOption);
  };

  const handleStatusChange = (selectedOption) => {
    setSelectedStatus(selectedOption);
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedDataset(datasetOptions[0]);
    setSelectedProjectGroup(projectGroupOptions[0]);
    setSelectedStatus(statusOptions[0]);
  };

  return (
    <div className={style.filterContainer}>
      {/* Search Bar */}
      <Row className="mb-3">
        <Col md={12}>
          <Form.Group>
            <InputGroup>
              <Form.Control
                type="text"
                placeholder="Search feedback by subject, message, or email..."
                value={searchQuery}
                onChange={handleSearchChange}
                className={style.searchInput}
              />
              <InputGroup.Text className={style.searchIcon}>
              {/* Replace with actual search icon */}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.35-4.35"></path>
                </svg>
              </InputGroup.Text>
            </InputGroup>
          </Form.Group>
        </Col>
      </Row>

      {/* Filter Dropdowns */}
      <Row className="mb-3">
        <Col md={3}>
          <Form.Group>
            <Form.Label className={style.filterLabel}>Dataset</Form.Label>
            <Select
              isSearchable={false}
              value={selectedDataset}
              onChange={handleDatasetChange}
              options={datasetOptions}
              defaultValue={datasetOptions[0]}
              components={{ IndicatorSeparator: () => null }}
              className={style.selectDropdown}
            />
          </Form.Group>
        </Col>
        
        <Col md={3}>
          <Form.Group>
            <Form.Label className={style.filterLabel}>Project Group</Form.Label>
            <Select
              isSearchable={false}
              value={selectedProjectGroup}
              onChange={handleProjectGroupChange}
              options={projectGroupOptions}
              defaultValue={projectGroupOptions[0]}
              components={{ IndicatorSeparator: () => null }}
              className={style.selectDropdown}
            />
          </Form.Group>
        </Col>
        
        <Col md={3}>
          <Form.Group>
            <Form.Label className={style.filterLabel}>Status</Form.Label>
            <Select
              isSearchable={false}
              value={selectedStatus}
              onChange={handleStatusChange}
              options={statusOptions}
              defaultValue={statusOptions[0]}
              components={{ IndicatorSeparator: () => null }}
              className={style.selectDropdown}
            />
          </Form.Group>
        </Col>
        
        <Col md={3} className="d-flex align-items-end">
          <button 
            type="button" 
            className={style.clearButton}
            onClick={handleClearFilters}
          >
            Clear Filters
          </button>
        </Col>
      </Row>
    </div>
  );
};

export default FeedbackFilter;
