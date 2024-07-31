import axios from 'axios';
import { getLoginLocationUuid } from '../utils/sessionService';
import { getAppDescriptor } from '../utils/appService';
import { translate } from '../utils/translate';
import { Bahmni } from '../utils/constants';

const openmrsUrl = Bahmni.Registration.Constants.openmrsUrl;
const baseOpenMRSRESTURL = Bahmni.Registration.Constants.baseOpenMRSRESTURL;

const search = (
  query: string,
  identifier: string,
  addressFieldName: string,
  addressFieldValue: string,
  customAttributeValue: string,
  offset: number,
  customAttributeFields: string[],
  programAttributeFieldName: string,
  programAttributeFieldValue: string,
  addressSearchResultsConfig: any,
  patientSearchResultsConfig: any,
  filterOnAllIdentifiers: boolean
) => {
  const config = {
    params: {
      q: query,
      identifier: identifier,
      s: "byIdOrNameOrVillage",
      addressFieldName: addressFieldName,
      addressFieldValue: addressFieldValue,
      customAttribute: customAttributeValue,
      startIndex: offset || 0,
      patientAttributes: customAttributeFields,
      programAttributeFieldName: programAttributeFieldName,
      programAttributeFieldValue: programAttributeFieldValue,
      addressSearchResultsConfig: addressSearchResultsConfig,
      patientSearchResultsConfig: patientSearchResultsConfig,
      loginLocationUuid: getLoginLocationUuid(),
      filterOnAllIdentifiers: filterOnAllIdentifiers
    },
    withCredentials: true
  };
  return axios.get(`${baseOpenMRSRESTURL}/patient`, config);
};

const searchByIdentifier = (identifier: string) => {
  return axios.get(`${Bahmni.Common.Constants.bahmniCommonsSearchUrl}/patient`, {
    params: {
      identifier: identifier,
      loginLocationUuid: getLoginLocationUuid()
    },
    withCredentials: true
  });
};

const searchByNameOrIdentifier = (query: string, limit: number) => {
  return axios.get(`${Bahmni.Common.Constants.bahmniCommonsSearchUrl}/patient/lucene`, {
    params: {
      identifier: query,
      filterOnAllIdentifiers: true,
      q: query,
      s: "byIdOrName",
      limit: limit,
      loginLocationUuid: getLoginLocationUuid()
    },
    withCredentials: true
  });
};

const get = (uuid: string) => {

  return axios.get(`${baseOpenMRSRESTURL}/patient/${uuid}`, {
    withCredentials: true
  }).then(response => {

    const url = `${baseOpenMRSRESTURL}/patient`;
    const data = {
        patient: patient,

  const url = `${baseOpenMRSRESTURL}/patient/${openMRSPatient.uuid}`;
  const data = {
    patient: patient,
    openMRSPatient: openMRSPatient,
    attributeTypes: $rootScope.patientConfiguration.attributeTypes
  };
  const config = {
    withCredentials: true,
    headers: { "Accept": "application/json", "Content-Type": "application/json" }
  };
  return axios.put(url, data, config)
    .then(response => response.data)
    .catch(error => {
      console.error("Error updating patient:", error);
      throw error;
    });
};
    const config = {
        withCredentials: true,
        headers: { "Accept": "application/json", "Content-Type": "application/json" }
    };
    return axios.post(url, data, config)
        .then(response => response.data)
        .catch(error => {
            console.error("Error creating patient:", error);
            throw error;
        });
};
  }).catch(error => {
    console.error("Error fetching patient data:", error);
    throw error;
  });
};

const create = (patient: any, jumpAccepted: boolean) => {

    const url = `${baseOpenMRSRESTURL}/patient`;
    const data = {
        patient: patient,

  const url = `${baseOpenMRSRESTURL}/patient/${openMRSPatient.uuid}`;
  const data = {
    patient: patient,
    openMRSPatient: openMRSPatient,
    attributeTypes: $rootScope.patientConfiguration.attributeTypes // SECOND AGENT: [MISSING CONTEXT] - Replace with actual attribute types if available
  };
  const config = {
    withCredentials: true,
    headers: { "Accept": "application/json", "Content-Type": "application/json" }
  };
  return axios.put(url, data, config)
    .then(response => response.data)
    .catch(error => {
      console.error("Error updating patient:", error);
      throw error;
    });
};
    const config = {
        withCredentials: true,
        headers: { "Accept": "application/json", "Content-Type": "application/json" }
    };
    return axios.post(url, data, config)
        .then(response => response.data)
        .catch(error => {
            console.error("Error creating patient:", error);
            throw error;
        });
};

const update = (patient: any, openMRSPatient: any) => {

  const url = `${baseOpenMRSRESTURL}/patient/${openMRSPatient.uuid}`;
  const data = {
    patient: patient,
    openMRSPatient: openMRSPatient,
    attributeTypes: $rootScope.patientConfiguration.attributeTypes // SECOND AGENT: [MISSING CONTEXT] - Replace with actual attribute types if available
  };
  const config = {
    withCredentials: true,
    headers: { "Accept": "application/json", "Content-Type": "application/json" }
  };
  return axios.put(url, data, config)
    .then(response => response.data)
    .catch(error => {
      console.error("Error updating patient:", error);
      throw error;
    });
};

const getAllPatientIdentifiers = (uuid: string) => {
  const url = `${Bahmni.Registration.Constants.basePatientUrl}${uuid}/identifier`;
  return axios.get(url, {
    params: {
      includeAll: true
    },
    withCredentials: true
  });
};

const updateImage = (uuid: string, image: string) => {
  const url = `${baseOpenMRSRESTURL}/personimage/`;
  const data = {
    person: { uuid: uuid },
    base64EncodedImage: image
  };
  const config = {
    withCredentials: true,
    headers: { "Accept": "application/json", "Content-Type": "application/json" }
  };
  return axios.post(url, data, config);
};

const getRegistrationMessage = (patientId: string, name: string, age: string, gender: string) => {
  const locationName = getAppDescriptor().getConfigValue("registrationMessage") || Bahmni.Registration.Constants.registrationMessage;
  let message = translate(locationName);
  message = message.replace("#clinicName", locationName);
  message = message.replace("#patientId", patientId);
  message = message.replace("#name", name);
  message = message.replace("#age", age);
  message = message.replace("#gender", gender);
  message = message.replace("#helpDeskNumber", ""); // SECOND AGENT: [MISSING CONTEXT] - Replace with actual help desk number
  return message;
};

export const patientService = {
  search,
  searchByIdentifier,
  create,
  update,
  get,
  updateImage,
  searchByNameOrIdentifier,
  getAllPatientIdentifiers,
  getRegistrationMessage
};
