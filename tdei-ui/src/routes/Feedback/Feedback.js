import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getSelectedProjectGroup } from "../../selectors";
import  useGetFeedback  from "../../hooks/feedback/useGetFeedback";
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

const Feedback = () => {
  const { tdei_project_group_id } = useSelector(getSelectedProjectGroup);
  const {
    data = [],
    isError,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    isLoading,
    refreshData,
  } = useGetFeedback(
    null, // tdei_dataset_id
    null, // from_date
    null, // to_date
    "created_at", // sort_by
    "desc", // sort_order
    1, // page_no
    10 // page_size
  );
  const [feedbackList, setFeedbackList] = useState([]);
  useEffect(() => {
    if (data) {
      if (data && data.pages){
        console.log("Feedback pages:", data.pages);
        setFeedbackList(data.pages.flatMap((page) => page.data));
      }
      // setFeedbackList(data.pages.flatMap((page) => page.data));
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
                  <Button className="tdei-primary-button me-3" onClick={downloadData} disabled={isLoading}>
                      <DownloadIcon className="me-2" />
                      Download CSV
                  </Button>
                  </div>

            </div>
            <FeedbackSummary />
            <FeedbackFilter refreshData={refreshData} />
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
                                No feedback available for this project group.
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
