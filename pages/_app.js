import "../styles/globals.css";
import Layout from "../components/Layout";
import { ThemeProvider } from "next-themes";

function MyApp({ Component, pageProps }) {
  return (
    <Layout>
      <ThemeProvider attribute="class">
        <Component {...pageProps} />
      </ThemeProvider>
    </Layout>
  );
}

export default MyApp;
