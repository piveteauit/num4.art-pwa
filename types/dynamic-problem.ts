export interface StepProps {
  emoji: string;
  text: string;
}

export interface DynamicProblemProps {
  title?: string;
  description?: string;
  conclusion?: string;

  steps: StepProps[];
}
