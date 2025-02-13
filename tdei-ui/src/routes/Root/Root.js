import React from "react";
import { Container, Spinner } from "react-bootstrap";
import Navigation from "../../components/Navigation/Navigation";
import style from "./style.module.css";
import useGetProjectGroupRoles from "../../hooks/roles/useProjectGroupRoles";
import { getSelectedProjectGroup, getSideMenuFlag } from "../../selectors";
import { useDispatch, useSelector } from "react-redux";
import { set } from "../../store";
import { Outlet } from "react-router-dom";

const Root = () => {
  const { data: projectGroupData, isLoading: isProjectGroupLoading, isError } = useGetProjectGroupRoles();
  const dispatch = useDispatch();
  const selectedProjectGroup = useSelector(getSelectedProjectGroup);
  const flag = useSelector(getSideMenuFlag);
  React.useEffect(() => {
    const isEmptyObject = (obj) => Object.keys(obj).length === 0;
    if ((selectedProjectGroup === null || isEmptyObject(selectedProjectGroup)) && projectGroupData?.pages?.[0]?.data?.length > 0) {
      const firstProjectGroup = projectGroupData.pages[0].data[0];
      if (firstProjectGroup) {
        console.log("Setting first project group:", firstProjectGroup);
        dispatch(set(firstProjectGroup));
      }
    }
  }, [projectGroupData, dispatch, selectedProjectGroup]);
  const roles = selectedProjectGroup?.roles;
  return (
    <Container fluid className="p-0">
      {isError ? <div>Error in getting roles</div> : null}
      {isProjectGroupLoading && !roles ? (
        <div className={`${style.loaderCenter} d-flex justify-content-center`}>
          <Spinner
            size="lg"
            style={{ width: "3rem", height: "3rem" }}
            variant="secondary"
          />
        </div>
      ) : (
        <div className="d-flex">
          {flag && (
            <div className={style.navigationBlock}>
              <Navigation />
            </div>
          )}
          <div className={style.contentBlock}>
            <Outlet roles={roles} />
          </div>
        </div>
      )}
    </Container>
  );
};

export default Root;
