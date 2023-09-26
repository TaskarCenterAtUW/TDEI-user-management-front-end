import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";
import Container from "../../components/Container/Container";
import Layout from "../../components/Layout";
import { getSelectedOrg } from "../../selectors";
import MapBox from "./MapBox";
import { useDispatch, useSelector } from "react-redux";
import useCreateService from "../../hooks/service/useCreateService";
import { useAuth } from "../../hooks/useAuth";
import { show } from "../../store/notification.slice";
import { show as showModal } from "../../store/notificationModal.slice";
import OrgList from "../../components/OrganisationList/OrgList";
import { Formik, Field } from "formik";
import * as yup from "yup";
import useUpdateSevice from "../../hooks/service/useUpdateService";
import { useQueryClient } from "react-query";
import style from "./Maps.module.css";
import { useNavigate, useParams } from 'react-router-dom';
import { GEOJSON } from '../../utils'
import "./Map.css"
import { GET_SERVICES } from "../../utils";
import { getService } from "../../services";

const CreateUpdateService = () => {
    const queryClient = useQueryClient();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    var data = {};
    const selectedOrg = useSelector(getSelectedOrg);  
    const idData = useParams();
    const [geoJson, setGeoJson] = useState(GEOJSON);
    const [serviceData, setServiceData] = React.useState({
        service_name: "",
        tdei_org_id: selectedOrg.tdei_org_id,
        polygon: GEOJSON
      });
    const { user } = useAuth();
   
    console.log("Params ",idData['id']);
    React.useEffect(()=>{
        if(idData['id'] !== undefined){
            getService(idData['id']).then((services)=>{
                console.log(services);
                setServiceData(services.data[0]);
            })
        }
    },[idData]);

    const validationSchema = yup.object().shape({
        tdei_org_id: yup.string().required("Organization Name is required"),
        service_name: yup.string().required("Service Name is required"),
      });

    const onSuccess = (data) => {
        console.log("sucessfully created", data);
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
        console.error("error message", err);
        dispatch(
            show({
                message: `Error in ${serviceData?.tdei_service_id ? "updating" : "creating"
                    } Service`,
                type: "danger",
            })
        );
        navigate(-1);
    };
    const { isLoading, mutate } = useCreateService({ onSuccess, onError });
  const { isLoading: isUpdateLoading, mutate: updateService } = useUpdateSevice(
    { onSuccess, onError }
  );

        // const handleCreateService = (values) => {
        //     if (props.data?.tdei_service_id) {
        //       updateService({
        //         service_name: values.service_name,
        //         tdei_service_id: props.data?.tdei_service_id,
        //         tdei_org_id: values.tdei_org_id,
        //       });
        //     } else {
        //       mutate(values);
        //     }
        //   };

    const handleCreateService = (values) => {
        if (serviceData?.tdei_service_id) {
            updateService({
                service_name: values.service_name? values.service_name : "",
                tdei_service_id: serviceData?.tdei_service_id ? serviceData?.tdei_service_id : "",
                tdei_org_id: values.tdei_org_id? values.tdei_org_id : "",
                polygon: geoJson.features.length === 0 ? GEOJSON : geoJson
            });
        } else {
            console.log("geoJson", geoJson);
            mutate({
                service_name: values.service_name,
                tdei_service_id: serviceData?.tdei_service_id,
                tdei_org_id: values.tdei_org_id,
                polygon: geoJson
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

    const handleGeoJson = (data) => {
        setGeoJson(data);
    };
    const getJson = () => {
        if (selectedOrg?.tdei_org_id && serviceData?.polygon !== undefined ){
            return serviceData?.polygon;
        }else if (!selectedOrg?.tdei_org_id && serviceData?.polygon === undefined ){
            return GEOJSON;
        }
        return geoJson
    };

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
                            <div className={style.header}>
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

                                <Form.Group className="col-7 mb-3" controlId="organisationId ">
                                    <Form.Label>Organization Name</Form.Label>

                                    {user.isAdmin ? (
                                        <Field component={OrgList} name="tdei_org_id" />
                                    ) : (
                                        <Form.Control
                                            type="text"
                                            placeholder="Enter Organization ID"
                                            name="tdei_org_id"
                                            value={selectedOrg.org_name}
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
                                <div className={style.apiKey}>
                                    <Form.Label>Service Location</Form.Label>
                                    <MapBox isEdit = {serviceData?.tdei_service_id ? true : false} geojson={getJson()} onGeoJsonAdded={handleGeoJson} />
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
