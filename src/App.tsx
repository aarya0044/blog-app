import { useState } from "react";
import BlogList from "./components/BlogList";

export default function App() {
  const [category, setCategory] = useState<string>("ALL");

  const categories = ["ALL", "FINANCE", "TECH", "CAREER", "EDUCATION", "REGULATIONS"];

  return (
    <div className="p-8 bg-gray-100 min-h-screen max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold mb-2">CA Monk Blog App</h1>
      <p className="text-muted-foreground mb-8">
        Insights on finance, tech, career & education
      </p>

      {/* Filter Bar */}
      <div className="flex gap-3 mb-8 flex-wrap">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition
              ${
                category === cat
                  ? "bg-black text-white"
                  : "bg-white border hover:bg-gray-100"
              }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <BlogList selectedCategory={category} />
    </div>
  );
}
