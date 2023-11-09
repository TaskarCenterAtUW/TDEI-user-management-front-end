import React from "react";
import style from "./AssignPoc.module.css";
import { Button, Form, Alert } from "react-bootstrap";
import { show } from "../../store/notification.slice";
import { useDispatch } from "react-redux";
import ProjectGroupList from "../ProjectGroupList";
import useAssignRoles from "../../hooks/roles/useAssignRoles";
import { Formik, Field } from "formik";
import * as yup from "yup";

const AssignPoc = () => {
  const dispatch = useDispatch();
  const initialvalues = { tdei_project_group_id: "", user_name: "", roles: ["poc"] };
  const validationSchema = yup.object().shape({
    tdei_project_group_id: yup.string().required("Project Group Name is required"),
    user_name: yup.string().required("Email Id is required"),
  });
  const onSuccess = (data) => {
    console.log("Assigned POC", data);
    dispatch(show({ message: "Assigned POC successfully", type: "success" }));
  };

  const onError = (err) => {
    //dispatch(show({ message: 'Error in assigning POC', type: 'danger' }));
    console.error(err);
  };

  const { isLoading, mutate, isError, error } = useAssignRoles({
    onError,
    onSuccess,
  });

  const handleAssignPoc = (values) => {
    mutate(values);
  };

  return (
    <div className={style.card}>
      <h5 className="mb-4">ASSIGN POC</h5>
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
              <Form.Label>Project Group Name</Form.Label>
              <Field component={ProjectGroupList} name="tdei_project_group_id" />
            </Form.Group>
            <Button variant="primary" type="submit" disabled={isLoading}>
              {isLoading ? "Assigning..." : "Submit"}
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default AssignPoc;
