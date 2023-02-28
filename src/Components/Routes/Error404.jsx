import { useNavigate } from "react-router-dom";

import Button from "../Button";
import Spacer from "../Spacer";

function Error404() {
   const navigateTo = useNavigate();

   return (
      <div className="page404Holder">
         <h1 className="mainText taCenter fw9" style={{ fontSize: "190px", lineHeight: "160px" }}>
            4<span style={{ fontSize: "260px" }}>0</span>4
         </h1>
         <p className="normalText taCenter">Looks like you are lost. No worries, there is always a way back</p>
         <Spacer height="40px" />
         <Button text="Home" className="secondary aCenter" onClick={() => { navigateTo("/"); }} />
      </div>
   );
}

export default Error404;