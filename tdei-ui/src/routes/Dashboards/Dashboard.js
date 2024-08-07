import React from "react";
import { useSelector } from "react-redux";
import Layout from "../../components/Layout";
import UserHeader from "../../components/UserHeader/UserHeader";
import { getSelectedProjectGroup } from "../../selectors";

const Dashboard = () => {
  const selectedProjectGroup = useSelector(getSelectedProjectGroup);

  return (
    <Layout>
      <UserHeader roles={selectedProjectGroup?.roles} />
    </Layout>
  );
};

export default Dashboard;
