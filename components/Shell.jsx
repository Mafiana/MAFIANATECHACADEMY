import Navbar from "./Navbar";
import Footer from "./Footer";

export default function Shell({ children, portal = false }) {
  return (
    <>
      <Navbar />
      <div className="wrap">{children}</div>
      <Footer portal={portal} />
    </>
  );
}
