import { Outlet } from "react-router-dom";

export default function AdminLayout() {
  return (
    <div className="m-4 p-4 flex flex-col h-screen border-r border-gray-200">
      <h1 className="text-2xl font-bold">This is admin layout</h1>
      <div className="flex-1 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
}