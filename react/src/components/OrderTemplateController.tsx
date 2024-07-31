import React, { useState } from 'react';

interface OrderTemplate {
  drug: { name: string };
  dosingInstructions: {
    dose: number;
    doseUnits: string;
    dosingRule: string;
    frequency: string;
    route: string;
  };
  administrationInstructions: string;
  duration: number;
  durationUnits: string;
  additionalInstructions: string;
}

interface OrderTemplateControllerProps {
  orderSetMember: {
    orderTemplate: OrderTemplate;
  };
  treatmentConfig: {
    doseUnits: { name: string }[];
    dosingRules: string[];
    frequencies: { name: string }[];
    dosingInstructions: { name: string }[];
    durationUnits: { name: string }[];
    routes: { name: string }[];
  };
  onSelectOfDrug: (orderSetMember: any) => void;
  onChange: (orderSetMember: any) => void;
  getDrugsOf: (orderSetMember: any) => any[];
  isRuleMode: (orderSetMember: any) => boolean;
  treatment: {
    calculateDurationInDays: () => void;
  };
}

const OrderTemplateController: React.FC<OrderTemplateControllerProps> = ({
  orderSetMember,
  treatmentConfig,
  onSelectOfDrug,
  onChange,
  getDrugsOf,
  isRuleMode,
  treatment,
}) => {
  const [conceptNameInvalid, setConceptNameInvalid] = useState(false);

  return (
    <section className="edit-drug-order">
      <form name="addForm">
        <div className="clearfix">
          <div className="form-field">
            <div className="field-value">
              <input
                className="enter-concept"
                type="text"
                name="conceptSetTemplate"
                value={orderSetMember.orderTemplate.drug.name}
                onChange={(e) => onChange(orderSetMember)}
                placeholder="Enter a drug name"

                onSelect={(selected) => onSelectOfDrug(orderSetMember)}
                onBlur={() => setConceptNameInvalid(false)}
                onFocus={() => setConceptNameInvalid(true)}
                source={() => getDrugsOf(orderSetMember)}
                strictSelect={true}
                isInvalid={conceptNameInvalid}
              />
            </div>
          </div>
          <div className="form-field">
            <div className="field-value">
              <input
                id="uniform-dose"
                className="form-field dose"
                type="number"
                min="0"
                step="any"
                placeholder="Dose"
                value={orderSetMember.orderTemplate.dosingInstructions.dose}
                onChange={(e) => onChange(orderSetMember)}
                required
                disabled={isRuleMode(orderSetMember) && orderSetMember.orderTemplate.dosingInstructions.dosingRule === 'customrule'}
              />
            </div>
          </div>
          <div className="form-field">
            <div className="field-value">
              <select
                id="uniform-dose-unit"
                className="form-field freq-dose-units"
                value={orderSetMember.orderTemplate.dosingInstructions.doseUnits}
                onChange={(e) => onChange(orderSetMember)}
                required
                disabled={isRuleMode(orderSetMember)}
              >
                <option value="">Choose Unit</option>
                {treatmentConfig.doseUnits.map((item) => (
                  <option key={item.name} value={item.name}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="form-field">
            <div className="field-value">
              <select
                id="dosingrule"
                className="form-field frequency"
                value={orderSetMember.orderTemplate.dosingInstructions.dosingRule}
                onChange={(e) => onChange(orderSetMember)}
                placeholder="Please select a rule"
              >
                <option value="">Choose Rule</option>
                {treatmentConfig.dosingRules.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="form-field">
            <div className="field-value">
              <select
                id="frequency"
                className="form-field frequency"
                value={orderSetMember.orderTemplate.dosingInstructions.frequency}
                onChange={(e) => onChange(orderSetMember)}
                required
                placeholder="Please select a frequency"
              >
                <option value="">Choose frequency</option>
                {treatmentConfig.frequencies.map((item) => (
                  <option key={item.name} value={item.name}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <div className="clearfix">
          <div className="form-field">
            <div className="field-value">
              <select
                value={orderSetMember.orderTemplate.administrationInstructions}
                onChange={(e) => onChange(orderSetMember)}
              >
                <option value="">Choose Instruction</option>
                {treatmentConfig.dosingInstructions.map((item) => (
                  <option key={item.name} value={item.name}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="form-field">
            <div className="field-value">
              <input
                type="number"
                min="1"
                placeholder="Duration"
                value={orderSetMember.orderTemplate.duration}
                onChange={(e) => {
                  onChange(orderSetMember);
                  treatment.calculateDurationInDays();
                }}
                required
                pattern="^[0-9]+$"
              />
            </div>
          </div>
          <div className="form-field">
            <div className="field-value">
              <select
                value={orderSetMember.orderTemplate.durationUnits}
                onChange={(e) => onChange(orderSetMember)}
                required
              >
                <option value="">Choose Unit</option>
                {treatmentConfig.durationUnits.map((item) => (
                  <option key={item.name} value={item.name}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="form-field">
            <div className="field-value">
              <select
                value={orderSetMember.orderTemplate.dosingInstructions.route}
                onChange={(e) => onChange(orderSetMember)}
                required
              >
                <option value="">Choose Route</option>
                {treatmentConfig.routes.map((item) => (
                  <option key={item.name} value={item.name}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="form-field">
            <div className="field-value">
              <textarea
                className="order-set-additionalInstructions"
                placeholder="Additional Instructions"
                value={orderSetMember.orderTemplate.additionalInstructions}
                onChange={(e) => onChange(orderSetMember)}
              />
            </div>
          </div>
        </div>
      </form>
    </section>
  );
};

export default OrderTemplateController;
