import React, { useEffect, useCallback, useState, ReactNode } from 'react';
import { useGetCategoryExpensesQuery, useGetCategoryExpenseByIdQuery, useGetCategoryExpensesTotalQuery, useAddCategoryExpenseMutation, useUpdateCategoryExpenseMutation, useDeleteCategoryExpenseMutation } from '@store/UserCategoryExpenseApiSlice/UserCategoryExpenseApiSlice';
import classes from './UserExpenseCard.module.css'
import UserExpenseChart from '@components/UserExpenseChart/UserExpenseChart';
import UserExpenseCardDot from '@components/UserExpenseCardDot/UserExpenseCardDot';
import { numberWithCommas } from '@services/UsefulMethods/UsefulMethods';


const UserExpenseCard = () => {
    const [id, setId] = useState<number>(0);
    const [isExtended, setIsExtended] = useState<boolean>(false);
    const { data: expenses = [], error: Expenses_GET_error, isError: isExpensesError, isLoading: isExpensesLoading } = useGetCategoryExpensesQuery(null);
    const { data: total, error: Total_GET_error, isError: isTotalError, isLoading: isTotalLoading } = useGetCategoryExpensesTotalQuery(null);

    if (isExpensesLoading || isTotalLoading) {
        return <div>Loading</div>
    }
    if (isExpensesError || isTotalError) {
        return <div>Error</div>
    }

    const getExpenses = () => {
        return expenses.map(item => <UserExpenseCardDot key={item.id} expense={item} setId={setId} />)
    }
    const expenseTitle = expenses.find(el => el.id === id)?.title;
    const expenseAmount = expenses.find(el => el.id === id)?.amount

    let expensePercentage;
    if (total && expenseAmount){
        expensePercentage = +(expenseAmount * 100 / total.total).toFixed(2) || 0;
    }

    
    const handleBtnClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        setIsExtended(!isExtended)
    }
    const handleCloseExtended = () => {
        if (isExtended) {
            setIsExtended(false)
        }
    }


    // if the user does not interact with this card for more than 15 seconds, close the extended menu
    let timeout: ReturnType<typeof setTimeout>;

    let clearInterval = () => {
        clearTimeout(timeout);
    }

    let setInterval = () => {
        timeout = setTimeout(handleCloseExtended, 15000);
    }
   
    return (
        <div className={classes.expenseChart} onMouseEnter={clearInterval} onMouseLeave={setInterval}>
            <div className={classes.inner}>
                <h3 className={classes.title}>Expenses</h3>
                <div className={classes.wrapper}>
                    <div className={classes.chart}>
                        <UserExpenseChart expenses={expenses}  total={total} setId={setId}/>
                    </div>
                    <div className={classes.info}>
                        <div className={classes.expenseInfo}>
                            <h5 className={classes.expenseTitle}>{expenseTitle}</h5>
                            <p className={classes.expensePercent}>{expensePercentage}%</p>
                            <span className={classes.expenseAmount}>{numberWithCommas(expenseAmount)}$</span>
                        </div>
                        {isExtended ? 
                            <ul className={classes.popupList}>
                                {getExpenses()}
                            </ul>
                        : 
                            <ul className={classes.chartList}>
                                {getExpenses().slice(0, 4)}
                                <li className={classes.item}>
                                    <button className={classes.viewMore} onClick={handleBtnClick}>View more</button>
                                </li>
                            </ul>
                    }
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserExpenseCard;