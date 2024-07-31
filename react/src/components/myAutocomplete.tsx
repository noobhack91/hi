import React, { useState } from 'react';
import { Autocomplete } from '@material-ui/lab';
import TextField from '@material-ui/core/TextField';

interface MyAutocompleteProps {
    id: string;
    itemType: string;
    source: (id: string, term: string, itemType: string) => Promise<any>;
    responseMap?: (data: any) => any;
    onSelect?: (item: any) => void;
    onChange?: () => void;
}

const MyAutocomplete: React.FC<MyAutocompleteProps> = ({ id, itemType, source, responseMap, onSelect, onChange }) => {
    const [options, setOptions] = useState<any[]>([]);
    const [inputValue, setInputValue] = useState<string>('');

    const handleInputChange = async (event: React.ChangeEvent<{}>, value: string) => {
        setInputValue(value);
        if (value.trim().length >= 2) {
            const data = await source(id, value, itemType);
            const results = responseMap ? responseMap(data) : data;
            setOptions(results);
        } else {
            setOptions([]);
        }
    };

    const handleSelect = (event: React.ChangeEvent<{}>, value: any) => {
        if (onSelect && value) {
            onSelect(value);
        }
        if (onChange) {
            onChange();
        }
    };

    return (
        <Autocomplete
            id={id}
            options={options}
            getOptionLabel={(option) => option.label || ''}
            inputValue={inputValue}
            onInputChange={handleInputChange}
            onChange={handleSelect}
            renderInput={(params) => <TextField {...params} label="Search" variant="outlined" />}
        />
    );
};

export default MyAutocomplete;
