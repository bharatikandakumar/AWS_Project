import React from 'react';
import './App.css';
import SearchResult from './SearchResult'
import CreateIngredient from './CreateIngredient'



class App extends React.Component {

constructor(props) {
  super(props);
  this.state = {
      searchString : "",
      searchResults : {"ingredientName" : {"text" : "" , "tags" : { }}}
  };
  this.handleChange = this.handleChange.bind(this);
}

handleChange(event) {
  event.preventDefault();
  var newSearchString = document.getElementById("search").value;
  console.log(newSearchString)
  if(newSearchString.trim() === ""){
      this.setState({
          searchString: "",
          searchResults : {"ingredientName" : {"text" : "" , "tags" : { }}}
      });
  }else{
      fetch('https://k1qbwyai1g.execute-api.us-east-1.amazonaws.com/dev/ingredient/'+newSearchString)
          .then(res => res.json())
          .then(data => {
              console.log({ data });
              this.setState({
                  searchString: newSearchString,
                  searchResults : data
              });
          })
          .catch(err => console.log(err));
     
  }

}

componentDidMount() {
this.setState({
  searchString : "",
  searchResults : {"ingredientName" : {"text" : "" , "tags" : { }}}
});  
}

render(){
  return (
    <div>
              
              {/* <h2>Ingredient Search Portal</h2>
              <div>
                <form>
                  <input id="search" type="text" placeholder="type here to search" />
                  <button onClick={this.handleChange}>Search</button>
                  <hr />
                </form>
              </div>
              <SearchResult searchResult={this.state.searchResults}/> */}
              <CreateIngredient></CreateIngredient>
          </div>
  )
}
}

export default App;
