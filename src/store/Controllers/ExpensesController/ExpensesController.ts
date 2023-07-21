import { api } from '@store/api';

//types
import IGroup from '@models/IGroup';
import { 
    IExpenseByGroupBody,
    IExpenseByGroupResponse
} from './ExpensesControllerInterfaces';
import { Omiter } from '@services/UsefulMethods/ObjectMethods';
import IExpense from '@models/IExpense';


export const ExpensesApiSlice = api.injectEndpoints({
    endpoints: (builder) => ({
        getExpenses: builder.query<IExpense[], string>({
            query: (year_month: string = '2023-07') => ({
                url: `expenses`,
                params: {
                    year_month: year_month,
                },
                credentials: 'include',
            }),
            transformErrorResponse: (
                response: { status: string | number },
            ) => response.status,
            providesTags: (result) => result ? [...result.map(item => ({ type: 'ExpensesController' as const, id: item.id })),
            { type: 'ExpensesController', id: 'CREATE_EXPENSE_BY_GROUP' },
            { type: 'ExpensesController', id: 'UPDATE_EXPENSE_BY_GROUP' },
            { type: 'ExpensesController', id: 'DELETE_EXPENSE_BY_GROUP' }]
                :
            [{ type: 'ExpensesController', id: 'CREATE_EXPENSE_BY_GROUP' },
            { type: 'ExpensesController', id: 'UPDATE_EXPENSE_BY_GROUP' },
            { type: 'ExpensesController', id: 'DELETE_EXPENSE_BY_GROUP' }]
        }),
        getExpensesByGroup: builder.query<IExpense[], {group_id:number, year_month: string}>({
            query: ({group_id, year_month = '2023-07'}) => ({
                url: `expenses/by-group/${group_id}`,
                params: {
                    year_month: year_month
                },
                credentials: 'include',
            }),
            transformErrorResponse: (
                response: { status: string | number },
            ) => response.status,
            providesTags: (result) => result ? [...result.map(item => ({ type: 'ExpensesController' as const, id: item.id })),
            { type: 'ExpensesController', id: 'CREATE_EXPENSE_BY_GROUP' },
            { type: 'ExpensesController', id: 'UPDATE_EXPENSE_BY_GROUP' },
            { type: 'ExpensesController', id: 'DELETE_EXPENSE_BY_GROUP' }]
                :
            [{ type: 'ExpensesController', id: 'CREATE_EXPENSE_BY_GROUP' },
            { type: 'ExpensesController', id: 'UPDATE_EXPENSE_BY_GROUP' },
            { type: 'ExpensesController', id: 'DELETE_EXPENSE_BY_GROUP' }]
        }),
        createExpenseByGroup: builder.mutation<IExpenseByGroupResponse, IExpenseByGroupBody>({
            query: (body) => ({
                url: `expenses/group/${body.group_id}`,
                method: 'POST',
                credentials: 'include',
                body: Omiter(['id', 'group_id'], body)
            }),
            transformErrorResponse: (
                response: { status: string | number },
            ) => response.status,
            invalidatesTags: [{ type: 'ExpensesController', id: 'CREATE_EXPENSE_BY_GROUP' }],
        }),
        updateExpenseByGroup: builder.mutation<IExpenseByGroupResponse, IExpenseByGroupBody>({
            query: (body) => ({
                url: `expenses/group/${body.group_id}/${body.id}`,
                method: 'PUT',
                credentials: 'include',
                body: Omiter(['id','group_id'], body)
            }),
            transformErrorResponse: (
                response: { status: string | number },
            ) => response.status,
            invalidatesTags: [{ type: 'ExpensesController', id: 'UPDATE_EXPENSE_BY_GROUP' }],
        }),
        deleteExpenseByGroup: builder.mutation<null, {group_id:number, expense_id: number}>({
            query: ({ group_id, expense_id}) => ({
                url: `expenses/group/${group_id}/${expense_id}`,
                method: 'DELETE',
                credentials: 'include',
            }),
            transformErrorResponse: (
                response: { status: string | number },
            ) => response.status,
            invalidatesTags: [{ type: 'ExpensesController', id: 'DELETE_EXPENSE_BY_GROUP' }],
        }),
    }),
    overrideExisting: false,
})

export const {
    useGetExpensesQuery,
    useGetExpensesByGroupQuery,
    useCreateExpenseByGroupMutation,
    useUpdateExpenseByGroupMutation,
    useDeleteExpenseByGroupMutation
} = ExpensesApiSlice