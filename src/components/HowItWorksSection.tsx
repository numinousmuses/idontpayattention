import ImageCard from "@/components/ui/image-card";

export default function HowItWorksSection() {
  const steps = [
    {
      caption: "Drop a link / file / text",
      imageUrl: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=400&h=300&fit=crop"
    },
    {
      caption: "Generates smart notes and a TL:DR",
      imageUrl: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=300&fit=crop"
    },
    {
      caption: "Copy, download or share",
      imageUrl: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=400&h=300&fit=crop"
    }
  ];

  return (
    <section className="w-full py-16 bg-white">
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