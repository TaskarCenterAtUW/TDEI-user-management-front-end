import React from "react";
import Container from "../../components/Container/Container";
import Layout from "../../components/Layout";
import style from "./Stations.module.css";
import newWindowIcon from "../../assets/img/new-window-icon.svg";
import CreateStation from "../../components/CreateStation/CreateStation";
import { Button, Form, Spinner } from "react-bootstrap";
import { useAuth } from "../../hooks/useAuth";
import { debounce } from "lodash";
import useGetStations from "../../hooks/station/useGetStations";
import stationIcon from "../../assets/img/stations-icon.svg";
import useDeleteStation from "../../hooks/station/useDeleteStation";
import { useDispatch } from "react-redux";
import { useQueryClient } from "react-query";
import { show as showModal } from "../../store/notificationModal.slice";
import DeleteModal from "../../components/DeleteModal";
import { GET_STATIONS } from "../../utils";
import { show } from "../../store/notification.slice";
import { ListingBlock } from "../Services/Services";
import iconNoData from "./../../assets/img/icon-noData.svg";
import { useSelector } from "react-redux";
import { getSelectedProjectGroup } from "../../selectors";
import { useNavigate } from 'react-router-dom';
import useIsPoc from "../../hooks/useIsPoc";


const Stations = () => {
  const selectedProjectGroup = useSelector(getSelectedProjectGroup);
  const [showCreateStation, setShowCreateStation] = React.useState(false);
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [, setQuery] = React.useState("");
  const [debounceQuery, setDebounceQuery] = React.useState("");
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
  } = useGetStations(debounceQuery, user?.isAdmin);

  const onSuccess = (data) => {
    console.log("suucessfull", data);
    queryClient.invalidateQueries({ queryKey: [GET_STATIONS] });
    setShowDeleteModal(false);
    dispatch(showModal({ message: "Station deleted successfully" }));
  };
  const onError = (err) => {
    setShowDeleteModal(false);
    console.error("error message", err);
    dispatch(show({ message: `Error in deleteing station`, type: "danger" }));
  };

  const { mutate, isLoading: isDeletingStation } = useDeleteStation({
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
    return list?.find((station) => station.tdei_station_id === id);
  };
  const handleDelete = (id) => {
    const dataToEdit = getData(id);
    setSelectedData(dataToEdit);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    const { tdei_station_id, tdei_project_group_id } = selectedData;
    mutate({ tdei_station_id, status: false, tdei_project_group_id });
  };

  const handleEdit = (id) => {
    const dataToEdit = getData(id);
    setSelectedData(dataToEdit);
    setShowCreateStation(false);
    // navigate('/maps', { state: dataToEdit });
    navigate('/station/edit/' + id);
  };

  const handleCreate = () => {
    setSelectedData({});
    setShowCreateStation(false);
    navigate('/CreateUpdateStation');
  };
  return (
    !user.isAdmin && !isUserPoc && selectedProjectGroup.tdei_project_group_id === undefined ? (<div className="p-4">
      <div className="alert alert-warning" role="alert">
        Oops! User doesn't have permission to access this page!
      </div>
    </div>) : (
      <div className={style.layout} >
        <div className={style.header}>
          <div className={style.title}>
            <div className="page-header-title">Stations</div>
            <div className="page-header-subtitle">
              Here are the stations currently in the{" "}
              <span className="fw-bold">
                {user.isAdmin ? "TDEI system" : `${selectedProjectGroup.name}`}
              </span>
              .
            </div>
          </div>
          {user?.isAdmin || isUserPoc ? (
            <div>
              <Button onClick={handleCreate} className="tdei-primary-button">
                Create New
              </Button>
            </div>
          ) : null}
        </div>
        <Container>
          <>
            <div className={style.searchPanel}>
              <Form.Control
                type="text"
                placeholder="Search Station"
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
                    <div className={style.noDataText}>No station found..!</div>
                  </div>
                ) : null}
                {values?.data?.map((list) => (
                  <ListingBlock
                    id={list.tdei_station_id}
                    name={list.station_name}
                    icon={stationIcon}
                    handleEdit={handleEdit}
                    handleDelete={handleDelete}
                    key={list.tdei_station_id}
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
        <CreateStation
          show={showCreateStation}
          onHide={() => setShowCreateStation(false)}
          data={selectedData}
        />
        <DeleteModal
          show={showDeleteModal}
          onHide={() => setShowDeleteModal(false)}
          message={{
            title: `Delete Station ${selectedData.station_name}`,
            details: "Are you sure you want to delete station?",
          }}
          handler={confirmDelete}
          isLoading={isDeletingStation}
        />
      </div>
    ));
};

export default Stations;
