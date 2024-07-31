import React from 'react';

interface ProviderDirectiveProps {
    creatorName?: string;
    providerName: string;
    providerDate?: string;
}

const ProviderDirective: React.FC<ProviderDirectiveProps> = ({ creatorName, providerName, providerDate }) => {
    return (
        <span>
            {creatorName && providerName && creatorName !== providerName && (
                <span>
                    {creatorName} {/* SECOND AGENT: [MISSING CONTEXT] - Translation key for "ON_BEHALF_OF_TRANSLATION_KEY" */}
                </span>
            )}
            {providerName}
            {providerDate && (
                <span>
                    {/* SECOND AGENT: [MISSING CONTEXT] - Format providerDate using bahmniTime equivalent in React */}
                    {providerDate}
                </span>
            )}
        </span>
    );
};

export default ProviderDirective;
