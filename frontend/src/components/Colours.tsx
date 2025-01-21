export default function Colours() {
  return (
    <div className="bg-dark5 min-h-screen flex gap-10 justify-center">
      <div className="flex flex-col">
        <Square className="bg-dark1"></Square>
        <Square className="bg-dark2"></Square>
        <Square className="bg-dark3"></Square>
        <Square className="bg-dark4"></Square>
        <Square className="bg-dark5"></Square>
      </div>
      <div className="flex flex-col">
        <Square className="bg-light1"></Square>
        <Square className="bg-light2"></Square>
        <Square className="bg-light3"></Square>
        <Square className="bg-light4"></Square>
        <Square className="bg-light5"></Square>
      </div>
      <div className="flex flex-col">
        <Square className="bg-red1"></Square>
        <Square className="bg-red2"></Square>
        <Square className="bg-red3"></Square>
        <Square className="bg-red4"></Square>
        <Square className="bg-red5"></Square>
      </div>
      <div className="flex flex-col">
        <Square className="bg-blue-600"></Square>
        <Square className="bg-blue-700"></Square>
        <Square className="bg-blue-800"></Square>
        <Square className="bg-blue-900"></Square>
        <Square className="bg-blue-950"></Square>
      </div>
    </div>
  );
}

function Square({ className }: { className: string }) {
  return (
    <div className={"w-40 h-40 text-transparent " + className}>{className}</div>
  );
}
