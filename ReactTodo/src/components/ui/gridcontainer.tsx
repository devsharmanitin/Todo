import type { ReactNode, FC } from 'react';

interface GridContainerPrsps {
    children: ReactNode,
    className?: string,
}


const GridContainer: FC<GridContainerPrsps> = ({ children, className }) => {
    return (
        <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 rounded-lg ${className}`}>
            {children}
        </div>
    )
}


export default GridContainer;