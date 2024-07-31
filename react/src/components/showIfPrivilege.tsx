import React, { useContext, useEffect, useState } from 'react';

// Assuming we have a UserContext that provides the current user and their privileges
import { UserContext } from '../context/UserContext';

interface ShowIfPrivilegeProps {
    showIfPrivilege: string;
}

const ShowIfPrivilege: React.FC<ShowIfPrivilegeProps> = ({ showIfPrivilege, children }) => {
    const { currentUser } = useContext(UserContext);
    const [hasPrivilege, setHasPrivilege] = useState(false);

    useEffect(() => {
        if (currentUser) {
            const privileges = showIfPrivilege.split(',');
            const userPrivileges = currentUser.privileges.map((priv: { name: string }) => priv.name);
            const intersect = privileges.filter(priv => userPrivileges.includes(priv));
            setHasPrivilege(intersect.length > 0);
        } else {
            setHasPrivilege(false);
        }
    }, [currentUser, showIfPrivilege]);

    if (!hasPrivilege) {
        return null;
    }

    return <>{children}</>;
};

export default ShowIfPrivilege;
