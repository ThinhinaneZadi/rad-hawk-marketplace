// App.jsx
// CHANGE: Added /sell route pointing to SellItem page

import { Routes, Route } from "react-router-dom";
import { AuthProvider }  from "./context/AuthContext";

import Navbar        from "./components/Navbar";
import Footer        from "./components/Footer";
import CustomCursor  from "./components/CustomCursor";

import Home          from "./pages/Home";
import Marketplace   from "./pages/Marketplace";
import ItemDetails   from "./pages/ItemDetails";
import ContactSeller from "./pages/ContactSeller";
import Safety        from "./pages/Safety";
import Support       from "./pages/Support";
import Auth          from "./pages/Auth";
import Dashboard     from "./pages/Dashboard";
import SellItem      from "./pages/SellItem";    // NEW

import "./App.css";

export default function App() {
  return (
    <AuthProvider>
      <CustomCursor />
      <Navbar />

      <Routes>
        <Route path="/"               element={<Home />} />
        <Route path="/marketplace"    element={<Marketplace />} />
        <Route path="/item/:id"       element={<ItemDetails />} />
        <Route path="/contact-seller" element={<ContactSeller />} />
        <Route path="/safety"         element={<Safety />} />
        <Route path="/support"        element={<Support />} />
        <Route path="/auth"           element={<Auth />} />
        <Route path="/dashboard"      element={<Dashboard />} />
        <Route path="/sell"           element={<SellItem />} />   {/* NEW */}
      </Routes>

      <Footer />
    </AuthProvider>
  );
}
