import React, { useState } from "react";
import { Button } from "react-bootstrap";
import { CopyToClipboard } from "react-copy-to-clipboard";
import style from "../../components/UserHeader/UserHeader.module.css"
///
/// Copy to ClipBoard Component
///
function ClipboardCopy({ copyText, copyTitle }) {
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
    <div className={ copyTitle == "Id" ? style.apiKey:style.projectId}>
      <div style={{display: "flex"}}>
      <div  style={{ width:  copyTitle != "Id" ? "80px" : null}}>{copyTitle} : </div>
      <div className={style.maskedKey}>
        <div className={style.keyVisible}>{copyText}</div>
        <div className={style.buttonContainer}>
          <CopyToClipboard text={copyText} onCopy={() => handleCopyClick()}>
            <Button variant="link">{isCopied ? "Copied!" : "Copy"}</Button>
          </CopyToClipboard>
        </div>
      </div>
      </div>
    </div>
  );
}
export default ClipboardCopy;