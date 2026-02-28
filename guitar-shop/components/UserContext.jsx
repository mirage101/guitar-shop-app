import { createContext, useContext, useEffect, useState } from "react";
import Constants from "expo-constants";
import * as SecureStore from "expo-secure-store";

const BASE_URL = Constants.expoConfig.extra.BASE_URL;

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [userData, setUserData] = useState();
    const token = SecureStore.getItem("authToken");

    const getUserData = () => {
        if (!token) {
            return;
        }

        fetch(`${BASE_URL}/api/customer`, {
            method: "GET",
            headers: {
                Cookie: "customer_jwt_token=" + token,
            }
        })
            .then((response) => response.json())
            .then((data) => setUserData(data.data))
            .catch((error) => console.log(error));
    }

    useEffect(() => {
        getUserData();
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