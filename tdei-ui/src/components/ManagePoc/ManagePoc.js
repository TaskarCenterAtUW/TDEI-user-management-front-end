import React from "react";
import { Button, Modal, Form, Alert } from "react-bootstrap";
import style from "./ManagePoc.module.css";
import closeIcon from "../../assets/img/close-icon.svg";
import iconAddPoc from "../../assets/img/icon-add-poc.svg";
import { Formik } from "formik";
import * as yup from "yup";
import useAssignRoles from "../../hooks/roles/useAssignRoles";
import SuccessModal from "../SuccessModal";
import { getUserName, GET_PROJECT_GROUP_LIST } from "../../utils";
import trashIcon from "../../assets/img/trash-icon.svg";
import useRevokePermission from "../../hooks/roles/useRevokePermission";
import DeleteModal from "../DeleteModal";
import { useQueryClient } from "react-query";
import userIcon from "../../assets/img/icon-userIcon.svg";
import { useDispatch } from "react-redux";
import { show } from "../../store/notification.slice";
import clsx from "clsx";

const ManagePoc = (props) => {
  const { data } = props;
  const [toggle, setToggle] = React.useState(false);
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);
  const [showModal, setShowModal] = React.useState(false);
  const [userId, setUserId] = React.useState("");
  const initialvalues = {
    tdei_project_group_id: data.tdei_project_group_id,
    user_name: "",
    roles: ["poc"],
  };
  const validationSchema = yup.object().shape({
    user_name: yup.string().required("Email Id is required"),
  });

  const onSuccess = (data) => {
    console.log("Assigned POC", data);
    queryClient.invalidateQueries({ queryKey: [GET_PROJECT_GROUP_LIST] });
    setShowModal(true);
    props.onHide();
  };

  const onError = (err) => {
    console.error(err);
  };

  const onRevokeSuccess = (data) => {
    setShowDeleteModal(false);
    setShowModal(true);
    queryClient.invalidateQueries({ queryKey: [GET_PROJECT_GROUP_LIST] });
  };

  const onRevokeError = (err) => {
    setShowDeleteModal(false);
    console.error(err);
    dispatch(show({ message: `Error in deleting poc user`, type: "danger" }));
  };
  const { isLoading, mutate, isError, error, reset } = useAssignRoles({
    onError,
    onSuccess,
  });

  const { mutate: revokePermission, isLoading: revokePermissionLoading } =
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
      tdei_project_group_id: data.tdei_project_group_id,
      user_name: userId,
      roles: ["poc"],
    });
  };

  return (
    <>
      <Modal
        onHide={handleHide}
        show={props.show}
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Manage POC
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className={style.modalBody}>
          <div className={style.projectGroupDetails}>
            <div className={style.projectGroupName}>{data.name}</div>
            {/* <div className={style.address}>{data.address}</div> */}
          </div>
          {!toggle ? (
            <div className={style.pocDetails}>
              <div className={style.header}>
                <div className={style.name}>List of POC</div>
                <Button
                  className={clsx(style.addNew)}
                  onClick={() => setToggle((prev) => !prev)}
                  variant="link"
                >
                  + Add New POC
                </Button>
              </div>
              {data?.poc?.length === 0 ? (
                <div className={style.noPocBlock}>
                  <img src={iconAddPoc} className={style.noPocIcon} alt="" />
                  <div className={style.noPocText}>
                    No POC added. Please add new POC.
                  </div>
                </div>
              ) : null}
              <div className={style.pocCardDetails}>
                {data?.poc?.map((user, i) => (
                  <div className={style.pocCard} key={i}>
                    <div className={style.userList}>
                      <img
                        src={userIcon}
                        className={style.pocUserIcon}
                        alt="user-icon"
                      />
                      <div className={style.userName}>{getUserName(user)}</div>
                    </div>
                    <Button
                      className={style.trashIcon}
                      onClick={() => {
                        setUserId(user.username);
                        setShowDeleteModal(true);
                        props.onHide();
                      }}
                      variant="link"
                    >
                      <img src={trashIcon} alt="trash-icon" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className={style.pocDetails}>
              <div className={style.header}>
                <div className={style.name}>Add New POC</div>
                <Button
                  className={style.addNew}
                  onClick={() => setToggle((prev) => !prev)}
                  variant="link"
                >
                  <img src={closeIcon} alt="close-icon" />
                </Button>
              </div>
              {isError ? (
                <Alert variant={"danger"}>
                  {error.data || "Error in assigning POC"}
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
                      <Form.Label>Email Id</Form.Label>
                      <Form.Control
                        type="email"
                        placeholder="Enter Email Id"
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
        onHide={() => {
          setShowModal(false)
          setToggle(false);
        }}
        message={`POC ${toggle ? "assigned" : "deleted"} successfully.`}
      />
      <DeleteModal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        message={{
          title: "Remove POC",
          details: "Are you sure you want to remove POC from the project group?",
        }}
        handler={handleRevokePermission}
        isLoading={revokePermissionLoading}
      />
    </>
  );
};

export default ManagePoc;
