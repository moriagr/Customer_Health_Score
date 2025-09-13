import React, { ReactNode } from 'react';
import { Loading } from '../UI/Loading';
import { ErrorBox } from '../UI/ErrorBox';
import { EmptyDataMessage } from '../UI/EmptyDataMessage';
import { CustomButton } from '../UI/CustomButton/Index';

interface Props {
    loading: boolean;
    error?: string | null;
    isEmpty?: boolean;
    emptyMessage?: string;
    children: ReactNode;
    goBack?: () => void;
    tryAgain?: () => void;
}

export const DataStateHandler: React.FC<Props> = ({
    loading,
    error,
    isEmpty,
    goBack,
    tryAgain,
    emptyMessage = "No data available.",
    children
}) => {
    return <div style={{ padding: 20 }}>
        {goBack ? <CustomButton onClickFunc={goBack} text={"Go Back"} /> : null}

        {loading ?
            <Loading /> :
            error ?
                <ErrorBox error={error} tryAgain={tryAgain} goBack={goBack} /> :
                isEmpty ?
                    <EmptyDataMessage message={emptyMessage} /> :
                    children}
    </div>
};
