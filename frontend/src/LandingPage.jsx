import React from 'react'
import { NavLink, Outlet } from 'react-router-dom';
import expenses from "./assets/expenses.png";

function LandingPage() {
  return (
    <>
      <div className="bg-linear-to-br min-h-screen from-green-200 to-white">
        {/* ================= NAVBAR ================= */}
        <nav className="max-w-7xl mx-auto flex items-center justify-between py-6 px-6">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-gray-800">
              Fin<span className="text-green-500 text-4xl">Track</span>
            </h1>
          </div>
          {/* Buttons */}
          <div className="flex items-center gap-4">
            <NavLink to={"/login"}>
              <button className="text-gray-600  cursor-pointer">Login</button>
            </NavLink>
            <NavLink to={"/signup"}>
              <button
                className="
                      bg-green-500 text-white px-6 py-2.5 rounded-full
                        transition-all duration-200 ease-in-out
                        shadow-[8px_8px_18px_#00000030,-8px_-8px_18px_#ffffff40]
                        hover:shadow-[4px_4px_10px_#00000030,-4px_-4px_10px_#ffffff40]
                        active:shadow-[inset_6px_6px_14px_#00000035,inset_-6px_-6px_14px_#ffffff40]
                        active:scale-95
                    "
              >
                Sign Up
              </button>
            </NavLink>
          </div>
        </nav>
        {/* ================= HERO SECTION ================= */}
        <section className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* LEFT CONTENT */}
          <div>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              We're here to <br />
              Manage your <br />
              Budget
            </h1>
            {/* Curve Line */}
            <div className="w-48 h-2 bg-green-400 rounded-full my-6" />
            <p className="text-gray-600 max-w-md">
              Let's make your work more organize and easily using the Taskio
              Dashboard with many of the latest features in managing work every
              day.
            </p>
          </div>
          {/* RIGHT IMAGE SECTION */}
          <div className="relative flex justify-center">
            {/* Background Shape */}
            <div className="absolute bg-green-200 w-72 h-96 rounded-3xl flex items-end overflow-hidden">
              <img src={expenses} className="w-full shadow-3xl " alt="person" />
            </div>
            {/* Main Image */}
            {/* Floating Card */}
            <div className="absolute top-8 left-0 md:left-20 bg-white px-4 py-2 rounded-lg shadow-md">
              <p className="text-sm text-gray-500">Enter amount</p>
              <p className="font-bold">$450.00</p>
            </div>
            {/* Income Card */}
            <div className="absolute right-0 md:right-20 bg-white px-4 py-2 rounded-lg shadow-md">
              <p className="text-sm text-gray-500">Total Income</p>
              <p className="font-bold">$245.00</p>
            </div>
            <div className="absolute top-50 right-0 md:right-20 bg-white px-4 py-2 rounded-lg shadow-md">
              <p className="text-sm text-gray-500">Total Expense</p>
              <p className="font-bold">$345.00</p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

export default LandingPage
