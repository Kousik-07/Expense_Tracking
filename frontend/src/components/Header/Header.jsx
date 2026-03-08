import React from 'react'
import { FaRegUserCircle } from "react-icons/fa";
import { LuSquareMenu } from "react-icons/lu";
import { useState } from "react";
import { RxCrossCircled } from "react-icons/rx";
import {  NavLink, useNavigate } from 'react-router-dom';
import { RiLogoutCircleRLine } from "react-icons/ri";
import { toast } from 'react-toastify';
import http from '../../utils/http';
function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate=useNavigate()
  // Logout
  const logout = async() => {
    try {
      await http.get("/api/user/logout")
      navigate("/")
    } catch (error) {
      return toast.error(error.response ? error.response.data.message : error.message)
    }
  }
  return (
    <div>
      <nav className="bg-white shadow-sm px-10 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold text-gray-800">
            Fin<span className="text-green-500 text-4xl">Track</span>
          </h1>
        </div>
        <ul className="hidden gap-8 text-gray-600 font-medium md:flex">
          <NavLink
            to={"/app"}
            className={({ isActive }) =>
              isActive ? "text-green-500 border-b-2 border-green-500 pb-1" : ""
            }
            end
          >
            <li>Dashboard</li>
          </NavLink>
          <NavLink
            to={"/app/transactions"}
            className={({ isActive }) =>
              isActive
                ? "text-green-500 border-b-2 border-green-500 pb-1"
                : "hover:text-green-500 cursor-pointer"
            }
          >
            <li>Transactions</li>
          </NavLink>
          <NavLink
            to={"/app/budget"}
            className={({ isActive }) =>
              isActive
                ? "text-green-500 border-b-2 border-green-500 pb-1"
                : "hover:text-green-500 cursor-pointer"
            }
          >
            <li>Budget</li>
          </NavLink>
          <NavLink
            to={"/app/goals"}
            className={({ isActive }) =>
              isActive
                ? "text-green-500 border-b-2 border-green-500 pb-1"
                : "hover:text-green-500 cursor-pointer"
            }
          >
            <li>Goals</li>
          </NavLink>
          <NavLink
            to={"/app/reports"}
            className={({ isActive }) =>
              isActive
                ? "text-green-500 border-b-2 border-green-500 pb-1"
                : "hover:text-green-500 cursor-pointer"
            }
          >
            <li>Reports</li>
          </NavLink>
        </ul>
        <div className="flex gap-6">
          <div className="profile text-3xl">
            <NavLink to={"profile"}>
              <FaRegUserCircle />
            </NavLink>
          </div>
          <button
          onClick={logout}
            className="logout text-3xl hidden md:flex cursor-pointer">
              <RiLogoutCircleRLine />
          </button>
          <div className="text-3xl md:hidden">
            <button onClick={() => setMenuOpen(true)}>
              <LuSquareMenu />
            </button>
          </div>
        </div>
      </nav>

      {menuOpen && (
        <div
          onClick={() => setMenuOpen(false)}
          className="fixed inset-0 bg-black bg-opacity-40 z-40"
        ></div>
      )}
      {/* Side Menu */}
      <div
        className={`
        fixed top-0 right-0 h-full w-64 bg-white shadow-lg z-50
        transform transition-transform duration-300
        ${menuOpen ? "translate-0" : "translate-x-full"}
      `}
      >
        {/* Close Button */}
        <div className="flex p-4 text-3xl">
          <button onClick={() => setMenuOpen(false)}>
            <RxCrossCircled />
          </button>
        </div>
        {/* Menu Items */}
        <ul className="flex flex-col gap-5 px-6 font-medium text-2xl">
          <NavLink
            to="/app"
            end
            onClick={() => setMenuOpen(false)}
            className={({ isActive }) =>
              isActive ? "text-green-500 border-b-2 border-green-500 pb-2" : ""
            }
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/app/transactions"
            onClick={() => setMenuOpen(false)}
            className={({ isActive }) =>
              isActive ? "text-green-500 border-b-2 border-green-500 pb-2" : ""
            }
          >
            Transactions
          </NavLink>

          <NavLink
            to="/app/budget"
            onClick={() => setMenuOpen(false)}
            className={({ isActive }) =>
              isActive ? "text-green-500 border-b-2 border-green-500 pb-2" : ""
            }
          >
            Budget
          </NavLink>

          <NavLink
            to="/app/goals"
            onClick={() => setMenuOpen(false)}
            className={({ isActive }) =>
              isActive ? "text-green-500 border-b-2 border-green-500 pb-2" : ""
            }
          >
            Goals
          </NavLink>

          <NavLink
            to="/app/reports"
            onClick={() => setMenuOpen(false)}
            className={({ isActive }) =>
              isActive ? "text-green-500 border-b-2 border-green-500 pb-2" : ""
            }
          >
            Reports
          </NavLink>

        </ul>
        <div className='flex justify-center pt-5'>
          <button onClick={logout} className='bg-blue-400 text-white p-2 text-2xl rounded-xl'>
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
}

export default Header
