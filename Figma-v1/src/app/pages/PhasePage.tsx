import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { phaseData } from "../data/phases";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Progress } from "../components/ui/progress";
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
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-orange-50 to-pink-50 p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8 pt-4">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="mb-4 -ml-2"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>

          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
            <h1 className="text-3xl font-bold mb-2">{phase.title}</h1>
            <p className="text-gray-600 mb-4">{phase.description}</p>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">
                  Step {currentStep + 1} of {phase.steps.length}
                </span>
                <span className="font-medium text-rose-600">
                  {Math.round(progress)}% Complete
                </span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          </div>
        </div>

        {/* Step Content */}
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="mb-6 border-0 shadow-xl">
            <CardHeader className={`bg-gradient-to-r ${phase.color} text-white rounded-t-lg`}>
              <CardTitle className="text-2xl">{step.title}</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <CardDescription className="text-base text-gray-700 mb-6 leading-relaxed">
                {step.content}
              </CardDescription>

              {/* Tips Section */}
              <div className="bg-amber-50 rounded-xl p-5 border border-amber-200">
                <div className="flex items-start gap-3 mb-3">
                  <Lightbulb className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                  <h3 className="font-semibold text-gray-800">Quick Tips</h3>
                </div>
                <ul className="space-y-2 ml-8">
                  {step.tips.map((tip, index) => (
                    <li key={index} className="text-gray-700 text-sm flex items-start gap-2">
                      <span className="text-amber-600 font-bold">•</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Navigation Buttons */}
        <div className="flex gap-4">
          <Button
            variant="outline"
            size="lg"
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="flex-1"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>
          <Button
            size="lg"
            onClick={handleNext}
            className={`flex-1 ${
              isLastStep
                ? "bg-green-600 hover:bg-green-700"
                : "bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600"
            }`}
          >
            {isLastStep ? (
              <>
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Complete Phase
              </>
            ) : (
              <>
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </div>

        {/* Step Indicators */}
        <div className="flex justify-center gap-2 mt-8">
          {phase.steps.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentStep(index)}
              className={`h-2 rounded-full transition-all ${
                index === currentStep
                  ? "w-8 bg-rose-500"
                  : index < currentStep
                  ? "w-2 bg-rose-300"
                  : "w-2 bg-gray-300"
              }`}
              aria-label={`Go to step ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
