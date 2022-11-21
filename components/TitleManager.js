import Head from "next/head";

const siteTitle = "DefenDAO";

export default function TitleManager(props) {
  return (
    <Head>
      <title>{siteTitle + " |  " + props.pageTitle}</title>
      <meta name="description" content={props.pageDescrption} />
    </Head>
  );
}
