import React, { useMemo, useState } from "react";
import style from "../../routes/Referral/Referral.module.css";
import { Dropdown, Button as RBButton } from "react-bootstrap";
import { useMediaQuery } from "react-responsive";
import {
  Chip,
  IconButton,
  Link,
  Tooltip,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import QrCode2Icon from "@mui/icons-material/QrCode2";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";

import menuOptionIcon from "../../assets/img/menu-options.svg";
import QRCodeModal from "../QRCode/QRCodeModal";

const fmtDate = (dStr) => {
  if (!dStr) return "-";
  const d = new Date(dStr);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleDateString(undefined, { month: "short", day: "2-digit", year: "numeric" });
};

const statusPillStyle = (isActive, validFrom, validTo) => {
  const base = {
    padding: "4px 12px",
    borderRadius: "12px",
    fontSize: "12px",
    fontWeight: 600,
    textTransform: "capitalize",
    display: "inline-block",
    minWidth: "80px",
    textAlign: "center",
    whiteSpace: "nowrap",
  };
  const now = new Date();
  const start = validFrom ? new Date(validFrom) : null;
  const end = validTo ? new Date(validTo) : null;

  if (end && now > end) return { ...base, backgroundColor: "rgb(254 226 226)", color: "rgb(153 27 27)" };
  if (start && now < start) return { ...base, backgroundColor: "rgb(254 249 195)", color: "rgb(133 77 14)" };
  if (isActive) return { ...base, backgroundColor: "rgb(220 252 231)", color: "rgb(22 101 52)" };
  return { ...base, backgroundColor: "#F5F5F5", color: "#666666", border: "1px solid #E0E0E0" };
};

const TypeChip = ({ type }) =>
  type === "campaign" ? (
    <Chip size="small" color="primary" style={{ backgroundColor: 'var(--primary-color)' }} label="Campaign" />
  ) : (
    <Chip size="small" variant="outlined" label="Invite" />
  );

const ReferralCodesTable = ({ codes = [], onEdit, onDelete }) => {
  const isMobile = useMediaQuery({ maxWidth: 992 });

  const [qrOpen, setQrOpen] = useState(false);
  const [selectedCode, setSelectedCode] = useState(null);

  const copyToClipboard = async (text) => {
    try { await navigator.clipboard.writeText(text); } catch { }
  };

  return (
    <div role="table" aria-label="Referral Codes List">
      <div className={`${style.gridContainer} ${style.projectHeader}`} role="rowgroup">
        <div className={style.sortableHeader} role="columnheader">Name</div>
        <div className={style.sortableHeader} role="columnheader">Type</div>
        <div className={style.sortableHeader} role="columnheader">Referral Code</div>
        <div className={style.sortableHeader} role="columnheader">Valid Period</div>
        <div className={style.sortableHeader} role="columnheader">Created</div>
        <div className={style.sortableHeader} role="columnheader">Status</div>
        {!isMobile && <div className={`${style.sortableHeader} ${style.actionsColHead}`} role="columnheader">Actions</div>}
      </div>
      {codes.map((code) => {
        const statusLabel = (() => {
          const now = new Date();
          const start = code.validFrom ? new Date(code.validFrom) : null;
          const end = code.validTo ? new Date(code.validTo) : null;
          if (end && now > end) return "expired";
          if (start && now < start) return "scheduled";
          return code.isActive ? "active" : "inactive";
        })();

        return (
          <div className={style.gridContainer} key={code.id} role="row">
            <div className={`${style.content} ${style.emailContentWrap}`} role="cell">
              <span className={style.name}>{code.name}</span>
              {code.instructionsUrl && (
                <div className="d-flex align-items-center gap-1 mt-1">
                  <OpenInNewIcon fontSize="inherit" color="disabled" />
                  <Link
                    href={code.instructionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    underline="hover"
                    variant="caption"
                  >
                    Instructions
                  </Link>
                </div>
              )}
            </div>
            <div className={style.content} role="cell"><TypeChip type={code.type} /></div>
            <div className={`${style.content} ${style.noWrap}`} role="cell">
              <code className={style.shortCodePill}>{code.shortCode}</code>
              <Tooltip title="Copy referral code">
                <IconButton
                  size="small"
                  onClick={() => copyToClipboard(code.shortCode)}
                  aria-label="Copy referral code"
                  className={style.itemIcon}
                >
                  <ContentCopyIcon fontSize="inherit" />
                </IconButton>
              </Tooltip>
            </div>
            <div className={`${style.content} ${style.emailContentWrap} ${style.noWrap}`} role="cell">
              {fmtDate(code.validFrom)} <span className={style.mutedSep}>to</span> {fmtDate(code.validTo)}
            </div>
            <div className={`${style.content} ${style.noWrap}`} role="cell">{fmtDate(code.createdAt)}</div>
            <div className={`${style.content} ${style.noWrap}`} role="cell">
              <span style={statusPillStyle(code.isActive, code.validFrom, code.validTo)}>{statusLabel}</span>
            </div>
            <div className={`${style.content} ${style.actionsCol}`} role="cell">
              <div className={style.dropdownContainer}>
                <Dropdown>
                  {isMobile ? (
                    <Dropdown.Toggle
                      id={`rc-actions-${code.id}`}
                      className={isMobile ? style.actionsButtonMobile : style.iconToggle}
                    >
                      Manage Code
                    </Dropdown.Toggle>
                  ) : (
                    <Dropdown.Toggle
                      variant="link"
                      aria-label="Actions"
                      id={`rc-actions-${code.id}`}
                      className={`${style.dropdownToggle} ${style.dropdownToggleBase}`}
                    >
                      <img
                        src={menuOptionIcon}
                        className={style.moreActionIcon}
                        alt=""
                      />
                    </Dropdown.Toggle>
                  )}

                  <Dropdown.Menu className={style.dropdownCard} align="end">
                    <Dropdown.Item
                      className={style.itemRow}
                      onClick={() => copyToClipboard(code.shareLink)}
                    >
                      <ContentCopyIcon fontSize="small" className={style.itemIconMUI} />
                      Copy Link
                    </Dropdown.Item>

                    <Dropdown.Item
                      className={style.itemRow}
                      onClick={() => { setSelectedCode(code); setQrOpen(true); }}
                    >
                      <QrCode2Icon fontSize="small" className={style.itemIconMUI} />
                      View QR
                    </Dropdown.Item>

                    <Dropdown.Item
                      className={style.itemRow}
                      onClick={() => onEdit?.(code)}
                    >
                      <EditIcon fontSize="small" className={style.itemIconMUI} />
                      Edit
                    </Dropdown.Item>

                    <Dropdown.Item
                      className={`${style.itemRow} ${style.destructive}`}
                      onClick={() => onDelete?.(code.id)}
                    >
                      <DeleteIcon fontSize="small" className={style.itemIconMUI} />
                      Delete
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            </div>
          </div>
        );
      })}

      {/* QR Modal */}
      {selectedCode && (
        <QRCodeModal
          isOpen={qrOpen}
          onClose={() => { setQrOpen(false); setSelectedCode(null); }}
          shareLink={selectedCode.shareLink}
          codeName={selectedCode.name}
          instructionsUrl={selectedCode.instructionsUrl}
        />
      )}
    </div>
  );
};

export default ReferralCodesTable;
