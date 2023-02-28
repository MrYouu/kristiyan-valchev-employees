function Table({ headElements = [], bodyElements = [] }) {
   return (
      <div className="normalTable">
         <div className="normalTableContent">
            <table>
               <thead>
                  <tr>
                     {
                        headElements?.map((thisElements, index) => {
                           return (
                              <th key={index}><h3 className="mainText total">{thisElements}</h3></th>
                           );
                        })
                     }
                  </tr>
               </thead>
               <tbody className="normalTableContentDivider"></tbody>
               <tbody>
                  {
                     bodyElements?.length !== 0 && bodyElements?.map((thisRow, index) => {
                        return (
                           <tr key={index}>
                              {
                                 thisRow.map((thisElement, index) => {
                                    return (
                                       <td key={index}>{thisElement}</td>
                                    );
                                 })
                              }
                           </tr>
                        );
                     })
                  }
                  {
                     bodyElements?.length === 0 &&
                     <tr>
                        <td colSpan={headElements.length}>
                           <p className="normalText total taCenter fsItalic">No items yet</p>
                        </td>
                     </tr>
                  }
               </tbody>
            </table>
         </div>
      </div>
   );
}

export default Table;