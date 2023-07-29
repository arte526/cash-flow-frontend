import { api } from '@store/api';

//types
import IGroup from '@models/IGroup';
import { 
    ICreateExpenseByGroupBody,
    IUpdateExpenseByGroupBody,
    IExpenseByGroupResponse,
    IGetExpensesByGroupBody
} from './ExpensesControllerInterfaces';
import { Omiter } from '@services/UsefulMethods/ObjectMethods';
import IExpense from '@models/IExpense';


export const ExpensesApiSlice = api.injectEndpoints({
    endpoints: (builder) => ({
        getExpenses: builder.query<IExpense[], string>({
            query: (year_month: string = '2023-07') => ({
                url: `groups/expenses`,
                params: {
                    year_month: year_month,
                },
                credentials: 'include',
            }),
            transformErrorResponse: (
                response: { status: string | number },
            ) => response.status,
            providesTags: (result) => result ? [...result.map(item => ({ type: 'ExpensesController' as const, id: item.id })),
            { type: 'ExpensesController', id: 'EXPENSES_BY_GROUP' },
            { type: 'ExpensesController', id: 'DELETE_EXPENSE_BY_GROUP' }]
                :
            [{ type: 'ExpensesController', id: 'EXPENSES_BY_GROUP' },
            { type: 'ExpensesController', id: 'DELETE_EXPENSE_BY_GROUP' }]
        }),
        getExpensesByGroup: builder.query<IExpense[], IGetExpensesByGroupBody>({
            query: ({group_id, period}) => ({
                url: `groups/${group_id}/expenses`,
                params: period,
                credentials: 'include',
            }),
            transformResponse: (response: IExpense[]): IExpense[] => {
                let unifiedCategories: IExpense[] = [];
                for (let i = 0; i < response.length; i++){
                    if (unifiedCategories[i]?.category_group.category.id !== response[i].category_group.category.id){
                        let unifiedCategory = response[i]
                        unifiedCategory.amount = 0;
                        unifiedCategories.push(unifiedCategory);
                    }
                }
                for (let i = 0; i < response.length; i++){
                    let updatingCategory = unifiedCategories[unifiedCategories.findIndex(el => el.category_group.category.id === response[i].category_group.category.id)]
                    updatingCategory.amount += response[i].amount
                    unifiedCategories[unifiedCategories.findIndex(el => el.category_group.category.id === response[i].category_group.category.id)] = updatingCategory
                }
                return unifiedCategories;
            },
            transformErrorResponse: (
                response: { status: string | number },
            ) => response.status,
            providesTags: (result) => result ? [...result.map(item => ({ type: 'ExpensesController' as const, id: item.id }))]
            : []
        }),
        createExpenseByGroup: builder.mutation<IExpenseByGroupResponse, ICreateExpenseByGroupBody>({
            query: (body) => ({
                url: `expenses/${body.group_id}/expenses`,
                method: 'POST',
                credentials: 'include',
                body: Omiter(['group_id'], body)
            }),
            transformErrorResponse: (
                response: { status: string | number },
            ) => response.status,
            invalidatesTags: [{ type: 'ExpensesController', id: 'EXPENSES_BY_GROUP' }],
        }),
        updateExpenseByGroup: builder.mutation<IExpenseByGroupResponse, IUpdateExpenseByGroupBody>({
            query: (body) => ({
                url: `expenses/${body.group_id}/expenses/${body.id}`,
                method: 'PUT',
                credentials: 'include',
                body: Omiter(['id','group_id'], body)
            }),
            transformErrorResponse: (
                response: { status: string | number },
            ) => response.status,
            invalidatesTags: (result, error, body) => [{ type: 'ExpensesController', id: body.id }],
        }),
        deleteExpenseByGroup: builder.mutation<null, {group_id:number, expense_id: number}>({
            query: ({ group_id, expense_id}) => ({
                url: `expenses/${group_id}/expenses/${expense_id}`,
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