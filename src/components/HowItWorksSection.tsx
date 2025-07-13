import ImageCard from "@/components/ui/image-card";

export default function HowItWorksSection() {
  const steps = [
    {
      caption: "Start the listener",
      imageUrl: "/notesclip1.gif"
    },
    {
      caption: "Generates smart notes and a TL:DR",
      imageUrl: "/notesclip2.gif"
    },
    {
      caption: "Copy, download or share",
      imageUrl: "/notesclip3.gif"
    }
  ];

  return (
    <section className="w-full py-24 bg-white border-t-2 border-b-2 border-black">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl md:text-5xl font-bold text-center text-black mb-12">
          How it works - 3 steps, max
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 max-w-6xl mx-auto">
          {steps.map((step, index) => (
            <ImageCard
              key={index}
              caption={step.caption}
              imageUrl={step.imageUrl}
              className="w-full min-w-0"
            />
          ))}
        </div>
      </div>
    </section>
  );
} 