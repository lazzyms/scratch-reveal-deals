import { useState } from "react";
import { ScratchCard } from "@/components/ScratchCard";
import { getRandomOffer } from "@/lib/discounts";
import { Button } from "@/components/ui/button";

const Index = () => {
  const [offer, setOffer] = useState(getRandomOffer());
  const [revealed, setRevealed] = useState(false);

  const handleReset = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gradient-purple flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="text-center mb-6 sm:mb-8 space-y-2 sm:space-y-4 max-w-2xl">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground">
          M&M Candles
        </h1>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">
          Scratch & Win
        </h2>
        <p className="text-base sm:text-lg md:text-xl text-muted-foreground px-4">
          Scratch the card to reveal your exclusive offer!
        </p>
        <p className="text-base sm:text-md md:text-lg text-muted-foreground px-4">
          (Upto 20% OFF<sup>*</sup>)
        </p>
      </div>

      <ScratchCard offer={offer} onReveal={() => setRevealed(true)} />

      {revealed && (
        <Button
          onClick={handleReset}
          className="mt-6 sm:mt-8 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-6 sm:px-8 py-4 sm:py-6 text-base sm:text-lg shadow-glow"
        >
          Reset
        </Button>
      )}
    </div>
  );
};

export default Index;
