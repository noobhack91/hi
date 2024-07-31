import React, { useState, useEffect, useContext } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { Spinner } from 'react-bootstrap';
import { WardService, BedManagementService, VisitService, MessagingService, AppService } from '../services';
import { NgDialog } from 'ng-dialog';
import { BahmniContext } from '../context/BahmniContext';
import _ from 'lodash';

const BedManagementController: React.FC = () => {
    const { patientUuid, visitUuid } = useParams();
    const history = useHistory();
    const { spinner, wardService, bedManagementService, visitService, messagingService, appService } = useContext(BahmniContext);

    const [wards, setWards] = useState(null);
    const [ward, setWard] = useState({});
    const [departmentSelected, setDepartmentSelected] = useState(false);
    const [selectedBedInfo, setSelectedBedInfo] = useState({});

    const editTagsPrivilege = Bahmni.IPD.Constants.editTagsPrivilege;
    const links = {
        "dashboard": {
            "name": "inpatient",
            "translationKey": "PATIENT_ADT_PAGE_KEY",
            "url": `../bedmanagement/#/patient/${patientUuid}/visit/${visitUuid}/dashboard`
        }
    };
    const patientForwardUrl = appService.getAppDescriptor().getConfigValue("patientForwardUrl") || links.dashboard.url;

    const isDepartmentPresent = (department) => {
        if (!department) return false;
        return _.values(department).indexOf() === -1;
    };

    const init = () => {
        setSelectedBedInfo(selectedBedInfo || {});
        loadAllWards().then(() => {
            const context = useParams().context || {};
            if (context && isDepartmentPresent(context.department)) {
                expandAdmissionMasterForDepartment(context.department);
            } else if (selectedBedInfo.bedDetails) {
                expandAdmissionMasterForDepartment({
                    uuid: selectedBedInfo.bedDetails.wardUuid,
                    name: selectedBedInfo.bedDetails.wardName
                });
            }
            resetDepartments();
            resetBedInfo();
        });
    };

    const loadAllWards = () => {
        return spinner.forPromise(wardService.getWardsList().then((wardsList) => {
            setWards(wardsList.results);
        }));
    };

    const mapRoomInfo = (roomsInfo) => {
        const mappedRooms = [];
        _.forIn(roomsInfo, (value, key) => {
            const bedsGroupedByBedStatus = _.groupBy(value, 'status');
            const availableBeds = bedsGroupedByBedStatus["AVAILABLE"] ? bedsGroupedByBedStatus["AVAILABLE"].length : 0;
            mappedRooms.push({ name: key, beds: value, totalBeds: value.length, availableBeds: availableBeds });
        });
        return mappedRooms;
    };

    const getRoomsForWard = (bedLayouts) => {
        bedLayouts.forEach((bed) => {
            if (!bed.bedTagMaps) {
                bed.bedTagMaps = [];
            }
            if (!bed.patient) {
                if (bed.patients && bed.patients.length > 0) {
                    bed.patient = bed.patients[0];
                }
            }
        });
        const rooms = mapRoomInfo(_.groupBy(bedLayouts, 'location'));
        _.each(rooms, (room) => {
            room.beds = bedManagementService.createLayoutGrid(room.beds);
        });
        return rooms;
    };

    const getWardDetails = (department) => {
        return _.filter(wards, (entry) => {
            return entry.ward.uuid === department.uuid;
        });
    };

    const selectCurrentDepartment = (department) => {
        _.each(wards, (wardElement) => {
            if (wardElement.ward.uuid === department.uuid) {
                wardElement.ward.isSelected = true;
                wardElement.ward.selected = true;
            }
        });
    };

    const loadBedsInfoForWard = (department) => {
        return wardService.bedsForWard(department.uuid).then((response) => {
            const wardDetails = getWardDetails(department);
            const rooms = getRoomsForWard(response.data.bedLayouts);
            setWard({
                rooms: rooms,
                uuid: department.uuid,
                name: department.name,
                totalBeds: wardDetails[0].totalBeds,
                occupiedBeds: wardDetails[0].occupiedBeds
            });
            setDepartmentSelected(true);
            setSelectedBedInfo({
                ...selectedBedInfo,
                wardName: department.name,
                wardUuid: department.uuid
            });
            selectCurrentDepartment(department);

            const event = new CustomEvent("event:departmentChanged");
            window.dispatchEvent(event);
        });
    };

    const expandAdmissionMasterForDepartment = (department) => {
        spinner.forPromise(loadBedsInfoForWard(department));
    };

    const onSelectDepartment = (department) => {
        spinner.forPromise(loadBedsInfoForWard(department).then(() => {

            // Broadcasting "event:deselectWards"
            const event = new Event("event:deselectWards");
            window.dispatchEvent(event);

            department.isSelected = true;
        }));
    };

    const resetDepartments = () => {
        _.each(wards, (option) => {
            option.ward.isSelected = false;
        });
    };

    const resetBedInfo = () => {
        setSelectedBedInfo({
            ...selectedBedInfo,
            roomName: undefined,
            bed: undefined
        });
    };

    const resetPatientAndBedInfo = () => {
        resetBedInfo();
        goToBedManagement();
    };

    const goToBedManagement = () => {
        if (history.location.pathname === "/bedManagement/bed") {
            const options = {
                context: {
                    department: {
                        uuid: ward.uuid,
                        name: ward.name
                    },
                    roomName: selectedBedInfo.roomName
                },
                dashboardCachebuster: Math.random()
            };
            history.push("/bedManagement", options);
        }
    };

    const getVisitInfoByPatientUuid = (patientUuid) => {
        return visitService.search({
            patient: patientUuid, includeInactive: false, v: "custom:(uuid,location:(uuid))"
        }).then((response) => {
            const results = response.data.results;
            const activeVisitForCurrentLoginLocation = results ? _.filter(results, (result) => {
                return result.location.uuid === selectedBedInfo.visitLocationUuid;
            }) : [];
            const hasActiveVisit = activeVisitForCurrentLoginLocation.length > 0;
            return hasActiveVisit ? activeVisitForCurrentLoginLocation[0].uuid : "";
        });
    };

    const goToAdtPatientDashboard = () => {
        getVisitInfoByPatientUuid(patientUuid).then((visitUuid) => {
            const options = { patientUuid: patientUuid, visitUuid: visitUuid };
            const url = appService.getAppDescriptor().formatUrl(patientForwardUrl, options);
            window.open(url);
        });
        if (window.scrollY > 0) {
            window.scrollTo(0, 0);
        }
    };

    const canEditTags = () => {
        return selectedBedInfo.bed && history.location.pathname === "/bedManagement/bed";
    };

    const editTagsOnTheBed = () => {
        NgDialog.openConfirm({
            template: 'views/editTags.html',
            scope: this,
            closeByEscape: true,
            className: "ngdialog-theme-default ng-dialog-adt-popUp"
        });
    };

    useEffect(() => {
        init();

            <h1>Bed Management</h1>
    
                {wards ? (
                    wards.map((wardElement) => (
                        <div key={wardElement.ward.uuid}>
                            <button onClick={() => onSelectDepartment(wardElement.ward)}>
                                {wardElement.ward.name}
                            </button>
                        </div>
                    ))
                ) : (
                    <Spinner animation="border" />
                )}
            </div>
            {departmentSelected && (
        
                    <h2>{ward.name}</h2>
            
                        {ward.rooms.map((room) => (
                            <div key={room.name}>
                                <h3>{room.name}</h3>
                        
                                    {room.beds.map((bed) => (
                                        <div key={bed.uuid}>
                                            <span>{bed.name}</span>
                                            <span>{bed.status}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>

    return (
        <div>

            <h1>Bed Management</h1>
            {wards ? (
                wards.map((wardElement) => (
                    <div key={wardElement.ward.uuid}>
                        <button onClick={() => onSelectDepartment(wardElement.ward)}>
                            {wardElement.ward.name}
                        </button>
                    </div>
                ))
            ) : (
                <Spinner animation="border" />
            )}
            {departmentSelected && (
        
                    <h2>{ward.name}</h2>
                    {ward.rooms.map((room) => (
                        <div key={room.name}>
                            <h3>{room.name}</h3>
                            {room.beds.map((bed) => (
                                <div key={bed.uuid}>
                                    <span>{bed.name}</span>
                                    <span>{bed.status}</span>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default BedManagementController;
