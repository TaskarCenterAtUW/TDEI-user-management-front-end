import clsx from "clsx";
import React from "react";
import {Button, Form, Spinner} from "react-bootstrap";
import Container from "../../components/Container/Container";
import Layout from "../../components/Layout";
import useGetJobs from "../../hooks/jobs/useGetJobs";
import style from "./Jobs.module.css";
import {useAuth} from "../../hooks/useAuth";
import {GET_JOBS} from "../../utils";
import {useQueryClient} from "react-query";
import refreshIcon from "./../../assets/img/icon-refresh.svg"
import {debounce} from "lodash";
import Select from "react-select";
import {useNavigate} from "react-router-dom";
import JobListItem from "../../components/JobListItem/JobListItem";

const Jobs = () => {
    const {user} = useAuth();
    const [, setQuery] = React.useState("");
    const [debounceQuery, setDebounceQuery] = React.useState("");
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    // Options for job type dropdown
    const jobTypeOptions = [
        {value: '', label: 'All'},
        {value: 'Confidence-Calculate', label: 'Confidence - Calculate'},
        {value: 'Dataset-Reformat', label: 'Reformat'},
        {value: 'Dataset-Upload', label: 'Upload'},
        {value: 'Dataset-Publish', label: 'Publish'},
        {value: 'Dataset-Validate', label: 'Validate'},
        {value: 'Dataset-Flatten', label: 'Flatten'},
        {value: 'Dataset-Queries', label: 'Queries'},
    ];

    // Options for status
    const jobStatusOptions = [
        {value: '', label: 'ALL'},
        {value: 'COMPLETED', label: 'COMPLETED'},
        {value: 'FAILED', label: 'FAILED'},
        {value: 'IN-PROGRESS', label: 'IN-PROGRESS'}
    ];
    const [jobType, setJobType] = React.useState(jobTypeOptions[0]);
    const [jobStatus, setJobStatus] = React.useState(jobStatusOptions[0]);

    const {
        data = [],
        isError,
        hasNextPage,
        fetchNextPage,
        isFetchingNextPage,
        isLoading,
    } = useGetJobs(user.isAdmin, debounceQuery, jobType.value, jobStatus.value);

    const handleJobTypeSelect = (value) => {
        setJobType(value);
        queryClient.invalidateQueries({queryKey: [GET_JOBS]});
    };

    const handleJobStatusSelect = (value) => {
        setJobStatus(value);
        queryClient.invalidateQueries({queryKey: [GET_JOBS]});
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

    return (
        <Layout>
            <div className={style.header}>
                <div className={style.title}>
                    <div className="page-header-title">Jobs</div>
                    <div className="page-header-subtitle">
                        Here are the Jobs currently in the{" "}
                        <span className="fw-bold">TDEI system</span>.
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
                            <Select id="jobShowSelect"/>
                        </div>
                        <div>
                            <button style={{height: '45px', width: '45px'}}>
                                <img src={refreshIcon}
                                     alt={Button}
                                />
                            </button>
                        </div>
                        <div>Sort by</div>
                    </div>
                    <div className={clsx(style.gridContainer, style.projectHeader)}>
                        <div>Input</div>
                        <div>Job Type / Job Id</div>
                        <div>Message</div>
                        <div>Status</div>
                        <div>Action</div>
                    </div>
                    {data?.pages?.map((values, i) => (
                        <React.Fragment key={i}>
                            {values?.data?.map((list) => (
                                <JobListItem jobItem={list}/>
                            ))}
                        </React.Fragment>
                    ))}
                    {isError ? " Error loading project group list" : null}
                    {isLoading ? (
                        <div className="d-flex justify-content-center">
                            <Spinner size="md"/>
                        </div>
                    ) : null}
                    {hasNextPage ? (
                        <Button
                            className="tdei-primary-button"
                            onClick={() => fetchNextPage()}
                            disabled={isFetchingNextPage || isError || !hasNextPage}
                        >
                            Load More {isFetchingNextPage && <Spinner size="sm"/>}
                        </Button>
                    ) : null}
                </>
            </Container>
        </Layout>
    );
};
export default Jobs;
