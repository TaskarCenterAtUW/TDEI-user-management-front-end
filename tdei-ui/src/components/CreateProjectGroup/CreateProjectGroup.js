import React from "react";
import { Modal, Button, Form } from "react-bootstrap";
import useCreateProjectGroup from '../../hooks/projectGroup/useCreateProjectGroup'
import { useDispatch } from "react-redux";
import { show } from "../../store/notification.slice";
import { Formik } from "formik";
import * as yup from "yup";
import { GET_PROJECT_GROUP_LIST, PHONE_REGEX } from "../../utils";
import { useQueryClient } from "react-query";
import SuccessModal from "../SuccessModal";
import useUpdateProjectGroup from "../../hooks/projectGroup/useUpdateProjectGroup";

const CreateProjectGroup = (props) => {
  const [showModal, setShowModal] = React.useState(false);
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const {
    project_group_name = "",
    address = "",
    url = "",
    phone = "",
    tdei_project_group_id,
  } = props.data;
  const isEdit = !!tdei_project_group_id;
  const initialValues = {
   project_group_name,
    phone,
    url,
    address,
  };

  const validationSchema = yup.object().shape({
    project_group_name: yup.string().required("Project Group Name is required"),
    address: yup.string().required("Address is required"),
    phone: yup.string().matches(PHONE_REGEX, "Phone number is not valid"),
  });

  const onSuccess = (data) => {
    setShowModal(true);
    props.onHide();
    queryClient.invalidateQueries({ queryKey: [GET_PROJECT_GROUP_LIST] });
  };
  const onError = (err) => {
    console.error("error message", err);
    dispatch(
      show({
        message: `Error in ${isEdit ? "updating" : "creating"} project group. ${err.data.message}`,
        type: "danger",
      })
    );
  };
  const { isLoading, mutate } = useCreateProjectGroup({ onSuccess, onError });

  const { isLoading: isUpdateProjectGroupLoading, mutate: updateProjectGroup } =
  useUpdateProjectGroup({ onSuccess, onError });

  const handleCreate = (value) => {
    mutate(value);
  };

  const handleUpdate = (value) => {
    const updateValue = { tdei_project_group_id, ...value };
    updateProjectGroup(updateValue);
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
            {isEdit ? "Edit Project Group" : "Create New Project Group"}
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
                <Form.Group className="mb-3" controlId="projectGroupName ">
                  <Form.Label>Project Group Name<span style={{ color: 'red' }}> *</span></Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter Name"
                    name="project_group_name"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.project_group_name}
                    isInvalid={touched.project_group_name && !!errors.project_group_name}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.project_group_name}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3" controlId="phoneNumber">
                  <Form.Label>Phone Number</Form.Label>
                  <Form.Control
                    type="text"
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
                  <Form.Label>Address<span style={{ color: 'red' }}> *</span></Form.Label>
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
                    disabled={isUpdateProjectGroupLoading || !dirty}
                  >{`${isUpdateProjectGroupLoading ? "Updating..." : "Update"}`}</Button>
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
        message={`Project Group ${isEdit ? "updated" : "created"} successfully.`}
      />
    </>
  );
};

export default CreateProjectGroup;
