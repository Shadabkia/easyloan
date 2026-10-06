import { useEffect, useState } from "react";
import { Footer, Header } from "./components/ui";
import Home from "./pages/Home";
import StandardLoan from "./pages/StandardLoan";
import BlockedMoney from "./pages/BlockedMoney";
import UpfrontFee from "./pages/UpfrontFee";
import type { Language } from "./types/calculator";

function currentPath() {
  return window.location.pathname;
}

export default function App() {
  const [path, setPath] = useState(currentPath);
  const [language, setLanguage] = useState<Language>("fa");

  useEffect(() => {
    const onPopState = () => setPath(currentPath());
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === "fa" ? "rtl" : "ltr";
    document.title = language === "fa" ? "وام‌سنج | هزینه واقعی وام" : "LoanLens | Understand your real loan cost";
  }, [language]);

  const navigate = (destination: string) => {
    const [pathname, hash] = destination.split("#");
    const nextPath = pathname || "/";
    if (nextPath !== window.location.pathname) {
      window.history.pushState({}, "", `${nextPath}${hash ? `#${hash}` : ""}`);
      setPath(nextPath);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (hash) {
      window.history.replaceState({}, "", `${nextPath}#${hash}`);
      requestAnimationFrame(() => document.getElementById(hash)?.scrollIntoView({ behavior: "smooth" }));
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  let page = <Home language={language} navigate={navigate} />;
  if (path === "/calculators/standard-loan") {
    page = <StandardLoan key={language} language={language} navigate={navigate} />;
  } else if (path === "/calculators/blocked-money") {
    page = <BlockedMoney key={language} language={language} navigate={navigate} />;
  } else if (path === "/calculators/upfront-fee") {
    page = <UpfrontFee key={language} language={language} navigate={navigate} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header
        language={language}
        setLanguage={setLanguage}
        navigate={navigate}
        currentPath={path}
      />
      {page}
      <Footer language={language} />
    </div>
  );
}
