import React, { useMemo, useState } from "react";
import clsx from "clsx";
import { Button, Spinner } from "react-bootstrap";
import DownloadIcon from "@mui/icons-material/Download";
import DatePicker from "../../../components/DatePicker/DatePicker";
import ResponseToast from "../../../components/ToastMessage/ResponseToast";
import dayjs from "dayjs";
import { useDownloadStatsReport } from "../../../hooks/reports/useDownloadStatsReport";
import { buildApiParams } from "../../../utils/helper";
import style from "../Reports.module.css";

const toYMD = (d) => d.toISOString().slice(0, 10);
const calcRange = (range) => {
  const today = new Date();
  const to = toYMD(today);
  const back = (days) => {
    const dt = new Date(today);
    dt.setDate(dt.getDate() - days);
    return toYMD(dt);
  };
  switch (range) {
    case "LAST_7":  return { from_date: back(7),  to_date: to };
    case "LAST_30": return { from_date: back(30), to_date: to };
    case "LAST_90": return { from_date: back(90), to_date: to };
    case "ALL":     return { from_date: null,     to_date: null };
    default:        return { from_date: null,     to_date: null };
  }
};

export const StatsReportPanel = () => {
  const [range, setRange] = useState("LAST_7");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [downloading, setDownloading] = useState(false);

  const [showToast, setShowToast] = useState(false);
  const [toastType, setToastType] = useState("success");
  const [toastMessage, setToastMessage] = useState("");

  const { mutate: downloadStats } = useDownloadStatsReport();

  const payload = useMemo(() => {
    if (range === "CUSTOM") return { from_date: fromDate || null, to_date: toDate || null };
    return calcRange(range);
  }, [range, fromDate, toDate]);

  const onQuickRange = (r) => {
    setRange(r);
    if (r !== "CUSTOM") { setFromDate(""); setToDate(""); }
  };

  const validate = () => {
    if (range === "CUSTOM") {
      if (!fromDate || !toDate) {
        setToastType("error"); setToastMessage("Please pick both From and To dates."); setShowToast(true);
        return false;
      }
      if (dayjs(toDate).isBefore(dayjs(fromDate), "day")) {
        setToastType("error"); setToastMessage("To date should be greater than or equal to From date."); setShowToast(true);
        return false;
      }
    }
    return true;
  };

  const handleDownload = () => {
    if (!validate()) return;
    setDownloading(true);
    const apiParams = buildApiParams(payload); 
    downloadStats({ ...apiParams, __rangeLabel: range }, {
      onSuccess: ({ filename }) => {
        setToastType("success");
        setToastMessage(`Downloaded ${filename}.`);
        setShowToast(true);
      },
      onError: (err) => {
        const msg = err?.message || "Failed to download CSV.";
        setToastType("error");
        setToastMessage(msg);
        setShowToast(true);
      },
      onSettled: () => setDownloading(false),
    });
  };

  const clearCustom = () => { setFromDate(""); setToDate(""); };

  return (
    <div className={style.controlsCard}>
      {/* Quick ranges */}
      <div className={style.quickRow}>
        <div className={style.quickLeft}>
          <span className={style.label}>Quick range</span>
          <button className={clsx(style.chip, range === "LAST_7" && style.chipActive)}  onClick={() => onQuickRange("LAST_7")}>Last 7 days</button>
          <button className={clsx(style.chip, range === "LAST_30" && style.chipActive)} onClick={() => onQuickRange("LAST_30")}>Last 30 days</button>
          <button className={clsx(style.chip, range === "LAST_90" && style.chipActive)} onClick={() => onQuickRange("LAST_90")}>Last 90 days</button>
          <button className={clsx(style.chip, range === "ALL" && style.chipActive)}     onClick={() => onQuickRange("ALL")} title="Omit dates to fetch all rows">ALL</button>
          <button className={clsx(style.chip, range === "CUSTOM" && style.chipActive)}  onClick={() => onQuickRange("CUSTOM")}>Custom</button>
        </div>
      </div>

      {/* Custom range */}
      <div className={clsx(style.dateRow, range !== "CUSTOM" && style.customDisabled)}>
        <div className={style.dateField}>
          <label className={style.dateLabel}>From</label>
          <DatePicker
            isFilter
            label="From date"
            dateValue={fromDate}
            onChange={(iso) => setFromDate(iso)}
            maxDate={toDate ? dayjs(toDate) : undefined}
          />
        </div>
        <div className={style.dateField}>
          <label className={style.dateLabel}>To</label>
          <DatePicker
            isFilter
            label="To date"
            dateValue={toDate}
            onChange={(iso) => setToDate(iso)}
            minDate={fromDate ? dayjs(fromDate) : undefined}
          />
        </div>
        <Button variant="outline-secondary" onClick={clearCustom} disabled={range !== "CUSTOM"} className={style.clearBtn}>
          Clear
        </Button>
      </div>

      {/* Action */}
      <div className={style.actionsRow}>
        <Button
          className={clsx("tdei-primary-button", style.downloadBtn)}
          onClick={handleDownload}
          disabled={downloading}
          title="Download CSV"
        >
           {downloading ? (
            <Spinner size="sm" />
          ) : (
            <>
              <DownloadIcon className="me-2" />  {downloading ? "Downloading…" : "Download CSV"}
            </>
          )}
        </Button>
      </div>

      <ResponseToast
        showtoast={showToast}
        handleClose={() => setShowToast(false)}
        message={toastMessage}
        type={toastType}
        autoHideDuration={3000}
      />
    </div>
  );
};
