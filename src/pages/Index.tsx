import { useState } from "react";
import { ScratchCard, getRandomDiscount } from "@/components/ScratchCard";
import { Button } from "@/components/ui/button";

const Index = () => {
  const [discount, setDiscount] = useState(getRandomDiscount());
  const [revealed, setRevealed] = useState(false);

  const handleReset = () => {
    setDiscount(getRandomDiscount());
    setRevealed(false);
  };

  return (
    <div className="min-h-screen bg-gradient-purple flex flex-col items-center justify-center p-6">
      <div className="text-center mb-8 space-y-4">
        <h1 className="text-5xl font-bold text-foreground mb-2">
          Scratch & Win
        </h1>
        <p className="text-xl text-muted-foreground">
          Scratch the card to reveal your exclusive discount!
        </p>
      </div>

      <ScratchCard discount={discount} onReveal={() => setRevealed(true)} />

      {revealed && (
        <Button
          onClick={handleReset}
          className="mt-8 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 py-6 text-lg shadow-glow"
        >
          Try Again
        </Button>
      )}

      <div className="mt-12 text-center">
        <p className="text-sm text-muted-foreground">
          Possible discounts: 5%, 10%, 15%, 20%, 25%, 50%
        </p>
      </div>
    </div>
  );
};

export default Index;
