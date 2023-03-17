import React from "react";
import { Modal, Button, Form } from "react-bootstrap";
import useCreateOrganisation from "../../hooks/organisation/useCreateOrganisation";
import { useDispatch } from "react-redux";
import { show } from "../../store/notification.slice";
import { Formik } from "formik";
import * as yup from "yup";
import { GET_ORG_LIST, PHONE_REGEX } from "../../utils";
import { useQueryClient } from "react-query";
import SuccessModal from "../SuccessModal";
import useUpdateOrganization from "../../hooks/organisation/useUpdateOrganization";

const CreateOrganisation = (props) => {
  const [showModal, setShowModal] = React.useState(false);
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const {
    org_name = "",
    address = "",
    url = "",
    phone = "",
    tdei_org_id,
  } = props.data;
  const isEdit = !!tdei_org_id;
  const initialValues = {
    org_name,
    phone,
    url,
    address,
  };

  const validationSchema = yup.object().shape({
    org_name: yup.string().required("Organization Name is required"),
    address: yup.string().required("Address is required"),
    phone: yup.string().matches(PHONE_REGEX, "Phone number is not valid"),
  });

  const onSuccess = (data) => {
    console.log("suucessfull", data);
    setShowModal(true);
    props.onHide();
    queryClient.invalidateQueries({ queryKey: [GET_ORG_LIST] });
  };
  const onError = (err) => {
    console.error("error message", err);
    dispatch(
      show({
        message: `Error in ${isEdit ? "updating" : "creating"} organization`,
        type: "danger",
      })
    );
  };
  const { isLoading, mutate } = useCreateOrganisation({ onSuccess, onError });

  const { isLoading: isUpdateOrgLoading, mutate: updateOrg } =
    useUpdateOrganization({ onSuccess, onError });

  const handleCreate = (value) => {
    mutate(value);
  };

  const handleUpdate = (value) => {
    const updateValue = { tdei_org_id, ...value };
    updateOrg(updateValue);
  };

  return (
    <>
      <Modal
        {...props}
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            {isEdit ? "Edit Organization" : "Create New Organization"}
          </Modal.Title>
        </Modal.Header>
        <Formik
          initialValues={initialValues}
          onSubmit={isEdit ? handleUpdate : handleCreate}
          validationSchema={validationSchema}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            dirty,
          }) => (
            <Form noValidate onSubmit={handleSubmit}>
              <Modal.Body>
                <Form.Group className="mb-3" controlId="organisationName ">
                  <Form.Label>Organization Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter Name"
                    name="org_name"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.org_name}
                    isInvalid={touched.org_name && !!errors.org_name}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.org_name}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3" controlId="phoneNumber">
                  <Form.Label>Phone Number</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Enter Phone Number"
                    name="phone"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.phone}
                    isInvalid={touched.phone && !!errors.phone}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.phone}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3" controlId="url">
                  <Form.Label>URL</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter URL"
                    name="url"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.url}
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="address">
                  <Form.Label>Address</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="address"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.address}
                    isInvalid={touched.address && !!errors.address}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.address}
                  </Form.Control.Feedback>
                </Form.Group>
              </Modal.Body>
              <Modal.Footer>
                <Button
                  variant="outline-secondary"
                  className="tdei-secondary-button"
                  onClick={props.onHide}
                >
                  Cancel
                </Button>
                {isEdit ? (
                  <Button
                    className="tdei-primary-button"
                    type="submit"
                    disabled={isUpdateOrgLoading || !dirty}
                  >{`${isUpdateOrgLoading ? "Updating..." : "Update"}`}</Button>
                ) : (
                  <Button
                    type="submit"
                    className="tdei-primary-button"
                    disabled={isLoading}
                  >{`${isLoading ? "Creating..." : "Create"}`}</Button>
                )}
              </Modal.Footer>
            </Form>
          )}
        </Formik>
      </Modal>
      <SuccessModal
        show={showModal}
        onHide={() => setShowModal(false)}
        message={`Organization ${isEdit ? "updated" : "created"} successfully.`}
      />
    </>
  );
};

export default CreateOrganisation;
