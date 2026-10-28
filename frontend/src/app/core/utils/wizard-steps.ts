export type WizardPath = 'personal' | 'address' | 'review';

const PATHS: WizardPath[] = ['personal', 'address', 'review'];

export function stepPath(step: number): WizardPath {
  return PATHS[step - 1] ?? 'personal';
}