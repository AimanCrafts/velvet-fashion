import React, { createContext, useContext, useEffect, useState } from "react";

export type RouteContextType = {
  path: string;
  segments: string[];
  navigate: (to: string) => void;
};

const RouteContext = createContext<RouteContextType | undefined>(undefined);

const readHash = (): string => {
  const h = window.location.hash.replace(/^#/, "");
  return h.startsWith("/") ? h : `/${h}`;
};

export const Router: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [path, setPath] = useState<string>(() => {
    if (typeof window === "undefined") return "/";
    return readHash();
  });

  useEffect(() => {
    const onHash = () => {
      setPath(readHash());
      window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const navigate = (to: string) => {
    const normalized = to.startsWith("/") ? to : `/${to}`;
    if (normalized === path) return;
    window.location.hash = normalized;
  };

  const segments = path.split("/").filter(Boolean);

  return (
    <RouteContext.Provider value={{ path, segments, navigate }}>
      {children}
    </RouteContext.Provider>
  );
};

export const useRouter = (): RouteContextType => {
  const ctx = useContext(RouteContext);
  if (!ctx) throw new Error("useRouter must be inside <Router>");
  return ctx;
};

export const Link: React.FC<
  React.AnchorHTMLAttributes<HTMLAnchorElement> & { to: string }
> = ({ to, children, onClick, ...rest }) => {
  const { navigate } = useRouter();
  const normalized = to.startsWith("/") ? to : `/${to}`;
  return (
    <a
      href={`#${normalized}`}
      onClick={(e) => {
        e.preventDefault();
        onClick?.(e);
        navigate(normalized);
      }}
      {...rest}
    >
      {children}
    </a>
  );
};
