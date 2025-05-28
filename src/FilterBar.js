// src/FilterBar.js
import React from 'react';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';

function FilterBar({ onCategoryChange }) {
    const categoryDescriptions = {
        "All": "View all events across all categories.",
        "Arts, Entertainment, & Lifestyle": "Music, art exhibitions, theater, VR experiences, and other lifestyle activities ticketed via NFTs.",
        "Business, Tech, & Conferences": "Conferences, networking events, and workshops in the Web3, DeFi, AI, and technology sectors.",
        "Community & Special Interest": "Local gatherings, DAO meetups, hobby groups, and special interest events utilizing NFT passes or POAPs."
    };

    const [selectedValue, setSelectedValue] = React.useState('All'); // Default to 'All'

    const handleChange = (event) => {
        const newCategory = event.target.value;
        setSelectedValue(newCategory);
        onCategoryChange(newCategory);
    };

    return (
        <Paper elevation={3} sx={{ width: '100%', p: { xs: 2, md: 3 }, mb: 4, borderRadius: 2 }}>
            <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} md={5} lg={4}>
                    <FormControl fullWidth variant="outlined">
                        <InputLabel id="category-select-label">Filter by Category</InputLabel>
                        <Select
                            labelId="category-select-label"
                            id="category-select"
                            value={selectedValue}
                            label="Filter by Category"
                            onChange={handleChange}
                        >
                            <MenuItem value="All">All Categories</MenuItem>
                            <MenuItem value="Arts, Entertainment, & Lifestyle">Arts, Entertainment, & Lifestyle</MenuItem>
                            <MenuItem value="Business, Tech, & Conferences">Business, Tech, & Conferences</MenuItem>
                            <MenuItem value="Community & Special Interest">Community & Special Interest</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12} md={7} lg={8}>
                    <Typography variant="body2" color="text.secondary" sx={{ pl: { md: 2 }, mt: { xs: 1, md: 0 } }}>
                        {categoryDescriptions[selectedValue] || "Select a category to see its description."}
                    </Typography>
                </Grid>
            </Grid>
        </Paper>
    );
}

export default FilterBar;