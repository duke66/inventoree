import AlertStore from './AlertBox'
import AuthState from './AuthState'

const HttpErrorHandler = (error) => {
    if (error.response) {
        if (error.response.status === 403) {
            if (error.response.data && error.response.data[0] === "You must authenticate first") {
                AuthState.setState({
                    authState: 'login',
                    user: null
                })
                return
            }
        }
        if (error.response.data && error.response.data.errors) {
            error.response.data.errors.forEach((item) => {
                AlertStore.Alert(item)
            })
        }
    }
}

export default HttpErrorHandler;