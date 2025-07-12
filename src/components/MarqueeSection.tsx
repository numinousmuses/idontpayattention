import Star8 from "@/components/stars/s8";
import Star12 from "@/components/stars/s12";
import Star14 from "@/components/stars/s14";
import Star22 from "@/components/stars/s22";
import Star26 from "@/components/stars/s26";
import Star29 from "@/components/stars/s29";

export default function MarqueeSection() {
  const starComponents = [Star8, Star12, Star14, Star22, Star26, Star29];

  const texts = [
    "Full transparency",
    "Open source", 
    "No account needed",
    "Forever free*",
    "Private"
  ];

  const extendedTexts = [...texts, ...texts];

  // Create content with text and stars
  const content = extendedTexts.map((text, index) => {
    const StarComponent = starComponents[index % starComponents.length];
    
    const starProps = index % 2 === 0 
      ? { color: "#3b82f6", stroke: "black", strokeWidth: 2 } // Tailwind blue-500
      : { color: "black" };

    return (
      <div key={`item-${index}`} className="flex items-center gap-8 mx-4">
        <span className="text-2xl md:text-3xl font-bold text-black whitespace-nowrap">
          {text}
        </span>
        <StarComponent size={32} {...starProps} />
      </div>
    );
  });

  return (
    <section className="w-full">
      <div className="relative flex w-full overflow-x-hidden border-t-4 border-b-2 border-black bg-white">
        <div className="animate-marquee whitespace-nowrap py-4 flex items-center">
          {content}
        </div>
        
        <div className="absolute top-0 animate-marquee2 whitespace-nowrap py-4 flex items-center">
          {content}
        </div>
      </div>
    </section>
  );
} 