import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";
import Container from "../../components/Container/Container";
import Layout from "../../components/Layout";
import { getSelectedOrg } from "../../selectors";
import MapBox from "./MapBox";
import { useDispatch, useSelector } from "react-redux";
import useCreateStation from "../../hooks/station/useCreateStation";
import { useAuth } from "../../hooks/useAuth";
import { show } from "../../store/notification.slice";
import { show as showModal } from "../../store/notificationModal.slice";
import OrgList from "../../components/OrganisationList/OrgList";
import { Formik, Field } from "formik";
import * as yup from "yup";
import useUpdateStation from "../../hooks/station/useUpdateStation";
import { GET_STATIONS } from "../../utils";
import { useQueryClient } from "react-query";
import style from "./Maps.module.css";
import { useNavigate, useParams } from 'react-router-dom';
import { GEOJSON } from '../../utils'
import "./Map.css"
import { getStation } from "../../services";

const CreateUpdateStation = () => {
    const queryClient = useQueryClient();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    var data = {};
    const selectedOrg = useSelector(getSelectedOrg);  
    const idData = useParams();
    const [geoJson, setGeoJson] = useState(GEOJSON);
    const [stationData, setStationData] = React.useState({
        tdei_org_id: selectedOrg.tdei_org_id,
        station_name: "",
        polygon: GEOJSON
    });
    const { user } = useAuth();
   
    console.log("Params ",idData['id']);
    React.useEffect(()=>{
        if(idData['id'] !== undefined){
            getStation(idData['id']).then((stations)=>{
                console.log(stations);
                setStationData(stations.data[0]);
            })
        }
    },[idData]);

    const validationSchema = yup.object().shape({
        tdei_org_id: yup.string().required("Organization Name is required"),
        station_name: yup.string().required("Station Name is required"),
    });

    const onSuccess = (data) => {
        console.log("suucessfully created", data);
        queryClient.invalidateQueries({ queryKey: [GET_STATIONS] });
        dispatch(
            showModal({
                message: `Station ${stationData?.tdei_station_id ? "updated" : "created"
                    } successfully.`,
            })
        );
        navigate(-1);
    };
    const onError = (err) => {
        console.error("error message", err);
        dispatch(
            show({
                message: `Error in ${stationData?.tdei_station_id ? "updating" : "creating"
                    } station`,
                type: "danger",
            })
        );
        navigate(-1);
    };
    const { isLoading, mutate } = useCreateStation({ onSuccess, onError });
    const { isLoading: isUpdateLoading, mutate: updateStation } =
        useUpdateStation({ onSuccess, onError });

    const handleCreateStation = (values) => {
        if (stationData?.tdei_station_id) {
            updateStation({
                station_name: values.station_name? values.station_name : "",
                tdei_station_id: stationData?.tdei_station_id ? stationData?.tdei_station_id : "",
                tdei_org_id: values.tdei_org_id? values.tdei_org_id : "",
                polygon: geoJson.features.length === 0 ? GEOJSON : geoJson
            });
        } else {
            console.log("geoJson", geoJson);
            mutate({
                station_name: values.station_name,
                tdei_station_id: stationData?.tdei_station_id,
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
            return "Edit Station";
        } else {
            return "Create New Station";
        }
    };
    const handlePop = () => {
        navigate(-1);
    };

    const handleGeoJson = (data) => {
        setGeoJson(data);
    };
    const getJson = () => {
        if (selectedOrg?.tdei_org_id && stationData?.polygon !== undefined ){
            return stationData?.polygon;
        }else if (!selectedOrg?.tdei_org_id && stationData?.polygon === undefined ){
            return GEOJSON;
        }
        return geoJson
    };

    return (
        <Layout>
            <Formik
                initialValues={stationData}
                onSubmit={handleCreateStation}
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
                                    <Form.Label>Station Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter Station Name"
                                        name="station_name"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.station_name}
                                        isInvalid={touched.station_name && !!errors.station_name}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.station_name}
                                    </Form.Control.Feedback>
                                </Form.Group>
                                <div className={style.apiKey}>
                                    <Form.Label>Station Location</Form.Label>
                                    <MapBox isEdit = {stationData?.tdei_station_id ? true : false} geojson={getJson()} onGeoJsonAdded={handleGeoJson} />
                                </div>
                            </Container>
                        </Form>
                    </>
                )}
            </Formik>
        </Layout>
    );
};


export default CreateUpdateStation;
