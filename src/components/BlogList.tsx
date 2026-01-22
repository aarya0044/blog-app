import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { getBlogs } from "../api/blogs";
import type { Blog } from "../types/blog";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

type Props = {
  selectedCategory: string;
};

const categoryColor: Record<string, string> = {
  FINANCE: "bg-emerald-100 text-emerald-800",
  TECH: "bg-blue-100 text-blue-800",
  CAREER: "bg-purple-100 text-purple-800",
  EDUCATION: "bg-orange-100 text-orange-800",
  REGULATIONS: "bg-red-100 text-red-800",
};

export default function BlogList({ selectedCategory }: Props) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["blogs"],
    queryFn: getBlogs,
  });

  const [search, setSearch] = useState("");
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);

  // COMBINED FILTER: CATEGORY + SEARCH
  const filteredBlogs = data?.filter((blog) => {
    const matchesCategory =
      selectedCategory === "ALL" ||
      blog.category.includes(selectedCategory);

    const matchesSearch =
      blog.title.toLowerCase().includes(search.toLowerCase()) ||
      blog.description.toLowerCase().includes(search.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-5 w-1/3" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-2/3" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return <p className="text-red-500">Failed to load blogs.</p>;
  }

  return (
    <>
      {/*SEARCH BAR*/}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search blogs by title or description..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
      </div>

      {/* EMPTY STATE */}
      {filteredBlogs?.length === 0 && (
        <div className="text-center py-16 animate-in fade-in">
          <p className="text-lg font-medium">No blogs found</p>
          <p className="text-sm text-muted-foreground mt-1">
            Try changing the category or search keyword
          </p>
        </div>
      )}

      {/*BLOG CARDS*/}
      <div className="space-y-6">
        {filteredBlogs?.map((blog) => (
          <Card
            key={blog.id}
            onClick={() => setSelectedBlog(blog)}
            className="relative overflow-hidden group cursor-pointer bg-white border hover:shadow-xl transition-all duration-300"
          >
            {/*Gradient Accent */}
            <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-blue-500 via-purple-500 to-pink-500" />

            <CardHeader>
              <div className="flex gap-2 mb-3 flex-wrap">
                {blog.category.map((cat) => (
                  <Badge
                    key={cat}
                    className={`${categoryColor[cat]} border-none`}
                  >
                    {cat}
                  </Badge>
                ))}
              </div>

              <CardTitle className="group-hover:text-blue-600 transition">
                {blog.title}
              </CardTitle>
            </CardHeader>

            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {blog.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* BLOG DETAIL MODAL */}
      {selectedBlog && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white max-w-2xl w-full rounded-xl p-6 relative animate-in fade-in zoom-in">
            <button
              onClick={() => setSelectedBlog(null)}
              className="absolute top-3 right-3 text-gray-500 hover:text-black"
            >
              ✕
            </button>

            <div className="flex gap-2 mb-4 flex-wrap">
              {selectedBlog.category.map((cat) => (
                <Badge
                  key={cat}
                  className={`${categoryColor[cat]} border-none`}
                >
                  {cat}
                </Badge>
              ))}
            </div>

            <h2 className="text-2xl font-bold mb-3">
              {selectedBlog.title}
            </h2>

            <p className="text-muted-foreground leading-relaxed">
              {selectedBlog.description}
            </p>
          </div>
        </div>
      )}
    </>
  );
}
