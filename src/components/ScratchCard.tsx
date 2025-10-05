import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { type DiscountOffer } from "@/lib/discounts";

interface ScratchCardProps {
  offer: DiscountOffer;
  onReveal?: () => void;
}

export const ScratchCard = ({ offer, onReveal }: ScratchCardProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [isScratching, setIsScratching] = useState(false);
  // Progress tracking removed per request – keeping only reveal logic.

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * 2; // Higher resolution
    canvas.height = rect.height * 2;
    ctx.scale(2, 2);

    // Create more attractive scratch overlay with shimmer effect
    const gradient = ctx.createLinearGradient(0, 0, rect.width, rect.height);
    gradient.addColorStop(0, "#c084a1");
    gradient.addColorStop(0.5, "#d4a5c4");
    gradient.addColorStop(1, "#a86b85");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, rect.width, rect.height);

    // Add shimmer overlay
    const shimmer = ctx.createLinearGradient(0, 0, rect.width, 0);
    shimmer.addColorStop(0, "rgba(255, 255, 255, 0.1)");
    shimmer.addColorStop(0.5, "rgba(255, 255, 255, 0.4)");
    shimmer.addColorStop(1, "rgba(255, 255, 255, 0.1)");
    ctx.fillStyle = shimmer;
    ctx.fillRect(0, 0, rect.width, rect.height);

    // Add text overlay with better visual hierarchy
    ctx.fillStyle = "rgba(255, 255, 255, 0.95)";
    ctx.font = "bold 28px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("🪙 SCRATCH HERE", rect.width / 2, rect.height / 2 - 15);

    ctx.font = "18px sans-serif";
    ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
    ctx.fillText(
      "Reveal your exclusive offer!",
      rect.width / 2,
      rect.height / 2 + 15
    );

    // Add visual hint for mobile users
    ctx.font = "14px sans-serif";
    ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
  }, []);

  const scratch = (x: number, y: number) => {
    const canvas = canvasRef.current;
    if (!canvas || isRevealed) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    // Create more natural, irregular scratch pattern
    const baseSize = 20;
    const sizeVariation = Math.random() * 15 + 5; // Random variation for natural look
    const brushSize = baseSize + sizeVariation;

    ctx.globalCompositeOperation = "destination-out";

    // Create irregular scratch pattern with multiple overlapping circles
    for (let i = 0; i < 3; i++) {
      const offsetX = (Math.random() - 0.5) * 10;
      const offsetY = (Math.random() - 0.5) * 10;
      const currentSize = brushSize - i * 8;

      ctx.beginPath();
      ctx.arc(
        (x + offsetX) * scaleX,
        (y + offsetY) * scaleY,
        currentSize * scaleX,
        0,
        Math.PI * 2
      );
      ctx.fill();
    }

    // Add subtle, natural-looking scratch marks around the edges
    ctx.globalCompositeOperation = "source-over";
    ctx.strokeStyle = "rgba(200, 180, 160, 0.3)"; // Subtle brown/gold color like real scratch cards
    ctx.lineWidth = 2 * scaleX;
    ctx.lineCap = "round";

    // Create random scratch marks
    for (let i = 0; i < 2; i++) {
      const angle = Math.random() * Math.PI * 2;
      const length = Math.random() * 20 + 10;
      const startX = x + Math.cos(angle) * (brushSize * 0.7);
      const startY = y + Math.sin(angle) * (brushSize * 0.7);
      const endX = startX + Math.cos(angle) * length;
      const endY = startY + Math.sin(angle) * length;

      ctx.beginPath();
      ctx.moveTo(startX * scaleX, startY * scaleY);
      ctx.lineTo(endX * scaleX, endY * scaleY);
      ctx.stroke();
    }

    // Check scratch percentage
    checkScratchPercentage(ctx, rect.width, rect.height);
  };

  const checkScratchPercentage = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number
  ) => {
    const imageData = ctx.getImageData(0, 0, width * 2, height * 2);
    let transparent = 0;

    for (let i = 3; i < imageData.data.length; i += 4) {
      if (imageData.data[i] === 0) {
        transparent++;
      }
    }

    const scratchedPercentage =
      (transparent / (imageData.data.length / 4)) * 100;

    // Auto-reveal when at least 50% is scratched
    if (scratchedPercentage >= 50 && !isRevealed) {
      // Clear the entire canvas with a smooth animation effect
      ctx.globalCompositeOperation = "destination-out";
      ctx.fillStyle = "rgba(0, 0, 0, 1)";
      ctx.fillRect(0, 0, width * 2, height * 2);

      setIsRevealed(true);
      onReveal?.();
    }
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsScratching(true);
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      scratch(e.clientX - rect.left, e.clientY - rect.top);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isScratching) return;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      scratch(e.clientX - rect.left, e.clientY - rect.top);
    }
  };

  const handleMouseUp = () => {
    setIsScratching(false);
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault(); // Prevent scrolling while scratching
    setIsScratching(true);
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect && e.touches[0]) {
      scratch(
        e.touches[0].clientX - rect.left,
        e.touches[0].clientY - rect.top
      );
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault(); // Prevent scrolling while scratching
    if (!isScratching) return;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect && e.touches[0]) {
      scratch(
        e.touches[0].clientX - rect.left,
        e.touches[0].clientY - rect.top
      );
    }
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    setIsScratching(false);
  };

  return (
    <div className="relative w-full max-w-md mx-auto">
      <Card className="relative overflow-hidden shadow-card border-primary/20">
        <div className="relative aspect-[3/2] bg-gradient-gold p-4 sm:p-8 flex items-center justify-center">
          <div
            className={`absolute inset-0 flex flex-col items-center justify-center px-4 transition-all duration-500 ${
              isRevealed ? "animate-reveal" : "opacity-0"
            }`}
          >
            <div
              className={`text-4xl sm:text-6xl md:text-7xl font-bold text-primary-foreground mb-2 sm:mb-4 text-center ${
                offer.isLucky ? "animate-glow-pulse" : ""
              }`}
            >
              {offer.label}
            </div>
            <div className="text-sm sm:text-lg md:text-xl text-primary-foreground/90 text-center px-2">
              {offer.description}
            </div>
          </div>
          <canvas
            ref={canvasRef}
            className={`absolute inset-0 w-full h-full touch-none select-none ${
              isRevealed
                ? "cursor-default pointer-events-none"
                : isScratching
                ? "cursor-grabbing"
                : "cursor-grab"
            }`}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            style={{
              touchAction: "none",
              userSelect: "none",
              WebkitUserSelect: "none",
              msUserSelect: "none",
            }}
          />
        </div>
      </Card>
    </div>
  );
};
