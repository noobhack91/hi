import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { createPatientService } from '../services/patientService';
import { getAppDescriptor } from '../services/appService';
import { showMessage } from '../services/messagingService';
import { getDateWithoutTime, now } from '../utils/dateUtil';
import { validate } from '../utils/validationUtil';
import { translateAttribute } from '../utils/translationUtil';
import { Spinner } from '../components/Spinner';
import { Dialog } from '../components/Dialog';

const CreatePatientController: React.FC = () => {
    const [patient, setPatient] = useState<any>({});
    const [patientLoaded, setPatientLoaded] = useState(false);
    const [createPatient, setCreatePatient] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);
    const history = useHistory();

    useEffect(() => {
        const init = async () => {
            const appDescriptor = await getAppDescriptor();
            const configValueForEnterId = appDescriptor.getConfigValue('showEnterID');
            const addressHierarchyConfigs = appDescriptor.getConfigValue("addressHierarchy");
            const disablePhotoCapture = appDescriptor.getConfigValue("disablePhotoCapture");
            const showEnterID = configValueForEnterId === null ? true : configValueForEnterId;
            const relatedIdentifierAttribute = appDescriptor.getConfigValue('relatedIdentifierAttribute');
            const today = getDateWithoutTime(now());
            const moduleName = appDescriptor.getConfigValue('registrationModuleName');

            setPatient({
                ...patient,
                addressHierarchyConfigs,
                disablePhotoCapture,
                showEnterID,
                relatedIdentifierAttribute,
                today,
                moduleName
            });

            prepopulateDefaultsInFields();
            expandSectionsWithDefaultValue();
            setPatientLoaded(true);
            setCreatePatient(true);
        };

        init();
    }, []);

    const getPersonAttributeTypes = () => {
        // SECOND AGENT: [MISSING CONTEXT] - This function needs to return the patient configuration attribute types from the root scope.
    };

    const getTranslatedPatientIdentifier = (patientIdentifier: any) => {
        return translateAttribute(patientIdentifier, 'registration');
    };

    const prepopulateDefaultsInFields = () => {
        const personAttributeTypes = getPersonAttributeTypes();
        const patientInformation = getAppDescriptor().getConfigValue("patientInformation");
        if (!patientInformation || !patientInformation.defaults) {
            return;
        }
        const defaults = patientInformation.defaults;
        const defaultVariableNames = Object.keys(defaults);

        const hasDefaultAnswer = (personAttributeType: any) => {
            return defaultVariableNames.includes(personAttributeType.name);
        };

        const isConcept = (personAttributeType: any) => {
            return personAttributeType.format === "org.openmrs.Concept";
        };

        const setDefaultAnswer = (personAttributeType: any) => {
            setPatient((prevPatient: any) => ({
                ...prevPatient,
                [personAttributeType.name]: defaults[personAttributeType.name]
            }));
        };

        const setDefaultConcept = (personAttributeType: any) => {
            const defaultAnswer = defaults[personAttributeType.name];
            const isDefaultAnswer = (answer: any) => {
                return answer.fullySpecifiedName === defaultAnswer;
            };

            personAttributeType.answers.filter(isDefaultAnswer).forEach((answer: any) => {
                setPatient((prevPatient: any) => ({
                    ...prevPatient,
                    [personAttributeType.name]: {
                        conceptUuid: answer.conceptId,
                        value: answer.fullySpecifiedName
                    }
                }));
            });
        };

        const isDateType = (personAttributeType: any) => {
            return personAttributeType.format === "org.openmrs.util.AttributableDate";
        };

        const isDefaultValueToday = (personAttributeType: any) => {
            return defaults[personAttributeType.name].toLowerCase() === "today";
        };

        const setDefaultValue = (personAttributeType: any) => {
            setPatient((prevPatient: any) => ({
                ...prevPatient,
                [personAttributeType.name]: isDefaultValueToday(personAttributeType) ? new Date() : ''
            }));
        };

        const defaultsWithAnswers = personAttributeTypes.filter(hasDefaultAnswer).forEach(setDefaultAnswer);

        defaultsWithAnswers.filter(isConcept).forEach(setDefaultConcept);
        defaultsWithAnswers.filter(isDateType).forEach(setDefaultValue);

        if (patient.relatedIdentifierAttribute && patient.relatedIdentifierAttribute.name) {
            setPatient((prevPatient: any) => ({
                ...prevPatient,
                [patient.relatedIdentifierAttribute.name]: false
            }));
        }
    };

    const expandSectionsWithDefaultValue = () => {
        // SECOND AGENT: [MISSING CONTEXT] - This function needs to expand sections with default values from the root scope patient configuration.
    };

    const prepopulateFields = () => {
        const fieldsToPopulate = getAppDescriptor().getConfigValue("prepopulateFields");
        if (fieldsToPopulate) {
            fieldsToPopulate.forEach((field: any) => {
                const addressLevel = patient.addressLevels.find((level: any) => level.name === field);
                if (addressLevel) {
                    setPatient((prevPatient: any) => ({
                        ...prevPatient,
                        address: {
                            ...prevPatient.address,
                            [addressLevel.addressField]: patient.loggedInLocation[addressLevel.addressField]
                        }
                    }));
                }
            });
        }
    };

    const addNewRelationships = () => {
        const newRelationships = patient.newlyAddedRelationships.filter((relationship: any) => relationship.relationshipType && relationship.relationshipType.uuid);
        newRelationships.forEach((relationship: any) => {
            delete relationship.patientIdentifier;
            delete relationship.content;
            delete relationship.providerName;
        });
        setPatient((prevPatient: any) => ({
            ...prevPatient,
            relationships: newRelationships
        }));
    };

    const getConfirmationViaDialog = (config: any) => {

        const handleYes = () => {
            config.yesCallback();
        };

        const handleNo = () => {
            // No action needed, just close the dialog
        };

        return (
            <Dialog
                template={config.template}
                data={config.data}
                onYes={handleYes}
                onNo={handleNo}
            />
        );
    };

    const copyPatientProfileDataToScope = (response: any) => {
        const patientProfileData = response.data;
        setPatient((prevPatient: any) => ({
            ...prevPatient,
            uuid: patientProfileData.patient.uuid,
            name: patientProfileData.patient.person.names[0].display,
            isNew: true,
            registrationDate: now(),
            newlyAddedRelationships: [{}]
        }));
        // SECOND AGENT: [MISSING CONTEXT] - Implement follow-up action logic.
    };

    const createPatient = async (jumpAccepted: boolean = false) => {
        try {
            const response = await createPatientService(patient, jumpAccepted);
            copyPatientProfileDataToScope(response);
        } catch (response) {
            if (response.status === 412) {
                const data = response.data.map((data: any) => ({
                    sizeOfTheJump: data.sizeOfJump,
                    identifierName: patientConfiguration.identifierTypes.find((type: any) => type.uuid === data.identifierType).name
                }));
                getConfirmationViaDialog({
                    template: 'views/customIdentifierConfirmation.html',
                    data,
                    scope: patient,
                    yesCallback: () => createPatient(true)
                });
            }
            if (response.isIdentifierDuplicate) {
                setErrorMessage(response.message);
            }
        }
    };

    const createPromise = () => {
        return new Promise((resolve) => {
            createPatient().finally(() => resolve({}));
        });
    };

    const handleCreate = async () => {
        addNewRelationships();
        const errorMessages = validate(patient, patientConfiguration.attributeTypes);
        if (errorMessages.length > 0) {
            errorMessages.forEach((errorMessage: string) => {
                showMessage('error', errorMessage);
            });

            <form onSubmit={(e) => { e.preventDefault(); handleCreate(); }}>
        
                    <label htmlFor="patientName">Name:</label>
                    <input
                        type="text"
                        id="patientName"
                        value={patient.name || ''}
                        onChange={(e) => setPatient({ ...patient, name: e.target.value })}
                    />
                </div>
        
                    <label htmlFor="patientIdentifier">Identifier:</label>
                    <input
                        type="text"
                        id="patientIdentifier"
                        value={patient.identifier || ''}
                        onChange={(e) => setPatient({ ...patient, identifier: e.target.value })}
                    />
                </div>
        
                    <label htmlFor="patientAddress">Address:</label>
                    <input
                        type="text"
                        id="patientAddress"
                        value={patient.address || ''}
                        onChange={(e) => setPatient({ ...patient, address: e.target.value })}
                    />
                </div>
        
                    <label htmlFor="patientBirthdate">Birthdate:</label>
                    <input
                        type="date"
                        id="patientBirthdate"
                        value={patient.birthdate || ''}
                        onChange={(e) => setPatient({ ...patient, birthdate: e.target.value })}
                    />
                </div>
        
                    <label htmlFor="patientGender">Gender:</label>
                    <select
                        id="patientGender"
                        value={patient.gender || ''}
                        onChange={(e) => setPatient({ ...patient, gender: e.target.value })}
                    >
                        <option value="">Select Gender</option>
                        <option value="M">Male</option>
                        <option value="F">Female</option>
                    </select>
                </div>
                <button type="submit">Create Patient</button>
            </form>
            {errorMessage && <div className="error-message">{errorMessage}</div>}
        </div>
        await Spinner.forPromise(createPromise());
        if (errorMessage) {
            showMessage("error", errorMessage);
            setErrorMessage(undefined);
        }
    };

    const afterSave = () => {
        showMessage("info", "REGISTRATION_LABEL_SAVED");
        history.push(`/patient/edit/${patient.uuid}`);
    };

    return (
        <div>

            <form onSubmit={(e) => { e.preventDefault(); handleCreate(); }}>
        
                    <label htmlFor="patientName">Name:</label>
                    <input
                        type="text"
                        id="patientName"
                        value={patient.name || ''}
                        onChange={(e) => setPatient({ ...patient, name: e.target.value })}
                    />
                </div>
        
                    <label htmlFor="patientIdentifier">Identifier:</label>
                    <input
                        type="text"
                        id="patientIdentifier"
                        value={patient.identifier || ''}
                        onChange={(e) => setPatient({ ...patient, identifier: e.target.value })}
                    />
                </div>
        
                    <label htmlFor="patientAddress">Address:</label>
                    <input
                        type="text"
                        id="patientAddress"
                        value={patient.address || ''}
                        onChange={(e) => setPatient({ ...patient, address: e.target.value })}
                    />
                </div>
        
                    <label htmlFor="patientBirthdate">Birthdate:</label>
                    <input
                        type="date"
                        id="patientBirthdate"
                        value={patient.birthdate || ''}
                        onChange={(e) => setPatient({ ...patient, birthdate: e.target.value })}
                    />
                </div>
        
                    <label htmlFor="patientGender">Gender:</label>
                    <select
                        id="patientGender"
                        value={patient.gender || ''}
                        onChange={(e) => setPatient({ ...patient, gender: e.target.value })}
                    >
                        <option value="">Select Gender</option>
                        <option value="M">Male</option>
                        <option value="F">Female</option>
                    </select>
                </div>
                <button type="submit">Create Patient</button>
            </form>
            {errorMessage && <div className="error-message">{errorMessage}</div>}
        </div>
    );
};

export default CreatePatientController;
