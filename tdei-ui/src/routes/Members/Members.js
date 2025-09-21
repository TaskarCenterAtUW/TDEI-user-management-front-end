import clsx from "clsx";
import { debounce } from "lodash";
import React from "react";
import { Button, Dropdown, Form, Spinner } from "react-bootstrap";
import Container from "../../components/Container/Container";
import Layout from "../../components/Layout";
import useGetProjectGroupUsers from "../../hooks/projectGroup/useGetProjectGroupUsers";
import { ActionItem } from "../ProjectGroup/ProjectGroup";
import style from "./Members.module.css";
import { getUserName } from "../../utils";
import AssignRoles from "../../components/AssignRoles/AssignRoles";
import userIcon from "./../../assets/img/icon-feather-user.svg";
import { useAuth } from "../../hooks/useAuth";
import iconNoData from "./../../assets/img/icon-noData.svg";
import { useSelector } from "react-redux";
import { getSelectedProjectGroup } from "../../selectors";
import { GET_PROJECT_GROUP_USERS } from "../../utils";
import { useQueryClient } from "react-query";
import { useDispatch } from "react-redux";
import { show } from "../../store/notification.slice";
import SuccessModal from "../../components/SuccessModal";
import DeleteModal from "../../components/DeleteModal";
import { Tooltip, OverlayTrigger } from "react-bootstrap";
import { formatPhoneNumber } from "../../utils";
import useDownloadUsers from "../../hooks/useDownloadActiveUsers";
import DownloadIcon from '@mui/icons-material/Download';
import useAssignRoles from "../../hooks/roles/useAssignRoles";
import ResponseToast from "../../components/ToastMessage/ResponseToast";
import { useMediaQuery } from 'react-responsive';


const Members = () => {
  const selectedProjectGroup = useSelector(getSelectedProjectGroup);
  const { user } = useAuth();
  const [, setQuery] = React.useState("");
  const [debounceQuery, setDebounceQuery] = React.useState("");
  const [showModal, setShowModal] = React.useState(false);
  const [selectedData, setSelectedData] = React.useState({});
  const [isEdit, setIsEdit] = React.useState(false);
  const queryClient = useQueryClient();
  const [showRevokeModal, setShowRevokeModal] = React.useState(false);
  const [showConfirmModal, setShowConfirmModal] = React.useState(false);
  const [selectedUser, setSelectedUser] = React.useState("");
  const [showToast, setShowToast] = React.useState(false);
  const [toastType, setToastType] = React.useState("success");
  const [toastMessage, setToastMessage] = React.useState("");
  const dispatch = useDispatch();
  const isMobile = useMediaQuery({ maxWidth: 992 });
  const {
    data = [],
    isError,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    isLoading,
  } = useGetProjectGroupUsers(debounceQuery);

  const onRemoveUserSuccess = (data) => {
    setShowRevokeModal(true);
    setShowConfirmModal(false);
    queryClient.invalidateQueries({ queryKey: [GET_PROJECT_GROUP_USERS] });
  };
  const onRemoveUserError = (err) => {
    setShowConfirmModal(false);
    console.error(err);
    dispatch(show({ message: `Error in removing user`, type: "danger" }));
  };
  const { mutate: removeUser, isLoading: removeUserLoading } =
    useAssignRoles({
      onError: onRemoveUserError,
      onSuccess: onRemoveUserSuccess,
    });

  const { mutate: downloadUsers, isLoading: isDownloadingUsers } = useDownloadUsers();

  const handleDownloadUsers = () => {
   downloadUsers(undefined, {
      onSuccess: ({ filename }) => {
        setToastType("success");
        setToastMessage(`Downloaded ${filename || "tdei-active-users.csv"}.`);
        setShowToast(true);
      },
      onError: (err) => {
        const msg = (err && err.message) || "Failed to download CSV.";
        setToastType("error");
        setToastMessage(msg);
        setShowToast(true);
      },
    });
  };


  const handleSearch = (e) => {
    setDebounceQuery(e.target.value);
  };

  const debouncedHandleSearch = React.useMemo(
    () => debounce(handleSearch, 300),
    []
  );
  const handleAssignUser = () => {
    setSelectedData({});
    setShowModal(true);
    setIsEdit(false);
  };
  const getData = (id) => {
    const list = data?.pages?.map((val) => val?.data).flat();
    return list?.find((user) => user.user_id === id);
  };
  const handleUser = (e) => {
    const { id } = e.target;
    const dataToEdit = getData(id);
    setSelectedData(dataToEdit);
    setShowModal(true);
    setIsEdit(true);
  };
  const handleRemoveUser = () => {
    removeUser({
      tdei_project_group_id: selectedProjectGroup.tdei_project_group_id,
      user_name: selectedUser.username,
      roles: [],
    });
  };
  const isAdmin = user.isAdmin;
  return (
    <Layout>
      <div className={style.header}>
        <div className={style.title}>
          <div className="page-header-title">Members</div>
          <div className="page-header-subtitle">
            Here are the members currently in the{" "}
            <span className="fw-bold">
              {user.isAdmin ? "TDEI system" : `${selectedProjectGroup.name}`}
            </span>
            .
          </div>
        </div>
        <div>
          {!user.isAdmin && (
            <div>
              <Button onClick={handleAssignUser} className="tdei-primary-button">
                Assign New User
              </Button>
            </div>
          )}
        </div>
      </div>
      <Container>
        <>
          <div className={style.searchPanel}>
            <div className={style.searchWrapper}>
              <Form.Control
                type="text"
                placeholder="Search User"
                onChange={(e) => {
                  setQuery(e.target.value);
                  debouncedHandleSearch(e);
                }}
              />
              {user.isAdmin &&
                (
                  <Button
                     className={clsx("tdei-primary-button", style.downloadBtn)}
                    onClick={handleDownloadUsers}
                    disabled={isDownloadingUsers}
                  >
                    {isDownloadingUsers ? <Spinner size="sm" /> : <><DownloadIcon /> Download Active Users</>}
                  </Button>
                )}
            </div>
          </div>
          <div className={clsx(
            style.gridContainer,
            isAdmin ? style.adminGrid : style.userGrid,
            style.userHeader
          )}>
            <div>Name & Email Id</div>
            <div>Contact Number</div>
            {!user.isAdmin && <div>Roles</div>}
            {!user.isAdmin && <div className="text-center">Action</div>}
          </div>
          {data?.pages?.map((values, i) => (
            <React.Fragment key={i}>
              {values?.data?.length === 0 ? (
                <div className="d-flex align-items-center mt-4">
                  <img
                    src={iconNoData}
                    className={style.noDataIcon}
                    alt="no-member-icon"
                  />
                  <div className={style.noDataText}>No members found..!</div>
                </div>
              ) : null}
              {values?.data?.map((list) => (
                <div className={clsx(
                  style.gridContainer,
                  isAdmin ? style.adminGrid : style.userGrid
                )} key={list.user_id}>
                  <div className={style.details}>
                    <div className={style.icon}>
                      <img src={userIcon} alt="sitemap-solid" />
                    </div>
                    <div>
                      <div className={style.name}>
                        {getUserName(list, list.user_id === user?.userId)}
                      </div>
                      <div className={style.address}>{list.username}</div>
                    </div>
                  </div>
                  <div className={style.content}>
                    <div className={style.mobileOnly}>Contact Number</div>
                    <div>{formatPhoneNumber(list.phone) || '--'}</div>
                  </div>
                  {!user.isAdmin && (
                    <div className={style.roles}>
                      <div className={style.mobileOnly}>Roles</div>
                      <DisplayRolesList list={list} />
                    </div>
                  )}
                  {user.userId !== list.user_id && !user.isAdmin && (<div className={style.actionItem}>
                    <Dropdown align="end">
                      {isMobile ? (
                        <Dropdown.Toggle
                          id="dropdown-basic"
                          variant="btn btn-link"
                          className={style.membersActionsButton}
                        >
                          Manage User
                        </Dropdown.Toggle>
                      ) : (
                        <Dropdown.Toggle as={ActionItem}></Dropdown.Toggle>
                      )}
                      <Dropdown.Menu align="end">
                        <Dropdown.Item id={list.user_id} onClick={handleUser}>
                          Manage User
                        </Dropdown.Item>
                        <Dropdown.Item id={list.user_id} onClick={() => {
                          setShowConfirmModal(true);
                          setSelectedUser(list);
                        }}>
                          Remove User
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </div>)}
                </div>
              ))}
            </React.Fragment>
          ))}
          {isError ? " Error loading members list" : null}
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
      <AssignRoles
        show={showModal}
        onHide={() => setShowModal(false)}
        data={selectedData}
        isEdit={isEdit}
      />
      <SuccessModal
        show={showRevokeModal}
        onHide={() => {
          setShowRevokeModal(false)
        }}
        message="User Removed Successfully"
      />
      <DeleteModal
        show={showConfirmModal}
        onHide={() => setShowConfirmModal(false)}
        message={{
          title: "Remove User",
          details: "Are you sure you want to remove the selected user from the project group?",
        }}
        handler={handleRemoveUser}
        isLoading={removeUserLoading}
      />
      <ResponseToast
        showtoast={showToast}
        handleClose={() => setShowToast(false)}
        message={toastMessage}
        type={toastType}
        autoHideDuration={3000}
      />
    </Layout>
  );
};

const DisplayRolesList = ({ list }) => {
  const [showMore, setShowMore] = React.useState(false);
  const handleShowMore = (e) => {
    e.preventDefault();
    setShowMore(true);
  };

  return (
    <>
      {showMore
        ? list.roles.map((role) => (
          <div className={style.roleBlock} key={role}>
            {role}
          </div>
        ))
        : list.roles.slice(0, 2).map((role) => (
          <div className={style.roleBlock} key={role}>
            {role}
          </div>
        ))}
      {list.roles.length > 2 && !showMore && (
        //eslint-disable-next-line
        <a className={style.showMore} onClick={handleShowMore}>
          Show all
        </a>
      )}
    </>
  );
};

export default Members;
