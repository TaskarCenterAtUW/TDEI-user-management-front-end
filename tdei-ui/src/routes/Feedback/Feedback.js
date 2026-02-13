import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getSelectedProjectGroup } from "../../selectors";
import useGetFeedback from "../../hooks/feedback/useGetFeedback";
import style from "./Feedback.module.css";
import { Button, Form, Spinner } from "react-bootstrap";
import Container from "../../components/Container/Container";
import FeedbackListItem from "../../components/FeedbackListItem/FeedbackListItem";
import clsx from "clsx";
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import FeedbackSummary from "../../components/FeedbackSummary";
import DownloadIcon from '@mui/icons-material/Download';
import FeedbackFilter from "../../components/FeedbackFilter";
import filterImg from './../../assets/img/filter.svg';
import ResponseToast from "../../components/ToastMessage/ResponseToast";
import IconButton from '@mui/material/IconButton';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useDownloadPGFeedbacks } from "../../hooks/feedback/useDownloadPGFeedbacks";
import { format } from "prettier";
import Popover from "@mui/material/Popover";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";

const Feedback = () => {
    const selectedProjectGroup = useSelector(getSelectedProjectGroup);
    const { mutate: downloadCSV, isPending: isDownloading } = useDownloadPGFeedbacks();
    const [selectedButton, setSelectedButton] = useState(null);
    const [isFeedbackDownloading, setIsFeedbackDownloading] = useState(false);
    const [formatAnchorEl, setFormatAnchorEl] = useState(null);
    const [filters, setFilters] = useState({
        datasetId: null,
        from_date: null,
        to_date: null,
        status: "",
        searchText: "",
        sort_by: "created_at",
        sort_order: "desc",
    });
    const {
        data = [],
        isError,
        hasNextPage,
        fetchNextPage,
        isFetchingNextPage,
        isLoading,
        refreshData,
    } = useGetFeedback(
        filters.datasetId || null,
        filters.from_date || null,
        filters.to_date || null,
        filters.sort_by || "created_at",
        filters.sort_order || "desc",
        1,
        10,
        filters.status || "",
    );
    const [feedbackList, setFeedbackList] = useState([]);
    useEffect(() => {
        if (data?.pages) {
            setFeedbackList(data.pages.flatMap((page) => page.data));
        }
    }, [data]);

    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [toastType, setToastType] = useState("success");

    const toggleApiSortByCreatedAt = () => {
        setFilters(prev => {
            const isCurrentlyCreated = prev.sort_by === 'created_at';
            const nextOrder =
                isCurrentlyCreated && prev.sort_order?.toLowerCase() === 'asc' ? 'desc' : 'asc';
            const next = { ...prev, sort_by: 'created_at', sort_order: nextOrder };
            return next;
        });
        refreshData?.();
    };

    const handleCloseToast = () => {
        setShowToast(false);
    };
    const toggleFilters = () => {
        setSelectedButton(selectedButton === 'Filter' ? null : 'Filter');
    };
    const downloadData = (selectedFormat = "csv") => {
        setIsFeedbackDownloading(true);
        const pgId = selectedProjectGroup?.tdei_project_group_id || selectedProjectGroup?.id;
        if (!pgId) {
            setIsFeedbackDownloading(false);
            return;
        }
        // Current support: whole project group
        downloadCSV(
            { tdei_project_group_id: pgId, format: selectedFormat },
            {
                onSuccess: ({ filename }) => {
                    setToastMessage(`Downloaded ${filename || "feedbacks file"}.`);
                    setToastType("success");
                    setShowToast(true);
                    setIsFeedbackDownloading(false);
                },
                onError: (err) => {
                    const msg =
                        (err?.response?.data && typeof err.response.data === "string" && err.response.data) ||
                        err?.message ||
                        "Failed to download file.";
                    setToastMessage(msg);
                    setToastType("error");
                    setShowToast(true);
                    setIsFeedbackDownloading(false);
                },
            }
        );
    };
    const openFormatMenu = (e) => setFormatAnchorEl(e.currentTarget);
    const closeFormatMenu = () => setFormatAnchorEl(null);
    const handleChooseFormat = (fmt) => {
        closeFormatMenu();
        downloadData(fmt);
    };

    return (
        <div className={style.jobsContainer}>
            <div className={style.header}>
                <div className={style.title}>
                    <h2 className="page-header-title">Feedback</h2>
                    <div className="page-header-subtitle">View and manage feedback for datasets</div>
                </div>
            </div>
            <FeedbackSummary />
            <div className={style.actionsRight}>
                <IconButton
                    className={style.iconBtn}
                    onClick={refreshData}
                    sx={{ height: '40px' }}
                    title="Refresh feedback list"  >
                    <RefreshIcon style={{ fontSize: 20 }} />
                </IconButton>
                <Button
                    variant="outline-secondary"
                    size="sm"
                    onClick={toggleFilters}
                    className={style.filterBtn}
                    style={{
                        backgroundColor: selectedButton === 'Filter' ? '#FFFFFF' : '#F8F8F8',
                        borderColor: '#E0E0E0',
                        color: '#162848',
                    }}
                >
                    <img
                        src={filterImg}
                        alt="Filter"
                        className="me-2"
                    />
                    Filter
                </Button>
                <Button
                    className="tdei-primary-button"
                    onClick={openFormatMenu}
                    disabled={isFeedbackDownloading || isDownloading}
                >
                    <DownloadIcon className="me-2" aria-hidden="true" />
                    {isFeedbackDownloading ? "Downloading…" : "Download Feedback"}
                </Button>
                <Popover
                    open={Boolean(formatAnchorEl)}
                    anchorEl={formatAnchorEl}
                    onClose={closeFormatMenu}
                    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                    transformOrigin={{ vertical: "top", horizontal: "right" }}
                    PaperProps={{ sx: { mt: 1, minWidth: 220 } }}
                >
                    <List dense disablePadding>
                        <ListItemButton onClick={() => handleChooseFormat("csv")} disabled={isFeedbackDownloading || isDownloading}>
                            <ListItemText primary="CSV" />
                        </ListItemButton>
                        <Divider />
                        <ListItemButton onClick={() => handleChooseFormat("geojson")} disabled={isFeedbackDownloading || isDownloading}>
                            <ListItemText primary="GeoJSON" />
                        </ListItemButton>
                    </List>
                </Popover>
            </div>
            {selectedButton === 'Filter' && (<FeedbackFilter
                refreshData={refreshData}
                onFiltersChange={setFilters}
            />)}

            <Container>

                {isLoading ? (
                    <div className="d-flex justify-content-center align-items-center" style={{ height: '200px' }}>
                        <Spinner animation="border" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </Spinner>
                    </div>
                ) : isError ? (
                    <div className="alert alert-danger" role="alert">
                        Error fetching feedback. Please try again later.
                    </div>
                ) : (
                    <>
                        {feedbackList.length === 0 ? (
                            <div className="alert alert-info" role="alert">
                                No feedback available.
                            </div>
                        ) : (
                            <div>
                                <div className={clsx(style.gridContainer, style.projectHeader)}>
                                    <div className={style.sortableHeader}>
                                        Feedback Details
                                        {/* {sortConfig.key === 'job_type' && sortConfig.direction === 'ascending' ? (
                                                              <ArrowDropUpIcon onClick={() => sortData('job_type')} className={style.sortIcon} />
                                                          ) : (
                                                              <ArrowDropDownIcon onClick={() => sortData('job_type')} className={style.sortIcon} />
                                                          )} */}
                                    </div>
                                    <div className={style.sortableHeader}>
                                        Contact & Location
                                        {/* {sortConfig.key === 'job_id' && sortConfig.direction === 'ascending' ? (
                                                              <ArrowDropUpIcon onClick={() => sortData('job_id')} className={style.sortIcon} />
                                                          ) : (
                                                              <ArrowDropDownIcon onClick={() => sortData('job_id')} className={style.sortIcon} />
                                                          )} */}
                                    </div>
                                    <div
                                        className={style.sortableHeader}
                                        style={{ cursor: 'pointer', userSelect: 'none' }}
                                        onClick={toggleApiSortByCreatedAt}
                                        title="Sort by submitted time (API)"
                                    >
                                        <span>Submitted time</span>
                                        {filters.sort_by === 'created_at' ? (
                                            (filters.sort_order?.toLowerCase() === 'asc') ? (
                                                <ArrowDropUpIcon className={style.sortIcon} />
                                            ) : (
                                                <ArrowDropDownIcon className={style.sortIcon} />
                                            )
                                        ) : null}
                                    </div>

                                    <div className={style.sortableHeader}>
                                        Dataset and Element ID
                                    </div>
                                    <div className={style.sortableHeader}>
                                        Status
                                    </div>
                                </div>
                                {feedbackList.map((feedback) => (
                                    <FeedbackListItem key={feedback.id} feedback={feedback} />
                                ))}

                                {hasNextPage && (
                                    <div className="d-flex justify-content-start my-3">
                                        <Button
                                            className="tdei-primary-button"
                                            onClick={() => fetchNextPage()}
                                            disabled={isFetchingNextPage}
                                        >
                                            {isFetchingNextPage ? 'Loading more...' : 'Load More'}
                                        </Button>
                                    </div>
                                    /**
                                     * <Button
                                                                 className="tdei-primary-button"
                                                                 onClick={() => fetchNextPage()}
                                                                 disabled={isFetchingNextPage || isError || !hasNextPage}
                                                             >
                                                                 Load More {isFetchingNextPage && <Spinner size="sm" />}
                                                             </Button>
                                     */
                                )}
                                <ResponseToast
                                    showtoast={showToast}
                                    handleClose={handleCloseToast}
                                    message={toastMessage}
                                    type={toastType}
                                    autoHideDuration={3000}
                                />

                            </div>
                        )}
                    </>
                )}
            </Container>
        </div>
    );

};

export default Feedback;
