import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

interface ScratchCardProps {
  discount: number;
  onReveal?: () => void;
}

const DISCOUNTS = [5, 10, 15, 20, 25, 50];

export const ScratchCard = ({ discount, onReveal }: ScratchCardProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [isScratching, setIsScratching] = useState(false);
  const scratchedPixelsRef = useRef(0);
  const totalPixelsRef = useRef(0);

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

    // Create scratch overlay with gradient
    const gradient = ctx.createLinearGradient(0, 0, rect.width, rect.height);
    gradient.addColorStop(0, "#c4b5fd");
    gradient.addColorStop(1, "#8b5cf6");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, rect.width, rect.height);

    // Add text overlay
    ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
    ctx.font = "bold 24px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("SCRATCH HERE", rect.width / 2, rect.height / 2 - 10);
    
    ctx.font = "16px sans-serif";
    ctx.fillText("to reveal your discount!", rect.width / 2, rect.height / 2 + 20);

    // Calculate total pixels
    totalPixelsRef.current = rect.width * rect.height;
  }, []);

  const scratch = (x: number, y: number) => {
    const canvas = canvasRef.current;
    if (!canvas || isRevealed) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(x * scaleX, y * scaleY, 30 * scaleX, 0, Math.PI * 2);
    ctx.fill();

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

    const scratchedPercentage = (transparent / (imageData.data.length / 4)) * 100;

    if (scratchedPercentage > 60 && !isRevealed) {
      setIsRevealed(true);
      onReveal?.();
      toast.success(`Congratulations! You won ${discount}% OFF!`, {
        description: "Your discount has been revealed!",
      });
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
    setIsScratching(true);
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect && e.touches[0]) {
      scratch(e.touches[0].clientX - rect.left, e.touches[0].clientY - rect.top);
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (!isScratching) return;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect && e.touches[0]) {
      scratch(e.touches[0].clientX - rect.left, e.touches[0].clientY - rect.top);
    }
  };

  return (
    <Card className="relative w-full max-w-md mx-auto overflow-hidden shadow-card border-primary/20">
      <div className="relative aspect-[3/2] bg-gradient-gold p-8 flex items-center justify-center">
        <div
          className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-500 ${
            isRevealed ? "animate-reveal" : "opacity-0"
          }`}
        >
          <div className="text-8xl font-bold text-primary-foreground mb-4 animate-glow-pulse">
            {discount}%
          </div>
          <div className="text-2xl font-semibold text-primary-foreground">
            OFF
          </div>
          <div className="text-lg text-primary-foreground/80 mt-2">
            Discount Unlocked!
          </div>
        </div>
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full cursor-pointer touch-none"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleMouseUp}
          style={{ touchAction: "none" }}
        />
      </div>
    </Card>
  );
};

export const getRandomDiscount = () => {
  return DISCOUNTS[Math.floor(Math.random() * DISCOUNTS.length)];
};
