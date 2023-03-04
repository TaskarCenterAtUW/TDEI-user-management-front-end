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

function CreateStation(props) {
  const dispatch = useDispatch();
  const [stationData, setStationData] = React.useState({
    org_id: "",
    name: "",
  });

  const { user } = useAuth();
  const selectedOrg = useSelector(getSelectedOrg);

  React.useEffect(() => {
    if (!user.isAdmin) {
      if (selectedOrg?.orgId) {
        setStationData({ ...stationData, org_id: selectedOrg.orgId });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedOrg, user.isAdmin]);

  const validationSchema = yup.object().shape({
    org_id: yup.string().required("Organization Name is required"),
    name: yup.string().required("Station Name is required"),
  });

  const onSuccess = (data) => {
    console.log("suucessfully created", data);
    props.onHide();
    dispatch(
      showModal({ message: "Station created successfully." })
    );
  };
  const onError = (err) => {
    console.error("error message", err);
    dispatch(show({ message: "Error in creating station", type: "danger" }));
  };
  const { isLoading, mutate } = useCreateStation({ onSuccess, onError });

  const handleCreateStation = (values) => {
    mutate(values);
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
                  <Field component={OrgList} name="org_id" />
                ) : (
                  <Form.Control
                    type="text"
                    placeholder="Enter Organization ID"
                    name="org_id"
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
              <Button variant="ouline-secondary" className="tdei-secondary-button" onClick={props.onHide}>
                Cancel
              </Button>
              <Button type="submit" className="tdei-primary-button" disabled={isLoading}>
                {isLoading ? "Creating..." : "Create"}
              </Button>
            </Modal.Footer>
          </Form>
        )}
      </Formik>
    </Modal>
  );
}

export default CreateStation;
