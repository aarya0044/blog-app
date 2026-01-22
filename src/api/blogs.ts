import type { Blog } from "../types/blog";

const BASE_URL = "http://localhost:3001/blogs";

export const getBlogs = async (): Promise<Blog[]> => {
  const response = await fetch(BASE_URL);

  if (!response.ok) {
    throw new Error("Failed to fetch blogs");
  }

  return response.json();
};
