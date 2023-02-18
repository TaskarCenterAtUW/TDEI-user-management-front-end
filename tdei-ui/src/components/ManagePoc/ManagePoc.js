import React from "react";
import { Button, Modal, Form, Alert } from "react-bootstrap";
import style from "./ManagePoc.module.css";
import closeIcon from "../../assets/img/close-icon.svg";
import { Formik } from "formik";
import * as yup from "yup";
import useAssignRoles from "../../hooks/roles/useAssignRoles";
import SuccessModal from "../SuccessModal";

const ManagePoc = (props) => {
  const { data } = props;
  const [toggle, setToggle] = React.useState(false);
  const [showModal, setShowModal] = React.useState(false);
  const initialvalues = { org_id: data.org_id, user_name: "", roles: ["poc"] };
  const validationSchema = yup.object().shape({
    user_name: yup.string().required("Username is required"),
  });

  const onSuccess = (data) => {
    console.log("Assigned POC", data);
    setShowModal(true);
    props.onHide();
  };

  const onError = (err) => {
    console.error(err);
  };
  const { isLoading, mutate, isError, error, reset } = useAssignRoles({
    onError,
    onSuccess,
  });

  const handleAssignPoc = (values) => {
    mutate(values);
  };

  const handleHide = () => {
    setToggle(false);
    reset();
    props.onHide();
  };

  return (
    <>
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            MANAGE POC
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className={style.modalBody}>
          <div className={style.orgDetails}>
            <div className={style.name}>{data.name}</div>
            <div className={style.address}>{data.address}</div>
          </div>
          {!toggle ? (
            <div className={style.pocDetails}>
              <div className={style.header}>
                <div className={style.name}>List of POC</div>
                <div
                  className={style.addNew}
                  onClick={() => setToggle((prev) => !prev)}
                >
                  + Add New POC
                </div>
              </div>
              <div className={style.pocCardDetails}>
                <div className={style.pocCard}></div>
              </div>
            </div>
          ) : (
            <div className={style.pocDetails}>
              <div className={style.header}>
                <div className={style.name}>Add New POC</div>
                <div
                  className={style.addNew}
                  onClick={() => setToggle((prev) => !prev)}
                >
                  <img src={closeIcon} alt="close-icon" />
                </div>
              </div>
              {isError ? (
                <Alert variant={"danger"}>
                  {error.data?.message || "Error in assigning POC"}
                </Alert>
              ) : null}
              <Formik
                initialValues={initialvalues}
                onSubmit={handleAssignPoc}
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
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                      <Form.Label>User Name</Form.Label>
                      <Form.Control
                        type="email"
                        placeholder="Enter User Name"
                        value={values.user_name}
                        name="user_name"
                        isInvalid={touched.user_name && !!errors.user_name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.user_name}
                      </Form.Control.Feedback>
                    </Form.Group>
                    <Button
                      className="tdei-primary-button"
                      type="submit"
                      disabled={isLoading}
                    >
                      {isLoading ? "Assigning..." : "Assign"}
                    </Button>
                  </Form>
                )}
              </Formik>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            onClick={handleHide}
            variant="ouline-secondary"
            className="tdei-secondary-button"
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      <SuccessModal
        show={showModal}
        onHide={() => setShowModal(false)}
        message={"POC assigned successfully."}
      />
    </>
  );
};

export default ManagePoc;
