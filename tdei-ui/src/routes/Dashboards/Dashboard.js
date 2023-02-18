import React from "react";
import { useSelector } from "react-redux";
import Creation from "../../components/Creation/Creation";
import UserHeader from "../../components/UserHeader/UserHeader";
import { getSelectedOrg } from "../../selectors";

const Dashboard = () => {
  const selectedOrg = useSelector(getSelectedOrg);

  return (
    <>
      <UserHeader roles={selectedOrg?.roles} />
      {/* <Creation roles={selectedOrg?.roles} /> */}
    </>
  );
};

export default Dashboard;
