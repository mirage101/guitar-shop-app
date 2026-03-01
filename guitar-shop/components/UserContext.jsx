import { createContext, useContext, useEffect, useState } from "react";
import Constants from "expo-constants";
import { getToken } from "../lib/authStorage";

const BASE_URL = Constants.expoConfig.extra.BASE_URL;

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [userData, setUserData] = useState();

    const getUserData = (token) => {
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
        const loadUserData = async () => {
            try {
                const token = await getToken();
                getUserData(token);
            } catch (error) {
                console.log(error);
            }
        }

        loadUserData();
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