import { Routes, Route } from "react-router-dom";

import Index from "./Components/Routes/Index";
import Error404 from "./Components/Routes/Error404";

function App() {
   return (
      <Routes>
         <Route index element={<Index />} />
         <Route path="*" element={<Error404 />} />
      </Routes>
   );
}

export default App;