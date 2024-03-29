'use client'
import * as React from 'react';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import {
    GridRowsProp,
    GridRowModesModel,
    GridRowModes,
    GridToolbarContainer,
    GridToolbar,
    GridValidRowModel,
} from '@mui/x-data-grid';
import {
    randomId,
} from '@mui/x-data-grid-generator';
import { IPatientHistory } from '@/app/interfaces/IPatient';
import moment from 'moment';

export var patientSex: string[] = ["F", "M"]
export const setPatientsSex = (pns: string[]) => {
    patientSex = pns
}

interface EditToolbarProps<T extends GridValidRowModel> {
    setRows: (newRows: (oldRows: GridRowsProp<T>) => GridRowsProp<T>) => void;
    setRowModesModel: (
        newModel: (oldModel: GridRowModesModel) => GridRowModesModel,
    ) => void;
}

export const HistoryEditToolbar: React.FC<EditToolbarProps<IPatientHistory>> = (props: EditToolbarProps<IPatientHistory>) => {
    const { setRows, setRowModesModel } = props;
    const handleClick = () => {
        const id = randomId();
        setRows((oldRows) => [...oldRows, {
            id: id,
            h_id: "",
            doctor_id: "",
            doctor_name: "",
            patient_id: "",
            patient_name: "",
            simple_diagnosis: "",
            diagnosis_desc: "",
            admission_date: moment().toDate(),
            discharge_date: moment().toDate(),
            bill_price: 0,
            isNew: true
        }]
        );
        console.log(`Addeding new row id = ${id}`)
        setRowModesModel((oldModel) => ({
            ...oldModel,
            // [id]: { mode: GridRowModes.Edit, fieldToFocus: 'simple_diagnosis' },
            [id]: { mode: GridRowModes.Edit, fieldToFocus: 'patient_name' },
        }))
    };

    return (
        <GridToolbarContainer>
            <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
                Add record
            </Button>
            <GridToolbar />
        </GridToolbarContainer>
    );
};

