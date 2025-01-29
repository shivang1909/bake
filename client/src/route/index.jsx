import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../pages/Home";
import SearchPage from "../pages/SearchPage";
import Login from "../pages/Login";
import Register from "../pages/Register";
import ForgotPassword from "../pages/ForgotPassword";
import OtpVerification from "../pages/OtpVerification";
import ResetPassword from "../pages/ResetPassword";
import UserMenuMobile from "../pages/UserMenuMobile";
import Dashboard from "../layouts/Dashboard";
import Profile from "../pages/Profile";
import MyOrders from "../pages/MyOrders";
import Address from "../pages/Address";
import CategoryPage from "../pages/CategoryPage";
import UploadProduct from "../pages/UploadProduct";
import ProductAdmin from "../pages/ProductAdmin";
import AdminPermision from "../layouts/AdminPermision";
import ProductListPage from "../pages/ProductListPage";
import ProductDisplayPage from "../pages/ProductDisplayPage";
import CartMobile from "../pages/CartMobile";
import CheckoutPage from "../pages/CheckoutPage";
import Success from "../pages/Success";
import Cancel from "../pages/Cancel";

import AddAdmin from "../pages/AddAdmin";
import SetPasswordPage from "../pages/SetPasswordPage";
import AdminLogin from "../pages/AdminLogin";
import AdminListPage from "../pages/AdminListPage";



const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                path: "",
                element: <Home />
            },
            {
                path: "search",
                element: <SearchPage />
            },
            {
                path: "set-admin-password/:userId",
                element: <SetPasswordPage />
            },
            {
                path: "login",
                element: <Login />
            },
            {
                path: "admin/login",
                element: <AdminLogin />
            },
            {
                path: "register",
                element: <Register />
            },
            {
                path: "forgot-password",
                element: <ForgotPassword />
            },
            {
                path: "verification-otp",
                element: <OtpVerification />
            },
            {
                path: "reset-password",
                element: <ResetPassword />
            },
            {
                path: "user",
                element: <UserMenuMobile />
            },
            {
                path: "dashboard",
                element: <Dashboard />,
                children: [
                    {
                        path: "profile",
                        element: <Profile />
                    },
                    {
                        path: "myorders",
                        element: <MyOrders />
                    },
                    {
                        path: "address",
                        element: <Address />
                    },
                    {
                        path: "cart",
                        element: <CartMobile />
                    },
                    {
                        path: "checkout",
                        element: <CheckoutPage />
                    }
                ]
            },
            {
                path: "admin/dashboard",
                element: <Dashboard />,
                children: [
                    {
                        path: "profile",
                        element: <Profile />
                    },
                    {
                        path: "category",
                        element: <CategoryPage />
                    },
                    {
                        path: "upload-product",
                        element: <UploadProduct />
                    },
                    {
                        path: "product",
                        element: <ProductAdmin />
                    },
                    {
                        path: "add-admin",
                        element: <AddAdmin />
                    },
                    {
                        path: "admin-list",
                        element: <AdminListPage />
                    }
                ]
            },
            {
                path: ":category",
                element: <ProductListPage />
            },
            {
                path: "product/:product",
                element: <ProductDisplayPage />
            },
            
            {
                path: "success",
                element: <Success />
            },
            {
                path: "cancel",
                element: <Cancel />
            }
        ]
    }
]);

export default router;
