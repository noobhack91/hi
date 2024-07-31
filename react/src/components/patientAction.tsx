import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { BahmniConstants } from '../utils/constants/BahmniConstants';
import VisitService from '../services/visitService';
import Spinner from './Spinner';
import MessagingService from '../services/messagingService';
import AuditLogService from '../services/auditLogService';

const PatientAction: React.FC = () => {
    const { patientUuid } = useParams<{ patientUuid: string }>();
    const history = useHistory();
    const { t } = useTranslation();
    const [hasActiveVisit, setHasActiveVisit] = useState(false);
    const [activeVisit, setActiveVisit] = useState<any>(null);
    const [forwardActionKey, setForwardActionKey] = useState<string>('');
    const [visitControl, setVisitControl] = useState<any>(null);
    const [actions, setActions] = useState<any>({ submitSource: '' });

    useEffect(() => {
        const init = async () => {
            if (!patientUuid) {
                setHasActiveVisit(false);
                setForwardActionKey('startVisit');
                return;
            }

            const searchParams = {
                patient: patientUuid,
                includeInactive: false,
                v: "custom:(uuid,visitType,location:(uuid))"
            };

            try {
                const response = await VisitService.search(searchParams);
                const results = response.data.results;
                const activeVisitForCurrentLoginLocation = results.filter((result: any) => result.location.uuid === BahmniConstants.visitLocationUuid);

                setHasActiveVisit(activeVisitForCurrentLoginLocation.length > 0);
                if (activeVisitForCurrentLoginLocation.length > 0) {
                    setActiveVisit(activeVisitForCurrentLoginLocation[0]);
                }
                setForwardActionKey(activeVisitForCurrentLoginLocation.length > 0 ? 'forwardAction' : 'startVisit');
            } catch (error) {
                console.error('Error fetching visit data', error);
            }
        };

        init();
    }, [patientUuid]);

    const handleStartVisit = () => {
        setActions({ ...actions, submitSource: 'startVisit' });
    };

    const handleFollowUpAction = async (patientProfileData: any) => {
        MessagingService.clearAll();
        switch (actions.submitSource) {
            case 'startVisit':

                if (!BahmniConstants.visitLocationUuid) {
                    history.push(`/patient/${patientUuid}/edit`);
                    MessagingService.showMessage("error", "NO_LOCATION_TAGGED_TO_VISIT_LOCATION");
                    break;
                }

                try {
                    const exists = await visitControl.checkIfActiveVisitExists(patientUuid, BahmniConstants.visitLocationUuid);
                    if (exists) {
                        MessagingService.showMessage("error", "VISIT_OF_THIS_PATIENT_AT_SAME_LOCATION_EXISTS");
                        break;

                afterSave();
                break;

                    const response = await visitControl.createVisitOnly(patientUuid, BahmniConstants.visitLocationUuid);
                    AuditLogService.log(patientUuid, "OPEN_VISIT", { visitUuid: response.data.uuid, visitType: response.data.visitType.display }, 'MODULE_LABEL_REGISTRATION_KEY');

                    if (forwardUrl) {
                        const updatedForwardUrl = BahmniConstants.appService.formatUrl(forwardUrl, { 'patientUuid': patientUuid });
                        window.location.href = updatedForwardUrl;
                        if (showSuccessMessage) {
                            MessagingService.showMessage("info", "REGISTRATION_LABEL_SAVE_REDIRECTION");
                        }
                    } else {
                        goToVisitPage({ patient: { uuid: patientUuid } });

            try {
                const response = await VisitService.createVisit({
                    patientUuid: patientProfileData.patient.uuid,
                    visitLocationUuid: BahmniConstants.visitLocationUuid,
                    visitType: BahmniConstants.defaultVisitType
                });
                AuditLogService.log(patientProfileData.patient.uuid, "OPEN_VISIT", { visitUuid: response.data.uuid, visitType: response.data.visitType.display }, 'MODULE_LABEL_REGISTRATION_KEY');
                const updatedForwardUrl = BahmniConstants.appService.formatUrl(forwardUrl, { 'patientUuid': patientProfileData.patient.uuid });
                window.location.href = updatedForwardUrl;
                if (BahmniConstants.showSuccessMessage) {
                    MessagingService.showMessage("info", "REGISTRATION_LABEL_SAVE_REDIRECTION");

            <button onClick={handleStartVisit}>
                {t('Start Visit')}
            </button>
            {hasActiveVisit && (
        
                    <h3>{t('Active Visit')}</h3>
                    <p>{t('Visit Type')}: {activeVisit.visitType.display}</p>
                    <p>{t('Location')}: {activeVisit.location.display}</p>
                </div>
            )}
            <button onClick={() => handleFollowUpAction({ patient: { uuid: patientUuid } })}>
                {t('Follow Up Action')}
            </button>
        </div>
            } catch (error) {
                console.error('Error creating visit', error);
                history.push(`/patient/${patientProfileData.patient.uuid}/edit`);
                MessagingService.showMessage("error", "NO_LOCATION_TAGGED_TO_VISIT_LOCATION");
            }
        } else {
            window.location.href = forwardUrl;
        }
                } catch (error) {
                    console.error('Error creating visit', error);
                    history.push(`/patient/${patientUuid}/edit`);
                }
                break;
            case 'forwardAction':
                goToForwardUrlPage(patientProfileData);
                break;
            case 'enterVisitDetails':
                goToVisitPage(patientProfileData);
                break;
            case 'configAction':
                handleConfigAction(patientProfileData);
                break;
            case 'save':

                afterSave();
                break;
            default:
                break;
        }
    };

    const goToForwardUrlPage = (patientData: any) => {
        const forwardUrl = BahmniConstants.appService.formatUrl(activeVisitConfig.forwardUrl, { 'patientUuid': patientData.patient.uuid });
        window.location.href = forwardUrl;
    };

    const handleConfigAction = (patientProfileData: any) => {
        const forwardUrl = BahmniConstants.appService.formatUrl(actionConfig.extensionParams.forwardUrl, { 'patientUuid': patientProfileData.patient.uuid });

            try {
                const response = await VisitService.createVisit({
                    patientUuid: patientProfileData.patient.uuid,
                    visitLocationUuid: BahmniConstants.visitLocationUuid,
                    visitType: BahmniConstants.defaultVisitType
                });
                AuditLogService.log(patientProfileData.patient.uuid, "OPEN_VISIT", { visitUuid: response.data.uuid, visitType: response.data.visitType.display }, 'MODULE_LABEL_REGISTRATION_KEY');
                const updatedForwardUrl = BahmniConstants.appService.formatUrl(forwardUrl, { 'patientUuid': patientProfileData.patient.uuid });
                window.location.href = updatedForwardUrl;
                if (BahmniConstants.showSuccessMessage) {
                    MessagingService.showMessage("info", "REGISTRATION_LABEL_SAVE_REDIRECTION");

            <button onClick={handleStartVisit}>
                {t('Start Visit')}
            </button>
            {hasActiveVisit && (
        
                    <h3>{t('Active Visit')}</h3>
                    <p>{t('Visit Type')}: {activeVisit.visitType.display}</p>
                    <p>{t('Location')}: {activeVisit.location.display}</p>
                </div>
            )}
            <button onClick={() => handleFollowUpAction({ patient: { uuid: patientUuid } })}>
                {t('Follow Up Action')}
            </button>
        </div>
            } catch (error) {
                console.error('Error creating visit', error);
                history.push(`/patient/${patientProfileData.patient.uuid}/edit`);
                MessagingService.showMessage("error", "NO_LOCATION_TAGGED_TO_VISIT_LOCATION");
            }
        } else {
            window.location.href = forwardUrl;
        }

        const createVisit = async (patientProfileData: any, forwardUrl: string) => {
            if (!BahmniConstants.visitLocationUuid) {
                history.push(`/patient/${patientProfileData.patient.uuid}/edit`);
                MessagingService.showMessage("error", "NO_LOCATION_TAGGED_TO_VISIT_LOCATION");
                return;
    

            try {
                const exists = await visitControl.checkIfActiveVisitExists(patientProfileData.patient.uuid, BahmniConstants.visitLocationUuid);
                if (exists) {
                    MessagingService.showMessage("error", "VISIT_OF_THIS_PATIENT_AT_SAME_LOCATION_EXISTS");

            <button onClick={handleStartVisit}>
                {t('Start Visit')}
            </button>
            {hasActiveVisit && (
        
                    <h3>{t('Active Visit')}</h3>
                    <p>{t('Visit Type')}: {activeVisit.visitType.display}</p>
                    <p>{t('Location')}: {activeVisit.location.display}</p>
                </div>
            )}
            <button onClick={() => handleFollowUpAction({ patient: { uuid: patientUuid } })}>
                {t('Follow Up Action')}
            </button>
        </div>

                const response = await visitControl.createVisitOnly(patientProfileData.patient.uuid, BahmniConstants.visitLocationUuid);
                AuditLogService.log(patientProfileData.patient.uuid, "OPEN_VISIT", { visitUuid: response.data.uuid, visitType: response.data.visitType.display }, 'MODULE_LABEL_REGISTRATION_KEY');

                if (forwardUrl) {
                    const updatedForwardUrl = BahmniConstants.appService.formatUrl(forwardUrl, { 'patientUuid': patientProfileData.patient.uuid });
                    window.location.href = updatedForwardUrl;
                    if (BahmniConstants.showSuccessMessage) {
                        MessagingService.showMessage("info", "REGISTRATION_LABEL_SAVE_REDIRECTION");
            
         else {
                    goToVisitPage(patientProfileData);
        
     catch (error) {
                console.error('Error creating visit', error);
                history.push(`/patient/${patientProfileData.patient.uuid}/edit`);
                MessagingService.showMessage("error", "NO_LOCATION_TAGGED_TO_VISIT_LOCATION");
    
;
        } else {
            window.location.href = forwardUrl;
        }
    };

    const goToVisitPage = (patientData: any) => {
        history.push(`/patient/${patientData.patient.uuid}/visit`);
    };

    return (
        <div>

            <button onClick={handleStartVisit}>
                {t('Start Visit')}
            </button>
            {hasActiveVisit && (
        
                    <h3>{t('Active Visit')}</h3>
                    <p>{t('Visit Type')}: {activeVisit.visitType.display}</p>
                    <p>{t('Location')}: {activeVisit.location.display}</p>
                </div>
            )}
            <button onClick={() => handleFollowUpAction({ patient: { uuid: patientUuid } })}>
                {t('Follow Up Action')}
            </button>
        </div>
    );
};

export default PatientAction;
