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

  const featureStyles = [
    { // index 0: Light
      bg: 'bg-blue-50',
      title: 'text-black',
      description: 'text-gray-700'
    },
    { // index 1: Dark
      bg: 'bg-blue-500',
      title: 'text-black',
      description: 'text-black'
    },
    { // index 2: Light on mobile/desktop, Dark on tablet
      bg: 'bg-blue-50 md:bg-blue-500 xl:bg-blue-50',
      title: 'text-black',
      description: 'text-gray-700 md:text-black xl:text-gray-700'
    },
    { // index 3: Dark on mobile/desktop, Light on tablet
      bg: 'bg-blue-500 md:bg-blue-50 xl:bg-blue-500',
      title: 'text-black',
      description: 'text-black md:text-gray-700 xl:text-black'
    },
  ];


  return (
    <section className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          const styles = featureStyles[index];
          
          return (
            <div
              key={index}
              className={`${styles.bg} border-2 border-black p-8 md:p-12 flex flex-col justify-center min-h-[300px]`}
            >
              <div className="mb-6">
                <Icon 
                  size={48} 
                  className={styles.title}
                />
              </div>
              
              <h3 className={`text-2xl md:text-3xl font-bold mb-4 ${styles.title}`}>
                {feature.title}
              </h3>
              
              <p className={`text-base md:text-lg leading-relaxed ${styles.description}`}>
                {feature.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
} 