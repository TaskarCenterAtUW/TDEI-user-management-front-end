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
  const isDatasetsAccessible = useIsDatasetsAccessible();
  const handleUploadNav = () => { 
    navigate('/UploadDataset');
  };
  // Check if the user is not an admin, not a flex data generator, not a PoC, osw_data_generator, pathways_data_generator

  // if (!(user.isAdmin || isDatasetsAccessible)) {
  //   return (
  //     <div className="p-4">
  //       <div className="alert alert-warning" role="alert">
  //         Oops! User doesn't have permission to access this page!
  //       </div>
  //     </div>
  //   );
  // }
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
              <Button onClick={handleUploadNav} className="tdei-primary-button">
                  Upload Dataset
              </Button>
          </div>
          </div>
          <DatasetsTabsContainer/>
      </div>
  );
};

export default Datasets;
