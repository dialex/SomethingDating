import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { phaseData } from "../data/phases";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { ArrowLeft, ArrowRight, CheckCircle2, Lightbulb } from "lucide-react";
import { motion } from "motion/react";

export default function PhasePage() {
  const { phaseId } = useParams<{ phaseId: string }>();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);

  const phase = phaseId ? phaseData[phaseId as keyof typeof phaseData] : null;

  if (!phase) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Phase not found</p>
      </div>
    );
  }

  const step = phase.steps[currentStep];
  const progress = ((currentStep + 1) / phase.steps.length) * 100;
  const isLastStep = currentStep === phase.steps.length - 1;

  const handleNext = () => {
    if (isLastStep) {
      navigate("/");
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-orange-50 to-pink-50">
      {/* Top App Bar */}
      <div className="bg-white/80 backdrop-blur-md sticky top-0 z-10 border-b border-gray-200">
        <div className="max-w-2xl mx-auto px-4 py-3">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="rounded-full -ml-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 pb-32 pt-6">
        {/* Phase Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-1">{phase.title}</h1>
          <p className="text-gray-600">{phase.description}</p>
        </div>

        {/* Segmented Progress Indicator */}
        <div className="flex gap-2 mb-8">
          {phase.steps.map((_, index) => (
            <div
              key={index}
              className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                index < currentStep
                  ? `bg-gradient-to-r ${phase.color}`
                  : index === currentStep
                  ? `bg-gradient-to-r ${phase.color} opacity-60`
                  : "bg-gray-200"
              }`}
            />
          ))}
        </div>

        {/* Step Content */}
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          {/* Step Number Chip */}
          <div className="flex items-center gap-3 mb-4">
            <div className={`rounded-full px-4 py-1 bg-gradient-to-r ${phase.color} text-white font-medium text-sm`}>
              Step {currentStep + 1} of {phase.steps.length}
            </div>
          </div>

          {/* Main Content Card */}
          <Card className="border-0 shadow-lg rounded-3xl mb-6 overflow-hidden">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold mb-4 text-gray-900">
                {step.title}
              </h2>
              <p className="text-base text-gray-700 mb-6 leading-relaxed">
                {step.content}
              </p>

              {/* Tips Section */}
              <div className="bg-amber-50 rounded-2xl p-5 border-0">
                <div className="flex items-center gap-2 mb-4">
                  <div className="bg-amber-100 rounded-full p-2">
                    <Lightbulb className="w-5 h-5 text-amber-700" />
                  </div>
                  <h3 className="font-semibold text-gray-900">Tips</h3>
                </div>
                <ul className="space-y-3">
                  {step.tips.map((tip, index) => (
                    <li key={index} className="text-gray-700 flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 flex-shrink-0" />
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Step Dots Navigation */}
          <div className="flex justify-center gap-2 mb-6">
            {phase.steps.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentStep(index)}
                className={`rounded-full transition-all ${
                  index === currentStep
                    ? `w-8 h-2 bg-gradient-to-r ${phase.color}`
                    : "w-2 h-2 bg-gray-300"
                }`}
                aria-label={`Go to step ${index + 1}`}
              />
            ))}
          </div>
        </motion.div>
      </div>

      {/* Bottom Navigation Bar - Material You Style */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-200 safe-bottom">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex gap-3">
            {/* Previous Button */}
            {currentStep > 0 && (
              <Button
                variant="outline"
                size="lg"
                onClick={handlePrevious}
                className="rounded-full px-6 border-2"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back
              </Button>
            )}

            {/* Next Button - FAB Style */}
            <Button
              size="lg"
              onClick={handleNext}
              className={`rounded-full flex-1 text-base font-semibold shadow-lg ${
                isLastStep
                  ? "bg-green-600 hover:bg-green-700"
                  : `bg-gradient-to-r ${phase.color} hover:opacity-90`
              }`}
            >
              {isLastStep ? (
                <>
                  <CheckCircle2 className="w-5 h-5 mr-2" />
                  Complete
                </>
              ) : (
                <>
                  Next
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}