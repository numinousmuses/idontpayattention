import { UserX, Gift, Shield, Code } from "lucide-react";

export default function FeaturesSection() {
  const features = [
    {
      icon: UserX,
      title: "No account needed to start",
      description: "Jump right in and start generating notes instantly. No signup walls, no email verification, no waiting around."
    },
    {
      icon: Gift,
      title: "Forever free*",
      description: "Core features stay free forever. Bring your own API key and transcribe, unlimited notes without paying a dime."
    },
    {
      icon: Shield,
      title: "Private",
      description: "Your notes stay in your browser by default. We don't snoop, store, or sell your data. What you transcribe is yours alone."
    },
    {
      icon: Code,
      title: "Open Source",
      description: "Built in the open with an MIT license. Fork it, modify it, or contribute back to the community. No black boxes here."
    }
  ];

  return (
    <section className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          
          // Build background class based on index for 4-column layout
          let bgClass = "";
          if (index === 0) bgClass = "bg-blue-50 xl:bg-blue-50";
          if (index === 1) bgClass = "bg-blue-500 xl:bg-blue-500";
          if (index === 2) bgClass = "bg-blue-500 xl:bg-blue-50";
          if (index === 3) bgClass = "bg-blue-50 xl:bg-blue-500";
          
          return (
            <div
              key={index}
              className={`${bgClass} border-2 border-black p-8 md:p-12 flex flex-col justify-center min-h-[300px]`}
            >
              <div className="mb-6">
                <Icon 
                  size={48} 
                  className="text-black" 
                />
              </div>
              
              <h3 className="text-2xl md:text-3xl font-bold mb-4 text-black">
                {feature.title}
              </h3>
              
              <p className={`text-base md:text-lg leading-relaxed ${
                index === 0 ? 'text-gray-700 xl:text-gray-700' :
                index === 1 ? 'text-black xl:text-black' :
                index === 2 ? 'text-black xl:text-gray-700' :
                'text-gray-700 xl:text-black'
              }`}>
                {feature.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
} 