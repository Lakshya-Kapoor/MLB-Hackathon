import { ArrowBigUp, ChevronLeft, ChevronRight, Clock } from "lucide-react";
import { useContext, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { SearchContext } from "../contexts/SearchContext";
import { ArticleData } from "../utils/types";

export default function ArticleSlider({ articles }) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateScrollButtons = () => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;

    // Check if we can scroll left
    setCanScrollLeft(container.scrollLeft > 0);

    // Check if we can scroll right
    setCanScrollRight(
      container.scrollLeft < container.scrollWidth - container.clientWidth - 1
    );
  };

  const scroll = (direction: "left" | "right") => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const cardWidth = 400; // Width of the card
    const gap = 16; // Gap between cards (4 * 4px from gap-4)
    const containerWidth = container.clientWidth;
    const visibleCards = Math.floor(containerWidth / (cardWidth + gap));
    const scrollAmount = (cardWidth + gap) * visibleCards;

    container.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <div className="relative group">
      <div
        ref={scrollContainerRef}
        className="overflow-x-auto scrollbar-hide flex gap-4"
        onScroll={updateScrollButtons}
      >
        {articles.map((article, index) => (
          <div key={index} className="shrink-0">
            <ArticleCard article={article} />
          </div>
        ))}
      </div>

      {canScrollLeft && (
        <button
          onClick={() => scroll("left")}
          className="absolute -left-12 top-1/2 -translate-y-1/2 bg-dark1/80 text-light1 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        >
          <ChevronLeft size={24} />
        </button>
      )}

      {canScrollRight && (
        <button
          onClick={() => scroll("right")}
          className="absolute -right-12 top-1/2 -translate-y-1/2 bg-dark1/80 text-light1 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        >
          <ChevronRight size={24} />
        </button>
      )}
    </div>
  );
}

export function ArticleCard({ article }: { article: ArticleData }) {
  const { search, setSearch } = useContext(SearchContext);

  const formattedDate = new Date(article.uploadDate).toLocaleDateString(
    "en-US",
    {
      month: "short",
      day: "numeric",
      year: "numeric",
    }
  );

  return (
    <Link
      to={`/articles/${article._id}`}
      onClick={() => setSearch(!search)}
      className="border border-light5/30 rounded-lg p-5 h-[250px] w-[385px] bg-gradient-to-br from-dark1/65 to-dark1/0 hover:bg-dark1/40 transition-all duration-200 flex flex-col justify-between"
    >
      <div className="flex flex-col justify-around flex-grow ">
        <h3 className="text-2xl text-light2 font-semibold font-secular">
          {article.title.substring(0, 50)}...
        </h3>
        <p className="text-md text-light5 mb-6">{article.catchyPhrase}</p>
      </div>
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-1">
          <Clock size={20} className="text-light5" />
          <p className="text-sm text-light4">{formattedDate}</p>
        </div>
        <div className="flex items-center rounded-full px-3 py-1 bg-emerald-600 font-semibold">
          <ArrowBigUp size={20} /> {article.reactions.upVotes}
        </div>
      </div>
    </Link>
  );
}
