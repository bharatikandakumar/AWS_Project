import React from 'react';
import ReactDOM from 'react-dom';

class CreateIngredient extends React.Component {

  constructor(props) {
      super(props);
      this.state = {
        ingredient:{
            "ingredientName":"",
            "ingredientText":"",
            "ingredientTags" : ""
        },
        "message":""
    };  
      this.handleSubmit = this.handleSubmit.bind(this);
      this.handleInput = this.handleInput.bind(this);
  }

  handleInput(event) {
    let name = event.target.name;
    let value = event.target.value;
    this.setState(
      prevState => ({
        ingredient: {
          ...prevState.ingredient,
          [name]: value
        }
      }));
  }


  handleSubmit(event) {
    event.preventDefault();
    let ingredient = this.state.ingredient;
    console.log(ingredient)
    let ingredient_updated = {}
    ingredient_updated[ingredient.ingredientName] = {
        "text": ingredient.ingredientText,
        "tags":{

        }
    }
    ingredient_updated[ingredient.ingredientName].tags[ingredient.ingredientTags] = 1
    console.log(JSON.stringify(ingredient_updated))
    fetch("https://k1qbwyai1g.execute-api.us-east-1.amazonaws.com/dev/add-ingredients", {
      method: "POST",
      body: JSON.stringify(ingredient_updated),
      headers: {
        "Content-Type": "application/json"
      }
    })
    .then(response=> response.text())
    .then(response => {
       console.log(response)
       this.setState({
        ingredient:{
            "ingredientName":"",
            "ingredientText":"",
            "ingredientTags" : ""
        },
        "message": response
       })
    })
  }

  componentDidMount() {
    this.setState({
        ingredient:{
            "ingredientName":"",
            "ingredientText":"",
            "ingredientTags" : ""
        },
        "message":""
    });  
  }

  render() {
      return (
          <div>
              <h1>Create Ingredient</h1>
              <div>
                <form onSubmit={this.handleSubmit}>
                  <label htmlFor="ingredientName">Ingredient Name</label>
                  <br/>
                  <input name="ingredientName" value={this.state.ingredient.ingredientName} type="text" onChange={this.handleInput} required/>
                  <br/>
                  <label htmlFor="ingredientText">Ingredient Text</label>
                  <br/>
                  <input name="ingredientText" value={this.state.ingredient.ingredientText} type="text" onChange={this.handleInput} required/>
                  <br/>
                  <label htmlFor="ingredientTags">Ingredient Tags</label>
                  <br/>
                  <input name="ingredientTags" value={this.state.ingredient.ingredientTags} type="text" onChange={this.handleInput} required/>
                  <br/>
                  <button onClick={this.handleChange}>Create Ingredient</button>
                  <p>{this.state.message}</p>
                </form>
              </div>
          </div>
  )
  }
}


export default CreateIngredient;