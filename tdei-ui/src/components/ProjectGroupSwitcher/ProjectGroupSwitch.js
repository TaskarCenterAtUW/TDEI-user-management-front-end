import React, { useEffect } from "react";
import Container from "../../components/Container/Container";
import style from "./ProjectGroupSwitcher.module.css"
import { Button, Form, Spinner } from "react-bootstrap";
import { useAuth } from "../../hooks/useAuth";
import { debounce } from "lodash";
import { useDispatch } from "react-redux";
import { useQueryClient } from "react-query";
import iconNoData from "./../../assets/img/icon-noData.svg";
import { useSelector } from "react-redux";
import { getSelectedProjectGroup } from "../../selectors";
import ClipboardCopy from "../../routes/Services/ClipBoardCopy";
import { useNavigate } from 'react-router-dom';
import useIsPoc from "../../hooks/useIsPoc";
import useGetProjectGroupRoles from "../../hooks/roles/useProjectGroupRoles";
import projectGroupIcon from "../../assets/img/icon-projectgroupIcon.svg"
import SwitchIcon from '@mui/icons-material/Tune';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { set } from "../../store";

const ProjectGroupSwitch = () => {
    const selectedProjectGroup = useSelector(getSelectedProjectGroup);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [debounceQuery, setDebounceQuery] = React.useState("");
    const [, setQuery] = React.useState("");

    const {
        data = [],
        isError,
        hasNextPage,
        fetchNextPage,
        isFetchingNextPage,
        isLoading,
    } = useGetProjectGroupRoles(debounceQuery);

    const updateSelectedProject = (id) => {
        if (selectedProjectGroup?.tdei_project_group_id === id) {
            return;
        }
        const selectedProject = data?.pages?.flatMap((page) => page?.data)?.find(
            (project) => project.tdei_project_group_id === id
        );

        if (selectedProject) {
            dispatch(set(selectedProject));
            navigate("/");
        }
    }
        // Sync Redux state when localStorage changes (cross-tab update)
        useEffect(() => {
            const handleStorageChange = (event) => {
                if (event.key === "selectedProjectGroup") {
                    console.log("Storage event detected. New value:", event.newValue);
                    const updatedProjectGroup = JSON.parse(localStorage.getItem("selectedProjectGroup"));
                    
                    if (updatedProjectGroup) {
                        console.log("Updated Project Group:", updatedProjectGroup);
                        console.log("Name:", updatedProjectGroup.name);
                    }
        
                    if (updatedProjectGroup && updatedProjectGroup.tdei_project_group_id !== selectedProjectGroup?.tdei_project_group_id) {
                        dispatch(set(updatedProjectGroup));
                    }
                }
            };
        
            window.addEventListener("storage", handleStorageChange);
            return () => window.removeEventListener("storage", handleStorageChange);
        }, [dispatch, selectedProjectGroup?.tdei_project_group_id]);
        
        
    const handleSearch = (e) => {
        setDebounceQuery(e.target.value);
    };

    const debouncedHandleSearch = React.useMemo(
        () => debounce(handleSearch, 300),
        []
    );

    return (
        <div className={style.layout}>
            <div className={style.title}>
                <div className="page-header-title">Project Groups</div>
            </div>
            <div className="page-header-subtitle" style={{ paddingTop: '10px', paddingBottom: '20px' }}>
                {"Current project is "}
                <span className="fw-bold">
                    {`${selectedProjectGroup.name}`}
                </span>
                . You can switch to a different project group below.
            </div>
            <Container className={style.scrollableContainer}>
                <><Form.Control
                    value={debounceQuery}
                    className={style.customFormControl}
                    aria-label="Text input with dropdown button"
                    placeholder="Search Project Group"
                    onChange={(e) => {
                        setDebounceQuery(e.target.value);
                        setQuery(e.target.value);
                        debouncedHandleSearch(e);
                    }}
                />
                    {data?.pages?.map((values, i) => (
                        <React.Fragment key={i}>
                            {values?.data?.length === 0 ? (
                                <div className="d-flex align-items-center mt-2">
                                    <img
                                        src={iconNoData}
                                        className={style.noDataIcon}
                                        alt="no-data-icon"
                                    />
                                    <div className={style.noDataText}>No project groups found..!</div>
                                </div>
                            ) : null}
                            {values?.data?.map((list) => (
                                <ListingBlock
                                    id={list.tdei_project_group_id}
                                    name={list.project_group_name}
                                    icon={projectGroupIcon}
                                    key={list.tdei_project_group_id}
                                    isCurrent={selectedProjectGroup.tdei_project_group_id === list.tdei_project_group_id}
                                    handleUpdateProject={updateSelectedProject}
                                />
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

export const ListingBlock = ({ id, name, icon, handleUpdateProject, isCurrent }) => {
    const selectedIcon = isCurrent ? <CheckCircleIcon /> : <SwitchIcon />;

    return (
        <div className={style.projectGroupsContainer}>
            <div className={style.block} key={id}>
                <div className={style.names}>
                    <img src={icon} className={style.projectGroupIcon} alt="icon" />
                    <div>
                        <div className={style.projectGroupName} title={name} tabIndex={0}>{name}</div>
                    </div>
                </div>
                {isCurrent ?
                    (<div className={style.currentProject}>
                        <span style={{ color: "green", paddingRight: "5px" }}>{selectedIcon}</span>
                        Current Project
                    </div>
                    ) : (
                        <div className={style.buttons}>
                            <Button
                                className={style.switchButton}
                                onClick={() => handleUpdateProject(id)}
                                variant="link"
                            >
                                <span style={{ color: isCurrent ? 'green' : null, paddingRight: '5px' }}>{selectedIcon}</span>
                                Switch Project
                            </Button>
                        </div>)}

            </div>
            <div className={style.projectGroupIdBlock}>
                <ClipboardCopy copyText={id} copyTitle={"Id"} />
            </div>
        </div>
    );
};


export default ProjectGroupSwitch;
