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

const FeedbackListItem = ({ feedback }) => {
  return (
    <div>
      <h5>{feedback.feedback_text}</h5>
      <p>Customer: {feedback.customer_email}</p>
      <p>Location: {feedback.location_latitude}, {feedback.location_longitude}</p>
      <p>Created At: {new Date(feedback.created_at).toLocaleString()}</p>
      <p>Status: {feedback.status}</p>
      <p>Due Date: {new Date(feedback.due_date).toLocaleString()}</p>
    </div>
  );
};

export default FeedbackListItem;
