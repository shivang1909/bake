
export const baseURL = import.meta.env.VITE_API_URL

const SummaryApi = {
    
    register : {
        url : '/api/user/register',
        method : 'post'
    },
    login : {
        url : '/api/user/login',
        method : 'post'
    },
    forgot_password : {
        url : "/api/user/forgot-password",
        method : 'put'
    },
    forgot_password_otp_verification : {
        url : 'api/user/verify-forgot-password-otp',
        method : 'put'
    },
    resetPassword : {
        url : "/api/user/reset-password",
        method : 'put'
    },
    refreshToken : {
        url : 'api/user/refresh-token',
        method : 'post'
    },
    userDetails : {
        url : '/api/user/user-details',
        method : "get"
    },


    // =========== Admin ===================  
    adminLogin : {
        url : '/api/admin/login',
        method : 'post'
    },
    adminDetails : {
        url : '/api/admin/user-details',
        method : "get"
    },
    
    logout : {
        url : "/api/user/logout",
        method : 'get'
    },
    uploadAvatar : {
        url : "/api/user/upload-avatar",
        method : 'put'
    },
    UpdateAdminDetails : {
        url : '/api/admin/update-admin',
        method : "put"
    },
    updateUserDetails : {
        url : '/api/user/update-user',
        method : 'put'
    },
    updateCartDetails : {
        url : '/api/user/update-cart',
        method : 'put'
    },
    usercartdetails:{
        url : '/api/user/getuser-cart',
        method : 'get'
    },
    addCategory : {
        url : '/api/category/add-category',
        method : 'post'
    },
    uploadImage : {
        url : '/api/file/upload',
        method : 'post'
    },
    getCategory : {
        url : '/api/category/get',
        method : 'get'
    },
    getCategoryById: {
        url: '/api/category/:id',
        method: 'get'
    },
    
    updateCategory : {
        url : '/api/category/update',
        method : 'put'
    },
    deleteCategory : {
        url : '/api/category/delete',
        method : 'delete'
    },
    createProduct : {
        url : '/api/product/create',
        method : 'post'
    },
    getProduct : {
        url : '/api/product/get',
        method : 'post'
    },
    getProductByCategory : {
        url : '/api/product/get-product-by-category',
        method : 'post'
    },
    getProductByCategoryName : {
        url : '/api/product/get-product-by-categoryname',
        method : 'post'
    },
    
    getProductDetails : {
        url : '/api/product/get-product-details',
        method : 'post'
    },
    updateProductDetails : {
        url : "/api/product/update-product-details",
        method : 'put'
    },
    deleteProduct : {
        url : "/api/product/delete-product",
        method : 'delete'
    },
    searchProduct : {
        url : '/api/product/search-product',
        method : 'post'
    },
    searchProductByCategory : {
        url : '/api/product/search-product-bycategory-search',
        method : 'post'
    }, // for product seach by name in productList.jsx
    // addTocart : {
    //     url : "/api/cart/create",
    //     method : 'post'
    // },
    // getCartItem : {
    //     url : '/api/cart/get',
    //     method : 'get'
    // },
    // updateCartItemQty : {
    //     url : '/api/cart/update-qty',
    //     method : 'put'
    // },
    // deleteCartItem : {
    //     url : '/api/cart/delete-cart-item',
    //     method : 'delete'
    // },
    createAddress : {
        url : '/api/address/create',
        method : 'post'
    },
    getAddress : {
        url : '/api/address/get',
        method : 'get'
    },
    updateAddress : {
        url : '/api/address/update',
        method : 'put'
    },
    disableAddress : {
        url : '/api/address/disable',
        method : 'delete'
    },
    // =========== Order Related APIs ===================  
    CashOnDeliveryOrder: {
        url: "/api/order/cash-on-delivery",
        method: "post"
    },
    payment_url: {
        url: "/api/order/checkout",
        method: "post"
    },
    getOrderItems: {
        url: "/api/order/order-list",
        method: "get"
    },

    // =========== Delivery NEW APIs  ===================
    assignDeliveryPartner: {  // 🆕 Admin assigns a delivery partner
        url: "/api/order/assign-delivery-partner",
        method: "put"
    },
   
    getDeliveredOrder:{
         url: "/api/order/delivery-partner-orders-history",
        method: "get"
    },
    getNotDeliveredOrder:{
        url: "/api/order/delivery-partner-not-deliverd",
       method: "get"
   },
    updateOrderStatus: {  // 🆕 Admin assigns a delivery partner
        url: "/api/order/update-order-status",
        method: "put"
    },
}

export default SummaryApi