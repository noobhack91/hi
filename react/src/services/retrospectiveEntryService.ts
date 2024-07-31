import { useState, useEffect } from 'react';
import { getCookie, setCookie, removeCookie } from '../utils/cookieUtils';
import { DateUtil } from '../utils/dateUtil';
import { RetrospectiveEntry } from '../domain/retrospectiveEntry';
import { Constants } from '../utils/constants';

interface RetrospectiveEntryService {
    getRetrospectiveEntry: () => RetrospectiveEntry | undefined;
    isRetrospectiveMode: () => boolean;
    getRetrospectiveDate: () => string | undefined;
    initializeRetrospectiveEntry: () => void;
    resetRetrospectiveEntry: (date?: string) => void;
}

const useRetrospectiveEntryService = (): RetrospectiveEntryService => {
    const [retrospectiveEntry, setRetrospectiveEntry] = useState<RetrospectiveEntry | undefined>(undefined);

    useEffect(() => {
        initializeRetrospectiveEntry();
    }, []);

    const getRetrospectiveEntry = (): RetrospectiveEntry | undefined => {
        return retrospectiveEntry;
    };

    const isRetrospectiveMode = (): boolean => {
        return retrospectiveEntry !== undefined;
    };

    const getRetrospectiveDate = (): string | undefined => {
        return retrospectiveEntry?.encounterDate;
    };

    const initializeRetrospectiveEntry = (): void => {
        const retrospectiveEncounterDateCookie = getCookie(Constants.retrospectiveEntryEncounterDateCookieName);
        if (retrospectiveEncounterDateCookie) {
            setRetrospectiveEntry(RetrospectiveEntry.createFrom(DateUtil.getDate(retrospectiveEncounterDateCookie)));
        }
    };

    const resetRetrospectiveEntry = (date?: string): void => {
        removeCookie(Constants.retrospectiveEntryEncounterDateCookieName, { path: '/', expires: 1 });
        setRetrospectiveEntry(undefined);

        if (date && !DateUtil.isSameDate(date, DateUtil.today())) {
            const newEntry = RetrospectiveEntry.createFrom(DateUtil.getDate(date));
            setRetrospectiveEntry(newEntry);
            setCookie(Constants.retrospectiveEntryEncounterDateCookieName, date, { path: '/', expires: 1 });
        }
    };

    return {
        getRetrospectiveEntry,
        isRetrospectiveMode,
        getRetrospectiveDate,
        initializeRetrospectiveEntry,
        resetRetrospectiveEntry
    };
};

export default useRetrospectiveEntryService;
