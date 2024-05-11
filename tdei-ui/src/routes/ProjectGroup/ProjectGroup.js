import clsx from "clsx";
import React from "react";
import {
  Button,
  Form,
  Dropdown,
  Spinner,
  OverlayTrigger,
  Popover,
} from "react-bootstrap";
import Container from "../../components/Container/Container";
import Layout from "../../components/Layout";
import useGetProjectGroups from "../../hooks/projectGroup/useGetProjectGroups";
import menuVertical from "../../assets/img/menu-vertical.png";
import CreateProjectGroup from "../../components/CreateProjectGroup/CreateProjectGroup";
import style from "./ProjectGroup.module.css";
import ManagePoc from "../../components/ManagePoc";
import { useDispatch } from "react-redux";
import { show } from "../../store/notification.slice";
import useDeleteProjectGroup from "../../hooks/projectGroup/useDeleteProjectGroup";
import { getUserName, GET_PROJECT_GROUP_LIST } from "../../utils";
import { useQueryClient } from "react-query";
import DeleteModal from "../../components/DeleteModal";
//src/assets/img/icon-projectgroupIcon.svg
import projectgroupIcon from "./../../assets/img/icon-projectgroupIcon.svg";
import { debounce } from "lodash";
import SuccessModal from "../../components/SuccessModal";
import userIcon from "../../assets/img/icon-userAvatar.png";
import ClipboardCopy from "../Services/ClipBoardCopy";

const ProjectGroup = () => {
  const [, setQuery] = React.useState("");
  const [debounceQuery, setDebounceQuery] = React.useState("");
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const [selectedData, setSelectedData] = React.useState({});
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);
  const [showModal, setShowModal] = React.useState(false);
  const [showCreateProjectGroup, setShowCreateProjectGroup] =
    React.useState(false);
  const [showManagePoc, setShowManagePoc] = React.useState(false);
  const {
    data = [],
    isError,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    isLoading,
  } = useGetProjectGroups(debounceQuery);

  const handleSearch = (e) => {
    setDebounceQuery(e.target.value);
  };

  const debouncedHandleSearch = React.useMemo(
    () => debounce(handleSearch, 300),
    []
  );

  const onSuccess = (data) => {
    console.log("suucessfull", data);
    setShowDeleteModal(false);
    setShowModal(true);
    queryClient.invalidateQueries({ queryKey: [GET_PROJECT_GROUP_LIST] });
  };
  const onError = (err) => {
    setShowDeleteModal(false);
    console.error("error message", err);
    dispatch(
      show({ message: `Error in deleteing project group`, type: "danger" })
    );
  };

  const { mutate, isLoading: deleteProjectGroupLoading } = useDeleteProjectGroup({
    onSuccess,
    onError,
  });

  const getData = (id) => {
    const list = data?.pages?.map((val) => val?.data).flat();
    return list?.find((project) => project.tdei_project_group_id === id);
  };

  const handleEdit = (e) => {
    const { id } = e.target;
    const dataToEdit = getData(id);
    setSelectedData(dataToEdit);
    setShowCreateProjectGroup(true);
  };
  const handlePoc = (e) => {
    const { id } = e.target;
    const dataToEdit = getData(id);
    setSelectedData(dataToEdit);
    setShowManagePoc(true);
  };
  const handleDelete = (e) => {
    const { id } = e.target;
    const dataToEdit = getData(id);
    setSelectedData(dataToEdit);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    const { tdei_project_group_id } = selectedData;
    mutate({ tdei_project_group_id, status: false });
  };

  const handleCreate = () => {
    setSelectedData({});
    setShowCreateProjectGroup(true);
  };

  return (
    <Layout>
      <div className={style.header}>
        <div className={style.title}>
          <div className="page-header-title">Project Groups</div>
          <div className="page-header-subtitle">
            Here are the project groups currently in the{" "}
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
              placeholder="Search Project Group"
              onChange={(e) => {
                setQuery(e.target.value);
                debouncedHandleSearch(e);
              }}
            />
            {/* <div>Sort by</div> */}
          </div>
          <div className={clsx(style.gridContainer, style.projectHeader)}>
            <div>Name & Address</div>
            <div>URL</div>
            <div>Contact Number</div>
            <div>POC</div>
            <div>Action</div>
          </div>
          {data?.pages?.map((values, i) => (
            <React.Fragment key={i}>
              {values?.data?.map((list) => (
                <div className={style.projectGroupBlock} key={list.tdei_project_group_id}>
                  <div className={style.gridContainer} >
                    <div className={style.details}>
                      <img
                        src={projectgroupIcon}
                        className={style.projectGroupIcon}
                        alt="sitemap-solid"
                      />
                      <div>
                        <div className={style.name} title={list.project_group_name} tabIndex={0}>{list.project_group_name}</div>
                        <div className={style.address} tabIndex={0}>{list.address}</div>
                      </div>
                    </div>
                    <div className={style.content} tabIndex={0}>{list.url}</div>
                    <div className={style.content} tabIndex={0}>{list.phone}</div>
                    <div>
                      <DisplayList list={list} handlePoc={handlePoc} />
                    </div>
                    <div className={style.actionItem}>
                      <Dropdown align="end">
                        <Dropdown.Toggle as={ActionItem}></Dropdown.Toggle>
                        <Dropdown.Menu align="end">
                          <Dropdown.Item
                            id={list.tdei_project_group_id}
                            onClick={handlePoc}
                          >
                            Manage POC
                          </Dropdown.Item>
                          <Dropdown.Item
                            id={list.tdei_project_group_id}
                            onClick={handleEdit}
                          >
                            Edit Project Group
                          </Dropdown.Item>
                          <Dropdown.Item
                            id={list.tdei_project_group_id}
                            onClick={handleDelete}
                          >
                            Delete Project Group
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    </div>
                  </div>
                  <div className={style.projectIdBlock}>
                    <ClipboardCopy copyText={list.tdei_project_group_id} copyTitle={"Project Id"} />
                  </div>
                </div>
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
      <CreateProjectGroup
        show={showCreateProjectGroup}
        onHide={() => setShowCreateProjectGroup(false)}
        data={selectedData}
      />
      <ManagePoc
        show={showManagePoc}
        onHide={() => setShowManagePoc(false)}
        data={selectedData}
      />
      <DeleteModal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        message={{
          title: `Delete Project Group ${selectedData.project_group_name}`,
          details: "Are you sure you want to delete project group?",
        }}
        handler={confirmDelete}
        isLoading={deleteProjectGroupLoading}
      />
      <SuccessModal
        show={showModal}
        onHide={() => setShowModal(false)}
        message={`Project group deleted successfully.`}
      />
    </Layout>
  );
};

export const ActionItem = React.forwardRef(({ children, onClick }, ref) => (
  <button onClick={onClick} ref={ref} className={`btn btn-link ${style.actionButton}`}>
    <img src={menuVertical} className={style.menuVertical} alt="menu-verical" />
    {children}
  </button>
));

const DisplayList = ({ list, handlePoc }) => {
  const { poc } = list;
  return (
    <>
      {poc.length ? (
        <div className={style.pocList}>
          <img src={userIcon} className={style.pocUserIcon} alt="user-icon" />
          <div className={style.content} tabIndex={0}>{getUserName(poc[0])}</div>
          {poc.length > 1 ? (
            <OverlayTrigger
              trigger={["hover", "focus"]}
              placement="bottom"
              overlay={
                <Popover id="popover-basic">
                  <Popover.Body>
                    {poc.map((val, i) => {
                      if (i !== 0) {
                        return (
                          <div className={style.pocList} key={i}>
                            <img
                              src={userIcon}
                              className={style.pocUserIcon}
                              alt="user-icon"
                            />
                            <div className={style.content}>
                              {getUserName(val)}
                            </div>
                          </div>
                        );
                      }
                      return null;
                    })}
                  </Popover.Body>
                </Popover>
              }
            >
              <div className={style.overlayList} tabIndex={0}>{`,+${poc.length - 1}`}</div>
            </OverlayTrigger>
          ) : null}
        </div>
      ) : (
        <Button
          className={style.notAssigned}
          id={list.tdei_project_group_id}
          onClick={handlePoc}
        >
          Not Assigned
        </Button>
      )}
    </>
  );
};

export default ProjectGroup;
