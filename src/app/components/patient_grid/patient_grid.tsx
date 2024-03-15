'use client'
import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import {
  GridRowsProp,
  GridRowModesModel,
  GridRowModes,
  DataGrid,
  GridColDef,
  GridToolbarContainer,
  GridActionsCellItem,
  GridEventListener,
  GridRowId,
  GridRowModel,
  GridRowEditStopReasons,
  GridToolbar,
  GridValidRowModel,
} from '@mui/x-data-grid';
import {
  randomCreatedDate,
  randomTraderName,
  randomId,
  randomArrayItem,
} from '@mui/x-data-grid-generator';
import Snackbar from '@mui/material/Snackbar';
import Alert, { AlertProps } from '@mui/material/Alert';
import axios, { AxiosResponse } from 'axios';
import moment from "moment"
import { randomNumberBetween } from '@mui/x-data-grid/utils/utils';
import { baseHost } from '@/app/constants/URLs';
import { getPatientsNames } from '@/app/service/patients.service';
import { StripedDataGrid } from '../editable_grid/striped_datagrid';
// import { patientNames, roomColumns, setPatientsName, setStaffsName, staffNames } from './room.grid.columns';
import { getStaffsName } from '@/app/service/stafff.service';
import { setPatientsAndStaffDropdownData } from '@/app/utils/patient.staff.helper';
import { IPatient, ResponsePatient } from '@/app/interfaces/IPatient';

export var patientSex: string[] = ["F", "M"]
export const setPatientsSex = (pns: string[]) => {
  patientSex = pns
}


interface EditToolbarProps {
  setRows: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void;
  setRowModesModel: (
    newModel: (oldModel: GridRowModesModel) => GridRowModesModel,
  ) => void;
}

const EditToolbar: React.FC<EditToolbarProps> = ({ setRows, setRowModesModel }) => {
  const handleClick = () => {
    const id = randomId();
    setRows((oldRows) => [...oldRows, { id, name: '', age: '', isNew: true }]);
    setRowModesModel((oldModel) => ({
      ...oldModel,
      [id]: { mode: GridRowModes.Edit, fieldToFocus: 'name' },
    }));
  };

  return (
    <><GridToolbarContainer>
          <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
              Add record
          </Button>
      </GridToolbarContainer><GridToolbar /></>
  );
};

const useFakeMutation = () => {
  return React.useCallback(
    // (oldRoomToMutate: Partial<IRoom>) =>
    //     new Promise<Partial<IRoom>>((resolve, reject) => {
    (oldRoomToMutate: Partial<any>) =>
      new Promise<Partial<any>>((resolve, reject) => {
        console.log("updated row ...".bgMagenta)
        console.log(oldRoomToMutate)
        setTimeout(() => {

          console.log("request to changing patient from room")
          axios.put(`${baseHost}/api/room`, {
            operation: "changePatient",
            room_id: oldRoomToMutate.room_id,
            patient_fullname_to_change: oldRoomToMutate.patient
            // patient_to: props.row.patient,
            // patient_to: props.row.patient
          })

          console.log("request to changing staff from room")
          axios.put(`${baseHost}/api/room`, {
            operation: "changeStaff",
            room_id: oldRoomToMutate.room_id,
            staff_fname_to_change: oldRoomToMutate?.staff?.trim().split(" ")[0]
            // patient_to: props.row.patient,
            // patient_to: props.row.patient
          })
          resolve({ ...oldRoomToMutate })
        }, 2000);
      }),
    [],
  );
};

const FullFeaturedCrudGrid: React.FC = () => {
  const [rows, setRows] = React.useState<GridRowsProp<IPatient>>([])
  const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>({});
  axios.get(`${baseHost}/api/patient`).then((res: AxiosResponse<ResponsePatient>) => {
    //console.log(res)
    //console.log(res.data.patient)
    if (res.data.patient) {
        const modifiedRows = res.data.patient.map((pt: IPatient) => {
            // console.log(`room bd[${rm.building_name}], floor[${rm.floor}]`)
            return {
                ...pt,
                p_id: pt.p_id,
                name: pt.name,
                sex: pt.gender,
                birthday: moment(pt.birthday).toDate(),
                tel: pt.phone_no
            }
        })
        //console.log(modifiedRows)
        setRows(modifiedRows)
        setSnackbar({
            children: "Retrieved rooms data from server.",
            // children: JSON.stringify(modifiedRows),
            severity: "success"
        })
    }
}).catch((err: any) => {
    console.log("Error getting room data from backend.")
    // console.error(err)
    setSnackbar({
        children: "Can not retrive rooms data from server...",
        severity: "error"
    })
})
  const mutateRow = useFakeMutation();
  const [snackbar, setSnackbar] = React.useState<Pick<
    AlertProps,
    'children' | 'severity'
  > | null>(null);

  const handleRowEditStop: GridEventListener<'rowEditStop'> = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleEditClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });

    // axios.put(`${baseHost}/api/patient`, {
    //     operation: "save",
    //     room_id : oldRoomToMutate.room_id,
    //     patient_fullname_to_change: oldRoomToMutate.patient
    //     // patient_to: props.row.patient,
    //     // patient_to: props.row.patient
    // })
  };

  const handleDeleteClick = (id: GridRowId) => () => {
    setRows(rows.filter((row) => row.p_id !== id));
  };

  const handleCancelClick = (id: GridRowId) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    const editedRow = rows.find((row) => row.p_id === id);
    if (editedRow!.isNew) {
      setRows(rows.filter((row) => row.p_id !== id));
    }
  };

  const processRowUpdate = React.useCallback(
    // async (newRow: GridRowModel<IRoom>) => {
    async (newRow: GridRowModel) => {
      // Make the HTTP request to save in the backend
      // console.log("updated")
      const response = await mutateRow(newRow);
      setSnackbar({ children: 'User successfully saved', severity: 'success' });
      return response;
    },
    [mutateRow],
  );

  //   const handleProcessRowUpdateError = React.useCallback((error: Error) => {
  //     setSnackbar({ children: error.message, severity: 'error' });
  //     }, []);

  //     return (
  //     // <div style={{ height: 400, width: '100%' }}>
  //     <div style={{ height: '80vh', width: '100%' }}>
  //         {/* <StriptedData */}
  //         <StripedDataGrid
  //             rows={rows}
  //             columns={columns}
  //             // processRowUpdate={() => {console.log("updated")}}
  //             processRowUpdate={processRowUpdate}
  //             onProcessRowUpdateError={handleProcessRowUpdateError}
  //             slots={{ toolbar: GridToolbar }}
  //             getRowClassName={(params) =>
  //                 params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'
  //             }
  //         />
  //         {!!snackbar && (
  //             <Snackbar
  //                 open
  //                 anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
  //                 onClose={handleCloseSnackbar}
  //                 autoHideDuration={6000}
  //             >
  //                 <Alert {...snackbar} onClose={handleCloseSnackbar} />
  //             </Snackbar>
  //         )}
  //         </div>
  //         );
  //     }

  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const columns: GridColDef[] = [
    {
      field: 'p_id',
      headerName: 'ID',
      type: 'string',
      width: 70,
      editable: true,
    },
    { field: 'name', 
    headerName: 'Name', 
    width: 250, 
    editable: true,
    type: 'string' },
    {
      field: 'sex',
      headerName: 'Sex',
      type: 'singleSelect',
      width: 130,
      editable: true,
      valueOptions: ({ row }) => {
        if (patientSex !== null)
          return patientSex
        return ["F", "M"]
      },
      // renderEditCell: (params) => <CustomEditComponent {...params} />,
      //renderCell: (params) => <CustomRenderCellComponent {...params} />
    },
    {
      field: 'birthday',
      headerName: 'Birthday',
      type: 'date',
      width: 230,
      align: 'left',
      headerAlign: 'left',
      editable: true,
    },
    {
      field: 'tel',
      headerName: 'Tel.',
      width: 230,
      editable: true,
      type: 'string',
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 100,
      cellClassName: 'actions',
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              label="Save"
              sx={{
                color: 'primary.main',
              }}
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              icon={<CancelIcon />}
              label="Cancel"
              className="textPrimary"
              onClick={handleCancelClick(id)}
              color="inherit"
            />,
          ];
        }

        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(id)}
            color="inherit"
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={handleDeleteClick(id)}
            color="inherit"
          />,
        ];
      },
    }
  ];

  return (
    <Box
      sx={{
        height: 500,
        width: '100%',
        '& .actions': {
          color: 'text.secondary',
        },
        '& .textPrimary': {
          color: 'text.primary',
        },
      }}
    >
      <DataGrid
        rows={rows}
        columns={columns}
        getRowId={(row) => row.p_id}
        editMode="row"
        rowModesModel={rowModesModel}
        onRowModesModelChange={handleRowModesModelChange}
        onRowEditStop={handleRowEditStop}
        processRowUpdate={processRowUpdate}
        slots={{
          toolbar: EditToolbar
        }}
        slotProps={{
          toolbar: { setRows, setRowModesModel,toolbar: {
          } },
        }}
      />
    </Box>
  );
};

export default FullFeaturedCrudGrid;