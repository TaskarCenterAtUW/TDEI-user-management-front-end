import React, { useState } from "react";
import copyIcon from "../../assets/img/copy-icon.svg";
import copiedIcon from "../../assets/img/clipboard-copied.svg"
///
/// Copy to ClipBoard Component
///
function ClipboardCopy({ copyText }) {
  const [isCopied, setIsCopied] = useState(false);

  async function copyTextToClipboard(text) {
    if ('clipboard' in navigator) {
      return await navigator.clipboard.writeText(text);
    } else {
      console.log('error in copying!');
    }
  }

  // onClick handler function for the copy button
  const handleCopyClick = () => {
    copyTextToClipboard(copyText)
      .then(() => {
        setIsCopied(true);
        setTimeout(() => {
          setIsCopied(false);
        }, 1500);
      })
      .catch((err) => {
        console.log(err);
      });
  }
  return (

    <div className="input-group" style={{
      minWidth: "400px",
      marginTop: "10px"
    }}>
      <input className="form-control" type="text" value={copyText} readOnly />
      <div className="input-group-append">
        <button className="btn btn-outline-secondary" style={{
          borderRadius: "0px 5px 5px 0px", borderLeft: "none",
          borderColor: "lightgray"
        }} onClick={handleCopyClick} alt="Copy ID">
          <img src={ isCopied? copiedIcon : copyIcon} alt="Copy" />
        </button>
      </div>
    </div>

  );
}
export default ClipboardCopy;