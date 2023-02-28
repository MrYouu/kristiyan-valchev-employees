import { useCallback, useEffect, useState } from "react";

import { supportedFileTypes, getFileExtension, readFileContent, constructRawDataObject, getDate, getFormattedDate } from "../../Utilities/services";

import Spacer from "../Spacer";
import Table from "../Table";
import FileDropArea from "../FileDropArea";

function Index() {
   const [fileContent, setFileContent] = useState([]);
   const [workedTogetherData, setWorkedTogetherData] = useState([]);

   const onFileHandler = useCallback(file => {
      if (file) {
         const fileExtension = getFileExtension(file);
         readFileContent(file, fileExtension).then(res => setFileContent(constructRawDataObject(res, fileExtension)));
      }
      else setFileContent([]);
   }, []);

   const checkFileHandler = useCallback(file => {
      const fileExtension = getFileExtension(file);
      if (!supportedFileTypes.includes(fileExtension)) return false;
      return true;
   }, []);

   useEffect(() => {
      if (fileContent.length === 0) return;

      const readyData = Object.values(fileContent.map(thisElement => {
         const dateTo = !thisElement.dateTo ? getDate() : thisElement.dateTo;

         return {
            employeeID: thisElement.employeeID,
            projectID: thisElement.projectID,
            timeWorked: dateTo - thisElement.dateFrom,
         };
      }).reduce((previousValue, currentValue) => {
         (previousValue[currentValue.projectID] = previousValue[currentValue.projectID] || []).push(currentValue);
         return previousValue;
      }, {})).map(thisElement => {
         return thisElement.sort((a, b) => {
            if (a.timeWorked < b.timeWorked) return 1;
            if (a.timeWorked > b.timeWorked) return -1;
            return 0;
         });
      }).sort((a, b) => {
         if (a[0].timeWorked + a[1]?.timeWorked < b[0].timeWorked + b[1]?.timeWorked) return 1;
         if (a[0].timeWorked + a[1]?.timeWorked > b[0].timeWorked + b[1]?.timeWorked) return -1;
         return 0;
      });

      setWorkedTogetherData({
         employeeID1: readyData[0][0]?.employeeID,
         employeeID2: readyData[0][1]?.employeeID,
      });
   }, [fileContent]);

   return (
      <>
         <Spacer height="20px" />
         <h1 className="mainText taCenter weUnder">Pair of employees who have worked <span className="primaryColor">together</span></h1>
         <p className="normalText taCenter">
            Identifies the pair of employees who have worked together on common projects for the longest period of time.
         </p>

         <FileDropArea onFile={onFileHandler} checkFile={checkFileHandler} supportedFileExtensions={supportedFileTypes} />

         {
            fileContent.length === 0 &&
            <p className="normalText taCenter fsItalic">No file selected yet</p>
         }
         <Spacer height="60px" />
         {
            fileContent.length !== 0 && (<>
               <h2 className="mainText primaryColor">Worked together</h2>
               <Table
                  headElements={[
                     "Employee ID 1",
                     "Employee ID 2",
                     "Project ID",
                     "Days worked",
                  ]}
                  bodyElements={
                     Object.values(fileContent.filter(thisElement => thisElement.employeeID === workedTogetherData.employeeID1 ||
                        thisElement.employeeID === workedTogetherData.employeeID2).reduce((previousValue, currentValue) => {
                           (previousValue[currentValue.projectID] = previousValue[currentValue.projectID] || []).push(currentValue);
                           return previousValue;
                        }, {})).filter(thisElement => thisElement.length === 2).map(thisElement => {
                           const dateToEmployee1 = !thisElement[0].dateTo ? getDate() : thisElement[0].dateTo;
                           const dateToEmployee2 = !thisElement[1].dateTo ? getDate() : thisElement[1].dateTo;

                           return [
                              thisElement[0].employeeID,
                              thisElement[1].employeeID,
                              thisElement[0].projectID,
                              `${parseInt(((dateToEmployee1 - thisElement[0].dateFrom) + (dateToEmployee2 - thisElement[1].dateFrom)) / 1000 / 60 / 60 / 24)} days`,
                           ];
                        })
                  }
               />

               <h2 className="mainText">Raw data</h2>
               <Table
                  headElements={[
                     "Employee ID",
                     "Project ID",
                     "From date",
                     "To date",
                  ]}
                  bodyElements={fileContent.map(thisElement => {
                     return [
                        thisElement.employeeID,
                        thisElement.projectID,
                        getFormattedDate(thisElement.dateFrom),
                        (<span className={thisElement.dateTo === null ? "fsItalic" : ""}>
                           {thisElement.dateTo === null ? "present" : getFormattedDate(thisElement.dateTo)}
                        </span>),
                     ];
                  })}
               />
            </>)
         }
      </>
   );
}

export default Index;