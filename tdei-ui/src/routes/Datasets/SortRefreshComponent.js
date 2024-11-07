import React, { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import RefreshIcon from '@mui/icons-material/Refresh';
import SortIcon from '@mui/icons-material/Sort';
import FilterListIcon from '@mui/icons-material/FilterList';
import { Button, Menu, MenuItem } from '@mui/material';
import style from "./Datasets.module.css";
import { Row } from "react-bootstrap";

const SortRefreshComponent = ({ handleRefresh, handleSortChange, toggleFilters }) => {
    const [anchorEl, setAnchorEl] = useState(null);

    const sortOptions = [
        { field: 'uploaded_timestamp', label: 'Last Updated', order: 'ASC' },
        { field: 'uploaded_timestamp', label: 'Last Updated', order: 'DESC' },
        { field: 'project_group_name', label: 'Project Group Name', order: 'ASC' },
        { field: 'project_group_name', label: 'Project Group Name', order: 'DESC' },
        { field: 'status', label: 'Status', order: 'ASC' },
        { field: 'status', label: 'Status', order: 'DESC' },
        { field: 'valid_from', label: 'Valid From', order: 'ASC' },
        { field: 'valid_from', label: 'Valid From', order: 'DESC' },
        { field: 'valid_to', label: 'Valid To', order: 'ASC' },
        { field: 'valid_to', label: 'Valid To', order: 'DESC' },
    ];

    const open = Boolean(anchorEl);

    const handleSortMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleSortMenuClose = () => {
        setAnchorEl(null);
    };

    const handleSortSelection = (option) => {
        handleSortChange(option.field, option.order);
        handleSortMenuClose();
    };

    return (
        <Row className="d-flex justify-content-end align-items-center" style={{ gap: '8px' }}>
            <Button
                variant="outlined"
                size="small"
                startIcon={<FilterListIcon />}
                onClick={toggleFilters}
                className={style.sortFilterBtn}
            >
                Filter
            </Button>
            <Button
                variant="outlined"
                size="small"
                startIcon={<SortIcon />}
                onClick={handleSortMenuOpen}
                className={style.sortFilterBtn}
            >
                Sort by
            </Button>
            <Menu anchorEl={anchorEl} open={open} onClose={handleSortMenuClose}>
                {sortOptions.map(option => (
                    <MenuItem
                        key={`${option.field}-${option.order}`}
                        onClick={() => handleSortSelection(option)}
                    >
                        {`${option.label} (${option.order === 'ASC' ? 'A-Z' : 'Z-A'})`}
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
