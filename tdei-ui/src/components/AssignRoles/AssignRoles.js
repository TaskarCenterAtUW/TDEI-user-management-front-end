import React from "react";
import { Form, Button, Spinner, Alert, Modal } from "react-bootstrap";
import useAssignRoles from "../../hooks/roles/useAssignRoles";
import style from "./AssignRoles.module.css";
import { useDispatch, useSelector } from "react-redux";
import { show as showModal } from "../../store/notificationModal.slice";
import useGetRoles from "../../hooks/roles/useGetRoles";
import { Field, Formik } from "formik";
import * as yup from "yup";
import clsx from "clsx";
import successIcon from "../../assets/img/success-icon.svg";
import { useQueryClient } from "react-query";
import { GET_PROJECT_GROUP_USERS } from "../../utils";
import { getSelectedProjectGroup } from "../../selectors";

const AssignRoles = (props) => {
  const { data, isLoading: isRolesLoading, isError } = useGetRoles();
  const selectedProjectGroup = useSelector(getSelectedProjectGroup);
  const queryClient = useQueryClient();

  const [rolesData, setRolesData] = React.useState({
    user_name: "",
    tdei_project_group_id: "",
    roles: [],
  });
  const dispatch = useDispatch();

  React.useEffect(() => {
    if (selectedProjectGroup?.tdei_project_group_id) {
      setRolesData({
        ...rolesData,
        tdei_project_group_id: selectedProjectGroup.tdei_project_group_id,
        user_name: props.data.username || "",
        roles: props.data.roles || [],
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedProjectGroup, props]);

  const validationSchema = yup.object().shape({
    user_name: yup.string().required("Email Id is required"),
    roles: yup.array().of(yup.string()).min(1, "Please select roles"),
  });

  const onSuccess = () => {
    queryClient.invalidateQueries({ queryKey: [GET_PROJECT_GROUP_USERS] });
    props.onHide();
    dispatch(
      showModal({
        message: props.data?.user_id
          ? "User role updated successfully."
          : "User assigned successfully.",
      })
    );
  };

  const onError = (err) => {
    console.error(err);
  };

  const {
    mutate,
    isLoading,
    error,
    isError: assignRolesError,
    reset,
  } = useAssignRoles({ onError, onSuccess });

  const handleAssignRoles = (values) => {
    mutate(values);
  };

  const handleExit = () => {
    reset();
    props.onHide();
  };

  return (
    <>
      {props.show ? (
        <Modal
          onHide={handleExit}
          show={props.show}
          size="md"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
              Assign Role to New User
            </Modal.Title>
          </Modal.Header>
          {assignRolesError ? (
            <Alert variant={"danger"}>
              {error.data?.message || "Error in Assigning roles"}
            </Alert>
          ) : null}
          <Formik
            initialValues={rolesData}
            onSubmit={handleAssignRoles}
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
              dirty,
            }) => (
              <Form noValidate onSubmit={handleSubmit}>
                <Modal.Body>
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
                  <Form.Group className="mb-3" controlId="projectGroupId">
                    <Form.Label>Project Group ID</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter Project Group ID"
                      value={selectedProjectGroup.tdei_project_group_id}
                      name="tdei_project_group_id"
                      disabled
                    />
                  </Form.Group>
                  <Field name="roles">
                    {({ field, form }) => (
                      <Form.Group className="mb-3" controlId="rolesData">
                        <Form.Label>Select Roles</Form.Label>
                        {isError && (
                          <div className={style.danger}>
                            Error in loading roles
                          </div>
                        )}
                        {isRolesLoading ? (
                          <div className="d-flex justify-content-center">
                            <Spinner size="lg" />
                          </div>
                        ) : null}
                        <div
                          className={clsx({
                            "is-invalid":
                              form.touched.roles && !!form.errors.roles,
                          })}
                        >
                          {data?.data?.map((val) => (
                            <button
                              type="button"
                              className={clsx(style.roleListBlock, {
                                [style.active]: form.values.roles?.includes(
                                  val.name
                                ),
                              })}
                              onClick={() => {
                                const values = [...form.values.roles];
                                const roleValue = val.name;
                                if (values.includes(roleValue)) {
                                  values.splice(values.indexOf(roleValue), 1);
                                } else {
                                  values.push(roleValue);
                                }
                                form.setFieldValue(field.name, values);
                                form.setFieldTouched(field.name);
                              }}
                              key={val.name}
                            >
                              <div className={style.roleInfoBlock}>
                                <div className={style.roleName}>{val.name}</div>
                                <div className={style.roleDesc}>
                                  {val.description}
                                </div>
                              </div>
                              <div className={style.successIcon}>
                                <img
                                  src={successIcon}
                                  className={style.iconSelected}
                                  alt="success-icon"
                                />
                              </div>
                            </button>
                          ))}
                        </div>
                        <Form.Control.Feedback type="invalid">
                          {form.errors.roles}
                        </Form.Control.Feedback>
                      </Form.Group>
                    )}
                  </Field>
                </Modal.Body>
                <Modal.Footer>
                  <Button
                    variant="ouline-secondary"
                    className="tdei-secondary-button"
                    onClick={handleExit}
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="tdei-primary-button"
                    disabled={isLoading || !dirty}
                  >
                    {isLoading ? "Assigning..." : "Assign"}
                  </Button>
                </Modal.Footer>
              </Form>
            )}
          </Formik>
        </Modal>
      ) : null}
    </>
  );
};

export default AssignRoles;
