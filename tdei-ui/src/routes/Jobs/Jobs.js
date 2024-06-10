import clsx from "clsx";
import React, { useEffect, useState } from "react";
import { Button, Form, Spinner } from "react-bootstrap";
import Container from "../../components/Container/Container";
import Layout from "../../components/Layout";
import useGetJobs from "../../hooks/jobs/useGetJobs";
import style from "./Jobs.module.css";
import { useAuth } from "../../hooks/useAuth";
import { GET_JOBS } from "../../utils";
import { useQueryClient } from "react-query";
import refreshIcon from "./../../assets/img/icon-refresh.svg"
import { debounce } from "lodash";
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import JobListItem from "../../components/JobListItem/JobListItem";
import SortRefreshComponent from "../Datasets/SortRefreshComponent";
import useIsDatasetsAccessible from "../../hooks/useIsDatasetsAccessible";
import iconNoData from "./../../assets/img/icon-noData.svg";
import { width } from "@mui/system";

const Jobs = () => {
    const { user } = useAuth();
    const [, setQuery] = React.useState("");
    const [debounceQuery, setDebounceQuery] = React.useState("");
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const isDatasetsAccessible = useIsDatasetsAccessible();
    const isAdmin = user && user.isAdmin;
    const [sortedData, setSortedData] = useState([]);


    // Options for job type dropdown
    const jobTypeOptions = [
        { value: '', label: 'All' },
        { value: 'Confidence-Calculate', label: 'Confidence - Calculate' },
        { value: 'Dataset-Reformat', label: 'Reformat' },
        { value: 'Dataset-Upload', label: 'Upload' },
        { value: 'Dataset-Publish', label: 'Publish' },
        { value: 'Dataset-Validate', label: 'Validate' },
        { value: 'Dataset-Flatten', label: 'Flatten' },
        { value: 'Dataset-Queries', label: 'Queries' },
    ];

    // Options for status
    const jobStatusOptions = [
        { value: '', label: 'All' },
        { value: 'COMPLETED', label: 'Completed' },
        { value: 'FAILED', label: 'Failed' },
        { value: 'IN-PROGRESS', label: 'In-Progress' }
    ];

    const jobShowOptions = [
        { value: '', label: 'All' },
        { value: 'me', label: 'Submitted by me' }
    ]

    const [jobType, setJobType] = React.useState(jobTypeOptions[0]);
    const [jobStatus, setJobStatus] = React.useState(jobStatusOptions[0]);
    const [jobShow, setJobShow] = React.useState(jobShowOptions[0]);

    const {
        data = [],
        isError,
        hasNextPage,
        fetchNextPage,
        isFetchingNextPage,
        isLoading,
        refreshData
    } = useGetJobs(user.isAdmin, debounceQuery, jobType.value, jobStatus.value);

    useEffect(() => {
        // Check if data is available and update sortedData
        if (data && data.pages && data.pages.length > 0) {
            const allData = data.pages.reduce((acc, page) => [...acc, ...page.data], []);
            setSortedData(allData);
        }
    }, [data]);

    const handleJobTypeSelect = (value) => {
        setJobType(value);
        queryClient.invalidateQueries({ queryKey: [GET_JOBS] });
    };

    const handleJobStatusSelect = (value) => {
        setJobStatus(value);
        queryClient.invalidateQueries({ queryKey: [GET_JOBS] });
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
        // Logic for handling dropdown selection
        console.log('Dropdown item selected:', eventKey);
        if (eventKey === 'status') {
            // Sort by status in ascending order
            const sorted = [...sortedData].sort((a, b) => a.status.localeCompare(b.status));
            setSortedData(sorted);
        } else if (eventKey === 'type') {
            // Sort by type in ascending order
            const sorted = [...sortedData].sort((a, b) => a.data_type.localeCompare(b.data_type));
            setSortedData(sorted);
        } else if (eventKey === 'asc') {
            // Sort by name in ascending order
            const sorted = [...sortedData].sort((a, b) => {
                if (!a.request_input.dataset_name && !b.request_input.dataset_name) {
                    return 0; // Both are undefined, consider them equal
                }
                if (!a.request_input.dataset_name) {
                    return 1; // a is undefined, move it to the end
                }
                if (!b.request_input.dataset_name) {
                    return -1; // b is undefined, move it to the end
                }
                // Both are defined, use localeCompare
                return a.request_input.dataset_name.localeCompare(b.request_input.dataset_name);

            });
            setSortedData(sorted);
        }
    };

    const handleRefresh = () => {
        // Logic for refreshing
        refreshData();
    };
    if (!(isAdmin || isDatasetsAccessible)) {
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
                        Create New
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
                            <SortRefreshComponent handleRefresh={handleRefresh}
                                handleDropdownSelect={handleDropdownSelect}
                                isReleasedDataset={false} />
                        </div>
                    </div>
                    <div className={clsx(style.gridContainer, style.projectHeader)}>
                        <div>Input</div>
                        <div>Job Type / Job Id</div>
                        <div>Message</div>
                        <div>Status</div>
                        {/* <div>Action</div> */}
                    </div>
                    {data?.pages?.map((values, i) => (
                        <React.Fragment key={i}>
                            {values?.data?.length === 0 ? (
                                <div className="d-flex align-items-center mt-2">
                                    <img
                                        src={iconNoData}
                                        alt="no-data-icon"
                                        width="20"
                                    />
                                    <div className={style.noDataText}>No Jobs Found..!</div>
                                </div>
                            ) : null}
                            {sortedData.map((list, index) => (
                                <JobListItem jobItem={list} key={list.job_id} />
                            ))}
                        </React.Fragment>
                    ))}
                    {isError ? " Error loading project group list" : null}
                    {isLoading ? (
                        <div className="d-flex justify-content-center">
                            <Spinner size="md" />
                        </div>
                    ) : null}
                    {hasNextPage ? (
                        <Button
                            className="tdei-primary-button"
                            onClick={() => fetchNextPage()}
                            disabled={isFetchingNextPage || isError || !hasNextPage}
                        >
                            Load More {isFetchingNextPage && <Spinner size="sm" />}
                        </Button>
                    ) : null}
                </>
            </Container>
        </div>
    );
};
export default Jobs;
