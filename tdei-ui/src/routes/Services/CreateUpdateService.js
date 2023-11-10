import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";
import Container from "../../components/Container/Container";
import Layout from "../../components/Layout";
import { getSelectedProjectGroup } from "../../selectors";
import { useDispatch, useSelector } from "react-redux";
import useCreateService from "../../hooks/service/useCreateService";
import { useAuth } from "../../hooks/useAuth";
import { show } from "../../store/notification.slice";
import { show as showModal } from "../../store/notificationModal.slice";
import ProjectGrpList from "../../components/ProjectGroupList/ProjectGrpList";
import { Formik, Field } from "formik";
import * as yup from "yup";
import useUpdateSevice from "../../hooks/service/useUpdateService";
import { useQueryClient } from "react-query";
import { useNavigate, useParams } from 'react-router-dom';
import { GEOJSON } from '../../utils'
import { GET_SERVICES } from "../../utils";
import { getService } from "../../services";

const CreateUpdateService = () => {
    const queryClient = useQueryClient();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const selectedProjectGroup = useSelector(getSelectedProjectGroup);
    const idData = useParams();
    const [geoJson, setGeoJson] = useState(JSON.stringify(GEOJSON, null, 2));
    const [serviceData, setServiceData] = React.useState({
        service_name: "",
        tdei_project_group_id: selectedProjectGroup.tdei_project_group_id,
        polygon: JSON.stringify(GEOJSON, null, 2)
    });
    const { user } = useAuth();

    React.useEffect(() => {
        if (idData['id'] !== undefined) {
            getService(idData['id']).then((services) => {
                setServiceData(services.data[0]);
                setGeoJson(JSON.stringify(services.data[0].polygon, null, 2))
            })
        }
    }, [idData]);

    const validationSchema = yup.object().shape({
        tdei_project_group_id: yup.string().required("Project Group Name is required"),
        service_name: yup.string().required("Service Name is required"),
    });

    const onSuccess = (data) => {
        queryClient.invalidateQueries({ queryKey: [GET_SERVICES] });
        dispatch(
            showModal({
                message: `Service ${serviceData?.tdei_service_id ? "updated" : "created"
                    } successfully.`,
            })
        );
        navigate(-1);
    };
    const onError = (err) => {
        dispatch(
            show({
                message: `Error in ${serviceData?.tdei_service_id ? "updating" : "creating"
                    } Service. ${err.data.message}`,
                type: "danger",
            })
        );
        navigate(-1);
    };
    const { isLoading, mutate } = useCreateService({ onSuccess, onError });
    const { isLoading: isUpdateLoading, mutate: updateService } = useUpdateSevice(
        { onSuccess, onError }
    );

    const handleCreateService = (values) => {
        const parsedData = JSON.parse(geoJson);
        if (serviceData?.tdei_service_id) {
            updateService({
                service_name: values.service_name ? values.service_name : "",
                tdei_service_id: serviceData?.tdei_service_id ? serviceData?.tdei_service_id : "",
                tdei_project_group_id: values.tdei_project_group_id ? values.tdei_project_group_id : "",
                polygon: parsedData.features.length === 0 ? GEOJSON : parsedData
            });
        } else {
            mutate({
                service_name: values.service_name,
                tdei_service_id: serviceData?.tdei_service_id,
                tdei_project_group_id: values.tdei_project_group_id,
                polygon: parsedData
            });
        }
    };

    const getText = () => {
        if (idData['id'] !== undefined) {
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
    const getHeader = () => {
        if (idData['id'] !== undefined) {
            return "Edit Service";
        } else {
            return "Create New Service";
        }
    };
    const handlePop = () => {
        navigate(-1);
    };

    const handleTextareaChange = (e) => {
        const { value } = e.target;
        setGeoJson(value);
    };
    var link = <a href={'https://geojson.io/'} target="_blank" rel="noreferrer">geojson.io</a>;

    return (
        <Layout>
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
                    <>
                        <Form noValidate onSubmit={handleSubmit}>
                            <div className="header">
                                <div className="page-header-title">  {getHeader()}</div>
                                <div className="d-grid gap-2 d-md-flex">
                                    <Button
                                        variant="ouline-secondary"
                                        className="tdei-secondary-button"
                                        onClick={handlePop}
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
                                </div>
                            </div>
                            <Container className="d-flex align-items-center mt-2">

                                <Form.Group className="col-7 mb-3" controlId="projectGroupId ">
                                    <Form.Label>Project Group Name</Form.Label>

                                    {user.isAdmin ? (
                                        <Field component={ProjectGrpList} name="tdei_project_group_id" />
                                    ) : (
                                        <Form.Control
                                            type="text"
                                            placeholder="Enter Project Group ID"
                                            name="tdei_project_group_id"
                                            value={selectedProjectGroup.project_group_name}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            disabled
                                        />
                                    )}
                                </Form.Group>
                                <Form.Group className="col-7 mb-3" controlId="name">
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
                                <div className="apiKey">
                                    <Form.Label>Service Boundaries</Form.Label>
                                    <div className="tdei-hint-text">(hint: Create the bounding box using {link} )</div>
                                    <div className="jsonContent">
                                        <Form.Control
                                            as="textarea"
                                            type="text"
                                            name="polygon"
                                            onChange={handleTextareaChange}
                                            onBlur={handleBlur}
                                            rows={20}
                                            value={geoJson}
                                        />
                                    </div>
                                </div>
                            </Container>
                        </Form>
                    </>
                )}
            </Formik>
        </Layout>
    );
};


export default CreateUpdateService;
