import { ICategoryAmount } from "@models/ICategory";
import { IPeriodRangeDates, IPeriodYearMonth } from "@models/IPeriod";
import IUser from "@models/IUser";

export interface IGetCurrentUserInfo extends IUser{}

export interface IGetCurrentUserBalance {
    balance: number
}
export interface IGetCurrentUserDailyExpensesResponse {
    date: string,
    amount: number
}
export interface IGetCurrentUserDailyExpensesBody {
    period: IPeriodYearMonth | IPeriodRangeDates
}
export interface IGetUserExpensesByGroupResponse {
    group_id: number,
    group_title: string,
    categories: ICategoryAmount[]
}

export interface IGetUserExpensesByGroupBody {
    group_id: number,
    period: IPeriodYearMonth | IPeriodRangeDates;
}

export interface IGetTotalExpensesResponse {
    amount: number,
    percentage_increase: number
}
export interface IGetTotalReplenishmentsResponse extends IGetTotalExpensesResponse{}
export interface IGetTotalExpensesBody {
    period: IPeriodYearMonth | IPeriodRangeDates
}
export interface IGetTotalReplenishmentsBody extends IGetTotalExpensesBody { }

export interface IGetUserExpensesByCategoryResponse extends ICategoryAmount {}

export interface IGetUserExpensesByCategoryBody {
    period: IPeriodYearMonth | IPeriodRangeDates;
}

