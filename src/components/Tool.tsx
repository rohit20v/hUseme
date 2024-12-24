import React from "react";

const Tool = ({children}) => {
    const handleClick = () => {
        console.log('Div clicked!');
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLDivElement>) => {
        const isEnterOrSpace = e.key === 'Enter' || e.key === ' ';
        if (isEnterOrSpace) {
            e.preventDefault();
            handleClick();
        }
    };

    return (
        <div
            role="button"
            tabIndex={0}
            onClick={handleClick}
            onKeyDown={handleKeyPress}
            className={"tool"}
            onFocus={(e) => e.currentTarget.style.outline = '1px solid blue'}
            onBlur={(e) => e.currentTarget.style.outline = 'none'}
        >
            {children}
        </div>
    );
};

export default Tool;