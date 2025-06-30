import { Footer } from "./footer";
import { Header } from "./header";
import { SiteLanguageProvider } from "@/components/site-language-context";

type Props = {
  children: React.ReactNode;
};

const MarketingLayout = ({ children }: Props) => {
  return (
    <SiteLanguageProvider>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center">
          {children}
        </main>
        <Footer />
      </div>
    </SiteLanguageProvider>
  );
};

export default MarketingLayout;
