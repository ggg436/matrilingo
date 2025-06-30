import { LANGUAGES, useSiteLanguage } from "@/components/site-language-context";

export const SiteLanguageSelector = () => {
  const { siteLang, setSiteLang } = useSiteLanguage();
  return (
    <div className="flex items-center gap-2">
      <label htmlFor="site-language-select" className="font-medium text-sm">Site Language:</label>
      <select
        id="site-language-select"
        value={siteLang}
        onChange={e => setSiteLang(e.target.value)}
        className="border rounded px-2 py-1 text-sm"
      >
        {LANGUAGES.map(lang => (
          <option key={lang.code} value={lang.code}>{lang.label}</option>
        ))}
      </select>
    </div>
  );
};
