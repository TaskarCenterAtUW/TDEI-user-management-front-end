import React from "react";
import Container from "../../components/Container/Container";
import Layout from "../../components/Layout";
import style from "./Jobs.module.css";
import Select from "react-select";
import Dropzone from "../../components/DropZone/Dropzone";
import {Button} from "@mui/material";
import {useNavigate} from "react-router-dom";

const CreateJobService = () => {
    const navigate = useNavigate();

    const jobTypeOptions = [
        {value: 'Validate', label: 'Validate'},
        {value: 'Confidence Metric', label: 'Confidence Metric'},
        {value: 'Convert', label: 'Convert'}
    ];

    const handlePop = () => {
        navigate(-1);
    };

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
                        <Button style={{color: 'grey', borderColor: 'grey'}} variant="outlined" onClick={handlePop}>Cancel</Button>
                        <Button className="tdei-primary-button" variant="contained">Create</Button>
                    </div>
                </>
            </Container>
        </Layout>
    );
};

export default CreateJobService;
