import { useEffect, useState } from "react";
import { ArticleData } from "../utils/types";
import ArticleSlider from "../components/ArticleSlider";

export default function Articles() {
  const [articles, setArticles] = useState<{
    recent: ArticleData[];
    trending: ArticleData[];
  } | null>(null);

  useEffect(() => {
    let ignore = false;

    async function fetchArticles() {
      const urls = [
        "http://localhost:8000/articles/feed?type=recent",
        "http://localhost:8000/articles/feed?type=popular",
      ];

      const requests = urls.map((url) => fetch(url).then((res) => res.json()));
      const responses = await Promise.all(requests);

      if (!ignore) {
        setArticles({
          recent: responses[0],
          trending: responses[1],
        });
      }
    }

    fetchArticles();

    return () => {
      ignore = true;
    };
  }, []);

  if (!articles) {
    return <div className="text-white">Loading...</div>;
  }

  return (
    <div className="flex flex-col gap-20">
      <div className="space-y-4">
        <h2 className="text-light5 text-3xl font-semibold">Recent</h2>
        <div className="flex flex-col gap-8">
          <ArticleSlider articles={articles.recent} />
        </div>
      </div>
      <div className="space-y-4">
        <h2 className="text-light5 text-3xl font-semibold">Trending</h2>
        <div className="flex flex-col gap-8">
          <ArticleSlider articles={articles.trending} />
        </div>
      </div>
    </div>
  );
}
