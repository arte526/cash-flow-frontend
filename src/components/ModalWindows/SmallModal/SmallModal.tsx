import CloseButton from '@components/Buttons/CloseButton/CloseButton';
import React, {FC, SetStateAction, Dispatch, useRef, ReactNode, useState, useEffect} from 'react';
import { useOnClickOutside } from 'usehooks-ts'
//UI
import classes from './SmallModal.module.css';
import useClickOutsideRef from '@hooks/layoutHooks/useClickOutsideRef';

interface ISmallModalProps {
    active: boolean;
    setActive: Dispatch<SetStateAction<boolean>>;
    children: ReactNode,
    title: string;
    className: string,
    buttonRef?: React.RefObject<HTMLElement>
    disableHeader?: boolean
}
const SmallModal: FC<ISmallModalProps> = ({ active, setActive, children, className, title, buttonRef, disableHeader = false }) => {
    const [isVisible, setIsVisible] = useState<boolean>(active)
    const [isFadeOut, setIsFadeOut] = useState<boolean>(false)
    const ref = useRef(null);
    useClickOutsideRef(ref, () => setActive(false))
    useEffect(() => {
        if (active) {
            setIsVisible(true);
            setIsFadeOut(false)
        } else {
            setIsFadeOut(true);
        }
    }, [active])

    const handleAnimationEnd = (e: React.AnimationEvent<HTMLDivElement>) => {
        if (e.animationName.includes('fadeOut')) { 
            setIsVisible(false)
            setIsFadeOut(false)
        }
    }
    return (
        <>
            {isVisible && 
                <div
                    className={`${className ? className : ''}  ${isFadeOut ? `${classes.modal} ${classes.cardFadeOut}` : classes.modal}`}
                    onClick={(e) => e.stopPropagation()}
                    onAnimationEnd={handleAnimationEnd}
                    ref={ref}>
                    {!disableHeader && 
                    <div className={classes.modalHeader}>
                        <h5 className={classes.title}>{title}</h5>
                        <CloseButton size={24} closeHandler={() => { setActive(false) }} />
                    </div>}
                    <div className={classes.modal__content}>
                        {children}
                    </div>
                </div>}
        </>
    );
};

export default SmallModal;