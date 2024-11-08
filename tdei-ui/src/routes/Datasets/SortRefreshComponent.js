import React, { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import RefreshIcon from '@mui/icons-material/Refresh';
import SortIcon from '@mui/icons-material/Sort';
import { Button, Menu, MenuItem } from '@mui/material';
import style from "./Datasets.module.css";
import { Row } from "react-bootstrap";
import filterImg from './../../assets/img/filter.svg';

const SortRefreshComponent = ({ handleRefresh, handleSortChange, toggleFilters }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedButton, setSelectedButton] = useState(null);

    const sortOptions = [
        { field: 'project_group_name', label: 'Project Group Name', order: 'ASC' },
        { field: 'project_group_name', label: 'Project Group Name', order: 'DESC' },
        { field: 'status', label: 'Status', order: 'ASC' },
        { field: 'status', label: 'Status', order: 'DESC' },
        { field: 'uploaded_timestamp', label: 'Last Updated', order: 'DESC' },
        { field: 'valid_from', label: 'Valid From', order: 'DESC' },
        { field: 'valid_to', label: 'Valid To', order: 'DESC' },
    ];

    const open = Boolean(anchorEl);

    const handleSortMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
        setSelectedButton(selectedButton === 'Sort' ? null : 'Sort');
    };

    const handleSortMenuClose = () => {
        setAnchorEl(null);
        setSelectedButton(null);
    };

    const handleSortSelection = (option) => {
        handleSortChange(option.field, option.order);
        handleSortMenuClose();
    };

    const handleFilterClick = () => {
        toggleFilters();
        setSelectedButton(selectedButton === 'Filter' ? null : 'Filter'); // Toggle selection
    };

    return (
        <Row className="d-flex justify-content-end align-items-center" style={{ gap: '8px' }}>
            <Button
                variant="outlined"
                size="small"
                startIcon={<img src={filterImg} alt="Filter" style={{ width: 20, height: 15 }} />}
                onClick={handleFilterClick}
                className={style.sortFilterBtn}
                style={{
                    background: selectedButton === 'Filter' ? '#F8F8F8' : 'white'
                }}
            >
                Filter
            </Button>
            <Button
                variant="outlined"
                size="small"
                startIcon={<SortIcon />}
                onClick={handleSortMenuOpen}
                className={style.sortFilterBtn}
                style={{
                    background: selectedButton === 'Sort' ? '#F8F8F8' : 'white'
                }}
            >
                Sort by
            </Button>
            <Menu anchorEl={anchorEl} open={open} onClose={handleSortMenuClose}>
                {sortOptions.map(option => (
                    <MenuItem
                        key={`${option.field}-${option.order}`}
                        onClick={() => handleSortSelection(option)}
                    >
                        {option.field === 'project_group_name' || option.field === 'status'
                            ? `${option.label} (${option.order === 'ASC' ? 'A-Z' : 'Z-A'})`
                            : option.label
                        }
                    </MenuItem>
                ))}
            </Menu>
            <IconButton className={style.iconBtn} onClick={handleRefresh} sx={{ marginTop: '30px', marginRight: '12px' }}>
                <RefreshIcon style={{ fontSize: 20 }} />
            </IconButton>
        </Row>
    );
};

export default SortRefreshComponent;
