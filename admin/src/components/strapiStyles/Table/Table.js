import React, { useReducer } from 'react';
import { Table } from '@buffetjs/core';
import { sortBy as sort } from 'lodash';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faPencilAlt,
    faTrashAlt,
} from '@fortawesome/free-solid-svg-icons';

const headers = [
    {
        name: 'Id',
        value: 'id',
        isSortEnabled: true,
    },
    {
        name: 'First name',
        value: 'firstname',
        isSortEnabled: true,
    },
    {
        name: 'Last name',
        value: 'lastname',
        isSortEnabled: true,
    },
    {
        name: 'Best recipe',
        value: 'recipe',
        isSortEnabled: true,
    },
    {
        name: 'Main restaurant',
        value: 'restaurant',
        isSortEnabled: true,
    },
];

const rows = [
    {
        id: 1,
        firstname: 'Pierre',
        lastname: 'Gagnaire',
        recipe: 'Ratatouille',
        restaurant: 'Le Gaya',
    },
    {
        id: 2,
        firstname: 'Georges',
        lastname: 'Blanc',
        recipe: 'Beef bourguignon',
        restaurant: 'Le Georges Blanc',
    },
    {
        id: 3,
        firstname: 'Mars',
        lastname: 'Veyrat',
        recipe: 'Lemon Chicken',
        restaurant: 'La Ferme de mon père',
    },
];

const updateAtIndex = (array, index, value) =>
    array.map((row, i) => {
        if (index === i) {
            row._isChecked = value;
        }

        return row;
    });

const updateRows = (array, shouldSelect) =>
    array.map(row => {
        row._isChecked = shouldSelect;

        return row;
    });

function reducer(state, action) {
    const { nextElement, sortBy, type } = action;

    switch (type) {
        case 'CHANGE_SORT':
            if (state.sortBy === sortBy && state.sortOrder === 'asc') {
                return { ...state, sortOrder: 'desc' };
            }

            if (state.sortBy !== sortBy) {
                return { ...state, sortOrder: 'asc', sortBy };
            }

            if (state.sortBy === sortBy && state.sortOrder === 'desc') {
                return { ...state, sortOrder: 'asc', sortBy: nextElement };
            }

            return state;
        case 'SELECT_ALL':
            return { ...state, rows: updateRows(state.rows, true) };
        case 'SELECT_ROW':
            return {
                ...state,
                rows: updateAtIndex(state.rows, action.index, !action.row._isChecked),
            };
        case 'UNSELECT_ALL':
            return { ...state, rows: updateRows(state.rows, false) };
        default:
            return state;
    }
}

function init(initialState) {
    const updatedRows = initialState.rows.map(row => {
        row._isChecked = false;

        return row;
    });

    return { ...initialState, rows: updatedRows };
}

function Example({ withBulkAction, rowLinks, onClickRow, ...props }) {
    const [state, dispatch] = useReducer(
        reducer,
        {
            headers: props.headers || headers,
            rows: props.rows || rows,
            sortBy: props.sortBy || 'id',
            sortOrder: props.sortOrder || 'asc',
        },
        init,
    );
    const areAllEntriesSelected = state.rows.every(
        row => row._isChecked === true,
    );
    const bulkActionProps = {
        icon: 'trash',
        onConfirm: () => {
            alert('Are you sure you want to delete these entries?');
        },
        translatedNumberOfEntry: 'entry',
        translatedNumberOfEntries: 'entries',
        translatedAction: 'Delete all',
    };
    const sortedRowsBy = sort(state.rows, [state.sortBy]);
    const sortedRows =
        state.sortOrder === 'asc' ? sortedRowsBy : sortedRowsBy.reverse();

    return (
        <Table
            headers={state.headers}
            bulkActionProps={bulkActionProps}
            onClickRow={onClickRow}
            rows={sortedRows}
            showActionCollapse
            sortBy={state.sortBy}
            sortOrder={state.sortOrder}
            withBulkAction={withBulkAction}
            rowLinks={rowLinks}
            onChangeSort={({
                sortBy,
                firstElementThatCanBeSorted,
                isSortEnabled,
            }) => {
                if (isSortEnabled) {
                    dispatch({
                        type: 'CHANGE_SORT',
                        sortBy,
                        nextElement: firstElementThatCanBeSorted,
                    });
                }
            }}
            onSelect={(row, index) => {
                dispatch({ type: 'SELECT_ROW', row, index });
            }}
            onSelectAll={() => {
                const type = areAllEntriesSelected ? 'UNSELECT_ALL' : 'SELECT_ALL';

                dispatch({ type });
            }}

        // onClickRow={(e, data) => {
        //     console.log(data);
        //     alert('You have just clicked');
        // }}
        // rowLinks={[
        //     {
        //         icon: <FontAwesomeIcon icon={faPencilAlt} />,
        //         onClick: data => {
        //             console.log(data);
        //         },
        //     },
        //     {
        //         icon: <FontAwesomeIcon icon={faTrashAlt} />,
        //         onClick: data => {
        //             console.log(data);
        //         },
        //     },
        // ]}
        />
    );
}

export default Example;