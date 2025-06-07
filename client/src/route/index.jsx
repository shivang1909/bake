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
import ProductAdmin from "../pages/ProductAdmin";
import AdminPermision from "../layouts/AdminPermision";
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


const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                path:"HomeProducts",
                element: <HomeProducts />
            },
            {
                path:"Privacy-Policy",
                element: <PrivacyPolicy />
            },
            {
                path:"About-Us",
                element: <AboutUs />
            },
            {
                path:"Category/:Category",
                element: <Category />
            },
            {
                path:"Featured/:Featured",
                element: <Featured />
            },
            {
                path:"productpage",
                element: <ProductPage />
            },
            {
                path:"ShopAll",
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
                path: "dashboard",
                element: <Dashboard />,
                children: [
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
                    },
                    {
                        path: "Myprofile",
                        element: <MyProfile />
                    },
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
                        path: "HeroSection",
                        element: <HeroSection />
                    },
                    {
                        path: "category",
                        element: <CategoryPage />
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
                    },
                    {
                        path: "order-list",
                        element: <OrderListPage />
                    },
                    {
                        path: "order-history",
                        element: <OrderHistory />
                    },
                    {
                        path: "admin-cod-status",
                        element: <AdminCodStatus />
                    },
                    {
                        path: "my-deliveries",
                        element: <DeliveriesPage filterDelivered={false} />
                    },
                    {
                        path: "delivery-history",
                        element: <DeliveriesPage filterDelivered={true}/>
                    },
                    {
                        path: "delivery-cod-status",
                        element: <CodStatus />
                    },
                    {
                        path: "admin-promo",
                        element: <PromoCode />
                    },
                ]
            },
            // {
            //     path: "inventory",
            //     element: <Dashboard />,
            //     children: [
            //         {
            //             path: "profile",
            //             element: <Profile />
            //         },
            //         {
            //             path: "product",
            //             element: <ProductAdmin />
            //         },
            //     ]
            // },
            // {
            //     path: "deliveries",
            //     element: <Dashboard />,
            //     children: [
            //         {
            //             path: "profile",
            //             element: <Profile />
            //         },
            //         {
            //             path: "my-deliveries",
            //             element: <MyDeliveries />
            //         },
            //     ]
            // },
            {
                path: ":category",
                element: <ProductListPage />
            },
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
    }
]);

export default router;
