import clsx from "clsx";
import React from "react";
import { Button, Form, Dropdown, Spinner } from "react-bootstrap";
import Container from "../../components/Container/Container";
import Layout from "../../components/Layout";
import useGetOrganizations from "../../hooks/organisation/useGetOrganizations";
import menuVertical from "../../assets/img/menu-vertical.png";
import CreateOrganisation from "../../components/CreateOrganisation/CreateOrganisation";
import style from "./Organization.module.css";
import ManagePoc from "../../components/ManagePoc";
import { useDispatch } from "react-redux";
import { show } from "../../store/notification.slice";
import useCreateOrganisation from "../../hooks/organisation/useCreateOrganisation";
import useDeleteOrganization from "../../hooks/organisation/useDeleteOrganization";
import { GET_ORG_LIST } from "../../utils";
import { useQueryClient } from "react-query";
import DeleteModal from "../../components/DeleteModal";

const Organization = () => {
  const [query, setQuery] = React.useState("");
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const [selectedData, setSelectedData] = React.useState({});
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);
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
  } = useGetOrganizations(query);

  const onSuccess = (data) => {
    console.log("suucessfull", data);
    //setShowModal(true);
    queryClient.invalidateQueries({ queryKey: [GET_ORG_LIST] });
  };
  const onError = (err) => {
    console.error("error message", err);
    dispatch(
      show({ message: `Error in deleteing organization`, type: "danger" })
    );
  };

  const { mutate } = useDeleteOrganization({ onSuccess, onError });

  const getData = (id) => {
    const list = data?.pages?.map((val) => val?.data).flat();
    return list?.find((org) => org.org_id === id);
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
    const { org_id } = selectedData;
    setShowDeleteModal(false);
    mutate({ org_id, status: false });
  };

  const handleCreate = () => {
    setSelectedData({});
    setShowCreateOrganisation(true);
  };

  return (
    <Layout>
      <div className={style.header}>
        <div className={style.title}>
          <div className="page-header-title">ORGANIZATION</div>
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
              onChange={(e) => setQuery(e.target.value)}
            />
            <div>Sort by</div>
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
                <div className={style.gridContainer} key={list.org_id}>
                  <div className={style.details}>
                    <div className={style.icon}></div>
                    <div>
                      <div className={style.name}>{list.name}</div>
                      <div className={style.address}>{list.address}</div>
                    </div>
                  </div>
                  <div className={style.content}>{list.url}</div>
                  <div className={style.content}>{list.phone}</div>
                  <div>-</div>
                  <div className={style.actionItem}>
                    <Dropdown align="end">
                      <Dropdown.Toggle as={ActionItem}></Dropdown.Toggle>
                      <Dropdown.Menu align="end">
                        <Dropdown.Item id={list.org_id} onClick={handlePoc}>
                          Manage POC
                        </Dropdown.Item>
                        <Dropdown.Item id={list.org_id} onClick={handleEdit}>
                          Edit Organization
                        </Dropdown.Item>
                        <Dropdown.Item id={list.org_id} onClick={handleDelete}>
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
          title: `Delete Organization ${selectedData.name}`,
          details: "Are you sure you want to delete organization?",
        }}
        handler={confirmDelete}
      />
    </Layout>
  );
};

const ActionItem = React.forwardRef(({ children, onClick }, ref) => (
  <div onClick={onClick} ref={ref}>
    <img src={menuVertical} className={style.menuVertical} alt="menu-verical" />
    {children}
  </div>
));

export default Organization;
