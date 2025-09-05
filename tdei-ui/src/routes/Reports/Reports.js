import React, { useState } from "react";
import Container from "../../components/Container/Container";
import style from "./Reports.module.css";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Typography from "@mui/material/Typography";
import { StatsReportPanel } from "./panels/StatsReportPanel";
import { UsersReportPanel } from "./panels/UsersReportPanel";

const reportsConfig = [
  {
    id: "stats-report",
    title: "Usage Stats (CSV)",
    subtitle: "Download usage stats by quick range or a custom date range",
    Component: StatsReportPanel,
    defaultExpanded: true,
  },
  {
    id: "active-users",
    title: "Active Users",
    subtitle: "Download a CSV of currently active users",
    Component: UsersReportPanel,
    defaultExpanded: false,
  },
];

const Reports = () => {
  const [expanded, setExpanded] = useState(
    reportsConfig.find(r => r.defaultExpanded)?.id || reportsConfig[0].id
  );

  const handleChange = (panelId) => (_e, isExpanded) => {
    setExpanded(isExpanded ? panelId : false);
  };

  return (
    <div className={style.statsContainer}>
      <div className={style.header}>
        <div className={style.title}>
          <div className="page-header-title">Reports</div>
          <div className="page-header-subtitle">Download CSV reports</div>
        </div>
      </div>

      <Container>
        <div className={style.accordionStack}>
          {reportsConfig.map(({ id, title, subtitle, Component }) => (
            <Accordion
              key={id}
              expanded={expanded === id}
              onChange={handleChange(id)}
              disableGutters
              className={style.accordion}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />} className={style.accSummary}>
                <div className={style.accHeader}>
                  <Typography variant="h6" className={style.accTitle}>{title}</Typography>
                  {subtitle && <Typography className={style.accSubtitle}>{subtitle}</Typography>}
                </div>
              </AccordionSummary>
              <AccordionDetails className={style.accDetails}>
                <Component />
              </AccordionDetails>
            </Accordion>
          ))}
        </div>
      </Container>
    </div>
  );
};

export default Reports;
