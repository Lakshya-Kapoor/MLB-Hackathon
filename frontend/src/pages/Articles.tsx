import { useEffect, useState } from "react";
import { ArticleData } from "../utils/types";
import ReactMarkdown from "react-markdown";
import { format } from "date-fns";
import { Clock, Tag as TagIcon } from "lucide-react";

export default function Article() {
  const [article, setArticle] = useState<ArticleData | null>(null);

  useEffect(() => {
    const url = "http://localhost:8000/articles/100";

    let ignore = false;

    async function getArticle() {
      const res = await fetch(url);
      const data = await res.json();

      if (!ignore) {
        console.log(data);
        setArticle(data);
      }
    }

    getArticle();

    return () => {
      ignore = true;
    };
  }, []);

  if (!article) {
    return <div className="text-white">Loading...</div>;
  }
  return (
    <article className="max-w-4xl mx-auto p-6 bg-dark3 rounded-lg shadow-xl">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-light1 mb-4">{article.title}</h1>
        <p className="text-xl text-blue-400 italic mb-4">
          {article.catchyPhrase}
        </p>
        <div className="flex flex-wrap gap-4 text-light3 text-sm mb-4">
          <div className="flex items-center gap-2">
            <Clock size={16} />
            <span>Published: {format(article.uploadDate, "MMM dd, yyyy")}</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {article.tags.map((tag) => (
            <span
              key={tag}
              className="flex items-center gap-1 px-3 py-1 bg-blue-900 text-blue-200 rounded-full text-sm"
            >
              <TagIcon size={14} />
              {tag}
            </span>
          ))}
        </div>
      </header>

      <div>
        <p className="text-xl text-light5 mb-8">{article.description}</p>
        <ReactMarkdown className="markdown-content text-light2">
          {article.content}
        </ReactMarkdown>
      </div>
    </article>
  );
}
