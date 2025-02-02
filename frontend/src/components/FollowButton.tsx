export default function FollowButton({
  following,
  onClick,
}: {
  following: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`self-start px-6 py-3 rounded-full font-medium transition-colors duration-300 ${
        following
          ? "bg-red3 text-dark5 hover:bg-red2 active:bg-red3"
          : "border border-light1 border-opacity-40 text-light3 hover:border-opacity-100 active:bg-light1 active:text-dark5"
      }`}
    >
      {following ? "Following" : "Follow"}
    </button>
  );
}
