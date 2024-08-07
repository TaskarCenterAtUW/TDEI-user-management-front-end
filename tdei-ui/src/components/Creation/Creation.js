import React from "react";
import style from "./Creation.module.css";
import { Button } from "react-bootstrap";
import AssignPoc from "../AssignPoc/AssignPoc";
import CreateProjectGroup from "../CreateProjectGroup/CreateProjectGroup";
import CreateService from "../CreateService/CreateService";
import CreateStation from "../CreateStation/CreateStation";
import AssignRoles from "../AssignRoles/AssignRoles";
import { useAuth } from "../../hooks/useAuth";

const Creation = ({ roles }) => {
  const [showCreateProjectGroup, setShowCreateProjectGroup] =
    React.useState(false);
  const [showCreateService, setShowCreateService] = React.useState(false);
  const [showCreateStation, setShowCreateStation] = React.useState(false);
  const { user } = useAuth();
  if (!roles?.includes("poc") && !user.isAdmin) {
    return null;
  }
  return (
    <div className={`${style.container} p-3`}>
      {user.isAdmin ? (
        <>
          <h5 className="mb-4">CREATION</h5>
          <div className={style.buttonWrapper}>
            <Button onClick={() => setShowCreateProjectGroup(true)}>
              Project Group
            </Button>
            <Button onClick={() => setShowCreateService(true)}>Service</Button>
            <Button onClick={() => setShowCreateStation(true)}>Station</Button>
          </div>
          <AssignPoc />
          {/* <div className={style.hr}></div>
                <AssignRoles /> */}
          <CreateProjectGroup
            show={showCreateProjectGroup}
            onHide={() => setShowCreateProjectGroup(false)}
          />
          <CreateService
            show={showCreateService}
            onHide={() => setShowCreateService(false)}
          />
          <CreateStation
            show={showCreateStation}
            onHide={() => setShowCreateStation(false)}
          />
        </>
      ) : (
        <>
          <h5 className="mb-4">CREATION</h5>
          <div className={style.buttonWrapper}>
            <Button onClick={() => setShowCreateService(true)}>Service</Button>
            <Button onClick={() => setShowCreateStation(true)}>Station</Button>
          </div>
          <AssignRoles />
          <CreateService
            show={showCreateService}
            onHide={() => setShowCreateService(false)}
          />
          <CreateStation
            show={showCreateStation}
            onHide={() => setShowCreateStation(false)}
          />
        </>
      )}
    </div>
  );
};

export default Creation;
