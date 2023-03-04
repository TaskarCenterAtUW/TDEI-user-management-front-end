import React from "react";
import Container from "../../components/Container/Container";
import Layout from "../../components/Layout";
import style from "./Stations.module.css";
import newWindowIcon from "../../assets/img/new-window-icon.svg";
import { Button } from "react-bootstrap";
import CreateStation from "../../components/CreateStation/CreateStation";

const Stations = () => {
  const [showCreateStation, setShowCreateStation] = React.useState(false);
  return (
    <Layout>
      <div className={style.header}>
        <div className={style.title}>
          <div className="page-header-title">STATION</div>
          <div className="page-header-subtitle">
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since
          </div>
        </div>
      </div>
      <Container>
        <div className={style.insideContainer}>
          <div className="page-header-title" style={{ paddingBottom: "22px" }}>
            Add New Station for Organization
          </div>
          <div
            className="page-header-subtitle"
            style={{ paddingBottom: "40px", textAlign: "center" }}
          >
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since
          </div>
          <div style={{ paddingBottom: "40px" }}>
            <img src={newWindowIcon} alt="new-window-icon" />
          </div>
          <Button
            onClick={() => setShowCreateStation(true)}
            className="tdei-primary-button"
          >
            Create New Station
          </Button>
        </div>
      </Container>
      <CreateStation
        show={showCreateStation}
        onHide={() => setShowCreateStation(false)}
      />
    </Layout>
  );
};

export default Stations;
