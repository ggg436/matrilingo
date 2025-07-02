import { FeedWrapper } from "@/components/feed-wrapper";
import { StickyWrapper } from "@/components/sticky-wrapper";
import { LanguageExample } from "@/components/language-example";

const LanguageSettingsPage = () => {
  return (
    <div className="flex flex-row-reverse gap-[48px] px-6">
      <StickyWrapper>
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="font-bold text-xl">Language Settings</h2>
          <p className="text-muted-foreground text-sm mt-2">
            Choose your preferred language for the UI. This language will be used for all instructions and prompts.
          </p>
        </div>
      </StickyWrapper>
      <FeedWrapper>
        <div className="mb-6 space-y-4">
          <div className="flex items-center gap-x-2 pb-4 border-b">
            <h1 className="text-2xl font-bold">Language Settings</h1>
          </div>
          <p>
            You can change the language used for the UI by selecting an option from the language dropdown in the sidebar.
            Your choice will be saved in your browser and will be remembered the next time you visit.
          </p>
          <p>
            Below is an example of how the questions will be displayed in your chosen language.
          </p>
          <LanguageExample />
        </div>
      </FeedWrapper>
    </div>
  );
};

export default LanguageSettingsPage; 