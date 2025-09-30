import React, { useEffect, useMemo, useState } from "react";
import { Button as RBButton, Spinner, Form } from "react-bootstrap";
import FilterListIcon from "@mui/icons-material/FilterList";
import RefreshIcon from "@mui/icons-material/Refresh";
import AddIcon from "@mui/icons-material/Add";
import ReferralCodesTable from "../../components/Referral/ReferralCodesTable";
import style from "./Referral.module.css";
import { useParams, useNavigate } from "react-router-dom";
import Container from "../../components/Container/Container";
import { getSelectedProjectGroup } from "../../selectors";
import { useSelector } from "react-redux";
import { debounce } from "lodash";
import Select from "react-select";
import { getReferralCodes as fetchReferralCodesApi } from "../../services";
import CustomModal from "../../components/SuccessModal/CustomModal";
import { useDeleteReferralCode } from "../../hooks/referrals/useDeleteReferralCode";
import ResponseToast from "../../components/ToastMessage/ResponseToast";
import useGetProjectGroupById from "../../hooks/projectGroup/useGetProjectGroupById";

const USE_MOCK = true;

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

// when API is ready, map backend item -> UI shape used by the table
const mapApiToUi = (item) => ({
  id: item.id,
  name: item.name,
  type: item.type === 1 ? "campaign" : "invite",
  shortCode: item.code,
  instructionsUrl: item.instructions_url || "",
  validFrom: item.valid_from || null,
  validTo: item.valid_to || null,
  createdAt: item.created_at || null,
  isActive: Boolean(item.is_active),
  shareLink: `${process.env.REACT_APP_JOIN_BASE_URL || "https://app.example.com"}/join/${item.code}`,
});

const typeOptions = [
  { value: "", label: "All" },
  { value: "1", label: "Campaign" },
  { value: "2", label: "Invite" },
];

const Referral = () => {
  const [codes, setCodes] = useState(mockCodes);
  const [isLoading, setIsLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const { id: projectGroupId } = useParams();
  const navigate = useNavigate();
const { projectGroup, loading: pgLoading, error: pgError, notFound } =
useGetProjectGroupById(projectGroupId);

  // filters
  const [filters, setFilters] = useState({
    name: "",
    code: "",
    type: "",
  });

  const [refreshKey, setRefreshKey] = useState(0);
  const [deleteId, setDeleteId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // your API delete hook
  const { mutate: apiDelete, isLoading: isDeleting } = useDeleteReferralCode();
  const [toast, setToast] = useState({
    show: false,
    type: "success",
    message: "",
    autoHideDuration: 3000,
  });
  const showToast = (type, message, autoHideDuration = 3000) =>
    setToast({ show: true, type, message, autoHideDuration });
  const handleToastClose = () => setToast((t) => ({ ...t, show: false }));

  // debounced setters for text inputs
  const debouncedSetName = useMemo(
    () =>
      debounce((v) =>
        setFilters((prev) => ({ ...prev, name: v?.trim?.() ?? "" })), 300),
    []
  );
  const debouncedSetCode = useMemo(
    () =>
      debounce((v) =>
        setFilters((prev) => ({ ...prev, code: v?.trim?.() ?? "" })), 300),
    []
  );

  useEffect(() => {
    return () => {
      debouncedSetName.cancel?.();
      debouncedSetCode.cancel?.();
    };
  }, [debouncedSetName, debouncedSetCode]);

  // fetch (mock now; same call signature for API later)
  useEffect(() => {
    if (!projectGroupId) return;

    let ignore = false;
    const fetchReferrals = async () => {
      setIsLoading(true);
      try {
        if (USE_MOCK) {
          let rows = [...mockCodes];

          if (filters.name) {
            const q = filters.name.toLowerCase();
            rows = rows.filter((r) => r.name.toLowerCase().includes(q));
          }
          if (filters.code) {
            const q = filters.code.toLowerCase();
            rows = rows.filter((r) => r.shortCode.toLowerCase().includes(q));
          }
          if (filters.type) {
            const matchType = filters.type === "1" ? "campaign" : "invite";
            rows = rows.filter((r) => r.type === matchType);
          }
          if (!ignore) setCodes(rows);
        } else {
          const typeNumber =
            filters.type === "" ? undefined : Number(filters.type);

          const res = await fetchReferralCodesApi(
            projectGroupId,
            1,
            filters.name || undefined,
            typeNumber, 
            filters.code || undefined
          );

          const apiEnvelope = res?.data;
          const uiRows = (apiEnvelope?.data ?? []).map(mapApiToUi);
          if (!ignore) setCodes(uiRows);
        }
      } finally {
        if (!ignore) setIsLoading(false);
      }
    };

    fetchReferrals();
    return () => {
      ignore = true;
    };
  }, [projectGroupId, filters.name, filters.code, filters.type, refreshKey]);

  const handleRefresh = () => setRefreshKey((k) => k + 1);

  const handleNewCode = () => navigate(`/${projectGroupId}/referralCodes/new`);

  const handleEdit = (code) =>
    navigate(`/${projectGroupId}/referralCodes/${code.id}/edit?name=${encodeURIComponent(code.name)}`, {
   state: { referral: code },
 });

  const handleDeleteRequest = (id) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  // CONFIRM delete
  const confirmDelete = () => {
    if (!deleteId) return;

    if (USE_MOCK) {
      // local remove
      setCodes((prev) => prev.filter((c) => c.id !== deleteId));
      setShowDeleteModal(false);
      setDeleteId(null);
      showToast("success", "Referral code deleted successfully.");
      return;
    }

    // API delete + refresh/invalidate
    apiDelete(
      { projectGroupId, code_id: deleteId },
      {
        onSuccess: () => {
          setCodes((prev) => prev.filter((c) => c.id !== deleteId));
          setShowDeleteModal(false);
          setDeleteId(null);
          showToast("success", "Referral code deleted successfully.");
        },
        onError: (err) => {
          const msg =
            err?.response?.data?.message ||
            err?.message ||
            "Failed to delete referral code.";
          showToast("error", msg, 4000);
        },
      }
    );
  };
  const hasData = useMemo(() => codes.length > 0, [codes]);

  return (
    <div className={style.referralContainer}>
      <div className={style.header}>
        <div className="titleBlock">
          <div className="page-header-title">Referral Codes</div>
          <div className="page-header-subtitle">
            Manage and track your referral and invite codes of project group -{" "}
            <span className="fw-bold">
             {pgLoading ? "…" : (projectGroup?.project_group_name || "—")}
            </span>.
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
            title="Refresh"
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
          {showFilters && (
            <div className={style.searchPanel}>
              <div className="d-flex flex-wrap gap-3">
                <Form.Control
                  type="text"
                  placeholder="Search by referral code name"
                  onChange={(e) => debouncedSetName(e.target.value)}
                  aria-label="Search by name"
                />
                <Form.Control
                  type="text"
                  placeholder="Search by referral code value"
                  onChange={(e) => debouncedSetCode(e.target.value)}
                  aria-label="Search by code"
                />
                <div className={style.selectPanel}>
                  <label htmlFor="typeSelect" className={style.selectLabel}>
                    Type
                  </label>
                  <Select
                    inputId="typeSelect"
                    className={style.select}
                    options={typeOptions}
                    value={typeOptions.find((o) => o.value === filters.type)}
                    onChange={(opt) =>
                      setFilters((prev) => ({ ...prev, type: opt?.value || "" }))
                    }
                    isClearable={false}
                  />
                </div>
              </div>
            </div>
          )}
          <ReferralCodesTable
            codes={codes}
            onEdit={handleEdit}
            onDelete={handleDeleteRequest}
          />
        </Container>
      )}
      <CustomModal
        show={showDeleteModal}
        onHide={() => !isDeleting && setShowDeleteModal(false)}
        handler={confirmDelete}
        isLoading={isDeleting}
        modaltype="deactivate"
        title="Delete referral code?"
        message="This action cannot be undone."
        btnlabel={isDeleting ? "Deleting…" : "Yes, Delete"}
      />
      <ResponseToast
        showtoast={toast.show}
        type={toast.type}
        message={toast.message}
        autoHideDuration={toast.autoHideDuration}
        handleClose={handleToastClose}
      />
    </div>
  );
};

export default Referral;
