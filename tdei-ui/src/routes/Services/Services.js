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
import { Dropdown } from 'react-bootstrap';
import DropdownButton from 'react-bootstrap/DropdownButton';
import { toPascalCase } from "../../utils";
import Select from 'react-select';
import useEditServiceStatus from "../../hooks/service/useEditServiceStatus";
import CustomModal from "../../components/SuccessModal/CustomModal";

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
  const [showInactive, setShowInactive] = React.useState(false);
  const navigate = useNavigate();
  const isUserPoc = useIsPoc();

  const {
    data = [],
    isError,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    isLoading,
  } = useGetServices(debounceQuery, user?.isAdmin, serviceType, showInactive, "", false);
  const [statusModalMessage, setStatusModalMessage] = React.useState("");
  const [statusModalTitle, setStatusModalTitle] = React.useState("");
  const [statusModalAction, setStatusModalAction] = React.useState(null);
  const [showCustomModal, setShowCustomModal] = React.useState(false);
  const [statusModalType, setStatusModalType] = React.useState("");

  const handleUpdateStatus = (id) => {
    const dataToEdit = getData(id);
    setSelectedData(dataToEdit);

    setStatusModalMessage(
      showInactive
        ? `Are you sure you want to activate the service "${dataToEdit.service_name}"?`
        : `Are you sure you want to deactivate the service "${dataToEdit.service_name}"?`
    );
    setStatusModalTitle(showInactive ? "Activate Service" : "Deactivate Service");
    setStatusModalType(showInactive ? "success" : "deactivate");
    setStatusModalAction(() => () =>
      updateEditService({
        tdei_service_id: dataToEdit.tdei_service_id,
        status: showInactive,
        tdei_project_group_id: dataToEdit.tdei_project_group_id,
      })
    );
    setShowCustomModal(true);
  };

  // Update the DeleteModal confirmation handler
  const confirmStatusUpdate = () => {
    statusModalAction?.();
    setShowCustomModal(false);
  };


  const onSuccess = (data) => {
    queryClient.invalidateQueries({ queryKey: [GET_SERVICES] });
    setShowCustomModal(false);;
    setServiceType("all");
    setDebounceQuery("");
    setShowInactive(false);
    dispatch(showModal({ message: showInactive === true ? "Service activated successfully" : "Service deactivated successfully" }));
  };
  const onError = (err) => {
    setShowCustomModal(false);
    console.error("error message", err);
    dispatch(show({ message: `Error in ${showInactive === true ? "activating" : "deactivating"} service`, type: "danger" }));
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
  const handleEdit = (id, type) => {
    const dataToEdit = getData(id);
    setSelectedData(dataToEdit);
    navigate('/service/edit/' + id + "/" + type);
  };

  const handleCreate = () => {
    setSelectedData({});
    navigate('/CreateUpdateService');
  };
  const inactiveOptions = [
    { value: false, label: "Show Active" },
    { value: true, label: "Show Inactive" },
  ];

  const handleInactiveChange = (selectedOption) => {
    setShowInactive(selectedOption.value);
  };

  const { isLoading: isUpdateLoading, mutate: updateEditService } = useEditServiceStatus(
    { onSuccess, onError }
  );

  return (
    !user.isAdmin && !isUserPoc && selectedProjectGroup.tdei_project_group_id === undefined ? (<div className="p-4">
      <div className="alert alert-warning" role="alert">
        Oops! User doesn't have permission to access this page!
      </div>
    </div>) : (<div className={style.layout}>
      <div className={style.header}>
        <div className={style.title}>
          <h2 className="page-header-title">Services</h2>
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
            <Dropdown onSelect={handleSelect} align="end" className={style.dropdownButton}>
              <Dropdown.Toggle variant="outline-secondary customBorderColor" id="input-group-dropdown-2">
                {serviceType ? toPascalCase(serviceType) : ''}
              </Dropdown.Toggle>
              <Dropdown.Menu role="listbox">
                <Dropdown.Item as="button" role="option" aria-selected={serviceType === ""} eventKey="">All</Dropdown.Item>
                <Dropdown.Item as="button" role="option" aria-selected={serviceType === "flex"} eventKey="flex">Flex</Dropdown.Item>
                <Dropdown.Item as="button" role="option" aria-selected={serviceType === "pathways"} eventKey="pathways">Pathways</Dropdown.Item>
                <Dropdown.Item as="button" role="option" aria-selected={serviceType === "osw"} eventKey="osw">Osw</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            <label htmlFor="search-service-input" className="visually-hidden">Search Service</label>
            <Form.Control
              id="search-service-input"
              value={debounceQuery}
              className={style.customFormControl}
              aria-label="Search Service"
              placeholder="Search Service"
              onChange={(e) => {
                setDebounceQuery(e.target.value);
                setQuery(e.target.value);
                debouncedHandleSearch(e);
              }}
            />
            <label id="service-active-status-label" className="visually-hidden">Select Service Status</label>
            <Select
              inputId="service-active-status"
              className="inactiveSelect"
              value={inactiveOptions.find(option => option.value === showInactive)}
              options={inactiveOptions}
              onChange={handleInactiveChange}
              defaultValue={{ label: "Show Active", value: false }}
              isSearchable={false}
              aria-labelledby="service-active-status-label"
              components={{
                IndicatorSeparator: () => null
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
                  key={list.tdei_service_id}
                  isInActive={showInactive}
                  handleUpdateStatus={handleUpdateStatus}
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
      <CustomModal
        show={showCustomModal}
        onHide={() => setShowCustomModal(false)}
        title={statusModalTitle}
        message={statusModalMessage}
        btnlabel={showInactive ? "Activate" : "Deactivate"}
        handler={confirmStatusUpdate}
        modaltype={statusModalType}
        isLoading={isUpdateLoading}
      />
    </div>
    ));
};

export const ListingBlock = ({ id, name, type, icon, handleEdit, handleUpdateStatus, isInActive }) => {
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
            <div className={style.serviceType}>{type}</div>
            <div className={style.serviceName} title={name}>{name}</div>
          </div>
        </div>
        {isUserPoc || user?.isAdmin ? (<div className={style.buttons}>
          {isInActive === false &&
            <Button
              className={style.editButton}
              onClick={() => handleEdit(id, type)}
              variant="link"
            >
              <img src={iconEdit} alt="edit-icon" />
              <div className={style.btnText}>Edit</div>
            </Button>}
          <Button
            className={style.deleteButton}
            onClick={() => handleUpdateStatus(id, !isInActive)}
            variant="link"
          >
            <img src={iconDelete} alt="delete-icon" style={{ marginRight: '5px' }} />
            {isInActive ? "Activate" : "Deactivate"}
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
