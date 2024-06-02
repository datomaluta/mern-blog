// import { getPosts } from "../services/post";
// import { PostType } from "../types/post";
// import PostCard from "../components/ui/PostCard";
// import { categories } from "../data/categories";
// import LoadingSpinner from "../components/sharedComponents/LoadingSpinner";
// import { motion } from "framer-motion";
import { useEffect, useState } from "react";
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
  const [query, setQuery] = useState<queryType>({
    search: "",
    sort: "",
    category: "",
  });
  const urlParams = new URLSearchParams(location.search);
  const [queryString, setQueryString] = useState<string>(
    urlParams?.toString() || ""
  );

  const {
    data: posts,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    refetch: refetchPosts,
    isFetching,
  } = useInfiniteQuery({
    queryKey: ["posts"],
    queryFn: ({ pageParam }) =>
      getPosts({ page: pageParam, queryString })?.then(
        (res) => res.data?.data?.posts
      ),
    initialPageParam: 1,
    getNextPageParam: (lastPage: any, allPages) => {
      // console.log("lastPage: ", lastPage);
      // console.log("allPages: ", allPages);
      const nextPage = lastPage?.length ? allPages?.length + 1 : undefined;
      return nextPage;
    },
  });

  const filterHandler = () => {
    // console.log("filtet handler");
    // const urlParams = new URLSearchParams(location.search);
    // console.log(query);
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
    console.log("URL PARAMS TO STRING: ", urlParams?.toString());
    navigate(`${location.pathname}?${urlParams.toString()}`);
  };

  useEffect(() => {
    // const urlParams = new URLSearchParams(location.search);
    // getPostsRefetch(`${urlParams.toString()}`);
    setQueryString(urlParams.toString());
  }, [location.search, urlParams]);

  // console.log(queryString);

  console.log("QUERY STATE: ", query);

  useEffect(() => {
    refetchPosts();
  }, [queryString, refetchPosts]);

  console.log("POSTS: ", posts && posts?.pages[0]);

  return (
    <div className="mt-10 mb-20">
      {/* {status === "pending" && <LoadingSpinner blur />} */}

      <>
        {isFetching && <LoadingSpinner blur />}
        <div className="flex gap-4 mb-6 md:flex-col items-center">
          <div className="text-sm  flex-1  w-full">
            <input
              className="text-sm dark:bg-dark-gray-tint min-w-full md:w-auto block rounded-lg border-1 dark:border-zinc-500 border-zinc-200 focus:ring-0 dark:focus:border-zinc-200 focus:border-zinc-400"
              type="text"
              placeholder="Search Term..."
              onChange={(e) => setQuery({ ...query, search: e.target.value })}
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
            className="bg-light-purple px-10 py-2 rounded-lg md:w-full font-bold"
          >
            Filter
          </button>
        </div>
        {status === "success" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="grid grid-cols-3 lg:grid-cols-2 md:grid-cols-1 gap-5">
              {posts?.pages?.map((posts: PostType[]) =>
                posts?.map((post: PostType) => (
                  <PostCard key={post.id} post={post} />
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
