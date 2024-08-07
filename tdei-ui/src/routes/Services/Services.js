import React, { useEffect } from "react";
import Container from "../../components/Container/Container";
import Layout from "../../components/Layout";
import style from "./Services.module.css";
import newWindowIcon from "../../assets/img/new-window-icon.svg";
import { Button, Form, Spinner } from "react-bootstrap";
import CreateService from "../../components/CreateService/CreateService";
import { useAuth } from "../../hooks/useAuth";
import { debounce } from "lodash";
import useGetServices from "../../hooks/service/useGetServices";
import serviceIcon from "../../assets/img/icon-service-new.svg";
import iconFlex from "../../assets/img/flexType.svg";
import iconPathway from "../../assets/img/pathwayType.svg";
import iconOsw from "../../assets/img/oswType.svg";
import useDeleteService from "../../hooks/service/useDeleteService";
import { useDispatch } from "react-redux";
import { useQueryClient } from "react-query";
import { show as showModal } from "../../store/notificationModal.slice";
import DeleteModal from "../../components/DeleteModal";
import { GET_SERVICES } from "../../utils";
import { show } from "../../store/notification.slice";
import iconEdit from "./../../assets/img/icon-edit.svg";
import iconDelete from "./../../assets/img/icon-delete.svg";
import iconNoData from "./../../assets/img/icon-noData.svg";
import { useSelector } from "react-redux";
import { getSelectedProjectGroup } from "../../selectors";
import ClipboardCopy from "./ClipBoardCopy";
import { useNavigate } from 'react-router-dom';
import useIsPoc from "../../hooks/useIsPoc";
import InputGroup from 'react-bootstrap/InputGroup';
import {Dropdown} from 'react-bootstrap';
import DropdownButton from 'react-bootstrap/DropdownButton';
import { toPascalCase } from "../../utils";

const Services = () => {
  const selectedProjectGroup = useSelector(getSelectedProjectGroup);
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const [showCreateService, setShowCreateService] = React.useState(false);
  const { user } = useAuth();
  const [, setQuery] = React.useState("");
  const [debounceQuery, setDebounceQuery] = React.useState("");
  const [serviceType, setServiceType] = React.useState("all");
  const [selectedData, setSelectedData] = React.useState({});
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);
  const navigate = useNavigate();
  const isUserPoc = useIsPoc();

  const {
    data = [],
    isError,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    isLoading,
  } = useGetServices(debounceQuery, user?.isAdmin, serviceType);

  const onSuccess = (data) => {
    queryClient.invalidateQueries({ queryKey: [GET_SERVICES] });
    setShowDeleteModal(false);
    dispatch(showModal({ message: "Service deleted successfully" }));
  };
  const onError = (err) => {
    setShowDeleteModal(false);
    console.error("error message", err);
    dispatch(show({ message: `Error in deleteing service`, type: "danger" }));
  };

  const { mutate, isLoading: isDeletingService } = useDeleteService({
    onSuccess,
    onError,
  });
  const handleSelect = (value) => {
    queryClient.invalidateQueries({ queryKey: [GET_SERVICES] });
    setServiceType(value);
  };

  const handleSearch = (e) => {
    setDebounceQuery(e.target.value);
  };

  const debouncedHandleSearch = React.useMemo(
    () => debounce(handleSearch, 300),
    []
  );

  const getData = (id) => {
    const list = data?.pages?.map((val) => val?.data).flat();
    return list?.find((service) => service.tdei_service_id === id);
  };
  const handleDelete = (id) => {
    const dataToEdit = getData(id);
    setSelectedData(dataToEdit);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    const { tdei_service_id, tdei_project_group_id } = selectedData;
    mutate({ tdei_service_id, status: false, tdei_project_group_id });
  };

  const handleEdit = (id,type) => {
    const dataToEdit = getData(id);
    setSelectedData(dataToEdit);
    navigate('/service/edit/' + id + "/" + type);
  };

  const handleCreate = () => {
    setSelectedData({});
    navigate('/CreateUpdateService');
  };
  return (
    !user.isAdmin && !isUserPoc && selectedProjectGroup.tdei_project_group_id === undefined ? (<div className="p-4">
      <div className="alert alert-warning" role="alert">
        Oops! User doesn't have permission to access this page!
      </div>
    </div>) : (<div className={style.layout}>
      <div className={style.header}>
        <div className={style.title}>
          <div className="page-header-title">Services</div>
          <div className="page-header-subtitle">
            Here are the services currently in the{" "}
            <span className="fw-bold">
              {user.isAdmin ? "TDEI system" : `${selectedProjectGroup.name}`}
            </span>
            .
          </div>
        </div>
        {user?.isAdmin || isUserPoc ? (
          <div>
            <Button onClick={handleCreate} className="tdei-primary-button">
              Create Service
            </Button>
          </div>
        ) : null}
      </div>
      <Container>
        <>
          <InputGroup className="mb-3">
          <DropdownButton onSelect={handleSelect} variant="outline-secondary customBorderColor"
              title={serviceType ? toPascalCase(serviceType) : ''}
              id="input-group-dropdown-2"
              align="end" className= {style.dropdownButton}>
              <Dropdown.Item eventKey="">All</Dropdown.Item>
              <Dropdown.Item eventKey="flex">Flex</Dropdown.Item>
              <Dropdown.Item eventKey="pathways">Pathways</Dropdown.Item>
              <Dropdown.Item eventKey="osw">Osw</Dropdown.Item>
            </DropdownButton>
            <Form.Control
            className={style.customFormControl}
              aria-label="Text input with dropdown button"
              placeholder="Search Service"
              onChange={(e) => {
                setQuery(e.target.value);
                debouncedHandleSearch(e);
              }}
            />
          </InputGroup>
          {data?.pages?.map((values, i) => (
            <React.Fragment key={i}>
              {values?.data?.length === 0 ? (
                <div className="d-flex align-items-center mt-2">
                  <img
                    src={iconNoData}
                    className={style.noDataIcon}
                    alt="no-data-icon"
                  />
                  <div className={style.noDataText}>No service found..!</div>
                </div>
              ) : null}
              {values?.data?.map((list) => (
                <ListingBlock
                  id={list.tdei_service_id}
                  name={list.service_name}
                  type={list.service_type}
                  icon={serviceIcon}
                  handleEdit={handleEdit}
                  handleDelete={handleDelete}
                  key={list.tdei_service_id}
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
      <CreateService
        show={showCreateService}
        onHide={() => setShowCreateService(false)}
        data={selectedData}
      />
      <DeleteModal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        message={{
          title: `Delete Service ${selectedData.service_name}`,
          details: "Are you sure you want to delete service?",
        }}
        handler={confirmDelete}
        isLoading={isDeletingService}
      />
    </div>
    ));
};

export const ListingBlock = ({ id, name, type, icon, handleDelete, handleEdit }) => {
  const isUserPoc = useIsPoc();
  const { user } = useAuth();

  const getServiceTypeIcon = () => {
    if (type === 'flex') {
      return iconFlex
    }
    if (type === 'pathways') {
      return iconPathway
    }
    if (type === 'osw') {
      return iconOsw
    }
    return
  }

  const serviceTypeIcon = getServiceTypeIcon()

  return (
    <div className={style.serviceDetailsContainer}>
      <div className={style.block} key={id}>
        <div className={style.names}>
          <img src={serviceTypeIcon} className={style.serviceTypeIcon} alt="icon" />
          <div>
              <div className={style.serviceType} tabIndex={0}>{type}</div>
              <div className={style.serviceName} title={name} tabIndex={0}>{name}</div>
          </div> 
        </div>
        {isUserPoc || user?.isAdmin ? (<div className={style.buttons}>
          <Button
            className={style.editButton}
            onClick={() => handleEdit(id,type)}
            variant="link"
          >
            <img src={iconEdit} alt="edit-icon" />
            <div className={style.btnText}>Edit</div>
          </Button>
          <Button
            className={style.deleteButton}
            onClick={() => handleDelete(id)}
            variant="link"
          >
            <img src={iconDelete} alt="delete-icon" />
            <div className={style.btnText}>Delete</div>
          </Button>
        </div>) : null}
      </div>
      <div className={style.serviceIdBlock}>
        <ClipboardCopy copyText={id} copyTitle={"Id"} />
      </div>
    </div>
  );
};

export default Services;
