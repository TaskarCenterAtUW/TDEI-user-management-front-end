import React from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import useCreateService from "../../hooks/service/useCreateService";
import { useAuth } from "../../hooks/useAuth";
import { getSelectedOrg } from "../../selectors";
import { show } from "../../store/notification.slice";
import { show as modalShow } from "../../store/notificationModal.slice";
import OrgList from "../OrganisationList/OrgList";
import { Formik, Field } from "formik";
import * as yup from "yup";

const CreateService = (props) => {
  const dispatch = useDispatch();
  const [serviceData, setServiceData] = React.useState({
    name: "",
    org_id: "",
    // description: ""
  });
  const { user } = useAuth();
  const selectedOrg = useSelector(getSelectedOrg);

  React.useEffect(() => {
    if (!user.isAdmin) {
      if (selectedOrg?.orgId) {
        setServiceData({ ...serviceData, org_id: selectedOrg.orgId });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedOrg, user.isAdmin]);

  const validationSchema = yup.object().shape({
    org_id: yup.string().required("Organization Name is required"),
    name: yup.string().required("Service Name is required"),
  });
  const onSuccess = (data) => {
    console.log("sucessfully created", data);
    props.onHide();
    dispatch(
      modalShow({ message: "Service created successfully."})
    );
  };
  const onError = (err) => {
    console.error("error message", err);
    dispatch(show({ message: "Error in creating service", type: "danger" }));
  };
  const { isLoading, mutate } = useCreateService({ onSuccess, onError });

  const handleCreateService = (values) => {
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
          CREATE SERVICE
        </Modal.Title>
      </Modal.Header>
      <Formik
        initialValues={serviceData}
        onSubmit={handleCreateService}
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
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={selectedOrg.orgName}
                    disabled
                  />
                )}
              </Form.Group>
              <Form.Group className="mb-3" controlId="serviceName">
                <Form.Label>Service Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Service Name"
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
              {/* <Form.Group className="mb-3" controlId="serviceDescription">
                    <Form.Label>Service Description</Form.Label>
                    <Form.Control as="textarea" rows={3} name='description' onChange={handleServiceData} />
                </Form.Group> */}
            </Modal.Body>
            <Modal.Footer>
              <Button  variant="ouline-secondary" className="tdei-secondary-button" onClick={props.onHide}>
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
};

export default CreateService;
