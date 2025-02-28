export type TabType = 'post' | 'replies' | 'articles' | 'media' | 'likes';

type ProfileTabsProps = {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
};

const ProfileTabs = ({ activeTab, onTabChange }: ProfileTabsProps) => {
  const tabs: TabType[] = ['post', 'replies', 'articles', 'media', 'likes'];
  
  return (
    <div className="flex items-center overflow-x-auto justify-between">
      {tabs.map((tab) => (
        <div
          key={tab}
          onClick={() => onTabChange(tab)}
          style={{ color: activeTab === tab ? "white" : "#a2a2a2b9" }}
          className="capitalize relative py-4 gray w-fit cursor-pointer px-9 hover:bg-[#1f1f1fb8]"
        >
          <p>{tab}</p>
          {activeTab === tab && (
            <p className="absolute bottom-0 left-[24%] bg-blue-500 w-[55%] h-1 rounded-full" />
          )}
        </div>
      ))}
    </div>
  );
};

export default ProfileTabs