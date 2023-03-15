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
import useUpdateSevice from "../../hooks/service/useUpdateService";
import { useQueryClient } from "react-query";
import { GET_SERVICES } from "../../utils";

const CreateService = (props) => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const [serviceData, setServiceData] = React.useState({
    service_name: "",
    tdei_org_id: "",
    // description: ""
  });
  const { user } = useAuth();
  const selectedOrg = useSelector(getSelectedOrg);

  React.useEffect(() => {
    if (!user.isAdmin) {
      if (selectedOrg?.tdei_org_id) {
        setServiceData({
          ...serviceData,
          tdei_org_id: selectedOrg.tdei_org_id,
          service_name: props.data?.service_name || "",
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedOrg, user.isAdmin, props]);

  const validationSchema = yup.object().shape({
    tdei_org_id: yup.string().required("Organization Name is required"),
    service_name: yup.string().required("Service Name is required"),
  });
  const onSuccess = (data) => {
    console.log("sucessfully created", data);
    queryClient.invalidateQueries({ queryKey: [GET_SERVICES] });
    props.onHide();
    dispatch(
      modalShow({
        message: `Service ${
          props.data?.tdei_service_id ? "updated" : "created"
        } successfully.`,
      })
    );
  };
  const onError = (err) => {
    console.error("error message", err);
    dispatch(
      show({
        message: `Error in ${
          props.data?.tdei_service_id ? "updating" : "creating"
        } service`,
        type: "danger",
      })
    );
  };
  const { isLoading, mutate } = useCreateService({ onSuccess, onError });
  const { isLoading: isUpdateLoading, mutate: updateService } = useUpdateSevice(
    { onSuccess, onError }
  );

  const handleCreateService = (values) => {
    if (props.data?.tdei_service_id) {
      updateService({
        service_name: values.service_name,
        tdei_service_id: props.data?.tdei_service_id,
        tdei_org_id: values.tdei_org_id,
      });
    } else {
      mutate(values);
    }
  };

  const getText = () => {
    if (props.data?.tdei_service_id) {
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
      onHide={props.onHide}
      show={props.show}
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
                  <Field component={OrgList} name="tdei_org_id" />
                ) : (
                  <Form.Control
                    type="text"
                    placeholder="Enter Organization ID"
                    name="tdei_org_id"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={selectedOrg.org_name}
                    disabled
                  />
                )}
              </Form.Group>
              <Form.Group className="mb-3" controlId="serviceName">
                <Form.Label>Service Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Service Name"
                  name="service_name"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.service_name}
                  isInvalid={touched.service_name && !!errors.service_name}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.service_name}
                </Form.Control.Feedback>
              </Form.Group>
              {/* <Form.Group className="mb-3" controlId="serviceDescription">
                    <Form.Label>Service Description</Form.Label>
                    <Form.Control as="textarea" rows={3} name='description' onChange={handleServiceData} />
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
};

export default CreateService;
