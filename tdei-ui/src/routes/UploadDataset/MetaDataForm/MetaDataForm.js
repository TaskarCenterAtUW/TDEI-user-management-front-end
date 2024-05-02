import React, { useState } from "react";
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import style from "./MetaDataForm.module.css";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import DatasetDetails from "./DatasetDetails";
import DatasetProvenance from "./DataProvenance";
import DatasetSummary from "./DatasetSummary";
import Maintenance from "./Maintenance";
import Methodology from "./Methodology";

const MetaDataForm = () => {
    const [key, setKey] = useState('datasetDetails');

    const validationSchema = Yup.object().shape({
        datasetName: Yup.string().required('Dataset Name is required'),
        datasetVersion: Yup.string().required('Dataset Version is required'),
        datasetType: Yup.string().required('Dataset Type is required'),
        tdeiServiceId: Yup.string().required('TDEI Service Id is required')
    });
    return (
        <div>
            <div style={{ paddingTop: "20px" }}>
                <div>
                    <Formik
                        initialValues={{
                            datasetName: '',
                            description: '',
                        }}
                        validationSchema={validationSchema}
                        onSubmit={(values) => {
                            console.log(values);
                        }}
                    >
                        {() => (
                            <Form>
                                <Tabs
                                    activeKey={key}
                                    onSelect={(k) => setKey(k)}
                                    className="mb-2"
                                >
                                    <Tab eventKey="datasetDetails" title={<span className={style.boldText}> Dataset Details</span>}>
                                        <DatasetDetails />
                                    </Tab>
                                    <Tab eventKey="dataProvenance" title={<span className={style.boldText}> Data Provenance</span>}>
                                        <DatasetProvenance />
                                    </Tab>
                                    <Tab eventKey="datasetSummary" title={<span className={style.boldText}> Dataset Summary</span>}>
                                        <DatasetSummary />
                                    </Tab>
                                    <Tab eventKey="maintenance" title={<span className={style.boldText}> Maintenance</span>}>
                                        <Maintenance />
                                    </Tab>
                                    <Tab eventKey="methodology" title={<span className={style.boldText}> Methodology</span>}>
                                        <Methodology />
                                    </Tab>
                                </Tabs>
                            </Form>
                        )}
                    </Formik>
                </div>
            </div>
        </div>
    );
};

export default MetaDataForm;
