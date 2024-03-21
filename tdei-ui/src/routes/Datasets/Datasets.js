import React from "react";
import { useSelector } from "react-redux";
import style from "./Datasets.module.css";
import { getSelectedProjectGroup } from "../../selectors";
import { Button } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';
import DatasetsTabsContainer from "./DatasetsTabsContainer";

/** Page to display list of Datasets. */

const Datasets = () => {
  const selectedProjectGroup = useSelector(getSelectedProjectGroup);
  const navigate = useNavigate();
  const handleCreate = () => {
    
    // navigate('/CreateUpdateService');
  };
  
  return (
      <div>
        <div className={style.datasetsHeader}>
          <div>
              <div className="page-header-title">Datasets</div>
              <div className="page-header-subtitle">
                  Here are the list of datasets available
              </div>
          </div>
          <div>
              <Button onClick={handleCreate} className="tdei-primary-button">
                  Upload Dataset
              </Button>
          </div>
          </div>
          <DatasetsTabsContainer/>
      </div>
    
  );
};

export default Datasets;
