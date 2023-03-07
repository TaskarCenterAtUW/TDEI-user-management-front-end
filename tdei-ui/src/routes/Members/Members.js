import clsx from "clsx";
import { debounce } from "lodash";
import React from "react";
import {
  Button,
  Dropdown,
  Form,
  OverlayTrigger,
  Popover,
  Spinner,
} from "react-bootstrap";
import Container from "../../components/Container/Container";
import Layout from "../../components/Layout";
import useGetOrgUsers from "../../hooks/organisation/useGerOrgUsers";
import { ActionItem } from "../Organization/Organization";
import sitemapSolid from "../../assets/img/sitemap-solid.svg";
import style from "./Members.module.css";
import { getUserName } from "../../utils";
import AssignRoles from "../../components/AssignRoles/AssignRoles";
import useIsPoc from "../../hooks/useIsPoc";

const Members = () => {
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
          <div className="page-header-title">MEMBERS</div>
          <div className="page-header-subtitle">
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since
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
            <div>Sort by</div>
          </div>
          <div className={clsx(style.gridContainer, style.userHeader)}>
            <div>Name & Email Id</div>
            <div>Contact Number</div>
            <div>Roles</div>
            <div>Action</div>
          </div>
          {data?.pages?.map((values, i) => (
            <React.Fragment key={i}>
              {values?.data?.map((list) => (
                <div className={style.gridContainer} key={list.user_id}>
                  <div className={style.details}>
                    <div className={style.icon}>
                      <img src={sitemapSolid} alt="sitemap-solid" />
                    </div>
                    <div>
                      <div className={style.name}>{getUserName(list)}</div>
                      <div className={style.address}>{list.username}</div>
                    </div>
                  </div>
                  <div className={style.content}>{list.phone}</div>
                  <div className={style.roles}>
                    <>
                      {list.roles.slice(0, 2).map((role) => (
                        <div className={style.roleBlock} key={role}>
                          {role}
                        </div>
                      ))}
                      <>
                        {list.roles.length > 2 ? (
                          <OverlayTrigger
                            trigger={["hover", "focus"]}
                            placement="bottom"
                            overlay={
                              <Popover id="popover-basic">
                                <Popover.Body>
                                  {list.roles.slice(2).map((val, i) => {
                                    return (
                                      <div className={style.rolesList} key={i}>
                                        {val}
                                      </div>
                                    );
                                  })}
                                </Popover.Body>
                              </Popover>
                            }
                          >
                            <div
                              className={style.content}
                              style={{ cursor: "pointer" }}
                            >{`+${list.roles.length - 2}`}</div>
                          </OverlayTrigger>
                        ) : null}
                      </>
                    </>
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

export default Members;
