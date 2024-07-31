import React, { useState, useEffect, useContext } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { BahmniContext } from '../context/BahmniContext';
import _ from 'lodash';

const WardController: React.FC = () => {
    const { context } = useParams();
    const { bedDetails, selectedBedInfo, setSelectedBedInfo } = useContext(BahmniContext);
    const [ward, setWard] = useState<any>({});
    const [room, setRoom] = useState<any>(null);
    const [activeRoom, setActiveRoom] = useState<string | null>(null);
    const [roomSelected, setRoomSelected] = useState<boolean>(false);
    const history = useHistory();

    const init = () => {
        if (context && context.roomName) {
            expandAdmissionMasterForRoom(context.roomName);
        } else if (bedDetails) {
            expandAdmissionMasterForRoom(bedDetails.physicalLocationName);
        }
    };

    const getSelectedRoom = (roomName: string) => {
        const admissionRoom = _.filter(ward.rooms, (room) => room.name === roomName);
        setRoom(admissionRoom[0]);
        setActiveRoom(admissionRoom[0].name);
        setRoomSelected(true);
    };

    const updateSelectedBedInfo = (roomName: string) => {
        setSelectedBedInfo({
            ...selectedBedInfo,
            roomName: roomName,
            bed: undefined
        });
    };

    const onSelectRoom = (roomName: string) => {
        updateSelectedBedInfo(roomName);
        getSelectedRoom(roomName);
        // Emitting "event:roomSelected"
        const event = new CustomEvent("event:roomSelected", { detail: roomName });
        window.dispatchEvent(event);
        // Broadcasting "event:changeBedList"
        const changeBedListEvent = new CustomEvent("event:changeBedList", { detail: roomName });
        window.dispatchEvent(changeBedListEvent);
        setActiveRoom(roomName);
        goToBedManagement();
        if (window.scrollY > 0) {
            window.scrollTo(0, 0);
        }
    };

    const expandAdmissionMasterForRoom = (roomName: string) => {
        updateSelectedBedInfo(roomName);
        getSelectedRoom(roomName);
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

    useEffect(() => {
        init();
        // Listening to "event:deselectWards"
        const handleDeselectWards = () => {
            setActiveRoom(null);
        };
        window.addEventListener("event:deselectWards", handleDeselectWards);

        // Listening to "event:departmentChanged"
        const handleDepartmentChanged = () => {
            setRoomSelected(false);
        };
        window.addEventListener("event:departmentChanged", handleDepartmentChanged);

        return () => {
            window.removeEventListener("event:deselectWards", handleDeselectWards);
            window.removeEventListener("event:departmentChanged", handleDepartmentChanged);
        };
    }, []);

    return (
        <div>
            {/* SECOND AGENT: [MISSING CONTEXT] - Add JSX for rendering the ward and room details */}
        </div>
    );
};

export default WardController;
