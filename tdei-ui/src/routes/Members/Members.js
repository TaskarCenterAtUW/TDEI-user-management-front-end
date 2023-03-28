import clsx from "clsx";
import { debounce } from "lodash";
import React from "react";
import { Button, Dropdown, Form, Spinner } from "react-bootstrap";
import Container from "../../components/Container/Container";
import Layout from "../../components/Layout";
import useGetOrgUsers from "../../hooks/organisation/useGerOrgUsers";
import { ActionItem } from "../Organization/Organization";
import style from "./Members.module.css";
import { getUserName } from "../../utils";
import AssignRoles from "../../components/AssignRoles/AssignRoles";
import userIcon from "./../../assets/img/icon-feather-user.svg";
import { useAuth } from "../../hooks/useAuth";
import iconNoData from "./../../assets/img/icon-noData.svg";
import { useSelector } from "react-redux";
import { getSelectedOrg } from "../../selectors";

const Members = () => {
  const selectedOrg = useSelector(getSelectedOrg);
  const { user } = useAuth();
  const [, setQuery] = React.useState("");
  const [debounceQuery, setDebounceQuery] = React.useState("");
  const [showModal, setShowModal] = React.useState(false);
  const [selectedData, setSelectedData] = React.useState({});
  const {
    data = [],
    isError,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    isLoading,
  } = useGetOrgUsers(debounceQuery);

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
  };
  return (
    <Layout>
      <div className={style.header}>
        <div className={style.title}>
          <div className="page-header-title">Members</div>
          <div className="page-header-subtitle">
            Here are the members currently in the{" "}
            <span className="fw-bold">
              {user.isAdmin ? "TDEI system" : `${selectedOrg.org_name}`}
            </span>
            .
          </div>
        </div>
        <div>
          <Button onClick={handleAssignUser} className="tdei-primary-button">
            Assign New User
          </Button>
        </div>
      </div>
      <Container>
        <>
          <div className={style.searchPanel}>
            <Form.Control
              type="text"
              placeholder="Search User"
              onChange={(e) => {
                setQuery(e.target.value);
                debouncedHandleSearch(e);
              }}
            />
            {/* <div>Sort by</div> */}
          </div>
          <div className={clsx(style.gridContainer, style.userHeader)}>
            <div>Name & Email Id</div>
            <div>Contact Number</div>
            <div>Roles</div>
            <div>Action</div>
          </div>
          {data?.pages?.map((values, i) => (
            <React.Fragment key={i}>
              {values?.data?.length === 0 ? (
                <div className="d-flex align-items-center mt-4">
                  <img src={iconNoData} className={style.noDataIcon} />
                  <div className={style.noDataText}>No members found..!</div>
                </div>
              ) : null}
              {values?.data?.map((list) => (
                <div className={style.gridContainer} key={list.user_id}>
                  <div className={style.details}>
                    <div className={style.icon}>
                      <img src={userIcon} alt="sitemap-solid" />
                    </div>
                    <div>
                      <div className={style.name}>
                        {getUserName(list, list.username === user?.emailId)}
                      </div>
                      <div className={style.address}>{list.username}</div>
                    </div>
                  </div>
                  <div className={style.content}>{list.phone}</div>
                  <div className={style.roles}>
                    <DisplayRolesList list={list} />
                  </div>
                  <div className={style.actionItem}>
                    <Dropdown align="end">
                      <Dropdown.Toggle as={ActionItem}></Dropdown.Toggle>
                      <Dropdown.Menu align="end">
                        <Dropdown.Item id={list.user_id} onClick={handleUser}>
                          Manage User
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </div>
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
