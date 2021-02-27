import React from 'react';
import { useDispatch } from 'react-redux';

const Title = ({data}) => {
    const dispatch = useDispatch();
    return (
        <>
            <span>
                {data.title}
            </span>
            <i
                className='dx-icon dx-icon-close'
                style={{
                    display: 'inline-block',
                    opacity: 0.6,
                    marginRight: 0,
                    marginLeft: 7,
                    fontSize: 18
                }}
                onClick={() => dispatch({
                    type: 'front.tab.close',
                    data
                })}
            />
        </>
    );
};

export default Title;
