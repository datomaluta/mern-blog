import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getPosts } from "../services/post";
import LoadingSpinner from "../components/sharedComponents/LoadingSpinner";
import { motion } from "framer-motion";
import PostCard from "../components/ui/PostCard";
import { PostType } from "../types/post";
import { categories } from "../data/categories";

type queryType = {
  search: string;
  category: string;
  sort: string;
};

const AllPosts = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const urlParams = useMemo(
    () => new URLSearchParams(location.search),
    [location.search]
  );
  const { pathname } = useLocation();

  const [query, setQuery] = useState<queryType>({
    search: "",
    sort: "",
    category: "",
  });
  const queryString = urlParams?.toString();

  const {
    data: posts,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["posts", queryString],
    queryFn: ({ pageParam }) =>
      getPosts({ page: pageParam, queryString })?.then(
        (res) => res.data?.data?.posts
      ),
    initialPageParam: 1,
    getNextPageParam: (lastPage: any, allPages) => {
      const nextPage = lastPage?.length ? allPages?.length + 1 : undefined;
      return nextPage;
    },
  });

  // const { data: userData, isLoading: userDataLoading } = useQuery({
  //   queryKey: ["userData", urlParams.get("user")],
  //   queryFn: () =>
  //     getUserById(urlParams.get("user") || "").then(
  //       (res) => res.data?.data?.user
  //     ),
  //   enabled: !!urlParams.get("user"),
  // });

  const filterHandler = () => {
    query.search
      ? urlParams.set("search", query.search)
      : urlParams.delete("search");
    query.search
      ? urlParams.set("searchFields", "title,content")
      : urlParams.delete("searchFields");
    query.category
      ? urlParams.set("category", query.category)
      : urlParams.delete("category");

    query.sort ? urlParams.set("sort", query.sort) : urlParams.delete("sort");
    navigate(`${location.pathname}?${urlParams.toString()}`);
  };

  useEffect(() => {
    setQuery((prevQuery) => ({
      ...prevQuery,
      search: urlParams.get("search") || "",
      // user: urlParams.get("user") || "",
    }));
  }, [location.search, urlParams]);

  return (
    <div className="mt-10 mb-20">
      {status === "pending" && <LoadingSpinner blur />}

      <>
        {/* {isFetching && <LoadingSpinner blur />} */}
        <div className="flex gap-4 mb-6 md:flex-col items-center">
          <div className="text-sm  flex-1  w-full">
            <input
              className="text-sm dark:bg-dark-gray-tint min-w-full md:w-auto block rounded-lg border-1 dark:border-zinc-500 border-zinc-200 focus:ring-0 dark:focus:border-zinc-200 focus:border-zinc-400"
              type="text"
              placeholder="Search Term..."
              onChange={(e) => setQuery({ ...query, search: e.target.value })}
              value={query?.search || ""}
            />
          </div>

          <div className="md:w-full">
            <select
              onChange={(e) => setQuery({ ...query, category: e.target.value })}
              className="text-sm rounded-lg w-full dark:bg-dark-gray-tint cursor-pointer border-1 dark:border-zinc-500 border-zinc-200 focus:ring-0 dark:focus:border-zinc-200 focus:border-zinc-400"
            >
              <option value="">Choose category</option>
              {categories?.map((category) => (
                <option className="" key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div className="md:w-full">
            <select
              onChange={(e) => setQuery({ ...query, sort: e.target.value })}
              className="w-full text-sm rounded-lg dark:bg-dark-gray-tint cursor-pointer  border-1 dark:border-zinc-500 border-zinc-200 focus:ring-0 dark:focus:border-zinc-200 focus:border-zinc-400"
            >
              <option value="-createdAt">Latest</option>
              <option value="createdAt">Oldest</option>
            </select>
          </div>
          <button
            onClick={filterHandler}
            className="bg-light-purple px-10 py-2 rounded-lg md:w-full font-bold text-white"
          >
            Filter
          </button>
        </div>

        {/* {userData && !userDataLoading ? (
          <h1 className="mb-4"> Posts by {userData?.username}</h1>
        ) : (
          ""
        )} */}

        {pathname.includes("author") ? (
          <h1 className="mb-4">
            Posts by {posts?.pages[0][0]?.user?.username}
          </h1>
        ) : (
          ""
        )}

        {status === "success" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="grid grid-cols-3 lg:grid-cols-2 md:grid-cols-1 gap-5">
              {posts?.pages?.map((posts: PostType[]) =>
                posts?.map((post: PostType) => (
                  <PostCard key={post._id} post={post} />
                ))
              )}
            </div>
          </motion.div>
        )}

        {posts && posts?.pages[0]?.length === 0 && (
          <h1 className="text-2xl font-bold text-center mt-20">
            No posts found
          </h1>
        )}

        {hasNextPage && (
          <button
            className="mt-8 mb-8 block text-center border border-white-shade dark:border-dark-gray-tint w-max mx-auto px-5 py-3 rounded-xl"
            disabled={isFetchingNextPage || !hasNextPage}
            onClick={() => fetchNextPage()}
          >
            {isFetchingNextPage ? "Loading..." : "Load More"}
          </button>
        )}
      </>
    </div>
  );
};

export default AllPosts;
