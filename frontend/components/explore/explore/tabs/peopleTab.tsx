import SingleFollowUser from "@/components/home/rightSide/SingleFollowUser";
import { getCurrentUser } from "@/graphql/types";
import { getAllUsersData } from "@/lib/ServerFetchApi/ServerSideFunc";
import Loading from "@/shared/loading";

const PeopleTab = async () => {
  const userList = await getAllUsersData();

  if (!userList) {
    return (
      <div className="flex justify-center py-10">
        <Loading />
      </div>
    );
  }
  if (userList && !userList.length) {
    return (
      <div className="rounded-[20px] p-4 py-12">
        <p className="text-gray-400 text-lg">No Users yet</p>
      </div>
    );
  }

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
