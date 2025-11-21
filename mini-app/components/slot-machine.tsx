import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Share } from "@/components/share";
import { url } from "@/lib/metadata";

const fruits = ["Apple", "Banana", "Cherry", "Lemon"] as const;
type Fruit = typeof fruits[number];

function randomFruit(): Fruit {
  return fruits[Math.floor(Math.random() * fruits.length)];
}

export default function SlotMachine() {
  const [grid, setGrid] = useState<Fruit[][]>(
    Array.from({ length: 3 }, () => Array.from({ length: 3 }, randomFruit))
  );
  const [spinning, setSpinning] = useState(false);

  const shiftColumns = () => {
    setGrid(prev =>
      prev.map((row, rowIdx) =>
        row.map((_, colIdx) =>
          rowIdx === 0 ? randomFruit() : prev[rowIdx - 1][colIdx]
        )
      )
    );
  };

  const handleSpin = () => {
    if (spinning) return;
    setSpinning(true);
    const interval = setInterval(() => {
      shiftColumns();
    }, 200);
    setTimeout(() => {
      clearInterval(interval);
      setSpinning(false);
    }, 2000);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="grid grid-cols-3 gap-2">
        {grid.map((row, rowIdx) =>
          row.map((fruit, colIdx) => (
            <div
              key={`${rowIdx}-${colIdx}`}
              className="w-16 h-16 flex items-center justify-center border rounded"
            >
              <img
                src={`/${fruit.toLowerCase()}.png`}
                alt={fruit}
                width={64}
                height={64}
              />
            </div>
          ))
        )}
      </div>
      <Button onClick={handleSpin} disabled={spinning}>
        Spin
      </Button>
      {!spinning && (
        ((grid[0][0] === grid[0][1] && grid[0][1] === grid[0][2]) ||
          (grid[1][0] === grid[1][1] && grid[1][1] === grid[1][2]) ||
          (grid[2][0] === grid[2][1] && grid[2][1] === grid[2][2]) ||
          (grid[0][0] === grid[1][0] && grid[1][0] === grid[2][0]) ||
          (grid[0][1] === grid[1][1] && grid[1][1] === grid[2][1]) ||
          (grid[0][2] === grid[1][2] && grid[1][2] === grid[2][2])) && (
          <div className="mt-4 text-center">
            <h2 className="text-xl font-bold">You win!</h2>
            <Share text={`I just won with the Fruit Slot Machine! ${url}`} />
          </div>
        )
      )}
    </div>
  );
}
