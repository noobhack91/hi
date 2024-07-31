import React, { useState, useEffect } from 'react';
import { Spinner } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useMessagingService } from '../services/messagingService';

interface FormProps {
    form: any;
    patient: any;
    validateForm: boolean;
}

const FormControls: React.FC<FormProps> = ({ form, patient, validateForm }) => {
    const [loadedFormDetails, setLoadedFormDetails] = useState<any>({});
    const [loadedFormTranslations, setLoadedFormTranslations] = useState<any>({});
    const { t } = useTranslation();
    const { showMessage } = useMessagingService();

    useEffect(() => {
        const formUuid = form.formUuid;
        const formVersion = form.formVersion;
        const formName = form.formName;
        const formObservations = form.observations;
        const collapse = form.collapseInnerSections && form.collapseInnerSections.value;
        const locale = t('currentLanguage');

        if (!loadedFormDetails[formUuid]) {
            Spinner.forPromise(
                formService.getFormDetail(formUuid, { v: "custom:(resources:(value))" })
                    .then((response: any) => {
                        const formDetailsAsString = _.get(response, 'data.resources[0].value');
                        if (formDetailsAsString) {
                            const formDetails = JSON.parse(formDetailsAsString);
                            formDetails.version = formVersion;
                            setLoadedFormDetails((prevDetails: any) => ({
                                ...prevDetails,
                                [formUuid]: formDetails
                            }));
                            const formParams = { formName, formVersion, locale, formUuid };
                            form.events = formDetails.events;
                            Spinner.forPromise(
                                formService.getFormTranslations(formDetails.translationsUrl, formParams)
                                    .then((response: any) => {
                                        const formTranslations = !_.isEmpty(response.data) ? response.data[0] : {};
                                        setLoadedFormTranslations((prevTranslations: any) => ({
                                            ...prevTranslations,
                                            [formUuid]: formTranslations
                                        }));
                                        form.component = renderWithControls(formDetails, formObservations, formUuid, collapse, patient, validateForm, locale, formTranslations);
                                    })
                                    .catch(() => {
                                        const formTranslations = {};
                                        setLoadedFormTranslations((prevTranslations: any) => ({
                                            ...prevTranslations,
                                            [formUuid]: formTranslations
                                        }));
                                        form.component = renderWithControls(formDetails, formObservations, formUuid, collapse, patient, validateForm, locale, formTranslations);
                                    })
                            );
                        }
                        unMountReactContainer(formUuid);
                    })
            );
        } else {
            setTimeout(() => {
                form.events = loadedFormDetails[formUuid].events;
                form.component = renderWithControls(loadedFormDetails[formUuid], formObservations, formUuid, collapse, patient, validateForm, locale, loadedFormTranslations[formUuid]);
                unMountReactContainer(formUuid);
            }, 0);
        }

        return () => {
            if (form.component) {
                const formObservations = form.component.getValue();
                form.observations = formObservations.observations;

                const hasError = formObservations.errors;
                if (!_.isEmpty(hasError)) {
                    form.isValid = false;
                }
            }
        };
    }, [form, patient, validateForm, loadedFormDetails, loadedFormTranslations, t]);

    useEffect(() => {
        const collapse = form.collapseInnerSections && form.collapseInnerSections.value;
        if (loadedFormDetails[form.formUuid]) {
            form.component = renderWithControls(loadedFormDetails[form.formUuid], form.observations, form.formUuid, collapse, patient, validateForm, t('currentLanguage'), loadedFormTranslations[form.formUuid]);
        }
    }, [form.collapseInnerSections, form.formUuid, form.observations, loadedFormDetails, loadedFormTranslations, patient, validateForm, t]);

    const unMountReactContainer = (formUuid: string) => {
        const reactContainerElement = document.getElementById(formUuid);
        if (reactContainerElement) {
            reactContainerElement.addEventListener('destroy', () => {
                unMountForm(document.getElementById(formUuid));
            });
        }
    };

    return (
        <div>
            {/* Render form component here */}
            {form.component}
        </div>
    );
};

export default FormControls;
