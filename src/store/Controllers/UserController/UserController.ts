import IUser from '@models/IUser';
import { api } from '@store/api';

//types
import { IGetCurrentUserBalance, IGetCurrentUserInfo } from './UserControllerInterfaces';


export const UserApiSlice = api.injectEndpoints({
    endpoints: (builder) => ({
        getUserAuthStatus: builder.query<boolean, null>({
            query: () => ({
                url: `users/user-balance`,
                credentials: 'include',
            }),
            transformErrorResponse: (
                response: { status: string | number },
            ) => response.status,
            transformResponse: (response: {balance: number}): boolean => {
                if (!response) {
                    return false  
                } 
                return !!response
            },
            providesTags: [{ type: 'UserController' as const, id: 0 }],
        }),
        getCurrentUserInfo: builder.query<IGetCurrentUserInfo, null>({
            query: () => ({
                url: `users/info`,
                credentials: 'include',
            }),
            transformErrorResponse: (
                response: { status: string | number },
            ) => response.status,
            providesTags: [{ type: 'UserController' as const, id: 0 }],
        }),
        getUsers: builder.query<IUser[], null>({
            query: () => ({
                url: `users`,
                credentials: 'include',
            }),
            transformErrorResponse: (
                response: { status: string | number },
            ) => response.status,
            providesTags: [{ type: 'UserController' as const }],
        }),
        getCurrentUserBalance: builder.query<IGetCurrentUserBalance, null>({
            query: () => ({
                url: `users/user-balance`,
                credentials: 'include',
            }),
            transformErrorResponse: (
                response: { status: string | number },
            ) => response.status,
            providesTags: [
                { type: 'UserController' as const, id: 0 },
                { type: 'ReplenishmentsController' as const, id: 'CREATE_REPLENISHMENT' },
                { type: 'ExpensesController', id: 'EXPENSES_BY_GROUP' }],
        }),
    }),
    overrideExisting: false,
})

export const {
    useGetUserAuthStatusQuery,
    useGetCurrentUserInfoQuery,
    useGetCurrentUserBalanceQuery,
    useGetUsersQuery
} = UserApiSlice