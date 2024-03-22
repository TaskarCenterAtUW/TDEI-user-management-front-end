import React from 'react';
import Layout from '../../components/Layout';
import Container from "../../components/Container/Container";
import style from "./UploadDataset.module.css"
import VerticalStepper from "../../components/VerticalStepper/VerticalStepper"
const steps = [
  // { title: 'Step 1', content: 'Content for step 1' },
  // { title: 'Step 2', content: 'Content for step 2' },
  // { title: 'Step 3', content: 'Content for step 3' },
];
const UploadDataset = () => {
  return (
    <Layout>
      <Container className="d-flex align-items-center mt-2">
      <div className="page-header-title">Upload Dataset</div>
      <VerticalStepper steps={steps} />
     </Container>
    </Layout>
  );
};

export default UploadDataset;