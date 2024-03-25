import React from 'react';
import Layout from '../../components/Layout';
import Container from "../../components/Container/Container";
import style from "./UploadDataset.module.css"
import VerticalStepper from "../../components/VerticalStepper/VerticalStepper";
import ServiceUpload from './ServiceUpload';
import Metadata from './Metadata';
import DataFile from './DataFile';
import Changeset from './Changeset';

const stepsData = [
  {
    title: 'Service',
    subtitle: 'Select the service',
    component: ServiceUpload, 
  },
  {
    title: 'Data File',
    subtitle: 'Attach data file (.zip)',
    component: DataFile,
  },
  {
    title: 'Metadata File',
    subtitle: 'Attach metadata file (.json)',
    component: Metadata,
  },
  {
    title: 'Changeset',
    subtitle: 'Attach changeset file (.txt)',
    component: Changeset,
  },
];
const UploadDataset = () => {
  return (
    <Layout>
      <Container className="d-flex align-items-center mt-2">
      <div className="page-header-title">Upload Dataset</div>
      <VerticalStepper stepsData={stepsData} />
     </Container>
    </Layout>
  );
};

export default UploadDataset;