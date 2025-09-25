import React, { useEffect, useState, useCallback } from "react";
import { Modal, Button } from "react-bootstrap";
import QRCode from "qrcode";
import ResponseToast from "../ToastMessage/ResponseToast";
import style from "./QRCodeModal.module.css";

export default function QRCodeModal({
  isOpen,
  onClose,
  shareLink,
  codeName,
  instructionsUrl,
}) {
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [toastType, setToastType] = useState("success");

  // Generate QR when opened
  useEffect(() => {
    let cancelled = false;
    async function gen() {
      if (!isOpen || !shareLink) return;
      try {
        const url = await QRCode.toDataURL(shareLink, {
          width: 256,
          margin: 2,
          color: { dark: "#1f2937", light: "#ffffff" },
        });
        if (!cancelled) setQrCodeDataUrl(url);
      } catch {
        if (!cancelled) {
          setToastMsg("Failed to generate QR code");
          setToastType("error");
          setShowToast(true);
        }
      }
    }
    gen();
    return () => { cancelled = true; };
  }, [isOpen, shareLink]);

  const downloadQRCode = useCallback(() => {
    if (!qrCodeDataUrl) return;
    const link = document.createElement("a");
    link.download = `${(codeName || "referral").replace(/\s+/g, "-")}-qr-code.png`;
    link.href = qrCodeDataUrl;
    link.click();
    setToastMsg("QR code downloaded successfully");
    setToastType("success");
    setShowToast(true);
  }, [qrCodeDataUrl, codeName]);

  return (
    <>
      <Modal
        show={!!isOpen}
        onHide={onClose}
        size={instructionsUrl ? "lg" : "md"}
        centered
        scrollable
        fullscreen="sm-down"
        aria-labelledby="qr-modal-title"
        dialogClassName={style.dialogSized}     // ensure good max-height
        contentClassName={style.contentFlex}    // make content flex column
      >
        <Modal.Header closeButton>
          <Modal.Title id="qr-modal-title">QR Code for {codeName}</Modal.Title>
        </Modal.Header>

        {/* This body itself scrolls (React-Bootstrap + our CSS) */}
        <Modal.Body className={style.modalBody}>
           <div className={`${style.grid} ${!instructionsUrl ? style.single : ""}`}>
            {/* Left: QR + link + actions */}
            <div className={style.qrCol}>
              {qrCodeDataUrl && (
                <img
                  src={qrCodeDataUrl}
                  alt={`QR Code for ${codeName}`}
                  className={style.qrImage}
                />
              )}

              <div className={style.linkWrap}>
                <div className={style.linkLabel}>Share Link:</div>
                <div className={style.linkText}>{shareLink}</div>
              </div>

              <div className={style.btnRow}>
                <Button
                  onClick={downloadQRCode}
                  className="tdei-primary-button"
                  disabled={!qrCodeDataUrl}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" className="me-2" aria-hidden="true">
                    <path d="M5 20h14v-2H5v2zm7-18v10.17l3.59-3.58L17 10l-5 5-5-5 1.41-1.41L11 12.17V2h1z" fill="currentColor"/>
                  </svg>
                  Download QR Code
                </Button>
                <Button
                  variant="outline-secondary"
                  className="tdei-secondary-button"
                  onClick={onClose}
                >
                  Close
                </Button>
              </div>
            </div>

            {/* Right: instructions preview (iframe scrolls itself) */}
            {instructionsUrl && (
              <div className={style.previewCol}>
                <div>
                  <div className={style.previewLabel}>Instructions Preview</div>
                  <div className={style.previewNote}>{instructionsUrl}</div>
                </div>
                <div className={style.iframeWrap}>
                  <iframe
                    src={instructionsUrl}
                    title="Instructions Preview"
                    className={style.iframe}
                  />
                </div>
                <div className="text-center">
                  <Button
                    variant="outline-secondary"
                    className="tdei-secondary-button"
                    size="sm"
                    onClick={() => window.open(instructionsUrl, "_blank")}
                  >
                    Open in New Tab
                  </Button>
                </div>
              </div>
            )}
          </div>
        </Modal.Body>
      </Modal>

      <ResponseToast
        showtoast={showToast}
        handleClose={() => setShowToast(false)}
        message={toastMsg}
        type={toastType}
        autoHideDuration={2500}
      />
    </>
  );
}
