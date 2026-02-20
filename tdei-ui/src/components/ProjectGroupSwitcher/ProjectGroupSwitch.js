import React, { useEffect } from "react";
import Container from "../../components/Container/Container";
import style from "./ProjectGroupSwitcher.module.css";
import { Button, Form, Spinner } from "react-bootstrap";
import { useAuth } from "../../hooks/useAuth";
import { debounce } from "lodash";
import { useDispatch } from "react-redux";
import { useQueryClient } from "react-query";
import iconNoData from "./../../assets/img/icon-noData.svg";
import { useSelector } from "react-redux";
import { getSelectedProjectGroup } from "../../selectors";
import ClipboardCopy from "../../routes/Services/ClipBoardCopy";
import { useNavigate } from "react-router-dom";
import useGetProjectGroupRoles from "../../hooks/roles/useProjectGroupRoles";
import projectGroupIcon from "../../assets/img/icon-projectgroupIcon.svg";
import SwitchIcon from "@mui/icons-material/Tune";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { set } from "../../store";
import { FaCog } from "react-icons/fa";
import ProjectGroupSettings from "../ProjectGroupSettings/ProjectGroupSettings";
import QrCode2Icon from "@mui/icons-material/QrCode2";
import Tooltip from "@mui/material/Tooltip";
import { useMediaQuery } from "react-responsive";
import { SHOW_REFERRALS } from "../../utils";

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
    const selectedProject = data?.pages
      ?.flatMap((page) => page?.data)
      ?.find((project) => project.tdei_project_group_id === id);

    if (selectedProject) {
      dispatch(set(selectedProject));
      navigate("/");
    }
  };

  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === "selectedProjectGroup") {
        const updatedProjectGroup = JSON.parse(
          localStorage.getItem("selectedProjectGroup")
        );
        if (
          updatedProjectGroup &&
          updatedProjectGroup.tdei_project_group_id !==
            selectedProjectGroup?.tdei_project_group_id
        ) {
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
      <div className={style.header}>
        <div className={style.title}>
          <h2 className="page-header-title">Project Groups</h2>
          <div
            className="page-header-subtitle"
          >
            {"Current project is "}
            <span className="fw-bold">{`${selectedProjectGroup.name}`}</span>. You
            can switch to a different project group below.
          </div>
        </div>
      </div>
      <Container className={style.scrollableContainer}>
        <>
          <Form.Control
            value={debounceQuery}
            className={style.customFormControl}
            aria-label="Search Project Group"
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
                  <div className={style.noDataText}>
                    No project groups found..!
                  </div>
                </div>
              ) : null}
              {values?.data?.map((list) => (
                <ListingBlock
                  project={list}
                  key={list.tdei_project_group_id}
                  isCurrent={
                    selectedProjectGroup.tdei_project_group_id ===
                    list.tdei_project_group_id
                  }
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

export const ListingBlock = ({ project, handleUpdateProject, isCurrent }) => {
  const { tdei_project_group_id: id, project_group_name: name } = project;
  const selectedIcon = isCurrent ? <CheckCircleIcon /> : <SwitchIcon />;
  const [isProjectGroupSettingsDailogOpen, setProjectGroupSettingDailog] =
    React.useState(false);
  const navigate = useNavigate();

  const openDailog = () => {
    setProjectGroupSettingDailog(true);
  };

  const closeDailog = () => {
    setProjectGroupSettingDailog(false);
  };

  const canShowProjectGroupSettings = () => {
    return (
      project.roles.includes("poc") ||
      project.roles.includes("osw_data_generator")
    );
  };
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const canManageReferrals = SHOW_REFERRALS && project.roles.includes("poc");

  return (
    <div className={style.projectGroupsContainer}>
      <div className={style.block} key={id}>
        <div className={style.names}>
          <img
            src={projectGroupIcon}
            className={style.projectGroupIcon}
            alt=""
          />
          <div>
            <div className={style.projectGroupName} title={name}>
              {name}
            </div>
          </div>
        </div>
        <div className={style.buttonsAlignment}>
          {canShowProjectGroupSettings() ? (
            <div>
              <Button className={style.settingsButton} onClick={openDailog} aria-label="Project Group Settings">
                <FaCog />
              </Button>
              <ProjectGroupSettings
                projectGroup={project}
                show={isProjectGroupSettingsDailogOpen}
                onHide={closeDailog}
              />
            </div>
          ) : null}
          {canManageReferrals && (
              <Tooltip title="Manage Referral Codes" arrow>
                  <Button
                    style={{ display: SHOW_REFERRALS ? "inline-flex" : "none" }}
                    className={style.switchButton}
                    onClick={() => navigate(`/${id}/referralCodes`)}
                    variant="link"
                  >
                    <QrCode2Icon />

                  </Button>
              </Tooltip>
          )}

          {isCurrent ? (
            <div className={style.currentProject}>
              <span style={{ color: "green", paddingRight: "5px" }}>
                {selectedIcon}
              </span>
              Current Project
            </div>
          ) : (
            <div className={style.buttons}>
              <Button
                className={style.switchButton}
                onClick={() => handleUpdateProject(id)}
                variant="link"
              >
                <span
                  style={{
                    color: isCurrent ? "green" : null,
                    paddingRight: "5px",
                  }}
                >
                  {selectedIcon}
                </span>
                Switch Project
              </Button>
            </div>
          )}
        </div>
      </div>
      <div className={style.projectGroupIdBlock}>
        <ClipboardCopy copyText={id} copyTitle={"Id"} />
      </div>
    </div>
  );
};

export default ProjectGroupSwitch;
