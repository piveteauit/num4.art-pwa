import { motion } from "framer-motion";
interface ProgressBarProps {
  steps: string[];
  currentStep: number;
}

export default function ProgressBar({ steps, currentStep }: ProgressBarProps) {
  return (
    <div className="px-6 mt-6 w-full">
      {/* <div className="flex justify-between">
        {steps.map((step, index) => (
          <div key={step} className="flex flex-col items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center
              ${index <= currentStep ? "bg-primary" : "bg-gray-600"}`}
            >
              {index + 1}
            </div>
            <span className="mt-2 text-sm">{step}</span>
          </div>
        ))}
      </div> */}
      <div className="relative">
        <div className="h-1 bg-gray-600 w-full rounded" />
        <motion.div
          initial={{ width: "0%" }}
          animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          transition={{ duration: 0.3 }}
          className="h-1 bg-primary absolute top-0 rounded"
        />
      </div>
    </div>
  );
}
