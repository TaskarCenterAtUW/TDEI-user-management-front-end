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
import useGetOrganizations from "../../hooks/organisation/useGetOrganizations";
import menuVertical from "../../assets/img/menu-vertical.png";
import CreateOrganisation from "../../components/CreateOrganisation/CreateOrganisation";
import style from "./Organization.module.css";
import ManagePoc from "../../components/ManagePoc";
import { useDispatch } from "react-redux";
import { show } from "../../store/notification.slice";
import useDeleteOrganization from "../../hooks/organisation/useDeleteOrganization";
import { getUserName, GET_ORG_LIST } from "../../utils";
import { useQueryClient } from "react-query";
import DeleteModal from "../../components/DeleteModal";
import sitemapSolid from "../../assets/img/sitemap-solid.svg";
import iconOrg from "./../../assets/img/icon-orgIcon.svg"
import { debounce } from "lodash";
import SuccessModal from "../../components/SuccessModal";
import userIcon from "../../assets/img/icon-userAvatar.png";

const Organization = () => {
  const [, setQuery] = React.useState("");
  const [debounceQuery, setDebounceQuery] = React.useState("");
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const [selectedData, setSelectedData] = React.useState({});
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);
  const [showModal, setShowModal] = React.useState(false);
  const [showCreateOrganisation, setShowCreateOrganisation] =
    React.useState(false);
  const [showManagePoc, setShowManagePoc] = React.useState(false);
  const {
    data = [],
    isError,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    isLoading,
  } = useGetOrganizations(debounceQuery);

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
    queryClient.invalidateQueries({ queryKey: [GET_ORG_LIST] });
  };
  const onError = (err) => {
    setShowDeleteModal(false);
    console.error("error message", err);
    dispatch(
      show({ message: `Error in deleteing organization`, type: "danger" })
    );
  };

  const { mutate, isLoading: deleteOrgLoading } = useDeleteOrganization({
    onSuccess,
    onError,
  });

  const getData = (id) => {
    const list = data?.pages?.map((val) => val?.data).flat();
    return list?.find((org) => org.tdei_org_id === id);
  };

  const handleEdit = (e) => {
    const { id } = e.target;
    const dataToEdit = getData(id);
    setSelectedData(dataToEdit);
    setShowCreateOrganisation(true);
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
    const { tdei_org_id } = selectedData;
    mutate({ tdei_org_id, status: false });
  };

  const handleCreate = () => {
    setSelectedData({});
    setShowCreateOrganisation(true);
  };

  return (
    <Layout>
      <div className={style.header}>
        <div className={style.title}>
          <div className="page-header-title">ORGANIZATIONS</div>
          <div className="page-header-subtitle">
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry’s standard dummy text
            ever since
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
              placeholder="Search Organization"
              onChange={(e) => {
                setQuery(e.target.value);
                debouncedHandleSearch(e);
              }}
            />
            {/* <div>Sort by</div> */}
          </div>
          <div className={clsx(style.gridContainer, style.orgHeader)}>
            <div>Name & Address</div>
            <div>URL</div>
            <div>Contact Number</div>
            <div>POC</div>
            <div>Action</div>
          </div>
          {data?.pages?.map((values, i) => (
            <React.Fragment key={i}>
              {values?.data?.map((list) => (
                <div className={style.gridContainer} key={list.tdei_org_id}>
                  <div className={style.details}>
                    <img src={iconOrg} className={style.orgIcon} alt="sitemap-solid" />
                    <div>
                      <div className={style.name}>{list.org_name}</div>
                      <div className={style.address}>{list.address}</div>
                    </div>
                  </div>
                  <div className={style.content}>{list.url}</div>
                  <div className={style.content}>{list.phone}</div>
                  <div>
                    <DisplayList list={list} handlePoc={handlePoc} />
                  </div>
                  <div className={style.actionItem}>
                    <Dropdown align="end">
                      <Dropdown.Toggle as={ActionItem}></Dropdown.Toggle>
                      <Dropdown.Menu align="end">
                        <Dropdown.Item id={list.tdei_org_id} onClick={handlePoc}>
                          Manage POC
                        </Dropdown.Item>
                        <Dropdown.Item id={list.tdei_org_id} onClick={handleEdit}>
                          Edit Organization
                        </Dropdown.Item>
                        <Dropdown.Item id={list.tdei_org_id} onClick={handleDelete}>
                          Delete Organization
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </div>
                </div>
              ))}
            </React.Fragment>
          ))}
          {isError ? " Error loading organization list" : null}
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
      <CreateOrganisation
        show={showCreateOrganisation}
        onHide={() => setShowCreateOrganisation(false)}
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
          title: `Delete Organization ${selectedData.org_name}`,
          details: "Are you sure you want to delete organization?",
        }}
        handler={confirmDelete}
        isLoading={deleteOrgLoading}
      />
      <SuccessModal
        show={showModal}
        onHide={() => setShowModal(false)}
        message={`Organization deleted successfully.`}
      />
    </Layout>
  );
};

export const ActionItem = React.forwardRef(({ children, onClick }, ref) => (
  <div onClick={onClick} ref={ref}>
    <img src={menuVertical} className={style.menuVertical} alt="menu-verical" />
    {children}
  </div>
));

const DisplayList = ({ list, handlePoc }) => {
  const { poc } = list;
  return (
    <>
      {poc.length ? (
        <div className={style.pocList}>
          <img src={userIcon} className={style.pocUserIcon} alt="user-icon" />
          <div className={style.content}>{getUserName(poc[0])}</div>
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
                            <img src={userIcon} className={style.pocUserIcon} alt="user-icon" />
                            <div className={style.content}>{getUserName(val)}</div>
                          </div>
                        );
                      }
                      return null;
                    })}
                  </Popover.Body>
                </Popover>
              }
            >
              <div className={style.overlayList}>{`,+${poc.length - 1}`}</div>
            </OverlayTrigger>
          ) : null}
        </div>
      ) : (
        <div className={style.notAssigned} id={list.tdei_org_id} onClick={handlePoc}>
          Not Assigned
        </div>
      )}
    </>
  );
};

export default Organization;
