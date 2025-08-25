/**
 * Represent a single feedback item in the feedback list.
 * {
        "id": "14",
        "project_group": {
            "tdei_project_group_id": "1ec1c79b-6b7a-4011-936b-c75dbbd903e3",
            "name": "AA Viewer Internal"
        },
        "dataset": {
            "tdei_dataset_id": "22dfe795-bcab-40c9-8046-4820037a513e",
            "name": "Test_Sequim_City"
        },
        "dataset_element_id": "way/3642227",
        "feedback_text": "#test feedback",
        "customer_email": "shwethap@vindago.in",
        "location_latitude": 48.07712180754254,
        "location_longitude": -123.13807252883576,
        "created_at": "2025-08-21T14:37:36.789Z",
        "updated_at": "2025-08-21T14:37:36.789Z",
        "status": "open",
        "due_date": "2025-08-31T14:37:36.754Z"
    }
 */
import React from "react";
import style from "../../routes/Feedback/Feedback.module.css";

const FeedbackListItem = ({ feedback }) => {
  // CSS styles for different status states
  const getStatusStyle = (status) => {
    const baseStyle = {
      padding: '4px 12px',
      borderRadius: '12px',
      fontSize: '12px',
      fontWeight: '600',
      textTransform: 'capitalize',
      display: 'inline-block',
      minWidth: '80px',
      textAlign: 'center'
    };

    switch (status?.toLowerCase()) {
      case 'open':
        return {
          ...baseStyle,
          backgroundColor: 'rgb(219 234 254)',
          color: 'rgb(30, 64, 175)',
          border: '1px solid transparent'
        };
      case 'in progress':
      case 'in-progress':
      case 'inprogress':
        return {
          ...baseStyle,
          backgroundColor: 'rgb(254 249 195)',
          color: 'rgb(133 77 14)',
          border: '1px solid rgb(255 224 178)'
        };
      case 'resolved':
      case 'closed':
        return {
          ...baseStyle,
          backgroundColor: 'rgb(220 252 231)',
          color: 'rgb(22 101 52)',
          border: '1px solid transparent'
        };
    case 'overdue':
        return {
          ...baseStyle,
          backgroundColor: 'rgb(254 226 226)',
          color: 'rgb(153 27 27)',
          border: '1px solid transparent'
        };
      default:
        return {
          ...baseStyle,
          backgroundColor: '#F5F5F5',
          color: '#666666',
          border: '1px solid #E0E0E0'
        };
    }
  };
  const lat = feedback.location_latitude?.toFixed(8);
  const lng = feedback.location_longitude?.toFixed(8);
  return (
    <div className={style.gridContainer} key={feedback.id}>
        <p className={style.feedbackText}>{feedback.feedback_text}</p>
        <p> {feedback.customer_email} <br/> <span class = {style.feedbackLocation} >{lat}, {lng}</span></p>
        <p>{new Date(feedback.created_at).toLocaleString()}</p>
        <p> {feedback.dataset.name} {feedback.dataset_element_id}</p>
      <p>
        <span style={getStatusStyle(feedback.status)}>
          {feedback.status}
        </span>
      </p>
    </div>
  );
};

export default FeedbackListItem;
