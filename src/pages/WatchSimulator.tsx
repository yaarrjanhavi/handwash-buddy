import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { GestureDisplay } from "@/components/GestureDisplay";
import { ProgressRing } from "@/components/ProgressRing";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import gesturePalmToPalm from "@/assets/gesture-palm-to-palm.png";
import gesturePalmOverDorsum from "@/assets/gesture-palm-over-dorsum.png";
import gestureInterlaced from "@/assets/gesture-fingers-interlaced.png";
import gestureBacksOfFingers from "@/assets/gesture-backs-of-fingers.png";
import gestureThumbRub from "@/assets/gesture-thumb-rub.png";
import gestureFingertipsRub from "@/assets/gesture-fingertips-rub.png";

const GESTURES = [
  { id: 1, name: "Palm to Palm", image: gesturePalmToPalm, description: "Rub palms together" },
  { id: 2, name: "Palm Over Dorsum", image: gesturePalmOverDorsum, description: "Right palm over left hand" },
  { id: 3, name: "Fingers Interlaced", image: gestureInterlaced, description: "Interlock fingers" },
  { id: 4, name: "Backs of Fingers", image: gestureBacksOfFingers, description: "Lock fingers and rub backs" },
  { id: 5, name: "Thumb Rotation", image: gestureThumbRub, description: "Rotate thumbs in palms" },
  { id: 6, name: "Fingertips Rotation", image: gestureFingertipsRub, description: "Rotate fingertips in palms" },
];

export default function WatchSimulator() {
  const [isActive, setIsActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [detectedGesture, setDetectedGesture] = useState<string>("Waiting...");
  const navigate = useNavigate();
  const { toast } = useToast();

  // Simulate gesture detection with placeholder logic
  const simulateGestureDetection = useCallback(() => {
    if (!isActive) return;

    // Placeholder: Auto-advance every 3 seconds
    const timer = setTimeout(() => {
      if (currentStep < GESTURES.length - 1) {
        setDetectedGesture(`✓ ${GESTURES[currentStep].name}`);
        
        // Vibrate on gesture recognition (if supported)
        if (navigator.vibrate) {
          navigator.vibrate(200);
        }

        setTimeout(() => {
          setCurrentStep(prev => prev + 1);
          setDetectedGesture("Detecting...");
        }, 1000);
      } else {
        // Complete the session
        completeSession();
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [isActive, currentStep]);

  useEffect(() => {
    simulateGestureDetection();
  }, [simulateGestureDetection]);

  const startSession = () => {
    setIsActive(true);
    setCurrentStep(0);
    setStartTime(Date.now());
    setDetectedGesture("Detecting...");
    toast({
      title: "Session Started",
      description: "Begin with palm-to-palm gesture",
    });
  };

  const completeSession = async () => {
    if (!startTime) return;

    const duration = Math.floor((Date.now() - startTime) / 1000);
    const score = Math.floor(85 + Math.random() * 15); // Placeholder score 85-100%

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Authentication Required",
          description: "Please sign in to save your session",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase.from("handwash_sessions").insert({
        user_id: user.id,
        duration_seconds: duration,
        gestures_completed: GESTURES.length,
        completion_score: score,
      });

      if (error) throw error;

      toast({
        title: "Session Complete! 🎉",
        description: `Score: ${score}% | Duration: ${duration}s`,
      });

      // Vibrate success pattern
      if (navigator.vibrate) {
        navigator.vibrate([200, 100, 200]);
      }

      // Reset and return to dashboard
      setTimeout(() => {
        setIsActive(false);
        setCurrentStep(0);
        setStartTime(null);
        navigate("/");
      }, 2000);
    } catch (error: any) {
      toast({
        title: "Error saving session",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const progress = ((currentStep + 1) / GESTURES.length) * 100;
  const currentGesture = GESTURES[currentStep];
  const nextGesture = currentStep < GESTURES.length - 1 ? GESTURES[currentStep + 1] : null;

  return (
    <div className="min-h-screen bg-watch-bg text-watch-text flex items-center justify-center p-4">
      <div className="relative w-full max-w-sm aspect-square">
        {/* Progress Ring */}
        <ProgressRing progress={progress} />

        {/* Main Content */}
        <div className="absolute inset-8 flex flex-col items-center justify-center space-y-6">
          {!isActive ? (
            <div className="text-center space-y-6">
              <h1 className="text-2xl font-bold">HandWash Monitor</h1>
              <p className="text-sm text-watch-text/70">WHO Standard Protocol</p>
              <Button
                onClick={startSession}
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-8 py-6 text-lg font-semibold shadow-lg"
              >
                Begin Handwash
              </Button>
              <Button
                onClick={() => navigate("/")}
                variant="ghost"
                className="text-watch-text/70 hover:text-watch-text"
              >
                Back to Dashboard
              </Button>
            </div>
          ) : (
            <>
              {/* Current Gesture */}
              <GestureDisplay
                gesture={currentGesture}
                status={detectedGesture}
                isLarge={true}
              />

              {/* Next Gesture Hint */}
              {nextGesture && (
                <div className="text-center">
                  <p className="text-xs text-watch-text/50 mb-2">Next:</p>
                  <GestureDisplay
                    gesture={nextGesture}
                    status=""
                    isLarge={false}
                  />
                </div>
              )}

              {/* Step Counter */}
              <div className="text-center">
                <p className="text-sm text-watch-text/70">
                  Step {currentStep + 1} of {GESTURES.length}
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
