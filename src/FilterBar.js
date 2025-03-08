// src/FilterBar.js
import React from 'react';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

function FilterBar({ onCategoryChange }) {
    const handleCategoryChange = (event) => {
        onCategoryChange(event.target.value);
    };

    return (
        <FormControl sx={{ m: 1, minWidth: 120 }}>
            <InputLabel id="category-select-label">Category</InputLabel>
            <Select
                labelId="category-select-label"
                id="category-select"
                value=""  // You'll need to manage the selected value in the parent component
                label="Category"
                onChange={handleCategoryChange}
            >
                <MenuItem value="All">All</MenuItem>
                <MenuItem value="Technology">Technology</MenuItem>
                <MenuItem value="Music">Music</MenuItem>
                <MenuItem value="Sports">Sports</MenuItem>
            </Select>
        </FormControl>
    );
}

export default FilterBar;