import { useNavigate } from "react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Sparkles, Users, Heart, Leaf } from "lucide-react";
import { phaseData } from "../data/phases";

const iconMap = {
  Sparkles: Sparkles,
  Users: Users,
  Heart: Heart,
  Leaf: Leaf,
};

export default function HomePage() {
  const navigate = useNavigate();
  const phases = Object.values(phaseData);

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-orange-50 to-pink-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 pt-8">
          <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
            Your Dating Guide
          </h1>
          <p className="text-gray-600 text-lg">
            A step-by-step guide to build meaningful connections
          </p>
        </div>

        {/* Phase Cards */}
        <div className="grid gap-6 md:grid-cols-2">
          {phases.map((phase, index) => {
            const Icon = iconMap[phase.icon as keyof typeof iconMap];
            return (
              <Card
                key={phase.id}
                className="cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-105 overflow-hidden border-0 shadow-lg"
                onClick={() => navigate(`/phase/${phase.id}`)}
              >
                {/* Card Image with Title Overlay */}
                <div className="relative h-48 overflow-hidden">
                  <div className={`absolute inset-0 bg-gradient-to-br ${phase.color} opacity-90`} />
                  <img
                    src={phase.image}
                    alt={phase.title}
                    className="w-full h-full object-cover mix-blend-overlay"
                  />
                  {/* Title in bottom right corner */}
                  <div className="absolute bottom-4 right-4">
                    <h3 className="text-2xl font-bold text-white drop-shadow-lg">
                      {phase.title}
                    </h3>
                  </div>
                </div>

                {/* Card Content */}
                <CardContent className="pt-4 pb-4">
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>{phase.steps.length} steps</span>
                    <span className="text-rose-600 font-medium">Start →</span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Footer Message */}
        <div className="mt-12 text-center p-6 bg-white/50 backdrop-blur-sm rounded-2xl">
          <p className="text-gray-600">
            💝 Take your time with each phase. Great relationships are built step by step.
          </p>
        </div>
      </div>
    </div>
  );
}
