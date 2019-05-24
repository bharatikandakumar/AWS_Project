import React from 'react';
import './App.css';


class SearchResult extends React.Component {

    constructor(props){
        super(props)
        this.state = {
            ingredient : "",
            tags : []
        }
        
    }

    componentDidMount(){
        console.log(this.props.searchResult)
        this.state = {
            ingredient : "",
            tags : []
        }
    //     this.setState({
    //         ingredient :  this.props.searchResult.ingredientName.text,
    //   tags : this.props.searchResult.ingredientName.tags.keys
    //     })
    }

    render() {
        
        console.log(Object.keys(this.props.searchResult.ingredientName.tags))
        return (
         <div>
           <p>Ingredient: { this.props.searchResult.ingredientName.text }</p>
           <p>Tags: {Object.keys(this.props.searchResult.ingredientName.tags)}</p>
        </div>
        )
    }
  }

  export default SearchResult;