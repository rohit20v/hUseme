const Tool = ({children, isSelected}) => {

    return (
        <div
            style={isSelected ? {backgroundColor: "lightskyblue", padding: "4px"} : {}}
            role="button"
            tabIndex={0}
            className={"tool"}
            onFocus={(e) => e.currentTarget.style.outline = '1px solid dodgerblue'}
            onBlur={(e) => e.currentTarget.style.outline = 'none'}
        >
            {children}
        </div>
    );
};

export default Tool;