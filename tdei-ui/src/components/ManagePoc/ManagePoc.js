import React from "react";
import { Button, Modal, Form, Alert } from "react-bootstrap";
import style from "./ManagePoc.module.css";
import closeIcon from "../../assets/img/close-icon.svg";
import { Formik } from "formik";
import * as yup from "yup";
import useAssignRoles from "../../hooks/roles/useAssignRoles";
import SuccessModal from "../SuccessModal";
import { getUserName, GET_ORG_LIST } from "../../utils";
import trashIcon from "../../assets/img/trash-icon.svg";
import useRevokePermission from "../../hooks/roles/useRevokePermission";
import DeleteModal from "../DeleteModal";
import { useQueryClient } from "react-query";
import userIcon from "../../assets/img/account-icon.png";
import { useDispatch } from "react-redux";
import { show } from "../../store/notification.slice";

const ManagePoc = (props) => {
  const { data } = props;
  const [toggle, setToggle] = React.useState(false);
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);
  const [showModal, setShowModal] = React.useState(false);
  const [userId, setUserId] = React.useState("");
  const initialvalues = { org_id: data.org_id, user_name: "", roles: ["poc"] };
  const validationSchema = yup.object().shape({
    user_name: yup.string().required("Username is required"),
  });

  const onSuccess = (data) => {
    console.log("Assigned POC", data);
    queryClient.invalidateQueries({ queryKey: [GET_ORG_LIST] });
    setShowModal(true);
    props.onHide();
  };

  const onError = (err) => {
    console.error(err);
  };

  const onRevokeSuccess = (data) => {
    setShowModal(true);
    queryClient.invalidateQueries({ queryKey: [GET_ORG_LIST] });
  };

  const onRevokeError = (err) => {
    console.error(err);
    dispatch(
      show({ message: `Error in deleting poc user`, type: "danger" })
    );
  };
  const { isLoading, mutate, isError, error, reset } = useAssignRoles({
    onError,
    onSuccess,
  });

  const { mutate: revokePermission } =
    useRevokePermission({
      onError: onRevokeError,
      onSuccess: onRevokeSuccess,
    });

  const handleAssignPoc = (values) => {
    mutate(values);
  };

  const handleHide = () => {
    setToggle(false);
    reset();
    props.onHide();
  };

  const handleRevokePermission = () => {
    revokePermission({
      org_id: data.org_id,
      user_name: userId,
      roles: ["poc"],
    });
    setShowDeleteModal(false);
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
              {data?.poc?.length === 0 ? <div>No POC present</div> : null}
              <div className={style.pocCardDetails}>
                {data?.poc?.map((user, i) => (
                  <div className={style.pocCard} key={i}>
                    <div className={style.userList}>
                      <div className={style.userImg}>
                        <img src={userIcon} alt="user-icon" />
                      </div>
                      <div className={style.userName}>{getUserName(user)}</div>
                    </div>
                    <div
                      className={style.trashIcon}
                      onClick={() => {
                        setUserId(user.username);
                        setShowDeleteModal(true);
                        props.onHide();
                      }}
                    >
                      <img src={trashIcon} alt="trash-icon"/>
                    </div>
                  </div>
                ))}
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
        message={`POC ${toggle ? "assigned" : "deleted"} successfully.`}
      />
      <DeleteModal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        message={{
          title: "Remove POC",
          details: "Are you sure you want to remove POC from the organisation?",
        }}
        handler={handleRevokePermission}
      />
    </>
  );
};

export default ManagePoc;
