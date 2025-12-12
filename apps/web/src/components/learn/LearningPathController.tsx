import { useState, useEffect, useCallback } from 'react';
import type { LearningPath } from '~/data/learning-paths.config';

/**
 * Progress tracking interface
 * Stored in localStorage for persistence
 */
interface PathProgress {
  pathId: string;
  currentStep: number;
  completedSteps: number[];
  startedAt: string;
  lastAccessedAt: string;
  completedAt?: string;
}

/**
 * Step content resolved server-side
 */
interface StepContent {
  summary: string;
  tagline?: string;
}

interface Props {
  path: LearningPath;
  glossaryContent: Record<string, StepContent>;
  tagContent: Record<string, StepContent>;
}

const STORAGE_KEY = 'soranauts_learning_progress';

// Difficulty colors
const DIFFICULTY_COLORS = {
  beginner: '#22c55e',
  intermediate: '#eab308',
  advanced: '#ef4444',
};

/**
 * Load progress from localStorage
 */
const loadProgress = (pathId: string): PathProgress | null => {
  if (typeof window === 'undefined') return null;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    const all = JSON.parse(stored) as Record<string, PathProgress>;
    return all[pathId] || null;
  } catch {
    return null;
  }
};

/**
 * Save progress to localStorage
 */
const saveProgress = (progress: PathProgress) => {
  if (typeof window === 'undefined') return;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    const all = stored ? JSON.parse(stored) : {};
    all[progress.pathId] = progress;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  } catch {
    // Silent fail - localStorage might be full or disabled
  }
};

/**
 * LearningPathController
 * 
 * React component that manages learning path state and progression.
 * Handles step navigation, progress persistence, and keyboard shortcuts.
 */
export default function LearningPathController({ path, glossaryContent, tagContent }: Props) {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const [startedAt, setStartedAt] = useState<string | null>(null);

  // Load saved progress on mount
  useEffect(() => {
    const saved = loadProgress(path.id);
    if (saved) {
      setCurrentStep(saved.currentStep);
      setCompletedSteps(saved.completedSteps);
      setIsComplete(saved.completedAt !== undefined);
      setStartedAt(saved.startedAt);
    } else {
      setStartedAt(new Date().toISOString());
    }
  }, [path.id]);

  // Save progress on changes
  useEffect(() => {
    if (startedAt === null) return; // Don't save until initialized
    
    const progress: PathProgress = {
      pathId: path.id,
      currentStep,
      completedSteps,
      startedAt,
      lastAccessedAt: new Date().toISOString(),
      completedAt: isComplete ? new Date().toISOString() : undefined,
    };
    saveProgress(progress);
  }, [currentStep, completedSteps, isComplete, path.id, startedAt]);

  // Update progress bar in DOM
  useEffect(() => {
    const progressBar = document.querySelector('.progress-bar__fill') as HTMLElement;
    const stepText = document.querySelector('.progress-bar__step');
    
    if (progressBar) {
      const percent = isComplete 
        ? 100 
        : Math.round(((currentStep + 1) / path.steps.length) * 100);
      progressBar.style.width = `${percent}%`;
      progressBar.dataset.complete = String(isComplete);
    }
    
    if (stepText) {
      if (isComplete) {
        stepText.innerHTML = `<span class="progress-bar__complete"><svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 7L6 10L11 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>Complete</span>`;
      } else {
        stepText.textContent = `Step ${currentStep + 1} of ${path.steps.length}`;
      }
    }
  }, [currentStep, isComplete, path.steps.length]);

  const handleNext = useCallback(() => {
    if (currentStep < path.steps.length - 1) {
      // Mark current as completed
      if (!completedSteps.includes(currentStep)) {
        setCompletedSteps(prev => [...prev, currentStep]);
      }
      setCurrentStep(currentStep + 1);
      // Scroll to top of next step
      setTimeout(() => {
        document.querySelector(`[data-step="${currentStep + 1}"]`)?.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' 
        });
      }, 100);
    } else {
      // Last step - mark complete
      if (!completedSteps.includes(currentStep)) {
        setCompletedSteps(prev => [...prev, currentStep]);
      }
      setIsComplete(true);
      // Scroll to completion section
      setTimeout(() => {
        document.querySelector('.path-completion')?.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' 
        });
      }, 100);
    }
  }, [currentStep, completedSteps, path.steps.length]);

  const handlePrevious = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setTimeout(() => {
        document.querySelector(`[data-step="${currentStep - 1}"]`)?.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' 
        });
      }, 100);
    }
  }, [currentStep]);

  const handleStepClick = useCallback((index: number) => {
    setCurrentStep(index);
  }, []);

  const handleMarkComplete = useCallback((index: number) => {
    if (completedSteps.includes(index)) {
      setCompletedSteps(prev => prev.filter(i => i !== index));
    } else {
      setCompletedSteps(prev => [...prev, index]);
    }
  }, [completedSteps]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (e.key) {
        case 'ArrowDown':
        case 'n':
          e.preventDefault();
          handleNext();
          break;
        case 'ArrowUp':
        case 'p':
          e.preventDefault();
          handlePrevious();
          break;
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
        case '6':
        case '7':
        case '8':
        case '9':
          const stepNum = parseInt(e.key, 10) - 1;
          if (stepNum < path.steps.length) {
            e.preventDefault();
            handleStepClick(stepNum);
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrevious, handleStepClick, path.steps.length]);

  const getStepContent = (step: typeof path.steps[0]): string => {
    if (step.type === 'glossary') {
      return glossaryContent[step.slug]?.summary || step.summary || `Learn about ${step.title} in the SORA glossary.`;
    }
    return tagContent[step.slug]?.summary || step.summary || `Explore ${step.title} topics and related content.`;
  };

  const getStepUrl = (step: typeof path.steps[0]): string => {
    return step.type === 'glossary' 
      ? `/glossary/${step.slug}` 
      : `/tag/${step.slug}`;
  };

  const getStepState = (index: number): 'upcoming' | 'active' | 'completed' => {
    if (completedSteps.includes(index)) return 'completed';
    if (index === currentStep) return 'active';
    return 'upcoming';
  };

  const accentColor = DIFFICULTY_COLORS[path.difficulty];

  return (
    <div className="lpc" style={{ '--accent-color': accentColor } as React.CSSProperties}>
      {/* Steps Container */}
      <div className="lpc__steps">
        {path.steps.map((step, index) => {
          const state = getStepState(index);
          const isActive = index === currentStep;
          
          return (
            <div 
              key={step.slug}
              className={`lpc__step lpc__step--${state}`}
              data-step={index}
            >
              {/* Step Header - always visible */}
              <button 
                className="lpc__step-header"
                onClick={() => handleStepClick(index)}
                aria-expanded={isActive}
                aria-controls={`step-content-${index}`}
              >
                <span className="lpc__step-number">
                  {state === 'completed' ? (
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M3 7L6 10L11 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  ) : (
                    index + 1
                  )}
                </span>
                <span className="lpc__step-title">{step.title}</span>
                <span className="lpc__step-type">{step.type}</span>
                <svg 
                  className="lpc__step-chevron" 
                  width="16" 
                  height="16" 
                  viewBox="0 0 16 16" 
                  fill="none"
                  style={{ transform: isActive ? 'rotate(180deg)' : 'rotate(0deg)' }}
                >
                  <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>

              {/* Step Content - only when active */}
              {isActive && (
                <div 
                  id={`step-content-${index}`}
                  className="lpc__step-content"
                >
                  <p className="lpc__step-summary">{getStepContent(step)}</p>
                  
                  <div className="lpc__step-actions">
                    <a 
                      href={getStepUrl(step)} 
                      className="lpc__learn-more"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Learn More
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M2 10L10 2M10 2H4M10 2V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </a>

                    <label className="lpc__mark-complete">
                      <input 
                        type="checkbox"
                        checked={completedSteps.includes(index)}
                        onChange={() => handleMarkComplete(index)}
                      />
                      <span>Mark as complete</span>
                    </label>
                  </div>

                  {/* Navigation */}
                  <nav className="lpc__nav">
                    <button 
                      className="lpc__nav-btn lpc__nav-btn--prev"
                      onClick={handlePrevious}
                      disabled={index === 0}
                    >
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M10 4L6 8L10 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Previous
                    </button>

                    <span className="lpc__nav-progress">
                      Step {index + 1} of {path.steps.length}
                    </span>

                    <button 
                      className="lpc__nav-btn lpc__nav-btn--next"
                      onClick={handleNext}
                    >
                      {index === path.steps.length - 1 ? 'Complete Path' : 'Next Step'}
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </nav>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Keyboard Hints */}
      <div className="lpc__keyboard-hints">
        <span>Keyboard: <kbd>↑</kbd>/<kbd>↓</kbd> navigate, <kbd>1-9</kbd> jump to step</span>
      </div>

      <style>{`
        .lpc {
          --step-color-upcoming: var(--color-text-muted);
          --step-color-active: var(--accent-color, var(--red-600));
          --step-color-completed: #22c55e;
        }

        .lpc__steps {
          display: flex;
          flex-direction: column;
          gap: var(--space-3);
        }

        .lpc__step {
          border: 1px solid var(--color-border);
          border-radius: var(--radius-lg);
          overflow: hidden;
          transition: border-color 0.15s ease, box-shadow 0.15s ease;
          /* Account for sticky header/progress bar when scrolling */
          scroll-margin-top: 100px;
        }

        .lpc__step--upcoming {
          background: transparent;
        }

        .lpc__step--active {
          border-color: var(--step-color-active);
          box-shadow: 0 0 0 1px var(--step-color-active);
        }

        .lpc__step--completed {
          border-color: color-mix(in srgb, var(--step-color-completed) 30%, var(--color-border) 70%);
          background: color-mix(in srgb, var(--step-color-completed) 3%, transparent 97%);
        }

        .lpc__step-header {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          width: 100%;
          padding: var(--space-4);
          background: none;
          border: none;
          cursor: pointer;
          text-align: left;
          font-family: inherit;
          transition: background 0.15s ease;
        }

        .lpc__step-header:hover {
          background: var(--color-surface-hover);
        }

        .lpc__step-number {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 28px;
          height: 28px;
          font-size: var(--text-sm);
          font-weight: 700;
          border-radius: 50%;
          flex-shrink: 0;
        }

        .lpc__step--upcoming .lpc__step-number {
          background: var(--color-border);
          color: var(--color-text-muted);
        }

        .lpc__step--active .lpc__step-number {
          background: var(--step-color-active);
          color: white;
        }

        .lpc__step--completed .lpc__step-number {
          background: var(--step-color-completed);
          color: white;
        }

        .lpc__step-title {
          flex-grow: 1;
          font-size: var(--text-base);
          font-weight: 500;
          color: var(--color-text);
        }

        .lpc__step-type {
          font-size: var(--text-xs);
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--color-text-muted);
          padding: var(--space-1) var(--space-2);
          background: var(--color-surface);
          border-radius: var(--radius-sm);
        }

        .lpc__step-chevron {
          color: var(--color-text-muted);
          transition: transform 0.2s ease;
          flex-shrink: 0;
        }

        .lpc__step-content {
          padding: 0 var(--space-4) var(--space-4);
          padding-left: calc(var(--space-4) + 28px + var(--space-3));
          animation: slideDown 0.2s ease-out;
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .lpc__step-summary {
          font-size: var(--text-sm);
          color: var(--color-text-muted);
          line-height: 1.6;
          margin: 0 0 var(--space-4);
        }

        .lpc__step-actions {
          display: flex;
          align-items: center;
          gap: var(--space-4);
          margin-bottom: var(--space-4);
          flex-wrap: wrap;
        }

        .lpc__learn-more {
          display: inline-flex;
          align-items: center;
          gap: var(--space-1);
          font-size: var(--text-sm);
          font-weight: 500;
          color: var(--step-color-active);
          text-decoration: none;
        }

        .lpc__learn-more:hover {
          text-decoration: underline;
        }

        .lpc__mark-complete {
          display: inline-flex;
          align-items: center;
          gap: var(--space-2);
          font-size: var(--text-sm);
          color: var(--color-text-muted);
          cursor: pointer;
        }

        .lpc__mark-complete input {
          width: 16px;
          height: 16px;
          accent-color: var(--step-color-completed);
        }

        .lpc__nav {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: var(--space-3);
          padding-top: var(--space-4);
          border-top: 1px solid var(--color-border);
        }

        .lpc__nav-btn {
          display: inline-flex;
          align-items: center;
          gap: var(--space-1);
          padding: var(--space-2) var(--space-4);
          font-size: var(--text-sm);
          font-weight: 500;
          font-family: inherit;
          border-radius: var(--radius-md);
          cursor: pointer;
          transition: background 0.15s ease, opacity 0.15s ease;
        }

        .lpc__nav-btn--prev {
          background: var(--color-surface);
          color: var(--color-text);
          border: 1px solid var(--color-border);
        }

        .lpc__nav-btn--prev:hover:not(:disabled) {
          background: var(--color-surface-hover);
        }

        .lpc__nav-btn--prev:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .lpc__nav-btn--next {
          background: var(--step-color-active);
          color: white;
          border: none;
        }

        .lpc__nav-btn--next:hover {
          filter: brightness(0.9);
        }

        .lpc__nav-progress {
          font-size: var(--text-xs);
          color: var(--color-text-muted);
        }

        .lpc__keyboard-hints {
          margin-top: var(--space-4);
          padding: var(--space-3);
          font-size: var(--text-xs);
          color: var(--color-text-muted);
          text-align: center;
          background: var(--color-surface);
          border-radius: var(--radius-md);
        }

        .lpc__keyboard-hints kbd {
          display: inline-block;
          padding: 2px 6px;
          font-family: monospace;
          font-size: 11px;
          background: var(--color-surface-elevated);
          border: 1px solid var(--color-border);
          border-radius: 4px;
          margin: 0 2px;
        }

        @media (max-width: 640px) {
          .lpc__nav {
            flex-wrap: wrap;
            justify-content: center;
          }

          .lpc__nav-progress {
            width: 100%;
            text-align: center;
            order: -1;
            margin-bottom: var(--space-2);
          }

          .lpc__keyboard-hints {
            display: none;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .lpc__step,
          .lpc__step-header,
          .lpc__step-chevron,
          .lpc__nav-btn {
            transition: none;
          }

          .lpc__step-content {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}
