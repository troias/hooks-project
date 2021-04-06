import { useReducer, useCallback } from 'react'

const initialState = {

    loading: false,
    error: null,
    data: null,
    extra: null,
    identifier: null

}

const httpReducer = (httpState, action) => {
    switch (action.type) {
        case 'SEND':
            return {
                loading: true,
                error: null,
                data: null,
                extra: null,
                identifier: action.identifier
            }
        case 'RESPONSE':
            return {
                ...httpState,
                loading: false,
                data: action.data,
                extra: action.extra
            }
        case 'ERROR':
            return {
                loading: false,
                error: action.error
            }

        case 'CLEAR':
            return initialState

        default:
            throw new Error()
    }

}

const useHttp = () => {

    const [httpState, httpDispatch] = useReducer(httpReducer, initialState)

    const clear = useCallback(() => {
        httpDispatch({
            type: 'CLEAR'
        })
    })

    const sendRequest = useCallback(
        (url, method, body, extra, reqIdentifier) => {
            httpDispatch({
                type: 'SEND',
                identifier: reqIdentifier
            })
            fetch(
                url,
                {
                    method: method,
                    body: body,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                .then(res => {
                    return res.json()
                })
                .then(respData => {
                    httpDispatch({
                        type: 'RESPONSE',
                        data: respData,
                        extra: extra
                    })
                })
                .catch(error => {
                    httpDispatch({
                        type: 'ERROR',
                        error: error.message
                    })
                })
        }, [])

    return {
        isLoading: httpState.loading,
        data: httpState.data,
        error: httpState.error,
        reqExtra: httpState.extra,
        reqIdentifier: httpState.identifier,
        sendRequest: sendRequest,
        clear: clear
    }

}

export default useHttp

