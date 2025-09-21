import React from "react";
import { useState, useEffect } from "react";
import datasetIcon from "../../assets/img/dataset-menu-item.svg";
import style from "./Datasets.module.css"
import releasedDatasets from "../../assets/img/released-data-sets.svg"
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import MyDatasets from "./MyDatasets";
import ReleasedDatasets from "./ReleasedDatasets";
import Container from "../../components/Container/Container";
import { useAuth } from '../../hooks/useAuth';
import useIsDatasetsAccessible from "../../hooks/useIsDatasetsAccessible.js";
import useIsMember from "../../hooks/roles/useIsMember.js";

// Overall tabs container for Datasets
const DatasetsTabsContainer = () => {
    const { user } = useAuth();
    const isDatasetsAccessible = useIsDatasetsAccessible();
    const isMember = useIsMember();
    const isAdmin = user && user.isAdmin;
    const [key, setKey] = useState('myDatasets');

    useEffect(() => {
        // Update the default active tab if user is not admin or datasets are not accessible
        if (!isAdmin && !isDatasetsAccessible && !isMember) {
            setKey('releasedDatasets');
        }
    }, [isAdmin, isDatasetsAccessible]);

    return (
        <div className={style.datasetsLayout}>
            <Container className="d-flex align-items-center mt-2">
                <Tabs
                    activeKey={key}
                    onSelect={(k) => setKey(k)}
                    className="mb-2"
                >
                    {(isAdmin || isDatasetsAccessible || isMember) && (
                        <Tab eventKey="myDatasets" title={<span className={style.boldText}> { isAdmin? "All Datasets" : "My Project Datasets"}</span>}>
                            <MyDatasets />
                        </Tab>
                    )}
                     {!isAdmin && (
                    <Tab eventKey="releasedDatasets" title={<span className={style.boldText}> All Released Datasets</span>}>
                        <ReleasedDatasets />
                    </Tab>
                     )}
                </Tabs>
            </Container>
        </div>
    )
}

export default DatasetsTabsContainer;
