import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import _ from 'lodash';
import $ from 'jquery';
import 'jquery-ui/ui/widgets/autocomplete';

interface BahmniAutocompleteProps {
    source: (params: { elementId: string, term: string, elementType: string }) => Promise<any>;
    responseMap?: (data: any) => any;
    onSelect: (item: any) => void;
    onEdit?: (item: any) => void;
    minLength?: number;
    blurOnSelect?: boolean;
    strictSelect?: boolean;
    validationMessage?: string;
    isInvalid?: boolean;
    initialValue?: string;
    id: string;
    type: string;
}

const BahmniAutocomplete: React.FC<BahmniAutocompleteProps> = ({
    source,
    responseMap,
    onSelect,
    onEdit,
    minLength = 2,
    blurOnSelect,
    strictSelect,
    validationMessage,
    isInvalid: propIsInvalid,
    initialValue,
    id,
    type
}) => {
    const { t } = useTranslation();
    const [selectedValue, setSelectedValue] = useState<string | undefined>(initialValue);
    const [isInvalid, setIsInvalid] = useState<boolean>(false);
    const validationMsg = validationMessage || t("SELECT_VALUE_FROM_AUTOCOMPLETE_DEFAULT_MESSAGE");

    useEffect(() => {
        if (initialValue) {
            setSelectedValue(initialValue);
            setIsInvalid(false);
        }
    }, [initialValue]);

    useEffect(() => {
        const element = $(`#${id}`);

        const validateIfNeeded = (value: string) => {
            if (!strictSelect) {
                return;
            }
            setIsInvalid(value !== selectedValue);
            if (_.isEmpty(value)) {
                setIsInvalid(false);
            }
        };

        element.autocomplete({
            autofocus: true,
            minLength: minLength,
            source: (request, response) => {
                source({ elementId: id, term: request.term, elementType: type }).then((data) => {
                    const results = responseMap ? responseMap(data) : data;
                    response(results);
                });
            },
            select: (event, ui) => {
                setSelectedValue(ui.item.value);
                onSelect(ui.item);
                validateIfNeeded(ui.item.value);
                if (blurOnSelect) {
                    element.blur();
                }
                return true;
            },
            search: (event, ui) => {
                if (onEdit) {
                    onEdit(ui.item);
                }
                const searchTerm = $.trim(element.val() as string);
                validateIfNeeded(searchTerm);
                if (searchTerm.length < minLength) {
                    event.preventDefault();
                }
            }
        });

        const changeHandler = (e: Event) => {
            validateIfNeeded((e.target as HTMLInputElement).value);
        };

        const keyUpHandler = (e: Event) => {
            validateIfNeeded((e.target as HTMLInputElement).value);
        };

        element.on('change', changeHandler);
        element.on('keyup', keyUpHandler);

        return () => {
            element.off('change', changeHandler);
            element.off('keyup', keyUpHandler);
        };
    }, [id, type, source, responseMap, onSelect, onEdit, minLength, blurOnSelect, strictSelect, selectedValue]);

    useEffect(() => {
        const element = document.getElementById(id) as HTMLInputElement;
        if (element) {
            element.setCustomValidity(isInvalid ? validationMsg : '');
        }
    }, [isInvalid, validationMsg, id]);

    return (
        <input
            id={id}
            type={type}
            defaultValue={initialValue}
            className={isInvalid ? 'invalid' : ''}
        />
    );
};

export default BahmniAutocomplete;
