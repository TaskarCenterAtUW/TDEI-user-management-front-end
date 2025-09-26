import React, { useEffect, useMemo, useState } from "react";
import { Button as RBButton, Spinner } from "react-bootstrap";
import FilterListIcon from "@mui/icons-material/FilterList";
import RefreshIcon from "@mui/icons-material/Refresh";
import AddIcon from "@mui/icons-material/Add";
import ReferralCodesTable from "../../components/Referral/ReferralCodesTable";
import style from "./Referral.module.css";
import { useParams, useNavigate } from "react-router-dom";
import Container from "../../components/Container/Container";
import { getSelectedProjectGroup } from "../../selectors";
import { useSelector } from "react-redux";

const mockCodes = [
  {
    id: "1",
    name: "Summer Campaign 2024",
    type: "campaign",
    shareLink: "https://app.example.com/join/SUMM2424ABC",
    shortCode: "SUMM2424ABC",
    instructionsUrl: "https://wearemotto.com/",
    validFrom: "2024-06-01",
    validTo: "2024-08-31",
    createdAt: "2024-05-15",
    isActive: true,
  },
  {
    id: "2",
    name: "Friend Invite",
    type: "invite",
    shareLink: "https://app.example.com/join/FRIE2424XYZ",
    shortCode: "FRIE2424XYZ",
    validFrom: "2024-01-01",
    validTo: "2024-12-31",
    createdAt: "2024-01-01",
    isActive: true,
  },
  {
    id: "3",
    name: "Beta Testing Program",
    type: "invite",
    shareLink: "https://app.example.com/join/BETA2424DEF",
    shortCode: "BETA2424DEF",
    instructionsUrl: "https://example.com/beta-instructions",
    validFrom: "2024-03-01",
    validTo: "2024-05-01",
    createdAt: "2024-02-15",
    isActive: false,
  },
];

const Referral = () => {
  const [codes, setCodes] = useState(mockCodes);
  const [isLoading, setIsLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const selectedProjectGroup = useSelector(getSelectedProjectGroup);

  useEffect(() => {
    // TODO: API call to fetch by project group id `id`
    // setCodes(data)
  }, [id]);

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 800);
  };

  const handleNewCode = () => navigate(`/${id}/referralCodes/new`);

  const handleEdit = (code) =>
    navigate(`/${id}/referralCodes/${code.id}/edit`, {
      state: { referral: code },
    });

  const handleDelete = (deleteId) => {
    setCodes((prev) => prev.filter((c) => c.id !== deleteId));
  };

  const hasData = useMemo(() => codes.length > 0, [codes]);

  return (
    <div className={style.referralContainer}>
      <div className={style.header}>
        <div className="titleBlock">
          <div className="page-header-title">Referral Codes</div>
          <div className="page-header-subtitle">
            Manage and track your referral and invite codes of project group - <span className="fw-bold">{`${selectedProjectGroup.name}`}</span>.
          </div>
        </div>

        <div className={style.actionsRight}>
          <RBButton
            className={style.filterBtn}
            variant="outline-secondary"
            onClick={() => setShowFilters((s) => !s)}
            aria-pressed={showFilters}
          >
            <FilterListIcon fontSize="small" className="me-1" />
            Filter
          </RBButton>

          <RBButton
            className={style.filterBtn}
            variant="outline-secondary"
            onClick={handleRefresh}
            disabled={isLoading}
          >
            {isLoading ? (
              <Spinner size="sm" animation="border" className="me-2" />
            ) : (
              <RefreshIcon fontSize="small" className="me-1" />
            )}
          </RBButton>

          <RBButton className="tdei-primary-button" onClick={handleNewCode}>
            <AddIcon fontSize="small" className="me-1" />
            New Code
          </RBButton>
        </div>
      </div>

      {showFilters && (
        <div
          className="mb-3"
          style={{ border: "1px dashed #ddd", padding: 12, borderRadius: 8 }}
        >
          <span className="text-muted">Filters coming soon…</span>
        </div>
      )}

      {isLoading ? (
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ height: 200 }}
        >
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading…</span>
          </Spinner>
        </div>
      ) : !hasData ? (
        <div className="alert alert-info" role="alert">
          No referral codes available.
        </div>
      ) : (
        <Container>
          <ReferralCodesTable
            codes={codes}
            onEdit={handleEdit}      
            onDelete={handleDelete}
          />
        </Container>
      )}
    </div>
  );
};

export default Referral;
