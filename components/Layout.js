import Header from "./Header";
import Footer from "./Footer";
// import Sidebar from "./SideBar";

export default function Layout({ children }) {
  return (
    <>
      <div className="bg-primary">
        <Header />
        {/* <Sidebar /> */}
        <div> {children} </div>
        <Footer />
      </div>
    </>
  );
}
