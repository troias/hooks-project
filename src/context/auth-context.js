import React, { useState} from 'react'


export const AuthContext = React.createContext({
    isAuth: false, 
    login: () => {
    
    }
}) 

const AuthContextProvider = props => {
    const [ isAuth, setAuth] = useState(false)

    const logUserIn = () => {
        setAuth(true)
    }

    return (
        <AuthContext.Provider value={{login: logUserIn, isAuth }}>
            {props.children}
        </AuthContext.Provider>
    )
}

export default AuthContextProvider