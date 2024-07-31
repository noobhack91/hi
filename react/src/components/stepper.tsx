import React, { useState } from 'react';

interface StepperProps {
  obs: {
    disabled: boolean;
    uniqueId: string;
    concept: {
      hiNormal: number | null;
      lowNormal: number | null;
    };
  };
  ngClass?: string;
  focusMe?: boolean;
  ngModel: number;
  onChange: (value: number) => void;
}

const Stepper: React.FC<StepperProps> = ({ obs, ngClass, focusMe, ngModel, onChange }) => {
  const [value, setValue] = useState<number>(ngModel);

  const updateModel = (offset: number) => {
    let currValue = isNaN(value) ? 0 : value;
    if (isNaN(value) && obs.concept.lowNormal != null) {
      currValue = obs.concept.lowNormal - offset; // To mention the start point for Plus And Minus
    }
    const newValue = currValue + offset;
    setValue(newValue);
    onChange(newValue);
  };

  const increment = () => {
    if (obs.concept.hiNormal != null) {
      if (value < obs.concept.hiNormal) {
        updateModel(1);
      }
    } else {
      updateModel(1);
    }
  };

  const decrement = () => {
    if (obs.concept.lowNormal != null) {
      if (value > obs.concept.lowNormal) {
        updateModel(-1);
      }
    } else {
      updateModel(-1);
    }
  };

  return (
    <div className={`stepper clearfix ${ngClass}`}>
      <button onClick={decrement} className="stepper__btn stepper__minus" disabled={obs.disabled}>-</button>
      <input
        id={obs.uniqueId}
        className={`stepper__field ${ngClass}`}
        type="text"
        value={value}
        onChange={(e) => {
          const newValue = parseInt(e.target.value, 10);
          setValue(newValue);
          onChange(newValue);
        }}
        disabled={obs.disabled}
        autoFocus={focusMe}
      />
      <button onClick={increment} className="stepper__btn stepper__plus" disabled={obs.disabled}>+</button>
    </div>
  );
};

export default Stepper;
