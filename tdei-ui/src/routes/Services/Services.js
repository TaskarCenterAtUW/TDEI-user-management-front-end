import React from "react";
import Container from "../../components/Container/Container";
import Layout from "../../components/Layout";
import style from "./Services.module.css";
import newWindowIcon from "../../assets/img/new-window-icon.svg";
import { Button, Form, Spinner } from "react-bootstrap";
import CreateService from "../../components/CreateService/CreateService";
import { useAuth } from "../../hooks/useAuth";
import { debounce } from "lodash";
import useGetServices from "../../hooks/service/useGetServices";
import serviceIcon from "../../assets/img/services-icon.svg";
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

const Services = () => {
  const selectedProjectGroup = useSelector(getSelectedProjectGroup);
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const [showCreateService, setShowCreateService] = React.useState(false);
  const { user } = useAuth();
  const [, setQuery] = React.useState("");
  const [debounceQuery, setDebounceQuery] = React.useState("");
  const [selectedData, setSelectedData] = React.useState({});
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);
  const navigate = useNavigate();
  
  const {
    data = [],
    isError,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    isLoading,
  } = useGetServices(debounceQuery);

  const onSuccess = (data) => {
    console.log("suucessfull", data);
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

  const handleEdit = (id) => {
    const dataToEdit = getData(id);
    setSelectedData(dataToEdit);
    navigate('/service/edit/'+id);
  };

  const handleCreate = () => {
    setSelectedData({});
    navigate('/CreateUpdateService');
  };
  return (
    <Layout>
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
        {!user?.isAdmin ? (
          <div>
            <Button onClick={handleCreate} className="tdei-primary-button">
              Create New
            </Button>
          </div>
        ) : null}
      </div>
      <Container>
        {user?.isAdmin ? (
          <div className={style.insideContainer}>
            <div
              className="page-header-title"
              style={{ paddingBottom: "10px" }}
            >
              Add New Service for Project Group
            </div>
            <div
              className="page-header-subtitle"
              style={{ paddingBottom: "40px", textAlign: "center" }}
            >
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's standard dummy text
              ever since
            </div>
            <div style={{ paddingBottom: "40px" }}>
              <img src={newWindowIcon} alt="new-window-icon" />
            </div>
            <Button onClick={handleCreate} className="tdei-primary-button">
              Create New Service
            </Button>
          </div>
        ) : (
          <>
            <div className={style.searchPanel}>
              <Form.Control
                type="text"
                placeholder="Search Service"
                onChange={(e) => {
                  setQuery(e.target.value);
                  debouncedHandleSearch(e);
                }}
              />
              {/* <div>Sort by</div> */}
            </div>
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
        )}
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
    </Layout>
  );
};

export const ListingBlock = ({ id, name, icon, handleDelete, handleEdit }) => {
  return (
    <div className={style.block} key={id}>
      <div className={style.names}>
        <div className={style.imgBlock}>
          <img src={icon} alt="icon" />
        </div>
        <div>
          <div className="tdei-bold-name">{name}</div>
          <div className="tdei-name-desc">No description added</div>
          <div>
            <ClipboardCopy copyText={id} />
          </div>
        </div>
      </div>
      <div className={style.buttons}>
        <Button
          className={style.editButton}
          onClick={() => handleEdit(id)}
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
      </div>
    </div>
  );
};

export default Services;
