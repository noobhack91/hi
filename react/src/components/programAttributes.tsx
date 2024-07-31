import React, { useState, useEffect } from 'react';
import { formatDateWithoutTime, parseServerDateToDate } from '../utils/dateUtil'; // Assuming these utility functions exist
import _ from 'lodash';

interface ProgramAttributesProps {
    patientProgram: any;
    programAttributeTypes: any[];
}

const ProgramAttributes: React.FC<ProgramAttributesProps> = ({ patientProgram, programAttributeTypes }) => {
    const [programAttributesMap, setProgramAttributesMap] = useState<any>({});

    useEffect(() => {
        setProgramAttributesMap(getProgramAttributesMap());
    }, [patientProgram, programAttributeTypes]);

    const getProgramAttributesMap = () => {
        const programAttributesMap: any = {};
        const programAttributes = patientProgram.attributes;

        _.forEach(programAttributeTypes, (programAttributeType) => {
            const programAttribute = getProgramAttributeByType(programAttributes, programAttributeType);

            if (programAttribute !== undefined && !programAttribute.voided) {
                programAttributesMap[programAttributeType.name] = programAttribute.value;
                if (isCodedConceptFormat(programAttributeType.format)) {
                    programAttributesMap[programAttributeType.name] = programAttribute.value && programAttribute.value.uuid;
                } else if (isDateFormat(programAttributeType.format)) {
                    programAttributesMap[programAttributeType.name] = parseServerDateToDate(programAttributesMap[programAttributeType.name]);
                } else if (isOpenmrsConceptFormat(programAttributeType.format)) {
                    programAttributesMap[programAttributeType.name] = programAttribute.value && programAttribute.value.uuid;
                }
            }
        });

        return programAttributesMap;
    };

    const getValueForAttributeType = (attributeType: any) => {
        const programAttributesMap = patientProgram.patientProgramAttributes;

        if (isDateFormat(attributeType.format)) {
            return programAttributesMap[attributeType.name] ? formatDateWithoutTime(programAttributesMap[attributeType.name]) : "";
        } else if (isCodedConceptFormat(attributeType.format) || isOpenmrsConceptFormat(attributeType.format)) {
            const mrsAnswer = _.find(attributeType.answers, (answer) => {
                return answer.conceptId === programAttributesMap[attributeType.name];
            });
            return mrsAnswer ? mrsAnswer.description : "";
        } else {
            return programAttributesMap[attributeType.name];
        }
    };

    const isIncluded = (attribute: any) => {
        const program = patientProgram.program;
        return !(program && _.includes(attribute.excludeFrom, program.name));
    };

    const getProgramAttributeByType = (programAttributes: any[], attributeType: any) => {
        return _.find(programAttributes, (programAttribute) => {
            return programAttribute.attributeType.uuid === attributeType.uuid;
        });
    };

    const isDateFormat = (format: string) => {
        return format === "org.openmrs.util.AttributableDate" || format === "org.openmrs.customdatatype.datatype.DateDatatype";
    };

    const isCodedConceptFormat = (format: string) => {
        return format === "org.bahmni.module.bahmnicore.customdatatype.datatype.CodedConceptDatatype";
    };

    const isOpenmrsConceptFormat = (format: string) => {
        return format === "org.openmrs.customdatatype.datatype.ConceptDatatype";
    };

    return (
        <div>
            {/* Render logic for program attributes can be added here */}
            {programAttributeTypes.map((attributeType) => {
                if (isIncluded(attributeType)) {
                    return (
                        <div key={attributeType.uuid}>
                            <label>{attributeType.name}</label>
                            <span>{getValueForAttributeType(attributeType)}</span>
                        </div>
                    );
                }
                return null;
            })}
    );
};

export default ProgramAttributes;
