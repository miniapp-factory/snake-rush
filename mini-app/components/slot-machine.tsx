"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Share } from "@/components/share";
import { url } from "@/lib/metadata";

const animals = ["fox", "panda", "lion", "owl"] as const;
type Animal = typeof animals[number];

function getRandomAnimal(): Animal {
  return animals[Math.floor(Math.random() * animals.length)];
}

export function SlotMachine() {
  const [grid, setGrid] = useState<Animal[][]>([
    [getRandomAnimal(), getRandomAnimal(), getRandomAnimal()],
    [getRandomAnimal(), getRandomAnimal(), getRandomAnimal()],
    [getRandomAnimal(), getRandomAnimal(), getRandomAnimal()],
  ]);
  const [spinning, setSpinning] = useState(false);
  const [win, setWin] = useState(false);

  const spin = () => {
    if (spinning) return;
    setSpinning(true);
    setWin(false);
    const interval = setInterval(() => {
      setGrid((prev) =>
        prev.map((col, idx) => {
          const newCol = [...prev[idx]];
          newCol.pop();
          newCol.unshift(getRandomAnimal());
          return newCol;
        })
      );
    }, 100);

    setTimeout(() => {
      clearInterval(interval);
      setSpinning(false);
      checkWin();
    }, 2000);
  };

  const checkWin = () => {
    // Check rows
    for (let r = 0; r < 3; r++) {
      if (grid[r][0] === grid[r][1] && grid[r][1] === grid[r][2]) {
        setWin(true);
        return;
      }
    }
    // Check columns
    for (let c = 0; c < 3; c++) {
      if (grid[0][c] === grid[1][c] && grid[1][c] === grid[2][c]) {
        setWin(true);
        return;
      }
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 min-h-screen bg-cover bg-center" style={{backgroundImage: 'url(/palm-jungle.png)'}}>
      <div className="grid grid-cols-3 gap-2">
        {grid.map((col, colIdx) =>
          col.map((animal, rowIdx) => (
            <div
              key={`${colIdx}-${rowIdx}`}
              className="w-24 h-24 flex items-center justify-center border rounded-md bg-white"
            >
              <img
                src={`/${animal}.png`}
                alt={animal}
                className="w-20 h-20 object-contain animate-move"
              />
            </div>
            <style jsx>{`
              @keyframes move {
                0% { transform: translateX(0); }
                50% { transform: translateX(10px); }
                100% { transform: translateX(0); }
              }
              .animate-move {
                animation: move 3s ease-in-out infinite;
              }
            `}</style>
          ))
        )}
      </div>
      <Button onClick={spin} disabled={spinning} variant="outline">
        {spinning ? "Spinning..." : "Spin"}
      </Button>
      {win && (
        <div className="mt-4 text-xl font-semibold text-green-600">
          You Win!
          <div className="mt-2">
            <Share text={`I just won the Animal Slot Machine! ${url}`} />
          </div>
        </div>
      )}
    </div>
  );
}
