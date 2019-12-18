import React, {Component} from "react"
import Modal from "../../Components/UI/Modal/Modal"
import Aux from "../Auxillary/Auxillary"


const withErrorHandler =(WrappedComponent, axios) => {
    return class extends Component {
        state = {
            error: null
        }

       

        render() {
            return (
                <Aux>
                <Modal 
                    show={this.state.error}
                    clicked={this.errorConfirmedHandler}>
                    {this.state.error ? this.state.error.message : null}}
                    </Modal>
                <WrappedComponent {...this.props} />
            </Aux>
            )
        }
    }
}

export default withErrorHandler