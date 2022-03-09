
import {
    IDropdownStyles,
    IStackTokens,
    mergeStyleSets,
} from "office-ui-fabric-react";

export const controlClass = mergeStyleSets({
    filtercontainer: {
       
    },
    
    Embedcontainer: {
        height: '70vh',
        marginTop: "0px",
        width: "85vw",
        
    },
    searchStyles: {
        marginTop: "30px",
    },
    margintop5: {
        marginTop: "5px",
    },
    marginleft15: {
        marginLeft: "5px",
        textAlign: "left"
    },
    submitStyles: {
        marginTop: "28px",
        marginLeft: "10px",
    },
    optionsStyles: {
        marginTop: "0px",
        marginLeft: "30px",
        padding: "0px",

    },
    optionsStyles1: {
        width: '230px',
        marginTop: "0px",
        marginLeft: "0px",
        padding: "0px",

    },
    commandbarStyles: {
        padding: "0px",
        width: "85vw"
    }
});

export const dropdownStyles: Partial<IDropdownStyles> = {
    dropdown: { width: 350 , marginTop: "10px" },
};

export const stackTokens: IStackTokens = { childrenGap: 0 };

export const stackTokens1: IStackTokens = { childrenGap: 5 };