import { Routes, Route } from "react-router-dom";
import Sidebar from "./Sidebar";
import DashboardHome from "../pages/dashboard/Home";
import Items from "../pages/dashboard/Items";
import ItemData from "../pages/dashboard/ItemData";

export default function DashboardLayout() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-10 pt-14 h-screen">
      <div className="lg:col-span-2 h-full">
        <Sidebar />
      </div>
      <div className="lg:col-span-8 h-full overflow-y-scroll">
        <Routes>
          <Route path="/" element={<DashboardHome />} />
          <Route path="/items" element={<Items />} />
          <Route path="/items/:id" element={<ItemData />} />
          <Route path="/settings" element={<h1>Settings</h1>} />
        </Routes>
      </div>
    </div>
  );
}
