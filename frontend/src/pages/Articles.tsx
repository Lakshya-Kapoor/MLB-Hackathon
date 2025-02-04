import { ArrowBigUp, ChevronLeft, ChevronRight, Clock } from "lucide-react";
import { useRef, useState } from "react";

const articles = new Array(10).fill(null);

export default function ButtonControlledSlider() {
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
    <div className="">
      <div className="relative group">
        <div
          ref={scrollContainerRef}
          className="overflow-x-auto scrollbar-hide flex gap-4"
          onScroll={updateScrollButtons}
        >
          {articles.map((_, index) => (
            <div key={index} className="shrink-0">
              <ArticleCard />
            </div>
          ))}
        </div>

        {canScrollLeft && (
          <button
            onClick={() => scroll("left")}
            className="absolute -left-10 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          >
            <ChevronLeft size={24} />
          </button>
        )}

        {canScrollRight && (
          <button
            onClick={() => scroll("right")}
            className="absolute -right-10 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          >
            <ChevronRight size={24} />
          </button>
        )}
      </div>
    </div>
  );
}

export function ArticleCard() {
  return (
    <div className="border border-light5/30 rounded-lg p-5 max-w-[400px] hover:bg-dark1/40 transition-all duration-200">
      <h3 className="text-3xl text-light3 font-semibold font-secular mb-3">
        This is the article title
      </h3>
      <p className="text-lg text-light4 mb-6">
        This is a catchy phrase for the article longer one is this
      </p>
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-1">
          <Clock size={20} className="text-light5" />
          <p className="text-sm text-light4">Jan 24, 2025</p>
        </div>
        <div className="flex items-center rounded-full px-3 py-1 bg-emerald-600 font-semibold">
          <ArrowBigUp size={20} /> 123
        </div>
      </div>
    </div>
  );
}
