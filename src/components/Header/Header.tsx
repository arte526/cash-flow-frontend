import React from 'react';
//types
import {FC, ReactNode} from 'react';
//hooks
import { useWindowSize } from 'usehooks-ts';
import { useCallback } from 'react';

//UI
import PcHeader from './PcHeader/PcHeader';
import MobileHeader from './MobileHeader/MobileHeader';

const Header: FC = () => {
    return (<>
        <MobileHeader/>
        <PcHeader/>
    </>);
};

export default Header;