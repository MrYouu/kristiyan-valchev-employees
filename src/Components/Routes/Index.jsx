import { useCallback, useEffect, useState } from "react";

import { supportedFileTypes, getFileExtension, readFileContent, constructRawDataObject, getFormattedDate, getTimeTogether, getDate } from "../../Utilities/services";

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

      const readyData = Object.values(fileContent.reduce((previousValue, currentValue) => {
         (previousValue[currentValue.projectID] = previousValue[currentValue.projectID] || []).push(currentValue);
         return previousValue;
      }, {})).map(thisElement => {
         for (let index = 0; index < thisElement.length; index++)
            for (let index2 = 0; index2 < thisElement.length; index2++) {
               if (index === index2) continue;

               thisElement[index] = getTimeTogether(thisElement[index], thisElement[index2]);
            }

         return thisElement;
      }).reduce((previousValue, currentValue) => {
         const employeeDataWithColleague = currentValue.reduce((previousEmployeeData, currentEmployeeData) => {
            if (!currentEmployeeData.workedWith) return previousEmployeeData;

            return {
               ...currentEmployeeData,
               workedMostWithEmployeeID: Object.keys(currentEmployeeData.workedWith).reduce((previousEmployeeID, currentEmployeeID) => {
                  if (!previousEmployeeID || currentEmployeeData.workedWith[previousEmployeeID] < currentEmployeeData.workedWith[currentEmployeeID])
                     return currentEmployeeID;
                  return previousEmployeeID;
               }),
            };
         });
         if (!employeeDataWithColleague.workedWith) return previousValue;

         if (Object.keys(previousValue).length === 0 || previousValue.workedWith[previousValue.workedMostWithEmployeeID] < employeeDataWithColleague.workedWith[employeeDataWithColleague.workedMostWithEmployeeID])
            return employeeDataWithColleague;
         else return previousValue;
      }, {});

      setWorkedTogetherData({
         employeeID1: readyData.employeeID,
         employeeID2: readyData.workedMostWithEmployeeID,
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
                           thisElement[0] = getTimeTogether(thisElement[0], thisElement[1]);

                           return [
                              thisElement[0].employeeID,
                              thisElement[1].employeeID,
                              thisElement[0].projectID,
                              `${parseInt(thisElement[0].workedWith[thisElement[1].employeeID] / 1000 / 60 / 60 / 24)} days`,
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
                     const isPresent = getFormattedDate(thisElement.dateTo) === getFormattedDate(getDate());

                     return [
                        thisElement.employeeID,
                        thisElement.projectID,
                        getFormattedDate(thisElement.dateFrom),
                        (<span className={isPresent ? "fsItalic" : ""}>
                           {isPresent ? "present" : getFormattedDate(thisElement.dateTo)}
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