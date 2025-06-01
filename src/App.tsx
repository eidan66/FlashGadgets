import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from "./components/Layout";
import CheckoutPage from "./pages/Checkout";
import ReceiptPage from "./pages/Recipt";
import HomePage from "./pages/Home";

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/receipt" element={<ReceiptPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
