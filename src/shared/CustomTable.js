import { DeleteForeverOutlined, EditOutlined, RemoveRedEyeOutlined } from '@mui/icons-material';
import { Box, Button, useTheme } from '@mui/material';
import { DataGrid, GridToolbar, getGridDateOperators, getGridNumericOperators, getGridSingleSelectOperators, getGridStringOperators } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import moment from 'moment';

// const Table = styled(DataGrid)(() => ({
//     "& .MuiDataGrid-toolbarContainer": {
//         "& .MuiButton-root": {
//             [theme.breakpoints.down('lg')]: {
//                 fontSize: "11px"
//             },
//         }
//     },
//     "& .MuiDataGrid-virtualScrollerContent": {
//         height: "100% !important"
//     },
//     "& .MuiDataGrid-columnHeaders": {
//         "& div": {
//             backgroundColor: theme.palette.secondary.main,
//             // color: "Bka"
//             "& .MuiDataGrid-columnHeaderTitle": {
//                 fontWeight: 'bold'
//             }
//         }
//     },
//     "& .MuiDataGrid-sortIcon": {
//         opacity: 1,
//         color: "white",
//     },
//     "& .MuiDataGrid-menuIconButton": {
//         opacity: 1,
//         color: "white"
//     },
//     "& .MuiDataGrid-cell": {
//         alignContent: "center"
//     },
//     "& .MuiDataGrid-footerContainer": {
//         position: "sticky",
//         bottom: 0,
//         background: "white",
//         "& .MuiInputBase-root": {
//             border: "1px solid "+theme.palette.primary.main,
//             borderRadius: "5px"
//         }
//     }
// }));

export default function CustomTable(props){
    const theme = useTheme();
    const PAGE_CONFIG = {pageSize: 25, page: 0};
    const [pagination, setPagination] = useState(PAGE_CONFIG)
    const [columns, setColumns] = useState([]);
    const filterStringOperators = getGridStringOperators().filter(({ value }) =>
        !['isEmpty', 'isNotEmpty', 'isAnyOf' ].includes(value),
    );
    const filterNumericOperators = getGridNumericOperators().filter(({ value }) =>
        !['isEmpty', 'isNotEmpty', 'isAnyOf' ].includes(value),
    );
    const filterDateOperators = getGridDateOperators().filter(({ value }) =>
        !['isEmpty', 'isNotEmpty', 'isAnyOf', 'not', 'after', 'before' ].includes(value),
    );
    const filterSingleSelectOperators = getGridSingleSelectOperators().filter(({ value }) =>
        !['isAnyOf'].includes(value),
    )

    useEffect(()=>{
        let columnData = [];
        props.columns.forEach((x)=>{
            if(x.field == 'action'){
                columnData.push({
                    field: 'action',
                    headerName: x.headerName,
                    flex: 1,
                    minWidth: x.minWidth || 100,
                    headerClassName: 'header',
                    filterable: false,
                    sortable: false,
                    renderCell: (params) => (
                        <>
                          {x.onView && <Button
                              type="button"
                              onClick={()=>{props.onView(params.row._id)}}
                              sx={{color: theme.palette.warning.main, p: '2px', minWidth: 0, m: 1}}
                          >
                              <RemoveRedEyeOutlined/>
                          </Button>}
                          {x.onEdit && <Button
                              type="button"
                              onClick={()=>{props.onEdit(params.row._id)}}
                              sx={{color: theme.palette.primary.main, p: '2px', minWidth: 0, m: 1}}
                          >
                              <EditOutlined/>
                          </Button>}
                          {x.delItem && <Button
                              type="button"
                              color='error'
                              onClick={()=>props.delItem(params.row._id)}
                              sx={{p: '2px', minWidth: 0, m: 1}}
                          >
                              <DeleteForeverOutlined />
                          </Button>}
                          {x.modal && <Button
                              type="button"
                              color='primary'
                              onClick={()=>props.modal(params.row)}
                              sx={{p: '2px', minWidth: 0, m: 1}}
                          >
                              <RemoveRedEyeOutlined />
                          </Button>}
                        </>
                    )
                })
            }else{
                columnData.push({
                    ...x,
                    flex: 1,
                    minWidth: x.minWidth || 100,
                    headerClassName: 'header',
                    filterable: x.filterable,
                    sortable: x.sortabe || true,
                    filterOperators: x.type == 'number' ? filterNumericOperators :
                        x.type == 'date' ? filterDateOperators :
                        x.type == 'singleSelect' ? filterSingleSelectOperators :
                        filterStringOperators,
                })
            }
        })
        setColumns(columnData);
    },[props.columns])

    function onPageChange(e){
        setPagination(e);
        props.onPageChange(e);
    }

    function onFilterChange(e){
        if(e.items.length && (e.items[0].value?.length > 0 || e.items[0].value instanceof Date)){
            let operator = e.items[0].operatorValue;
            if(e.items[0].value instanceof Date){
                e.items[0].value = new Date(moment(e.items[0].value).format('yyyy-MM-DD 00:00:00')).toISOString();
            }
            if(e.items[0].value instanceof Date == false){
                operator = operator == 'is' ? '=' : (operator == 'not' ? '!=' : operator);
            }
            props.onFilter({
                [e.items[0].columnField]: e.items[0].columnField == 'amount' ? (100*e.items[0].value) : e.items[0].value,
                operator: operator
            })
        }
        else if(!e.items?.length || (e.items?.length && !e.items[0]?.value))
            props.onFilter({});
    }

    function onSort(e){
        if(e.length)
            props.onSort({
                sortBy: e[0].field,
                sort: e[0].sort == 'asc' ? 1 : -1
            })
        else
            props.onSort({sortBy: '_id', sort: -1})
    }

    return(
        <Box sx={{
            height: '75vh',
            width: '100%',
            '& .header': {
              backgroundColor: theme.palette.primary.main,
              color: '#fff'
            },
          }}>
            <DataGrid
                getRowId={(row) => row._id}
                rows={props.data.data }
                columns={columns}
                disableSelectionOnClick={true}
                components={{ Toolbar: GridToolbar }} 
                density={'compact'}
                // Pagination settings
                initialState={{
                    pagination: {
                      pageSize: 25,
                    },
                  }}
                rowsPerPageOptions={[5, 10, 25, 50]}
                paginationModel={pagination}
                onPageSizeChange={(e) => onPageChange({...PAGE_CONFIG, pageSize: e})}
                onPageChange={(newPage) => onPageChange({...PAGE_CONFIG, page: newPage})}
                rowCount={props.data.pagination?.total || 0}
                paginationMode="server"
                // Pagination settings

                // Filter settings
                onFilterModelChange={onFilterChange}
                filterMode="server"
                // Filter settings

                // Sorting settings
                sortingMode="server"
                onSortModelChange={onSort}
                // Sorting settings
            />
        </Box>
    )
};