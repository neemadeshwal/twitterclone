import SingleFollowUser from "@/components/home/rightSide/SingleFollowUser";
import { getCurrentUser } from "@/graphql/types";
import Loading from "@/shared/loading";
import ScrollTop from "@/shared/ScrollTop";
import { SearchResultProps } from "../searchTabs";

const PeopleTab = ({
  searchResult,
  query,
  isLoading,
}: {
  searchResult: SearchResultProps;
  query: string;
  isLoading: boolean;
}) => {
  if (isLoading || !searchResult) {
    return (
      <div className="flex justify-center py-10">
        <Loading />
      </div>
    );
  }
  if (searchResult && searchResult?.people && !searchResult.people.length) {
    return (
      <>
        <ScrollTop />
        <div className="py-10 flex flex-col justify-center items-center">
          <h3 className="text-lg font-bold mb-4">No results for {query}</h3>
          <p className="text-gray-500 text-sm">
            Try searching for something else
          </p>
        </div>
      </>
    );
  }
  const userList = searchResult.people;

  return (
    <div>
      <div className="rounded-[20px] py-4 px-4">
        <div className="py-6 pt-0">
          <h3 className="text-[18px] font-[800]">People</h3>
        </div>
        <div className="flex flex-col gap-5">
          {userList.map((item: getCurrentUser) => {
            return <SingleFollowUser key={item.id} singleUser={item} />;
          })}
        </div>
      </div>
    </div>
  );
};

export default PeopleTab;
