import React from "react";
import { useSelector } from "react-redux";
import style from "./Datasets.module.css";
import { getSelectedProjectGroup } from "../../selectors";
import { Button } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';
import DatasetsTabsContainer from "./DatasetsTabsContainer";
import { useAuth } from '../../hooks/useAuth';
import useIsDatasetsAccessible from "../../hooks/useIsDatasetsAccessible.js";

/** Page to display list of Datasets. */

const Datasets = () => {
  const selectedProjectGroup = useSelector(getSelectedProjectGroup);
  const navigate = useNavigate();
  const { user } = useAuth();
  const isWritable = useIsDatasetsAccessible();
  const handleUploadNav = () => { 
    navigate('/UploadDataset');
  };
  return (
      <div>
        <div className={style.datasetsHeader}>
          <div>
              <h2 className="page-header-title">Datasets</h2>
              <div className="page-header-subtitle">
                  Here are the list of datasets available
              </div>
          </div>
          {isWritable &&  
          (<div>
              <Button onClick={handleUploadNav} className="tdei-primary-button">
                  Upload Dataset
              </Button>
          </div>)}
          </div>
          <DatasetsTabsContainer/>
      </div>
  );
};

export default Datasets;
