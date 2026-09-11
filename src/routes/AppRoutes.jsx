import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import ProtectedRoute from "./ProtectedRoute";
import Navbar from "../components/Navbar";
import Products from "../pages/Products";
import Cart from "../pages/Cart";
import Checkout from "../pages/Checkout";
import Orders from "../pages/Orders";
import OrderDetail from "../pages/OrderDetail";
import Addresses from "../pages/Addresses";
import AdminRoute from "./AdminRoute";
import AdminProducts from "../pages/AdminProducts";
import AdminCategories from "../pages/AdminCategories";
import Register from "../pages/Register";
import AdminUsers from "../pages/AdminUsers";

function Home() {
  return <h1 className="text-red-700 text-8xl">Home</h1>;
}

// export default function AppRoutes() {
//   return (
//     <BrowserRouter>
//       <Navbar />

//       <Routes>
//         {/* Públicas */}
//         <Route path="/" element={<Home />} />
//         <Route path="/login" element={<Login />} />
//         <Route path="/register" element={<Register />} />
//         <Route path="/products" element={<Products />} />

//         {/* Protegidas */}
//         <Route element={<ProtectedRoute />}>
//           <Route path="/cart" element={<Cart />} />
//           <Route path="/orders" element={<Orders />} />
//           <Route path="/orders/:orderId" element={<OrderDetail />} />
//           <Route path="/addresses" element={<Addresses />} />
//           <Route path="/checkout" element={<Checkout />} />
//         </Route>

//         <Route element={<AdminRoute />}>
//           <Route path="/admin/products" element={<AdminProducts />} />
//           <Route path="/admin/categories" element={<AdminCategories />} />
//           <Route path="/admin/users" element={<AdminUsers />} />
//         </Route>
//       </Routes>
//     </BrowserRouter>
//   );
// }
