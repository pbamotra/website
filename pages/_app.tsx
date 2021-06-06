import { Global } from "@emotion/react";

import "../styles/main.scss";

const globals = (
  <Global
    styles={{
      html: {
        fontFamily: "Rubik",
      },
    }}
  />
);

export default function App({ Component, pageProps }) {
  return (
    <>
      {globals}
      <Component {...pageProps} />
    </>
  );
}
