import React, { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import RefreshIcon from '@mui/icons-material/Refresh';
import SortIcon from '@mui/icons-material/Sort';
import FilterListIcon from '@mui/icons-material/FilterList';
import { Button, Menu, MenuItem } from '@mui/material';
import style from "./Datasets.module.css";
import { Row } from "react-bootstrap";

const SortRefreshComponent = ({ handleRefresh, handleSortChange, sortField, sortOrder, toggleFilters }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [order, setOrder] = useState(sortOrder);

    const sortOptions = [
        { value: 'uploaded_timestamp', label: 'Last Updated' },
        { value: 'project_group_name', label: 'Project Group Name' },
        { value: 'status', label: 'Status' },
        { value: 'valid_from', label: 'Valid From' },
        { value: 'valid_to', label: 'Valid To' },
    ];

    const open = Boolean(anchorEl);

    const handleSortMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleSortMenuClose = () => {
        setAnchorEl(null);
    };

    const handleSortSelection = (selectedOption) => {
        handleSortChange(selectedOption.value, order);
        handleSortMenuClose();
    };

    const toggleSortOrder = () => {
        const newOrder = order === 'ASC' ? 'DESC' : 'ASC';
        setOrder(newOrder);
        handleSortChange(sortField, newOrder);
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
                    <MenuItem key={option.value} onClick={() => handleSortSelection(option)}>
                        {option.label}
                    </MenuItem>
                ))}
            </Menu>
            <IconButton className={style.iconBtn} onClick={handleRefresh} sx={{marginTop:'30px', marginRight:'12px'}}>
          <RefreshIcon style={{ fontSize: 20 }} />
        </IconButton>
        </Row>
    );
};

export default SortRefreshComponent;
