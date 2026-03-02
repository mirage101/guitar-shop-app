import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../lib/firebase";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [userData, setUserData] = useState();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (!user) {
                setUserData(null);
                return;
            }

            setUserData({
                id: user.uid,
                email: user.email,
                customerName: user.displayName || user.email?.split("@")[0] || "Customer",
            });
        });

        return unsubscribe;
    }, [])
    return (
        <UserContext.Provider value={{ userData, setUserData }}>
            {children}
        </UserContext.Provider>
    )
}


export const useUserContext = () => {
    return useContext(UserContext);
}