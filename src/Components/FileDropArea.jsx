import { useEffect, useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileUpload } from "@fortawesome/free-solid-svg-icons";

const FileDropArea = ({ onFile = file => { }, checkFile = file => true, supportedFileExtensions = [] }) => {
   const [fileDropAreaState, setFileDropAreaState] = useState("");
   const [fileDropAreaError, setFileDropAreaError] = useState(null);
   const [attachedFile, setAttachedFile] = useState(null);

   const onDragEnterHandler = event => setFileDropAreaState("withFile");
   const onDragOverHandler = event => event.preventDefault();
   const onDragLeaveHandler = event => setFileDropAreaState("");

   const onDropHandler = event => {
      event.preventDefault();
      event.stopPropagation();
      setFileDropAreaState("");
      setFileDropAreaError(null);

      const droppedFiles = [...event.dataTransfer.files];
      const droppedItems = [...event.dataTransfer.items];

      if (droppedFiles.length !== 0) setAttachedFile(droppedFiles[0]);
      else {
         let uploadedFile = false;
         for (let index = 0; index < droppedItems.length; index++)
            if (droppedItems[index].kind === "file") {
               setAttachedFile(droppedItems[0]);
               uploadedFile = true;
               break;
            }

         if (!uploadedFile) {
            console.warn("Upload type not allowed");
            setFileDropAreaError("Upload type not allowed")
            setAttachedFile(null);
         }
      }
   }

   const onChangeInputHandler = event => setAttachedFile(event.target.files[0]);

   useEffect(() => {
      if (!attachedFile || !checkFile(attachedFile)) {
         setAttachedFile(null);
         if (attachedFile && !checkFile(attachedFile)) setFileDropAreaError("File type not allowed");
         onFile();
         return;
      }

      setFileDropAreaError(null);
      onFile(attachedFile);
   }, [attachedFile, onFile, checkFile]);

   return (
      <div className={`fileDropArea ${fileDropAreaState}`}>
         <label name="fileDropAreaInput" onDrop={onDropHandler} onDragOver={onDragOverHandler} onDragEnter={onDragEnterHandler} onDragLeave={onDragLeaveHandler}>
            <input type="file" name="fileDropAreaInput" onChange={onChangeInputHandler} />
            <p className="mainText taCenter weUnder" style={{ display: "flex", justifyContent: "center" }}>
               <FontAwesomeIcon className="inlineIcon" icon={faFileUpload} size="6x" />
               Click to select or Drag & Drop a file
            </p>
            {
               supportedFileExtensions.length !== 0 &&
               <p className="normalText taCenter weUnder accentColor">
                  supports: <span className="tdUnderline">{supportedFileExtensions.join(", ")}</span>
               </p>
            }
            {attachedFile && <p className="normalText taCenter weUnder primaryColor">{attachedFile?.name}</p>}
            {fileDropAreaError && <p className="mainText taCenter weUnder errorColor">{fileDropAreaError}</p>}
         </label>
      </div>
   );
}

export default FileDropArea;