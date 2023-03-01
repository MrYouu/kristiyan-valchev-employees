import papaparse from "papaparse";

//* Variables
export const supportedFileTypes = [
   "csv",
   "json",
   "xml",
];

//* File related functions
export function getFileExtension(file) {
   return file?.name?.slice(file?.name?.lastIndexOf(".") + 1);
}

//* Date related functions
export function getDate() {
   return parseInt(new Date().getTime());
}

export function getFormattedDate(date) {
   const thisDate = new Date(date);
   const thisDateFormatted = thisDate.toLocaleString("pt-BR");

   const year = parseInt(thisDateFormatted.split(" ")[0].split("/")[2]);
   const month = parseInt(thisDateFormatted.split(" ")[0].split("/")[1]);
   const day = parseInt(thisDateFormatted.split(" ")[0].split("/")[0]);

   return `${getMonthText(month)} ${day}, ${year}`;
}

export function getMonthText(month) {
   switch (month) {
      case 1: return "Jan";
      case 2: return "Feb";
      case 3: return "Mar";
      case 4: return "Apr";
      case 5: return "May";
      case 6: return "Jun";
      case 7: return "Jul";
      case 8: return "Aug";
      case 9: return "Sep";
      case 10: return "Oct";
      case 11: return "Nov";
      case 12: return "Dec";

      default: break;
   }
}

export function getTimeTogether(employeeData1, employeeData2) {
   if (employeeData1.dateFrom >= employeeData2.dateFrom && employeeData1.dateFrom <= employeeData2.dateTo)
      (employeeData1.workedWith = employeeData1.workedWith || {})[employeeData2.employeeID] = employeeData2.dateTo - employeeData1.dateFrom;
   if (employeeData1.dateFrom <= employeeData2.dateFrom && employeeData1.dateTo >= employeeData2.dateFrom)
      (employeeData1.workedWith = employeeData1.workedWith || {})[employeeData2.employeeID] = employeeData1.dateTo - employeeData2.dateFrom;
   if (employeeData1.dateFrom <= employeeData2.dateFrom && employeeData1.dateTo >= employeeData2.dateTo)
      (employeeData1.workedWith = employeeData1.workedWith || {})[employeeData2.employeeID] = employeeData2.dateTo - employeeData2.dateFrom;
   if (employeeData1.dateFrom >= employeeData2.dateFrom && employeeData1.dateTo <= employeeData2.dateTo)
      (employeeData1.workedWith = employeeData1.workedWith || {})[employeeData2.employeeID] = employeeData1.dateTo - employeeData1.dateFrom;

   return employeeData1;
}

//* Other functions
export function readFileContent(file, fileType) {
   return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = async ({ target }) => {
         switch (fileType) {
            case "csv":
               const csvObject = papaparse.parse(target.result);
               return resolve(csvObject?.data);

            case "json":
               return resolve(JSON.parse(target?.result ?? ""));

            case "xml":
               const parser = new DOMParser();
               const xmlObject = parser.parseFromString(target?.result, "application/xml");
               return resolve([...xmlObject.getElementsByTagName("item")].map(thisElement => {
                  return {
                     employeeID: thisElement.getElementsByTagName("employeeID")[0]?.textContent ?? "",
                     projectID: thisElement.getElementsByTagName("projectID")[0]?.textContent ?? "",
                     dateFrom: thisElement.getElementsByTagName("dateFrom")[0]?.textContent ?? "",
                     dareTo: thisElement.getElementsByTagName("dateTo")[0]?.textContent ?? null,
                  }
               }));

            default: return resolve([]);
         }
      };
      reader.readAsText(file);
   });
}

export function constructRawDataObject(data, fromFileType) {
   return data["map"] && ((fromFileType === "csv" && data[0]?.length >= 3) || ["json", "xml"].includes(fromFileType)) ? data.map(thisElement => {
      if (["json", "xml"].includes(fromFileType)) thisElement = Object.values(thisElement);

      const dateFromValues = thisElement[2]?.split("-");
      const dateToValues = thisElement[3]?.split("-");

      //? Dates are calculated like that because of Safari support
      return {
         employeeID: thisElement[0],
         projectID: thisElement[1],
         dateFrom: parseInt(new Date(`${dateFromValues[1]}-${dateFromValues[2]}-${dateFromValues[0]}`).getTime()),
         dateTo: !thisElement[3] || thisElement[3] === "NULL" ? getDate() : parseInt(new Date(`${dateToValues[1]}-${dateToValues[2]}-${dateToValues[0]}`).getTime()),
      };
   }) : [];
}