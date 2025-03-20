// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Dashboard from "./components/Dashboard";
// import Section from "./components/Section";

// function App() {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<Dashboard />} />
//         <Route path="/section/:id" element={<Section />} />
//       </Routes>
//     </Router>
//   );
// }

// export default App;


import React, { useState } from "react";
import Dashboard from "./components/Dashboard";
import Section from "./components/Section";

function App() {
  const [selectedSection, setSelectedSection] = useState(null);

  return (
    <div>
      {selectedSection ? (
        <Section section={selectedSection} onBack={() => setSelectedSection(null)} />
      ) : (
        <Dashboard onSelectSection={setSelectedSection} />
      )}
    </div>
  );
}

export default App;
