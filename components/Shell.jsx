import Navbar from "./Navbar";
import Footer from "./Footer";

export default function Shell({ children }) {
  return (
    <>
      <Navbar />
      <div className="wrap">{children}</div>
      <Footer />
    </>
  );
}
