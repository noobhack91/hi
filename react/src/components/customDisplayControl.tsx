import React from 'react';

interface CustomDisplayControlProps {
    patient: any;
    visitUuid: string;
    section: any;
    config: any;
    enrollment: any;
    params: any;
    visitSummary: any;
}

const CustomDisplayControl: React.FC<CustomDisplayControlProps> = ({
    patient,
    visitUuid,
    section,
    config,
    enrollment,
    params,
    visitSummary
}) => {
    return (
        <div dangerouslySetInnerHTML={{ __html: config.template }} />
    );
};

export default CustomDisplayControl;
