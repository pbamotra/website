import { render } from "react-dom";
import React, { useState, useEffect } from "react";

const roamTesterRoot = document.getElementById("roam-test-container");

if (!roamTesterRoot) {
  return;
}

const projectId = "firescript-577a2";

const formatDatabaseUrl = (shard) =>
  `https://${projectId}-dbs-${String(shard).padStart(4, "0")}.firebaseio.com`;

export function getDatabaseUrlForName(name, buckets) {
  // This is a whole bunch of clojure converted into JS.
  // No clue what it should be!;

  const Sg =
    "undefined" !== typeof Math &&
    "undefined" !== typeof Math.imul &&
    0 !== Math.imul(4294967295, 5)
      ? function (a, b) {
          return Math.imul(a, b);
        }
      : function (a, b) {
          var c = a & 65535,
            d = b & 65535;
          return (
            (c * d +
              (((((a >>> 16) & 65535) * d + c * ((b >>> 16) & 65535)) << 16) >>>
                0)) |
            0
          );
        };

  function Ug(a, b) {
    a = (a | 0) ^ (b | 0);
    return (Sg((a << 13) | (a >>> -13), 5) + -430675100) | 0;
  }

  function Tg(a) {
    a = Sg(a | 0, -862048943);
    return Sg((a << 15) | (a >>> -15), 461845907);
  }

  function hashString(value) {
    var hash = 0,
      i = 0,
      chr = 0;
    for (i = 0; i < value.length; i++) {
      chr = value.charCodeAt(i);
      hash = (hash << 5) - hash + chr;
      hash |= 0; // Convert to 32bit integer
    }
    return hash;
  }

  function Vg(a, b) {
    a = (a | 0) ^ b;
    a = Sg(a ^ (a >>> 16), -2048144789);
    a = Sg(a ^ (a >>> 13), -1028477387);
    return a ^ (a >>> 16);
  }

  function bucket(hash, count) {
    return ((hash % count) + count) % count;
  }

  const transformHash = (a) => Vg(Ug(0, Tg(a)), 4);

  const shard = bucket(transformHash(hashString(name)), buckets) + 1;

  return formatDatabaseUrl(shard);
}

// TODO: Change this if Roam does
const BUCKETS = 100;

const DEFAULT_MESSAGE =
  'Please type your Roam DB name in the search box above and press "test"';

const ROAM_URL = "roamresearch.com/#/app/";

const Tester = () => {
  const [state, setState] = useState({
    status: "ready",
    shouldFetch: false,
    message: {
      msg: DEFAULT_MESSAGE,
      type: "info",
    },
  });

  useEffect(() => {
    if (state.shouldFetch) {
      let mounted = true;

      let name = state.name;

      if (name.includes(ROAM_URL)) {
        name = name.split(ROAM_URL)[1];
        name = name.split("/")[0];
      }

      setState((x) => ({
        ...x,
        status: "loading",
        message: {
          msg: "Loading...",
          type: "info",
        },
      }));

      fetch(
        `${getDatabaseUrlForName(
          encodeURIComponent(name),
          BUCKETS
        )}/v10/dbs/${name}/log.json?orderBy="t"&limitToFirst=1`
      )
        .then((x) => {
          if (x.status < 300) {
            return x.json();
          } else {
            throw new Error("Graph is private!");
          }
        })
        .then((roam) => {
          if (!mounted) {
            return;
          }

          const { email } = Object.values(roam)[0];

          setState((x) => ({
            ...x,
            shouldFetch: false,
            status: "ready",
            message: {
              msg: email
                ? `Your graph is public. All your pages, files, and details like your email (${email}) are available for anyone to see. Follow the instructions below to make it private.`
                : `Your graph is public. Follow the instructions below to make it private.`,
              type: "exposed",
            },
          }));
        })
        .catch(() => {
          setState((x) => ({
            ...x,
            shouldFetch: false,
            status: "ready",
            message: {
              msg: "Your graph is private! We were unable to access it. 🎉",
              type: "info",
            },
          }));
        });

      return () => {
        mounted = false;
      };
    }
  }, [state.name, state.shouldFetch]);

  return (
    <>
      <input
        id="roam-test-input"
        placeholder={
          state === "loading" ? "Loading..." : "Enter your Roam DB name..."
        }
        disabled={state.status === "loading"}
        onKeyUp={(x) =>
          x.key === "Enter" && setState((x) => ({ ...x, shouldFetch: true }))
        }
        onChange={(e) => {
          const name = e.target.value.trim();
          setState((x) => ({ ...x, name }));
        }}
      />
      <button
        disabled={!state.name || state.status === "loading"}
        id="roam-test-button"
        onClick={() => setState((x) => ({ ...x, shouldFetch: true }))}
      >
        Test
      </button>
      <div
        id="roam-test-output"
        style={{ color: state.message.type === "exposed" ? "red" : undefined }}
      >
        {state.message.msg}
      </div>
    </>
  );
};

render(<Tester />, roamTesterRoot);
