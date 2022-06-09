import React, { useState, useEffect } from "react";
import styled from "@emotion/styled";

const projectId = "firescript-577a2";

const formatDatabaseUrl = (shard: number) =>
  `https://${projectId}-dbs-${String(shard).padStart(4, "0")}.firebaseio.com`;

export function getDatabaseUrlForName(name: string, buckets: number) {
  // This is a whole bunch of clojure converted into JS.
  // No clue what it should be!;

  const Sg =
    "undefined" !== typeof Math &&
    "undefined" !== typeof Math.imul &&
    0 !== Math.imul(4294967295, 5)
      ? function (a: number, b: number) {
          return Math.imul(a, b);
        }
      : function (a: number, b: number) {
          var c = a & 65535,
            d = b & 65535;
          return (
            (c * d +
              (((((a >>> 16) & 65535) * d + c * ((b >>> 16) & 65535)) << 16) >>>
                0)) |
            0
          );
        };

  function Ug(a: number, b: number) {
    a = (a | 0) ^ (b | 0);
    return (Sg((a << 13) | (a >>> -13), 5) + -430675100) | 0;
  }

  function Tg(a: number) {
    a = Sg(a | 0, -862048943);
    return Sg((a << 15) | (a >>> -15), 461845907);
  }

  function hashString(value: string) {
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

  function Vg(a: number, b: number) {
    a = (a | 0) ^ b;
    a = Sg(a ^ (a >>> 16), -2048144789);
    a = Sg(a ^ (a >>> 13), -1028477387);
    return a ^ (a >>> 16);
  }

  function bucket(hash: number, count: number) {
    return ((hash % count) + count) % count;
  }

  const transformHash = (a: number) => Vg(Ug(0, Tg(a)), 4);

  const shard = bucket(transformHash(hashString(name)), buckets) + 1;

  return formatDatabaseUrl(shard);
}

// TODO: Change this if Roam does
const BUCKETS = 100;

const DEFAULT_MESSAGE =
  'Please type your Roam DB name in the search box above and press "test"';

const ROAM_URL = "roamresearch.com/#/app/";

const TesterContainer = styled.div({
  borderRadius: "4px",
  padding: "24px",
  border: "solid 2px rgba(0, 0, 0, 0.1)",
  background: "var(--background-tint)"
});

const Input = styled.input({
  width: "100%",
  padding: "12px 16px",
  border: "solid 2px rgba(0, 0, 0, 0.1)",
  borderRadius: "4px",
});

const Button = styled.button({
  marginTop: "6px",
  border: "none",
  cursor: "pointer",
  borderRadius: "4px",
  padding: "12px 32px",
});

export default function RoamTester() {
  const [state, setState] = useState<{
    status: "ready" | "loading";
    shouldFetch: boolean;
    message: { type: string; msg: string };
    name?: string;
  }>({
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

      let name = state.name ?? "";

      if (name.includes(ROAM_URL)) {
        name = name.split(ROAM_URL)[1] ?? "";
        name = name.split("/")[0] ?? "";
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

          const { email } = Object.values(roam)[0] as any;

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
              msg: "Your graph is private! 🎉",
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
    <TesterContainer>
      <Input
        id="roam-test-input"
        placeholder={
          state.status === "loading"
            ? "Loading..."
            : "Enter your Roam DB name..."
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
      <Button
        disabled={!state.name || state.status === "loading"}
        id="roam-test-button"
        onClick={() => setState((x) => ({ ...x, shouldFetch: true }))}
      >
        Test
      </Button>
      {state.message.msg && (
        <p
          style={{
            color: state.message.type === "exposed" ? "red" : undefined,
            marginBottom: 0,
          }}
        >
          {state.message.msg}
        </p>
      )}
    </TesterContainer>
  );
}
