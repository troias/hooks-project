import React, { useReducer, useState,  useEffect, useCallback } from 'react';
import IngredientList from './IngredientList'
import IngredientForm from './IngredientForm';
import ErrorModal from '../UI/ErrorModal'
import Search from './Search';

const ingredientReducer = (currentIngredients, action) => {
switch (action.type) {
  case 'SET_ING':
    return action.ingredients
  case 'ADD_ING':
    return [...currentIngredients, action.ingredient]
  case 'DELETE_ING':
    return currentIngredients.filter(ing => ing.id !== action.id)
  default:
    throw new Error()
}
}

const Ingredients = () => {
  const [userIngredients, dispatch] = useReducer(ingredientReducer, [])
  // const [ingredientsState, setIngredientsState] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [ingError, setIngError] = useState()

  useEffect(() => {
    console.log('[useEffect], rendering ingredient')
  })

  const addIngredientHandler = (ingredient) => {
    setIsLoading(true)
    fetch('https://react-hooks-update-af222-default-rtdb.firebaseio.com/ingredients.json', {
      method: 'POST',
      body: JSON.stringify(ingredient),
      headers: { 'Content-Type': 'application/json' }
    }
    ).then(resp => {
      setIsLoading(false)
      return resp.json()
    }).then(respData => {
      // setIngredientsState(prevIngState => [...prevIngState,
      // {
      //   id: respData.name,
      //   ...ingredient,
      // }
      // ])
      dispatch({
        type: 'ADD_ING',
        ingredient: { 
          id: respData.name,
        ...ingredient }
       })
    })
    .catch(error => {
      setIngError(error.message)
      setIsLoading(false)
    })


  }

  const removeIngredientsHandler = (ingredientsID) => {
    setIsLoading(true)
    fetch(`https://react-hooks-update-af222-default-rtdb.firebaseio.com/ingredients/${ingredientsID}.json`, {
      method: 'DELETE',
    })
    .then(respData => {
      setIsLoading(false)
      // setIngredientsState(prevIngState => prevIngState.filter(x => 
      //   x.id !== ingredientsID
      // ))
      dispatch({
        type: 'DELETE_ING', 
        id: ingredientsID
      })
    })
  }

  const onLoadIngredientsHandler = useCallback((ingredients) => {
    dispatch({
      type: 'SET_ING', 
      ingredients: ingredients
    })
  }, [])

  const clearError = () => {
    setIngError(null)
    
  }
  return (
    <div className="App">
      <IngredientForm 
      onAddIngredient={addIngredientHandler} 
      loading={isLoading}/>
      {ingError && <ErrorModal onClose={clearError}>{ingError} </ErrorModal> }
      <section>
        <Search onLoadIngredients={onLoadIngredientsHandler} />
        <IngredientList
          ingredients={userIngredients}
          onRemoveItem={removeIngredientsHandler}
        />
      </section>
    </div>
  );
}


export default Ingredients;

