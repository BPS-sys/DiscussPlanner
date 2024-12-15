import { useContext, useState, createContext, Children } from "react";

const DrawerContext = createContext();

export const DrawerProvider = ({ children }) => {
    const [chatopen, setOpen] = useState(false);
    const [ responsecheck, SetResponseCheck ] = useState(false);
    const toggleDrawer = (newOpen) => () => {
        setOpen(newOpen);
        console.log(chatopen);
    };
    return (
        <DrawerContext.Provider value={{ chatopen, toggleDrawer, responsecheck, SetResponseCheck}}>
            { children }
        </DrawerContext.Provider >
    );
};

// Context を利用するカスタムフック
export const useDrawerContext = () => {
    return useContext(DrawerContext);
};

