"use client";
import Image from "next/image";
import { Loader } from "lucide-react";
import { 
  ClerkLoaded, 
  ClerkLoading, 
  SignInButton, 
  SignUpButton, 
  SignedIn, 
  SignedOut
} from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useSiteLanguage } from "@/components/site-language-context";

const translations = {
  tagline: {
    en: "Learn, practice, and master new languages with Lingo.",
    ne: "नयाँ भाषा सिक्नुस्, अभ्यास गर्नुस्, र लिङ्गोसँग दक्ष बन्नुस्।",
    ma: "नव भाषा सीखू, अभ्यास करू, आ लिङ्गो सं निपुण बनू।",
    bh: "नइकी भाषा सीखी, अभ्यास करीं, आ लिंगो के साथ माहिर बनीं।",
    sa: "नवभाषा शिक्षस्व, अभ्यासं कुरु, च लिङ्गो सह पारङ्गतिं प्राप्नुहि।",
  },
  continue: {
    en: "Continue Learning",
    ne: "पढाइ जारी राख्नुस्।",
    ma: "सीखब जारी रखू।",
    bh: "सीखल जारी रखीं।",
    sa: "अधिगमं अनुवर्तय।",
  },
};

type LangKey = keyof typeof translations.tagline;

export default function Home() {
  const { siteLang } = useSiteLanguage();
  const lang: LangKey = ["en", "ne", "ma", "bh", "sa"].includes(siteLang) ? (siteLang as LangKey) : "en";
  return (
    <div className="max-w-[988px] mx-auto flex-1 w-full flex flex-col lg:flex-row items-center justify-center p-4 gap-2">
      <div className="relative w-[240px] h-[240px] lg:w-[424px] lg:h-[424px] mb-8 lg:mb-0">
        <Image src="/hero.svg" fill alt="Hero" />
      </div>
      <div className="flex flex-col items-center gap-y-8">
        <h1 className="text-xl lg:text-3xl font-bold text-neutral-600 max-w-[480px] text-center">
          {translations.tagline[lang]}
        </h1>
        <div className="flex flex-col items-center gap-y-3 max-w-[330px] w-full">
          <ClerkLoading>
            <Loader className="h-5 w-5 text-muted-foreground animate-spin" />
          </ClerkLoading>
          <ClerkLoaded>
            <SignedOut>
              <SignUpButton
                mode="modal"
                afterSignInUrl="/learn"
                afterSignUpUrl="/learn"
              >
                <Button size="lg" variant="secondary" className="w-full">
                  Get Started
                </Button>
              </SignUpButton>
              <SignInButton
                mode="modal"
                afterSignInUrl="/learn"
                afterSignUpUrl="/learn"
              >
                <Button size="lg" variant="primaryOutline" className="w-full">
                  I already have an account
                </Button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <Button size="lg" variant="secondary" className="w-full" asChild>
                <Link href="/learn">
                  {translations.continue[lang]}
                </Link>
              </Button>
            </SignedIn>
          </ClerkLoaded>
        </div>
      </div>
    </div>
  )
}
