import clsx from "clsx";
import React, { useEffect, useState } from "react";
import { Button, Form, Spinner } from "react-bootstrap";
import Container from "../../components/Container/Container";
import Layout from "../../components/Layout";
import useGetJobs from "../../hooks/jobs/useGetJobs";
import style from "./Jobs.module.css";
import { useAuth } from "../../hooks/useAuth";
import { useQueryClient } from "react-query";
import refreshIcon from "./../../assets/img/icon-refresh.svg";
import { debounce } from "lodash";
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import JobListItem from "../../components/JobListItem/JobListItem";
import useIsDatasetsAccessible from "../../hooks/useIsDatasetsAccessible";
import iconNoData from "./../../assets/img/icon-noData.svg";
import { width } from "@mui/system";
import refreshBtn from "./../../assets/img/refreshBtn.svg";
import { IconButton } from "@mui/material";
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import useIsMember from "../../hooks/roles/useIsMember";

const Jobs = () => {
    const { user } = useAuth();
    const [, setQuery] = React.useState("");
    const [debounceQuery, setDebounceQuery] = React.useState("");
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const isDatasetsAccessible = useIsDatasetsAccessible();
    const isAdmin = user && user.isAdmin;
    const isMember = useIsMember();
    const [sortedData, setSortedData] = useState([]);
    const [jobError, setJobError] = useState('');

    // Options for job type dropdown
    const jobTypeOptions = [
        { value: '', label: 'All' },
        { value: 'Clone-Dataset', label: 'Clone Dataset' },
        { value: 'Confidence-Calculate', label: 'Confidence - Calculate' },
        { value: 'Dataset-BBox', label: 'Dataset BBox' },
        { value: 'Dataset-Incline-Tag', label: 'Dataset Incline Tag' },
        { value: 'Dataset-Publish', label: 'Dataset Publish' },
        { value: 'Dataset-Reformat', label: 'Dataset Reformat' },
        { value: 'Dataset-Road-Tag', label: 'Dataset Road Tag' },
        { value: 'Dataset-Spatial-Join', label: 'Dataset Spatial Join' },
        { value: 'Dataset-Union', label: 'Dataset Union' },
        { value: 'Dataset-Upload', label: 'Dataset Upload' },
        { value: 'Dataset-Validate', label: 'Dataset Validate' },
        { value: 'Edit-Metadata', label: 'Edit Metadata' },
        { value: 'Quality-Metric', label: 'Quality Metric' },
    ];

    // Options for status
    const jobStatusOptions = [
        { value: '', label: 'All' },
        { value: 'COMPLETED', label: 'Completed' },
        { value: 'FAILED', label: 'Failed' },
        { value: 'IN-PROGRESS', label: 'In-Progress' },
        { value: 'ABANDONED', label: 'Abandoned' }
    ];

    const jobShowOptions = [
        { value: 'all', label: 'All' },
        { value: 'me', label: 'Submitted by me' }
    ]

    const [jobType, setJobType] = React.useState(jobTypeOptions[0]);
    const [jobStatus, setJobStatus] = React.useState(jobStatusOptions[0]);
    const [jobShow, setJobShow] = React.useState(jobShowOptions[0]);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
    const sortData = (key) => {
        const direction = sortConfig.key === key && sortConfig.direction === 'ascending' ? 'descending' : 'ascending';
    
        const sorted = [...sortedData].sort((a, b) => {
            let aValue, bValue;
            if (key === 'job_type') {
                aValue = a.job_type;
                bValue = b.job_type;
            } else if (key === 'job_id') {
                aValue = Number(a.job_id);
                bValue = Number(b.job_id);
            } else if (key === 'status') {
                aValue = a.status;
                bValue = b.status;
            } else if (key === 'created_at') {
                aValue = new Date(a.created_at);
                bValue = new Date(b.created_at);
            } else {
                aValue = a.requested_by;
                bValue = b.requested_by;
            }
            if (typeof aValue === 'string' && typeof bValue === 'string') {
                return direction === 'ascending' 
                    ? aValue.localeCompare(bValue)
                    : bValue.localeCompare(aValue);
            } else {
                return direction === 'ascending' ? (aValue - bValue) : (bValue - aValue);
            }
        });
    
        setSortedData(sorted);
        setSortConfig({ key, direction });
    };    
    const {
        data = [],
        isError,
        error,
        hasNextPage,
        fetchNextPage,
        isFetchingNextPage,
        isLoading,
        refreshData
    } = useGetJobs(user.isAdmin, debounceQuery, jobType.value, jobStatus.value,jobShow.value);

    useEffect(() => {
        if (data && data.pages && data.pages.length > 0) {
            // Accumulate jobs across pages and ensure uniqueness using a Map
            const allData = data.pages.reduce((acc, page) => {
                page.data.forEach(job => {
                    acc.set(job.job_id, job);
                });
                return acc;
            }, new Map());
            const sorted = Array.from(allData.values());
            setSortedData(sorted);
        }
    }, [data]);

    useEffect(() => {
        if (isError && (error?.response?.status === 404 || error?.response?.status === 400) || error?.response?.status === 500) {
          setSortedData([]);
          setJobError(error.response.data)
        }
      }, [isError, error]);

    const handleJobTypeSelect = (value) => {
        setJobType(value);
    };

    const handleJobStatusSelect = (value) => {
        setJobStatus(value);
    };

    const handleJobShowSelect = (value) => {
        setJobShow(value);
    };

    const handleSearch = (e) => {
        setDebounceQuery(e.target.value);
    };

    const debouncedHandleSearch = React.useMemo(
        () => debounce(handleSearch, 300),
        []
    );

    const handleCreate = () => {
        navigate('/CreateJob');
    };

    const handleDropdownSelect = (eventKey) => {
        const sortData = (dataToSort, key) => {
            return [...dataToSort].sort((a, b) => {
                const aValue = key === 'request_input.dataset_name'
                    ? a?.request_input?.dataset_name ?? ''
                    : a[key] ?? '';
                const bValue = key === 'request_input.dataset_name'
                    ? b?.request_input?.dataset_name ?? ''
                    : b[key] ?? '';

                return aValue.localeCompare(bValue);
            });
        };

        let sorted = [];
        if (eventKey === 'status') {
            sorted = sortData(sortedData, 'status');
        } else if (eventKey === 'type') {
            sorted = sortData(sortedData, 'jobType');
        } else if (eventKey === 'asc') {
            sorted = sortData(sortedData, 'request_input.dataset_name');
        }

        setSortedData(sorted);
    };

    const handleRefresh = () => {
        // Logic for refreshing
        refreshData();
    };
    if (!(isAdmin || isDatasetsAccessible || isMember)) {
        return (
            <div className="p-4">
                <div className="alert alert-warning" role="alert">
                    Oops! User doesn't have permission to access this page!
                </div>
            </div>
        );
    }
    return (
        <div className={style.jobsContainer}>
            <div className={style.header}>
                <div className={style.title}>
                    <div className="page-header-title">Jobs</div>
                    <div className="page-header-subtitle">
                        Here are the jobs you have access to
                    </div>
                </div>
                <div>
                    <Button onClick={handleCreate} className="tdei-primary-button">
                        Create Job
                    </Button>
                </div>
            </div>
            <Container>
                <>
                    <div className={style.searchPanel}>
                        <div className="d-flex flex-wrap">
                            <Form.Control
                                type="text"
                                placeholder="Search Job Id"
                                onChange={(e) => {
                                    setQuery(e.target.value);
                                    debouncedHandleSearch(e);
                                }}
                            />
                            <div className={style.selectPanel}>
                                <label htmlFor="jobTypeSelect" className={style.selectLabel}>Job Type</label>
                                <Select id="jobTypeSelect"
                                    className={style.select}
                                    options={jobTypeOptions}
                                    value={jobType}
                                    onChange={handleJobTypeSelect}
                                />
                            </div>
                            <div className={style.selectPanel}>
                                <label htmlFor="jobStatusSelect" className={style.selectLabel}>Status</label>
                                <Select id="jobStatusSelect"
                                    className={style.select}
                                    options={jobStatusOptions}
                                    value={jobStatus}
                                    onChange={handleJobStatusSelect}
                                />
                            </div>
                            <div className={style.selectPanel}>
                                <label htmlFor="jobShowSelect" className={style.selectLabel}>Show</label>
                                <Select id="jobShowSelect"
                                    className={style.select}
                                    options={jobShowOptions}
                                    value={jobShow}
                                    onChange={handleJobShowSelect}
                                />
                            </div>
                        </div>
                        <div className="d-flex">
                            <div className="d-flex align-items-center">
                                <IconButton className={style.iconBtn} onClick={handleRefresh}>
                                    <img alt="refresh" src={refreshBtn} style={{ height: "15px", width: "15px" }} />
                                </IconButton>
                            </div>
                        </div>
                    </div>
                    <div className={clsx(style.gridContainer, style.projectHeader)}>
                        <div className={style.sortableHeader}>
                            Job Type
                            {sortConfig.key === 'job_type' && sortConfig.direction === 'ascending' ? (
                                <ArrowDropUpIcon onClick={() => sortData('job_type')} className={style.sortIcon} />
                            ) : (
                                <ArrowDropDownIcon onClick={() => sortData('job_type')} className={style.sortIcon} />
                            )}
                        </div>
                        <div className={style.sortableHeader}>
                            Job Id
                            {sortConfig.key === 'job_id' && sortConfig.direction === 'ascending' ? (
                                <ArrowDropUpIcon onClick={() => sortData('job_id')} className={style.sortIcon} />
                            ) : (
                                <ArrowDropDownIcon onClick={() => sortData('job_id')} className={style.sortIcon} />
                            )}
                        </div>
                        <div className={style.sortableHeader}>
                            Submitted By
                            {sortConfig.key === 'requested_by' && sortConfig.direction === 'ascending' ? (
                                <ArrowDropUpIcon onClick={() => sortData('requested_by')} className={style.sortIcon} />
                            ) : (
                                <ArrowDropDownIcon onClick={() => sortData('requested_by')} className={style.sortIcon} />
                            )}
                        </div>
                        <div>Message</div>
                        <div className={style.sortableHeader}>
                            Status
                            {sortConfig.key === 'status' && sortConfig.direction === 'ascending' ? (
                                <ArrowDropUpIcon onClick={() => sortData('status')} className={style.sortIcon} />
                            ) : (
                                <ArrowDropDownIcon onClick={() => sortData('status')} className={style.sortIcon} />
                            )}
                        </div>
                        <div className={style.sortableHeader}>
                            Created On
                            {sortConfig.key === 'created_at' && sortConfig.direction === 'ascending' ? (
                                <ArrowDropUpIcon onClick={() => sortData('created_at')} className={style.sortIcon} />
                            ) : (
                                <ArrowDropDownIcon onClick={() => sortData('created_at')} className={style.sortIcon} />
                            )}
                        </div>
                    </div>
                    {isLoading ? (
                        <div className="d-flex justify-content-center">
                            <Spinner size="md" />
                        </div>
                    ) : sortedData.length > 0 ? (
                        sortedData.map((list, index) => (
                            <JobListItem jobItem={list} key={list.job_id} />
                        ))
                    ): <div></div>}
                    {isError && (error?.response?.status === 404 || error?.response?.status === 400) && (
                        <div className="d-flex align-items-center mt-2">
                            <img
                                src={iconNoData}
                                alt="no-data-icon"
                                width="20"
                            />
                            <div className={style.noDataText}>{jobError}</div>
                        </div>
                    )}  
                    {isError && error?.response?.status === 500 && (
                        <div className="d-flex align-items-center mt-2">
                            <img
                                src={iconNoData}
                                alt="no-data-icon"
                                width="20"
                            />
                            <div className={style.noDataText}>Error Loading Jobs!</div>
                        </div>
                    )}
                    {hasNextPage && !isLoading && (
                        <Button
                            className="tdei-primary-button"
                            onClick={() => fetchNextPage()}
                            disabled={isFetchingNextPage || isError || !hasNextPage}
                        >
                            Load More {isFetchingNextPage && <Spinner size="sm" />}
                        </Button>
                    )}
                </>
            </Container>
        </div>
    );
};
export default Jobs;
