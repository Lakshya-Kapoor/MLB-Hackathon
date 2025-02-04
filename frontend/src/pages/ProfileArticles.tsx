import { useContext, useEffect, useState } from "react";
import { ProfileContext } from "../contexts/ProfileContext";
import { ArticleData } from "../utils/types";
import { ArticleCard } from "../components/ArticleSlider";

export default function ProfileArticles() {
  const { data } = useContext(ProfileContext)!;
  const [articles, setArticles] = useState<null | ArticleData[]>(null);

  useEffect(() => {
    let ignore = false;

    async function getArticles() {
      const url = `http://localhost:8000/articles/search/tags?name=${data.name}`;
      let res = await fetch(url);
      res = await res.json();

      if (!ignore) {
        setArticles(res);
      }
    }

    getArticles();

    return () => {
      ignore = true;
    };
  }, [data]);

  if (!articles) return <div>Loading...</div>;

  if (articles.length === 0)
    return <div className="text-white">No articles found</div>;

  return (
    <div className="grid grid-cols-3 gap-5">
      {articles.map((article: ArticleData) => (
        <ArticleCard key={article._id} article={article} />
      ))}
    </div>
  );
}

// 569637204490;
