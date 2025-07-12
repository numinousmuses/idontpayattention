import { UserX, Gift, Shield, Code } from "lucide-react";

export default function FeaturesSection() {
  const features = [
    {
      icon: UserX,
      title: "No account needed to start",
      description: "Jump right in and start generating notes instantly. No signup walls, no email verification, no waiting around.",
      bgColor: "bg-gray-100"
    },
    {
      icon: Gift,
      title: "Forever free*",
      description: "Core features stay free forever. Bring your own API key and transcribe, unlimited notes without paying a dime.",
      bgColor: "bg-blue-500"
    },
    {
      icon: Shield,
      title: "Private",
      description: "Your notes stay in your browser by default. We don't snoop, store, or sell your data. What you transcribe is yours alone.",
      bgColor: "bg-blue-500"
    },
    {
      icon: Code,
      title: "Open Source",
      description: "Built in the open with an MIT license. Fork it, modify it, or contribute back to the community. No black boxes here.",
      bgColor: "bg-gray-100"
    }
  ];

  return (
    <section className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          const isBlue = feature.bgColor === "bg-blue-500";
          
          return (
            <div
              key={index}
              className={`${feature.bgColor} border-2 border-black p-8 md:p-12 flex flex-col justify-center min-h-[300px]`}
            >
              <div className="mb-6">
                <Icon 
                  size={48} 
                  className={`${isBlue ? 'text-black' : 'text-black'}`} 
                />
              </div>
              
              <h3 className={`text-2xl md:text-3xl font-bold mb-4 ${isBlue ? 'text-black' : 'text-black'}`}>
                {feature.title}
              </h3>
              
              <p className={`text-base md:text-lg leading-relaxed ${isBlue ? 'text-black' : 'text-gray-700'}`}>
                {feature.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
} 