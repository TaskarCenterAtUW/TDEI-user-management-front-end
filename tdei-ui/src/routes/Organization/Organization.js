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

const Organization = () => {
  const [pageNumber, setPageNumber] = React.useState(1);
  const [query, setQuery] = React.useState("");
  const [selectedData, setSelectedData] = React.useState({});
  const [showCreateOrganisation, setShowCreateOrganisation] =
    React.useState(false);
  const [showManagePoc, setShowManagePoc] = React.useState(false);
  const { data, isLoading, isError, hasMore } = useGetOrganizations(
    query,
    pageNumber
  );
  React.useEffect(() => {
    setPageNumber(1);
  }, [query]);

  const getData = (id) => data.find((val) => val.org_id === id);

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
  const handleDelete = () => { };

  const handleCreate = () => {
    setSelectedData({});
    setShowCreateOrganisation(true);
  };
  return (
    <Layout>
      <div className={style.header}>
        <div className={style.title}>
          <div className="page-header-title">ORGANIZATION</div>
          <div className="page-header-subtitle">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry’s standard dummy text ever since</div>
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
          {data?.map((list) => (
            <div className={style.gridContainer} key={list.org_id}>
              <div className={style.details}><div className={style.icon}></div>
                <div><div className={style.name}>{list.name}</div><div className={style.address}>{list.address}</div></div></div>
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
                    <Dropdown.Item onClick={handleDelete}>
                      Delete Organization
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            </div>
          ))}
          {isError ? " Error loading organization list" : null}
          {data.length > 0 ? (
            <Button
              className="tdei-primary-button"
              onClick={() => setPageNumber((prev) => prev + 1)}
              disabled={isLoading || isError || !hasMore}
            >
              Load More {isLoading && <Spinner size="sm" />}
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
