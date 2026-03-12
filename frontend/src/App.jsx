import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { ToastContainer } from "react-toastify";
import Guard from './Guard/Guard';
import { lazy, Suspense } from 'react';
import Loader from './components/Shared/Loader';
import { GoogleOAuthProvider } from "@react-oauth/google";

const AppLayout =lazy(()=>import('./components/Applayout/AppLayout'))
const Home =lazy(()=>import('./components/Home')) 
const Transactions =lazy(()=>import('./components/Transactions')) ;
const Budget =lazy(()=>import('./components/Budget')) ;
const Goals =lazy(()=>import('./components/Goals')) ;
const Reports =lazy(()=>import('./components/Reports')) ;
const Profile =lazy(()=>import('./components/Profile')) ;
const Signup =lazy(()=>import('./components/Signup')) ;
const Login =lazy(()=>import('./components/Login')) ;
const AuthLayout =lazy(()=>import('./components/Applayout/AuthLayout')) ;
const LandingPage =lazy(()=>import('./LandingPage')) ;
const PageNotFound =lazy(()=>import('./components/pageNotFound/PageNotFound')) ;
const Forget = lazy(() => import("./components/forgotPassword/Forget")); ;


function App() {
  

  const router = createBrowserRouter([
    
    {
      path: "/",
      element: <AuthLayout />,
      children: [
        {
          index: true,
          element: <LandingPage />,
        },
        {
          path: "signup",
          element: <Signup />,
        },
        {
          path: "login",
          element: <Login />,
        },
        {
          path: "forgetPassword",
          element: <Forget />,
        },
        {
          path: "/*",
          element: <PageNotFound />,
        },
      ],
    },
    {
      path: "/app",
      element: (
        <Guard endpoint={"/api/user/session"}>
          <AppLayout />
        </Guard>
      ),
      children: [
        {
          index: true,
          element: <Home />,
        },
        {
          path: "transactions",
          element: <Transactions />,
        },
        {
          path: "budget",
          element: <Budget />,
        },
        {
          path: "goals",
          element: <Goals />,
        },
        {
          path: "reports",
          element: <Reports />,
        },
        {
          path: "profile",
          element: <Profile />,
        },
      ],
    },
  ]);

  return (
    <>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
        <Suspense fallback={<Loader />}>
          <RouterProvider router={router} />
        </Suspense>
        <ToastContainer />
      </GoogleOAuthProvider>
    </>
  );
}

export default App
