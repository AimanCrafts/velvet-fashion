import { StoreProvider } from "./context/StoreContext";
import { Router, useRouter } from "./router/Router";
import { Navbar } from "./components/layout/Navbar";
import { Footer } from "./components/layout/Footer";
import { HomePage } from "./pages/HomePage";
import { ShopPage } from "./pages/ShopPage";
import { LookbookPage } from "./pages/LookbookPage";
import { TrackOrderPage } from "./pages/TrackOrderPage";
import { ProductDetailPage } from "./pages/ProductDetailPage";
import { CheckoutPage } from "./pages/CheckoutPage";
import { OrderConfirmationPage } from "./pages/OrderConfirmationPage";
import { AdminPage } from "./pages/AdminPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { CartDrawer } from "./components/checkout/CartDrawer";
import { ProductQuickViewModal } from "./components/store/ProductQuickViewModal";
import { AtelierStandardsModal } from "./components/store/AtelierStandardsModal";
import { Toast } from "./components/ui/Toast";
import { ErrorBoundary } from "./components/ui/ErrorBoundary";

function AppRoutes() {
  const { path } = useRouter();

  if (path === "/" || path === "") return <HomePage />;
  if (path === "/shop") return <ShopPage />;
  if (path === "/lookbook") return <LookbookPage />;
  if (path === "/track") return <TrackOrderPage />;
  if (path.startsWith("/product/")) return <ProductDetailPage />;
  if (path === "/checkout") return <CheckoutPage />;
  if (path.startsWith("/order/")) return <OrderConfirmationPage />;
  if (path === "/admin") return <AdminPage />;

  return <NotFoundPage />;
}

function StorefrontShell() {
  const { path } = useRouter();

  const isCheckout = path === "/checkout";
  const isAdmin = path === "/admin";

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-stone-900 selection:bg-[#3E0713] selection:text-[#FAF8F5]">
      <Toast />

      {!isAdmin && <Navbar minimal={isCheckout} />}

      <main className="flex-1 flex flex-col">
        <AppRoutes />
      </main>

      <CartDrawer />
      <ProductQuickViewModal />
      <AtelierStandardsModal />

      {!isAdmin && !isCheckout && <Footer />}
    </div>
  );
}

export function App() {
  return (
    <ErrorBoundary>
      <StoreProvider>
        <Router>
          <StorefrontShell />
        </Router>
      </StoreProvider>
    </ErrorBoundary>
  );
}

export default App;
