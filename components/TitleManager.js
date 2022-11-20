import Head from "next/head";

const siteTitle = "WalletViewer";

export default function TitleManager(props) {
  return (
    <Head>
      <title>{props.pageTitle + "-" + siteTitle}</title>
      <meta name="description" content={props.pageDescrption} />
    </Head>
  );
}
