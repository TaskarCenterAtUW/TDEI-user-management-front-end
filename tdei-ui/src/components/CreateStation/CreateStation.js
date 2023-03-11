import React from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import useCreateStation from "../../hooks/station/useCreateStation";
import { useAuth } from "../../hooks/useAuth";
import { getSelectedOrg } from "../../selectors";
import { show } from "../../store/notification.slice";
import { show as showModal } from "../../store/notificationModal.slice";
import OrgList from "../OrganisationList/OrgList";
import { Formik, Field } from "formik";
import * as yup from "yup";
import useUpdateStation from "../../hooks/station/useUpdateStation";
import { GET_STATIONS } from "../../utils";
import { useQueryClient } from "react-query";

function CreateStation(props) {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const [stationData, setStationData] = React.useState({
    owner_org: "",
    name: "",
  });

  const { user } = useAuth();
  const selectedOrg = useSelector(getSelectedOrg);

  React.useEffect(() => {
    if (!user.isAdmin) {
      if (selectedOrg?.orgId) {
        setStationData({
          ...stationData,
          owner_org: selectedOrg.orgId,
          name: props.data?.name || "",
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedOrg, user.isAdmin, props]);

  const validationSchema = yup.object().shape({
    owner_org: yup.string().required("Organization Name is required"),
    name: yup.string().required("Station Name is required"),
  });

  const onSuccess = (data) => {
    console.log("suucessfully created", data);
    queryClient.invalidateQueries({ queryKey: [GET_STATIONS] });
    props.onHide();
    dispatch(
      showModal({
        message: `Station ${
          props.data?.station_id ? "updated" : "created"
        } successfully.`,
      })
    );
  };
  const onError = (err) => {
    console.error("error message", err);
    dispatch(
      show({
        message: `Error in ${
          props.data?.station_id ? "updating" : "creating"
        } station`,
        type: "danger",
      })
    );
  };
  const { isLoading, mutate } = useCreateStation({ onSuccess, onError });
  const { isLoading: isUpdateLoading, mutate: updateStation } =
    useUpdateStation({ onSuccess, onError });

  const handleCreateStation = (values) => {
    if (props.data?.station_id) {
      updateStation({
        name: values.name,
        station_id: props.data?.station_id,
        owner_org: values.owner_org,
      });
    } else {
      mutate(values);
    }
  };

  const getText = () => {
    if (props.data?.station_id) {
      if (isUpdateLoading) {
        return "Updating";
      }
      return "Update";
    } else {
      if (isLoading) {
        return "Creating";
      }
      return "Create";
    }
  };

  return (
    <Modal
      {...props}
      size="md"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          CREATE STATION
        </Modal.Title>
      </Modal.Header>
      <Formik
        initialValues={stationData}
        onSubmit={handleCreateStation}
        validationSchema={validationSchema}
        enableReinitialize
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
        }) => (
          <Form noValidate onSubmit={handleSubmit}>
            <Modal.Body>
              <Form.Group className="mb-3" controlId="organisationId ">
                <Form.Label>Organization Name</Form.Label>
                {user.isAdmin ? (
                  <Field component={OrgList} name="owner_org" />
                ) : (
                  <Form.Control
                    type="text"
                    placeholder="Enter Organization ID"
                    name="owner_org"
                    value={selectedOrg.orgName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    disabled
                  />
                )}
              </Form.Group>
              <Form.Group className="mb-3" controlId="name">
                <Form.Label>Station Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Station Name"
                  name="name"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.name}
                  isInvalid={touched.name && !!errors.name}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.name}
                </Form.Control.Feedback>
              </Form.Group>
              {/* <Form.Group className="mb-3" controlId="stopCode">
                    <Form.Label>Stop Code</Form.Label>
                    <Form.Control type="text" placeholder="Enter Stop Code" name='stop_code' onChange={handleStationData} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="stopLatitude">
                    <Form.Label>Stop Latitude</Form.Label>
                    <Form.Control type="text" placeholder="Enter Stop Latitude" name='stop_lat' onChange={handleStationData} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="stopLongitude">
                    <Form.Label>Stop Longitude</Form.Label>
                    <Form.Control type="text" placeholder="Enter Stop Longitude" name='stop_lon' onChange={handleStationData} />
                </Form.Group> */}
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="ouline-secondary"
                className="tdei-secondary-button"
                onClick={props.onHide}
                disabled={isLoading || isUpdateLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="tdei-primary-button"
                disabled={isLoading || isUpdateLoading}
              >
                {getText()}
              </Button>
            </Modal.Footer>
          </Form>
        )}
      </Formik>
    </Modal>
  );
}

export default CreateStation;
