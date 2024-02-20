import { Route, Routes, Navigate } from "react-router-dom";
import { lazy } from "react";

const LoginPageComponent = lazy(() => import("../pages/public/login"));
const OTPPageComponent = lazy(() => import("../pages/public/otp"));
const RegisterComponent = lazy(() => import("../pages/public/register"));
const UserPage = lazy(() => import("../pages/common/user"));
const ForgotPassword = lazy(() => import("../pages/public/forgotPassword"));
const ResetPassword = lazy(() => import("../pages/public/resetPassword"));
const Dashboard = lazy(() => import("../pages/public/Dashboard/index"))
const ProductSummary = lazy(() => import("../pages/public/ProductSummary/index"))
const Checkout = lazy(() => import("../pages/public/Checkout/index"))

const publicPaths = [
  {
    path: "login",
    element: LoginPageComponent,
  },
  {
    path: "otp/:id",
    element: OTPPageComponent,
  },
  {
    path: "register/:id",
    element: RegisterComponent,
  },
  {
    path: "register",
    element: RegisterComponent,
  },
  {
    path: "user/:id",
    element: UserPage,
  },
  {
    path: "forgotPassword",
    element: ForgotPassword,
  },
  {
    path: "change-password/:id",
    element: ResetPassword,
  },
  {
    path: "/",
    element: Dashboard
  },
  {
    path: "/product/:id",
    element: ProductSummary
  },
  {
    path: "/checkout",
    element: Checkout
  }
];

function PublicApp() {
  return (
    <Routes>
      {publicPaths.map((e, index) => (
        <Route key={index} path={e.path} element={<e.element />} />
      ))}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default PublicApp;
