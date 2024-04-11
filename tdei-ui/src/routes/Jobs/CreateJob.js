import React, {useState} from "react";
import Container from "../../components/Container/Container";
import Layout from "../../components/Layout";
import {getSelectedProjectGroup} from "../../selectors";
import {useDispatch, useSelector} from "react-redux";
import useCreateService from "../../hooks/service/useCreateService";
import {useAuth} from "../../hooks/useAuth";
import {show} from "../../store/notification.slice";
import {show as showModal} from "../../store/notificationModal.slice";
import * as yup from "yup";
import useUpdateSevice from "../../hooks/service/useUpdateService";
import {useQueryClient} from "react-query";
import {useNavigate, useParams} from 'react-router-dom';
import {GEOJSON, GET_SERVICES} from '../../utils'
import {getService} from "../../services";
import style from "./Jobs.module.css";
import Select from "react-select";
import Dropzone from "../../components/DropZone/Dropzone";
import {Button} from "@mui/material";

const CreateJobService = () => {
    const queryClient = useQueryClient();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const selectedProjectGroup = useSelector(getSelectedProjectGroup);
    const idData = useParams();
    const [geoJson, setGeoJson] = useState(JSON.stringify(GEOJSON, null, 2));
    const [serviceData, setServiceData] = React.useState({
        service_name: "",
        tdei_project_group_id: selectedProjectGroup.tdei_project_group_id,
        service_type: selectedProjectGroup.service_type,
        polygon: JSON.stringify(GEOJSON, null, 2),
    });
    const {user} = useAuth();

    const jobTypeOptions = [
        {value: 'Validate', label: 'Validate'},
        {value: 'Confidence Metric', label: 'Confidence Metric'},
        {value: 'Convert', label: 'Convert'}
    ];

    React.useEffect(() => {
        if (idData['id'] !== undefined && idData['serviceType'] !== undefined) {
            getService(idData['id'], idData['serviceType']).then((services) => {
                setServiceData(services.data[0]);
                setGeoJson(JSON.stringify(services.data[0].polygon, null, 2))
            })
        }
    }, [idData]);

    const validationSchema = yup.object().shape({
        tdei_project_group_id: yup.string().required("Project Group Name is required"),
        service_name: yup.string().required("Service Name is required"),
        service_type: yup.string().required("Service Type is required")
    });

    const onSuccess = (data) => {
        queryClient.invalidateQueries({queryKey: [GET_SERVICES]});
        dispatch(
            showModal({
                message: `Service ${serviceData?.tdei_service_id ? "updated" : "created"
                } successfully.`,
            })
        );
        navigate(user.isAdmin && idData['id'] === undefined ? -2 : !user.isAdmin && idData['id'] === undefined ? -2 : -1);
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
    const {isLoading, mutate} = useCreateService({onSuccess, onError});
    const {isLoading: isUpdateLoading, mutate: updateService} = useUpdateSevice(
        {onSuccess, onError}
    );

    const onDrop = (files) => {
        const selectedFile = files[0];
        console.log(selectedFile);
    };

    return (
        <Layout>
            <Container>
                <>
                    <div className={style.header}>
                        <div className={style.title}>
                            <div className="page-header-title">Create New Job</div>
                        </div>
                    </div>
                    <div className={style.divider}></div>
                    <div className={style.rectangleBox}>
                        <form className={style.form}>
                            <div className={style.formItems}>
                                <p>Job Type</p>
                                <Select className={style.selectPanel}
                                        options={jobTypeOptions}
                                        placeholder="Select a Job type"
                                />
                            </div>

                            <div className={style.formItems}>
                                <p>Attach data file</p>
                                <Dropzone onDrop={onDrop} accept={{
                                    'application/zip': ['.zip']
                                }} format={".zip"}/>
                            </div>
                        </form>
                    </div>
                    <div className={style.divider}></div>
                    <div className={style.buttonContainer}>
                        <Button style={{ color: 'grey', borderColor: 'grey' }} variant="outlined">Cancel</Button>
                        <Button className="tdei-primary-button" variant="contained">Create</Button>
                    </div>
                </>
            </Container>
        </Layout>
    );
};


export default CreateJobService;
