import React, { useState, useEffect } from "react";
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Chip from '@mui/material/Chip';

export default function ChipInput({ initialChips, onChipsChange }) {
    const [chips, setChips] = useState([]);

    useEffect(() => {
    setChips(initialChips ? initialChips : []);
    }, [initialChips]);

    const handleChipsChange = (event, value) => {
        setChips(value);
        onChipsChange(value);
    };

    return (
        <Autocomplete
            multiple
            id="tags-filled"
            options={[]}
            freeSolo
            value={chips}
            onChange={handleChipsChange}
            renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                    <Chip
                        key={index}
                        variant="outlined"
                        label={option}
                        {...getTagProps({ index })}
                    />
                ))
            }
            renderInput={(params) => (
                <TextField
                    {...params}
                    placeholder="Press Enter to add"
                />
            )}
        />
    );
}