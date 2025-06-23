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
import AdminDashboard from "../layouts/AdminDashboard";
import Profile from "../pages/Profile";
import MyOrders from "../pages/MyOrders";
import Address from "../pages/Address";
import CategoryPage from "../pages/CategoryPage";
import ProductAdmin from "../pages/ProductAdmin";
import ProductListPage from "../pages/ProductListPage";
import ProductDisplayPage from "../pages/ProductDisplayPage";
import ProductDisplayPageNew from "../pages/ProductDisplayPageNew";
import CartMobile from "../pages/CartMobile";
import CheckoutPage from "../pages/CheckoutPage";
import Success from "../pages/Success";
import Cancel from "../pages/Cancel";
import AddAdmin from "../pages/AddAdmin";
import SetPasswordPage from "../pages/SetPasswordPage";
import AdminLogin from "../pages/AdminLogin";
import AdminListPage from "../pages/AdminListPage";
import OrderListPage from "../pages/OrderListPage";
import DeliveriesPage from "../pages/DeliveriesPage";
import OrderHistory from "../components/OrderHistory"
import CodStatus from "../components/CodStatus";
import AdminCodStatus from "../components/AdminCodStatus";
import PromoCode from "../pages/PromocodePage";
import ProductPage from "../pages/ProductPage";
import ShopAll from '../components/ShopAll'
import HomeProducts from "../components/HomeProducts"
import Category from "../pages/Category"
import HeroSection from '../pages/HeroSection'
import Ad from "../pages/Ad";
import MyProfile from "../pages/MyProfile";
import Featured from "../pages/Featured";
import PrivacyPolicy from "../pages/PrivacyPolicy";
import AuthSuccess from '../pages/AuthSuccess';
import AboutUs from "../pages/AboutUs";
import ContactUs from "../pages/ContactUs";
import SignUp from "../pages/SignUp";
import Terms_Condition from "../pages/Terms_Condition";
import NotFoundPage from "../components/NotFound";
import HomepageSectionList from "../components/HomePageSection";
import WeightVariantManager from "../components/WeightVariant";
import ProtectedRoute from "../components/ProtectedRoute";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                path: "HomeProducts",
                element: <HomeProducts />
            },
            {
                path: "Privacy-Policy",
                element: <PrivacyPolicy />
            },
            {
                path: "Terms-conditions",
                element: <Terms_Condition />
            },
            {
                path: "About-Us",
                element: <AboutUs />
            },
            {
                path: "Contact-Us",
                element: <ContactUs />
            },
            {
                path: "Category/:Category",
                element: <Category />
            },
            {
                path: "Featured/:Featured",
                element: <Featured />
            },
            {
                path: "productpage",
                element: <ProductPage />
            },
            {
                path: "ShopAll",
                element: <ShopAll />
            },
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
                path: "auth-success",
                element: <AuthSuccess />
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
                path: "signup",
                element: <SignUp />
            },
            {
                path: "forgot-password",
                element: <ForgotPassword />
            },
            {
                path: "admin/forgot-password",
                element: <ForgotPassword />
            },
            {
                path: "verification-otp",
                element: <OtpVerification />
            },
            {
                path: "admin/verification-otp",
                element: <OtpVerification />
            },
            {
                path: "reset-password",
                element: <ResetPassword />
            },
            {
                path: "admin/reset-password",
                element: <ResetPassword />
            },
            {
                path: "user",
                element: <UserMenuMobile />
            },
            {
                path: "profile",
                element: <Profile />
            },
            {
                path: "dashboard/checkout",
                element: <CheckoutPage />
            },
            {
                path: "dashboard/address",
                element: <Address />
            },
            {
                path: "/dashboard/myorders",
                element: <MyOrders />
            },
            {
                path: "dashboard/Myprofile",
                element: <MyProfile />
            },
            {
                path: "admin/dashboard/",
                element: (
                    <ProtectedRoute allowedRoles={["Admin", "Delivery Partner", "Finance Manager", "Inventory Manager"]}>
                        <AdminDashboard />
                    </ProtectedRoute>
                ),
                children: [
                    // Admin-only routes
                    {
                        path: "profile",
                        element: (
                            <ProtectedRoute allowedRoles={["Admin", "Inventory Manager", "Delivery Partner", "Finance Manager"]}>
                                <Profile />
                            </ProtectedRoute>
                        )
                    },
                    {
                        path: "HeroSection",
                        element: (
                            <ProtectedRoute allowedRoles={["Admin"]}>
                                <HeroSection />
                            </ProtectedRoute>
                        )
                    },
                    {
                        path: "HomePageSection",
                        element: (
                            <ProtectedRoute allowedRoles={["Admin"]}>
                                <HomepageSectionList />
                            </ProtectedRoute>
                        )
                    },
                    {
                        path: "weightvariant",
                        element: (
                            <ProtectedRoute allowedRoles={["Admin"]}>
                                <WeightVariantManager />
                            </ProtectedRoute>
                        )
                    },
                    {
                        path: "category",
                        element: (
                            <ProtectedRoute allowedRoles={["Admin"]}>
                                <CategoryPage />
                            </ProtectedRoute>
                        )
                    },
                    {
                        path: "product",
                        element: (
                            <ProtectedRoute allowedRoles={["Admin", "Inventory Manager"]}>
                                <ProductAdmin />
                            </ProtectedRoute>
                        )
                    },
                    {
                        path: "add-admin",
                        element: (
                            <ProtectedRoute allowedRoles={["Admin"]}>
                                <AddAdmin />
                            </ProtectedRoute>
                        )
                    },
                    {
                        path: "admin-list",
                        element: (
                            <ProtectedRoute allowedRoles={["Admin"]}>
                                <AdminListPage />
                            </ProtectedRoute>
                        )
                    },
                    {
                        path: "order-list",
                        element: (
                            <ProtectedRoute allowedRoles={["Admin"]}>
                                <OrderListPage />
                            </ProtectedRoute>
                        )
                    },
                    {
                        path: "order-history",
                        element: (
                            <ProtectedRoute allowedRoles={["Admin"]}>
                                <OrderHistory />
                            </ProtectedRoute>
                        )
                    },
                    {
                        path: "admin-cod-status",
                        element: (
                            <ProtectedRoute allowedRoles={["Admin"]}>
                                <AdminCodStatus />
                            </ProtectedRoute>
                        )
                    },
                    {
                        path: "my-deliveries",
                        element: (
                            <ProtectedRoute allowedRoles={["Delivery Partner"]}>
                                <DeliveriesPage filterDelivered={false} />
                            </ProtectedRoute>
                        )
                    },
                    {
                        path: "delivery-history",
                        element: (
                            <ProtectedRoute allowedRoles={["Delivery Partner"]}>
                                <DeliveriesPage filterDelivered={true} />
                            </ProtectedRoute>
                        )
                    },
                    {
                        path: "delivery-cod-status",
                        element: (
                            <ProtectedRoute allowedRoles={["Delivery Partner"]}>
                                <CodStatus />
                            </ProtectedRoute>
                        )
                    },
                    {
                        path: "admin-promo",
                        element: (
                            <ProtectedRoute allowedRoles={["Admin"]}>
                                <PromoCode />
                            </ProtectedRoute>
                        )
                    },
                ]
            },

         
            // // {
            // //     path: "inventory",
            // //     element: <Dashboard />,
            // //     children: [
            // //         {
            // //             path: "profile",
            // //             element: <Profile />
            // //         },
            // //         {
            // //             path: "product",
            // //             element: <ProductAdmin />
            // //         },
            // //     ]
            // // },
            // // {
            // //     path: "deliveries",
            // //     element: <Dashboard />,
            // //     children: [
            // //         {
            // //             path: "profile",
            // //             element: <Profile />
            // //         },
            // //         {
            // //             path: "my-deliveries",
            // //             element: <MyDeliveries />
            // //         },
            // //     ]
            // // },
            {
                path: "product/:product",
                element: <ProductDisplayPageNew />
            },
            {
                path: "productNew",
                element: <ProductDisplayPageNew />
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
    },
    {
        path: "*",
        element: <NotFoundPage />
    }

]);

export default router;
