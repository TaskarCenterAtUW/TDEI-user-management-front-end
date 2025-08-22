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

const Feedback = () => {
    const { tdei_project_group_id } = useSelector(getSelectedProjectGroup);
     const [selectedButton, setSelectedButton] = useState(null);
    const [filters, setFilters] = useState({
        datasetId: null,   
        from_date: null,   
        to_date: null,  
        status : "",
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
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
    const sortData = (key) => {
        const direction = sortConfig.key === key && sortConfig.direction === 'ascending' ? 'descending' : 'ascending';
        setSortConfig({ key, direction });
        const sortedData = [...feedbackList].sort((a, b) => {
            if (direction === 'ascending') {
                return a[key] > b[key] ? 1 : -1;
            } else {
                return a[key] < b[key] ? 1 : -1;
            }
        });
        setFeedbackList(sortedData);
    };
       const toggleFilters = () => {
        setSelectedButton(selectedButton === 'Filter' ? null : 'Filter');
    };

    const downloadData = () => {
        // Construct the CSV content
        console.log("Downloading data:", feedbackList);
    }

    return (
        <div className={style.jobsContainer}>
            <div className={style.header}>
                <div className={style.title}>
                    <div className="page-header-title">Feedback</div>
                    <div className="page-header-subtitle">View and manage feedback for datasets</div>
                </div>
                <div className="d-flex align-items-end">
                    <Button
                        variant="outline-secondary"                  
                        size="sm"
                        onClick={toggleFilters}
                        className={style.filterBtn}
                        style={{
                            backgroundColor: selectedButton === 'Filter' ? '#F8F8F8' : '#FFFFFF',
                            borderColor: '#E0E0E0',
                            color: '#162848',
                        }}
                    >
                        <img
                            src={filterImg}
                            alt="Filter"
                            style={{ width: 20, height: 15 }}
                            className="me-2"
                        />
                        Filter
                    </Button>
                    <Button className="tdei-primary-button me-3" onClick={downloadData} disabled={isLoading}>
                        <DownloadIcon className="me-2" />
                        Download CSV
                    </Button>
                </div>

            </div>
            <FeedbackSummary />
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
                                    <div className={style.sortableHeader}>
                                        Submitted time
                                        {/* {sortConfig.key === 'requested_by' && sortConfig.direction === 'ascending' ? (
                                                              <ArrowDropUpIcon onClick={() => sortData('requested_by')} className={style.sortIcon} />
                                                          ) : (
                                                              <ArrowDropDownIcon onClick={() => sortData('requested_by')} className={style.sortIcon} />
                                                          )} */}
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
                            </div>
                        )}
                    </>
                )}
            </Container>
        </div>
    );

};

export default Feedback;
