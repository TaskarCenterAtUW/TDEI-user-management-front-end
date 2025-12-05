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
  const accessToken = localStorage.getItem("accessToken");

  React.useEffect(() => {
    // Only auto-select when:
    // - user is logged in
    // - there is no tdei_project_group_id yet
    // - roles API has returned at least one PG
    if (
      accessToken &&
      !selectedProjectGroup?.tdei_project_group_id &&
      projectGroupData?.pages?.[0]?.data?.length > 0
    ) {
      const firstProjectGroup = projectGroupData.pages[0].data[0];
      if (firstProjectGroup) {
        console.log("[Root] Auto-selecting first PG:", firstProjectGroup);
        dispatch(set(firstProjectGroup));
      }
    }
  }, [
    accessToken,
    projectGroupData,
    dispatch,
    selectedProjectGroup?.tdei_project_group_id,
  ]);

    if (!selectedProjectGroup || !selectedProjectGroup.roles) {
    return (
      <Container fluid className="p-0">
        <div className={`${style.loaderCenter} d-flex justify-content-center`}>
          <Spinner size="lg" style={{ width: "3rem", height: "3rem" }} variant="secondary" />
        </div>
      </Container>
    );
  }
  const roles = selectedProjectGroup?.roles || [];
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
          <Navigation />
          <div className={style.contentBlock}>
            <Outlet roles={roles} />
          </div>
        </div>
      )}
    </Container>
  );
};

export default Root;
