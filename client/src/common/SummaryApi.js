export const baseURL = import.meta.env.VITE_API_URL;

const SummaryApi = {
  getInvoice: {
    url: "api/generate-invoice",
    method: "post",
  },
  getHomepageSections: {
    url: "/api/product/get-HomepageSection",
    method: "get",
  },
  addReview: {
    url: "/api/product/addreview",
    method: "post",
  },
  getReview: (id) => ({
    url: `/api/product/getreviewproduct/${id}`,
    method: "get",
  }),
  getProductByHomePageSection: (id) => ({
    url: `/api/product/getProductByHomePageSection/${id}`,
    method: "get",
  }),
  getnotification: {
    url: "/api/notification/getnotifications",
    method: "get",
  },
  clearAllNotifications: {
    url: "/api/notification/clearnotification",
    method: "delete",
  },
  updatenotification: {
    url: "/api/notification/updatenotification",
    method: "put",
  },

  addHomePageSection: {
    url: "/api/admin/create-homepage-section",
    method: "post",
  },

  deleteHomePageSection: {
    url: "/api/admin/delete-homepage-section",
    method: "delete",
  },
  updatehomepageSection: {
    url: "/api/admin/update-homepage-section",
    method: "put",
  },

  getallHomepageSection: {
    url: "/api/admin/homepage-sections",
    method: "get",
  },
  getallWeightVariant: {
    url: "/api/weight/listweight",
    method: "get",
  },
  addWeightVariant: {
    url: "/api/weight/addweight",
    method: "post",
  },
  deleteWeightVariant: {
    url: "/api/weight/deleteweight",
    method: "delete",
  },
  updateWeightVariant: {
    url: "/api/weight/updateweight",
    method: "put",
  },
  register: {
    url: "/api/user/register",
    method: "post",
  },
  login: {
    url: "/api/user/login",
    method: "post",
  },
  forgot_password: {
    url: "/api/user/forgot-password",
    method: "put",
  },
  forgot_password_otp_verification: {
    url: "api/user/verify-forgot-password-otp",
    method: "put",
  },
  resetPassword: {
    url: "/api/user/reset-password",
    method: "put",
  },
  refreshToken: {
    url: "api/user/refresh-token",
    method: "post",
  },
  userDetails: {
    url: "/api/user/user-details",
    method: "get",
  },

  // =========== Admin ===================
  adminLogin: {
    url: "/api/admin/login",
    method: "post",
  },
  adminDetails: {
    url: "/api/admin/user-details",
    method: "get",
  },

  logout: {
    url: "/api/user/logout",
    method: "get",
  },
  uploadAvatar: {
    url: "/api/user/upload-avatar",
    method: "put",
  },
  UpdateAdminDetails: {
    url: "/api/admin/update-admin",
    method: "put",
  },
  updateUserDetails: {
    url: "/api/user/update-user",
    method: "put",
  },
  updateCartDetails: {
    url: "/api/user/update-cart",
    method: "put",
  },
  usercartdetails: {
    url: "/api/user/getuser-cart",
    method: "get",
  },
  addCategory: {
    url: "/api/category/add-category",
    method: "post",
  },
  uploadImage: {
    url: "/api/file/upload",
    method: "post",
  },
  getCategory: {
    url: "/api/category/get",
    method: "get",
  },
  getCategoryById: {
    url: "/api/category/:id",
    method: "get",
  },

  updateCategory: {
    url: "/api/category/update",
    method: "put",
  },
  deleteCategory: {
    url: "/api/category/delete",
    method: "delete",
  },
  createProduct: {
    url: "/api/product/create",
    method: "post",
  },
  getProduct: {
    url: "/api/product/get",
    method: "post",
  },
  getProductByCategory: {
    url: "/api/product/get-product-by-category",
    method: "post",
  },
  getProductByCategoryName: {
    url: "/api/product/get-product-by-categoryname",
    method: "post",
  },

  getProductDetails: {
    url: "/api/product/get-product-details",
    method: "post",
  },
  getallProduct: {
    url: "/api/product/get-all-product",
    method: "get",
  },
  updateProductDetails: {
    url: "/api/product/update-product-details",
    method: "put",
  },
  deleteProduct: {
    url: "/api/product/delete-product",
    method: "delete",
  },
  searchProduct: {
    url: "/api/product/search-product",
    method: "post",
  },
  searchProductByCategory: {
    url: "/api/product/search-product-bycategory-search",
    method: "post",
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
  createAddress: {
    url: "/api/address/create",
    method: "post",
  },
  getAddress: {
    url: "/api/address/get",
    method: "get",
  },
  updateAddress: {
    url: "/api/address/update",
    method: "put",
  },
  deleteAddress: {
    url: "/api/address/delete",
    method: "delete",
  },

  // Banner Related APIs
  addBanner: {
    url: "/api/homebanner/addbanner",
    method: "post",
  },
  updatestatus: {
    url: "/api/homebanner/updatestatus",
    method: "put",
  },
  deleteBanner: {
    url: "/api/homebanner/deletebanner",
    method: "delete",
  },
  getBanners: {
    url: "/api/homebanner/getbanners",
    method: "get",
  },

  AddAdmin: {
    url: "/api/admin/add",
    method: "post",
  },
  getAdmins: {
    url: "/api/admin/list",
    method: "get",
  },
  setPassword: {
    url: (userId) => `/api/admin/set-password/${userId}`,
    method: "post",
  },
  verifyOtp: {
    url: `/api/auth/verify-otp`,
    method: "post",
  },
  forgotPass: {
    url: `/api/users/forgot-password`,
    method: "post",
  },
  resetPass: {
    url: (token) => `/api/users/reset-password/${token}`,
    method: "post",
  },
  // =========== Order Related APIs ===================
  CashOnDeliveryOrder: {
    url: "/api/order/cash-on-delivery",
    method: "post",
  },
  CancelOrder: {
    url: (orderId) => `/api/order/cancel/${orderId}`,
    method: "put",
  },

  payment_url: {
    url: "/api/order/checkout",
    method: "post",
  },
  getOrderItems: {
    url: "/api/order/order-list",
    method: "get",
  },
  getMyorderItems: {
    // display deliverd order of any user
    url: "/api/order/my-order-list",
    method: "get",
  },

  // =========== Delivery NEW APIs  ===================
  assignDeliveryPartner: {
    // 🆕 Admin assigns a delivery partner
    url: "/api/order/assign-delivery-partner",
    method: "put",
  },
  assignBulkDeliveryPartner: {
    // 🆕 Admin assigns a delivery partner
    url: "/api/order/bulk-assign-delivery-partner",
    method: "put",
  },

  getDeliveredOrder: {
    url: "/api/order/delivery-partner-orders-history",
    method: "get",
  },
  getCODOrder: {
    url: "/api/order/cod-order-history",
    method: "get",
  },

  getNotDeliveredOrder: {
    url: "/api/order/delivery-partner-not-deliverd",
    method: "get",
  },
  updateOrderStatus: {
    // 🆕 Admin assigns a delivery partner
    url: "/api/order/update-order-status",
    method: "put",
  },
  updateCODStatus: {
    // 🆕 Admin assigns a delivery partner
    url: "/api/order/update-cod-status",
    method: "put",
  },
  updateAdminCODStatus: {
    // 🆕 Admin assigns a delivery partner
    url: "/api/order/update-admin-cod-status",
    method: "put",
  },
  //=========== Promocode API endpoints ===========
  getAllPromocodes: {
    url: "/api/promocode",
    method: "GET",
  },
  getFilterdPromocodes: {
    url: "/api/promocode/applicable",
    method: "POST",
  },

  createPromocode: {
    url: "/api/promocode",
    method: "POST",
  },

  updatePromocode: {
    url: "/api/promocode",
    method: "PUT",
  },

  deletePromocode: {
    url: "/api/promocode",
    method: "DELETE",
  },
};

export default SummaryApi;
