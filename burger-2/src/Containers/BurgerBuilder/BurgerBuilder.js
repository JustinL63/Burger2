import React, {Component} from "react"
import Aux from "../../HOC/Auxillary/Auxillary"
import Burger from "../../Components/Burger/Burger"
import BuildControls from "../../Components/Burger/BuildControls/BuildControls"
import Modal from "../../Components/UI/Modal/Modal"
import OrderSummary from "../../Components/Burger/OrderSummary/OrderSummary"
import axios from "../../../src/Axios-Orders"
import Spinner from "../../Components/UI/Spinner/Spinner"
import withErrorHandler from "../../HOC/WithErrorHandler/WithErrorHandler"

const INGREDIENT_PRICES = {
    salad: 0.5,
    cheese: 0.5,
    meat: 1.4,
    bacon: 0.75
}

class BurgerBuilder extends Component {
    state = {
        ingredients: null,
        totalPrice: 4,
        purchasable: false,
        purchasing: false,
        loading: false
    }

    componentDidMount() {
        axios.get("https://burger-builder-1c97e.firebaseio.com/ingredients.json")
            .then(response => {
                this.setState({ingredients: response.data})
            })
    }

    updatePurchaseState(ingredients) {
        const sum = Object.keys(ingredients)
        .map(igKey => {
            return ingredients[igKey]
        })
        .reduce((sum, el) => {
            return sum + el
        }, 0)
        this.setState({purchasable: sum > 0})
    }

    addIngredientHandler = (type) => {
        const oldCount = this.state.ingredients[type]
        const updatedCount = oldCount + 1
        const updatedIngredients = {
            ...this.state.ingredients
        }
        updatedIngredients[type] = updatedCount
        const priceAddition = INGREDIENT_PRICES[type]
        const oldPrice =this.state.totalPrice
        const newPrice = oldPrice + priceAddition
        this.setState({
            totalPrice: newPrice, ingredients: updatedIngredients
        })
        this.updatePurchaseState(updatedIngredients)
    }   

    removeIngredientHandler = (type) => {
        const oldCount = this.state.ingredients[type]
        if (oldCount <= 0) {
            return
        }
        const updatedCount = oldCount - 1
        const updatedIngredients = {
            ...this.state.ingredients
        }
        updatedIngredients[type] = updatedCount
        const priceDeduction = INGREDIENT_PRICES[type]
        const oldPrice =this.state.totalPrice
        const newPrice = oldPrice - priceDeduction
        this.setState({
            totalPrice: newPrice, ingredients: updatedIngredients
        })
        this.updatePurchaseState(updatedIngredients)
    }

    purchaseHandler = () => {
        this.setState({
            purchasing: true
        })
    }

        purchaseCancelHandler = () => {
            this.setState({
                purchasing: false
            })
        }

        purchaseContinueHandler = () => {
           // alert(" You Continue!")
  //         this.setState({loading: true})
    //       const order = {
      //         ingredients: this.state.ingredients,
        //       price: this.state.totalPrice,
          //     customer: {
              //     name: "Justin Lamb",
            //       address: { 
         ///              street: "Main St",
            //           zipcode: "33602",
              //         country: "USA"
         //      },
           //     email: "test@test.com"
             //  },
           //    deliveryMethod: "fastest"
        //   }
          //  axios.post("/orders.json", order)
            //    .then(response => 
              //  this.setState({loading: false, purchasing: false}))
                //.catch(error => this.setState({loading: false, purchasing: false}))
            const queryParams = []
            for (let i in this.state.ingredients) {
                queryParams.push(encodeURIComponent(i) + "=" + encodeURIComponent(this.state.ingredients[i]))
            }   
            queryParams.push("price=" + this.state.totalPrice)
            const queryString = queryParams.join("&") 
            this.props.history.push({
                pathname: "/checkout",
                search: "?" + queryString
            })
        }

    render() {
        const disabledInfo = {
            ...this.state.ingredients
        }
        for (let key in disabledInfo) {
            disabledInfo[key] = disabledInfo[key] <= 0
        }
        let orderSummary = null
       
        

        let burger = <Spinner/>
        
        if (this.state.ingredients) {
            burger = (
                <Aux>
                    <Burger ingredients={this.state.ingredients}/>
                    <BuildControls ingredientAdded={this.addIngredientHandler}
                               ingredientRemoved={this.removeIngredientHandler}
                               disabled={disabledInfo}
                               purchasable={this.state.purchasable}
                               price={this.state.totalPrice}
                               ordered={this.purchaseHandler} />
                </Aux>
                )
                orderSummary =  <OrderSummary 
                ingredients={this.state.ingredients}
                price={this.state.totalPrice}
                purchaseCancelled={this.purchaseCancelHandler}
                purchaseContinued={this.purchaseContinueHandler}/>
        }
        if ( this.state.loading ) {
            orderSummary = <Spinner />;
        }

       

        return (
            <Aux>
                <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
                   {orderSummary}
                </Modal>
                {burger}
               
            </Aux>
        )
    }
}

export default withErrorHandler(BurgerBuilder, axios)