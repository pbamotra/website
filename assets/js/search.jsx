import elasticlunr from "elasticlunr";

const searchIndex = fetch(`/wiki-index.json?${COMMIT}`)
  .then((x) => x.json())
  .then((x) => elasticlunr.Index.load(x));

import { render } from "react-dom";
import React, { useState, useEffect, Suspense } from "react";

const searchRoot = document.getElementById("search");

if (!searchRoot) {
  return;
}

const SearchBar = () => {
  const [term, setTerm] = useState();

  useEffect(() => {}, [term]);

  return (
    <div
      style={{
        position: "relative",
      }}
    >
      <input />
      <div style={{ position: "absolute" }}>Loading..</div>
    </div>
  );
};

const LazySearchBar = React.lazy(() =>
  searchIndex.then(() => ({ default: SearchBar }))
);

render(
  <Suspense fallback={<span>Loading...</span>}>
    <LazySearchBar />
  </Suspense>,
  searchRoot
);
