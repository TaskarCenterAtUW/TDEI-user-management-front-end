import React, { useState } from "react";
import { Button, Menu, MenuItem, Divider, ListItemIcon, ListItemText, IconButton } from "@mui/material";
import SortIcon from "@mui/icons-material/Sort";
import RefreshIcon from "@mui/icons-material/Refresh";
import CheckIcon from "@mui/icons-material/Check";
import styles from './../../routes/Datasets/Datasets.module.css';

const FeedbackSortRefresh = ({
  sortField = "created_at",
  sortOrder = "desc",
  onSortChange,     
  onRefresh,       
  controlHeight = 44, 
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenuOpen  = (e) => setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const setField = (field) => { onSortChange?.(field, sortOrder); handleMenuClose(); };
  const setOrder = (order) => { onSortChange?.(sortField, order); handleMenuClose(); };

  return (
    <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", flexWrap: "nowrap" }}>
      <Button
        variant="outlined"
        size="medium"
        startIcon={<SortIcon />}
        onClick={handleMenuOpen}
        className={styles.sortFilterBtn}
        sx={{ height: controlHeight, borderColor: "#E0E0E0" }}
      >
        Sort
      </Button>

      <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
        <MenuItem disabled><ListItemText primary="Sort by" /></MenuItem>
        <MenuItem onClick={() => setField("created_at")}>
          <ListItemIcon>{sortField === "created_at" ? <CheckIcon fontSize="small" /> : null}</ListItemIcon>
          <ListItemText primary="Created At" />
        </MenuItem>
        <MenuItem onClick={() => setField("due_date")}>
          <ListItemIcon>{sortField === "due_date" ? <CheckIcon fontSize="small" /> : null}</ListItemIcon>
          <ListItemText primary="Due Date" />
        </MenuItem>
        <Divider />
        <MenuItem disabled><ListItemText primary="Order" /></MenuItem>
        <MenuItem onClick={() => setOrder("desc")}>
          <ListItemIcon>{sortOrder === "desc" ? <CheckIcon fontSize="small" /> : null}</ListItemIcon>
          <ListItemText primary="Descending" />
        </MenuItem>
        <MenuItem onClick={() => setOrder("asc")}>
          <ListItemIcon>{sortOrder === "asc" ? <CheckIcon fontSize="small" /> : null}</ListItemIcon>
          <ListItemText primary="Ascending" />
        </MenuItem>
      </Menu>
      <IconButton
        className={styles.sortFilterBtn}
        onClick={onRefresh}
        aria-label="refresh"
        sx={{
          height: controlHeight,
          width: controlHeight,
          border: "1px solid #E0E0E0",
          borderRadius: "8px",
        }}
      >
        <RefreshIcon fontSize="small" />
      </IconButton>
    </div>
  );
};

export default FeedbackSortRefresh;
