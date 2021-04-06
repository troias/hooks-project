import React, { useReducer, useEffect, useCallback, useMemo } from 'react';
import IngredientList from './IngredientList'
import IngredientForm from './IngredientForm';
import ErrorModal from '../UI/ErrorModal'
import Search from './Search';
import useHttp from '../../customHooks/httpHook'

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

  const {
    isLoading,
    error,
    data,
    reqExtra,
    reqIdentifier,
    sendRequest,
    clear } = useHttp()

  const [userIngredients, dispatch] = useReducer(ingredientReducer, [])

  const onLoadIngredientsHandler = useCallback((ingredients) => {
    dispatch({
      type: 'SET_ING',
      ingredients: ingredients
    })
  }, [])


  useEffect(() => {
    if (!isLoading && !error && reqIdentifier === 'REMOVE_INGREDIENT') {
      dispatch({
        type: 'DELETE_ING',
        id: reqExtra
      })

    } else if (!isLoading && !error && reqIdentifier === 'ADD_INGREDIENT') {
      dispatch({
        type: 'ADD_ING',
        ingredient: {
          id: data.name,
          ...reqExtra
        }
      })
    }

  }, [data, reqExtra, reqIdentifier, isLoading, error])



  const addIngredientHandler = useCallback((ingredient) => {
    sendRequest('https://react-hooks-update-af222-default-rtdb.firebaseio.com/ingredients.json',
      'POST',
      JSON.stringify(ingredient),
      ingredient,
      'ADD_INGREDIENT'
    );

  }, [sendRequest])

  const removeIngredientsHandler = useCallback(ingredientsID => {

    sendRequest(
      `https://react-hooks-update-af222-default-rtdb.firebaseio.com/ingredients/${ingredientsID}.json`,
      'DELETE',
      null,
      ingredientsID,
      'REMOVE_INGREDIENT')
  }, [sendRequest])




  const ingList = useMemo(() => {
    return <IngredientList
      ingredients={userIngredients}
      onRemoveItem={removeIngredientsHandler}
    />
  }, [userIngredients, removeIngredientsHandler])
  return (
    <div className="App">
      <IngredientForm
        onAddIngredient={addIngredientHandler}
        loading={isLoading} />
      { error && <ErrorModal onClose={clear}>{error} </ErrorModal>}
      <section>
        <Search onLoadIngredients={onLoadIngredientsHandler} />
        {ingList}
      </section>
    </div>
  );
}


export default Ingredients;

