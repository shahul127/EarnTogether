import { useLanguage } from "../i18n/LanguageContext";

export default function LanguageSelector() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="language-selector" aria-label="language selector">
      <button
        type="button"
        className={language === "en" ? "language-btn active" : "language-btn"}
        onClick={() => setLanguage("en")}
      >
        English
      </button>
      <button
        type="button"
        className={language === "ta" ? "language-btn active" : "language-btn"}
        onClick={() => setLanguage("ta")}
      >
        தமிழ்
      </button>
    </div>
  );
}
