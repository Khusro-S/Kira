# Data Processing Documentation

This document explains how the demo data for the Kira menstrual tracking app was prepared.

## Overview

The demo uses a curated dataset of menstrual cycle tracking data that has been:

- Transformed from cycle-level data to daily tracking entries
- Enhanced with synthetic health metrics (flow, mood, energy, sleep, symptoms)
- Pre-filtered to show one user per month for simplicity
- Split into monthly JSON files for efficient lazy loading

## Data Source

**Original Dataset**: `Menstural_cyclelength.csv`

- **Source**: [Menstrual Cycle Length Dataset - Kaggle](https://www.kaggle.com/datasets/himanshukumar7079/menstural-cycle-lengtg)
- **Records**: 3,325 cycle-level entries
- **Users**: 55 unique users
- **Date Range**: 1990-2012
- **License**: Public dataset available on Kaggle

## Processing Pipeline

The data processing was done using a Jupyter notebook with Python, Pandas, and NumPy.

### Repository

The data processing code is maintained in a separate repository:

**📁 Repository**: [kira-data-processing](https://github.com/Khusro-S/kira-data-processing)

### Processing Steps

1. **Data Loading**
   - Read CSV file with cycle-level data
   - Parse dates and validate data types

2. **Transformation to Daily Records**
   - Convert cycle-level entries to individual daily records
   - Calculate day of cycle for each date
   - Determine period days based on cycle information

3. **Synthetic Health Data Generation**
   - **Flow**: Random values (light/medium/heavy) for period days
   - **Mood**: Random values (great/good/okay/low/irritable)
   - **Energy**: Random values (high/medium/low)
   - **Sleep**: Random hours between 6-9
   - **Symptoms**: Random selection from predefined list

4. **User Selection (One per Month)**
   - Group data by month
   - Select user with most entries for each month
   - This simplifies the demo to ~30 entries per month

5. **Output Generation**
   - Create individual JSON files for each month (`YYYY-MM.json`)
   - Generate index file with metadata
   - Files saved to `/public/data/monthly/`

## Output Structure

```
/public/data/monthly/
├── index.json              # Metadata: total entries, date range, available months
├── 1990-01.json           # January 1990 data
├── 1990-02.json           # February 1990 data
├── ...
└── 2012-11.json           # November 2012 data
```

### File Format

**index.json**:

```json
{
  "totalEntries": 4989,
  "uniqueUsers": 55,
  "dateRange": {
    "min": "1990-01-01",
    "max": "2012-11-30"
  },
  "months": ["1990-01", "1990-02", ...]
}
```

**Monthly JSON** (e.g., `1990-01.json`):

```json
[
  {
    "userId": "123",
    "date": "1990-01-01",
    "flow": "medium",
    "mood": "great",
    "energy": "high",
    "sleep": 7.5,
    "symptoms": ["cramps", "bloating"],
    "notes": null,
    "isPeriod": true,
    "dayOfCycle": 1
  },
  ...
]
```

## Data Schema

| Field        | Type    | Description                                                      |
| ------------ | ------- | ---------------------------------------------------------------- |
| `userId`     | string  | Unique user identifier                                           |
| `date`       | string  | Date in YYYY-MM-DD format                                        |
| `flow`       | string  | Flow intensity: "light", "medium", "heavy", "none", or null      |
| `mood`       | string  | Mood state: "great", "good", "okay", "low", "irritable", or null |
| `energy`     | string  | Energy level: "high", "medium", "low", or null                   |
| `sleep`      | number  | Hours of sleep (6-9 hours), or null                              |
| `symptoms`   | array   | Array of symptom strings, or empty array                         |
| `notes`      | string  | User notes, or null                                              |
| `isPeriod`   | boolean | Whether this is a period day                                     |
| `dayOfCycle` | number  | Day number in the menstrual cycle                                |

## Demo Implementation

The demo uses lazy loading to efficiently display this data:

1. **Initial Load**: Loads only `index.json` (~2KB)
2. **Calendar View**: Loads 3 months at a time (current + prev + next)
3. **Insights View**: Loads months within selected time range
4. **Data Aggregation**:
   - 30 days & 3 months: Show daily data
   - 6 months: Show weekly averages
   - 1 year: Show monthly averages

## Statistics

- **Total Daily Entries**: 4,989
- **Users**: 55 unique users
- **Time Span**: 22+ years (1990-2012)
- **Monthly Files**: 167 files
- **File Size**: 2-6 KB per month
- **Total Demo Data**: ~500 KB (vs 21 MB if kept as one file)

## Running the Processing Yourself

If you want to regenerate the data:

1. Clone the data processing repository
2. Install dependencies: `pip install pandas numpy jupyter`
3. Open the Jupyter notebook
4. Run all cells
5. Copy the generated files to `/public/data/monthly/`

## Notes

- The demo data is synthetic and for demonstration purposes only
- Health metrics (mood, energy, sleep, symptoms) are randomly generated
- Real production data uses Convex database with user authentication
- This preprocessing was done once; the app only uses the resulting JSON files
