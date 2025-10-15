import React from "react";
import { useSelector } from "react-redux";
import { getSelectedProjectGroup } from "../../selectors";
import style from "./FeedbackSummary.module.css";
import iconTotalFeedback from "../../assets/img/icon-total-feedback.svg";
import iconOverdue from "../../assets/img/icon-overdue.svg";
import iconTurnAround from "../../assets/img/icon-turnaroundtime.svg";
import iconOpenIssues from "../../assets/img/icon-open-issues.svg";
import useGetFeedbackSummary from "../../hooks/feedback/useGetFeedbackSummary";
import { Spinner } from "react-bootstrap";
import useGetProjectGroupById from "../../hooks/projectGroup/useGetProjectGroupById";

const FeedbackSummary = () => {
  const { tdei_project_group_id } = useSelector(getSelectedProjectGroup);
  const { data, isLoading, isError, error } = useGetFeedbackSummary();
  const { loading: pgLoading, projectGroup } = useGetProjectGroupById(tdei_project_group_id);

 const turnaroundLabel = (() => {
    const tat = projectGroup?.data_viewer_config?.feedback_turnaround_time;
    if (!tat || tat.number == null || !tat.units) return null;
    const n = Number(tat.number);
    const unit = String(tat.units).toLowerCase();
    const singular = unit.endsWith("s") ? unit.slice(0, -1) : unit;
    return `${n} ${n === 1 ? singular : singular + "s"}`;
  })();


  // Default values if no data is provided
  const defaultData = {
    total_count: 5,
    lastThreeMonths: 3,
    total_overdues: 2,
    total_open: 1
  };

  // Handle loading state
  if (isLoading) {
    return (
      <div className={style.feedbackSummaryContainer}>
        <div className="d-flex justify-content-center align-items-center" style={{ height: '200px' }}>
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading feedback summary...</span>
          </Spinner>
        </div>
      </div>
    );
  }

  // Handle error state
  if (isError) {
    return (
      <div className={style.feedbackSummaryContainer}>
        <div className="alert alert-danger" role="alert">
          <strong>Error loading feedback summary:</strong> {error?.message || 'An error occurred while fetching data.'}
        </div>
      </div>
    );
  }

  // Use API data or fallback to default data
  const feedbackData = data || defaultData;

  const summaryCards = [
    {
      title: "Total Feedback",
      value: feedbackData.total_count,
      icon: <img src={iconTotalFeedback} className={style.cardIcon} alt="Total Feedback" />,
      bgColor: "#E3F2FD",
      iconColor: "#1976D2"
    },
    {
      title: "Turn Around Time",
       value: pgLoading ? "Loading…" : (turnaroundLabel || "NA"),
      icon: <img src={iconTurnAround} className={style.cardIcon} alt="Last 3 Months" />,
      bgColor: "#E8F5E8",
      iconColor: "#4CAF50"
    },
    {
      title: "Overdue",
      value: feedbackData.total_overdues,
      icon: <img src={iconOverdue} className={style.cardIcon} alt="Overdue" />,
      bgColor: "#FFF3E0",
      iconColor: "#FF9800"
    },
    {
      title: "Open Issues",
      value: feedbackData.total_open,
      icon: <img src={iconOpenIssues} className={style.cardIcon} alt="Open Issues" />,
      bgColor: "#FFEBEE",
      iconColor: "#F44336"
    }
  ];

  return (
    <div className={style.feedbackSummaryContainer}>
      {summaryCards.map((card, index) => (
        <div 
          key={index} 
          className={style.summaryCard}
          style={{ backgroundColor: card.bgColor }}
        >
          <div className={style.cardContent}>
            <div className={style.cardIconContainer} style={{ color: card.iconColor }}>
              {card.icon}
            </div>
            <div className={style.cardDetails}>
              <div className={style.cardTitle}>{card.title}</div>
              <div className={style.cardValue}>{card.value}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FeedbackSummary;
