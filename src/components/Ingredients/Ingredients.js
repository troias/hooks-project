import React, { useState, useEffect,  useCallback } from 'react';
import IngredientList from './IngredientList'
import IngredientForm from './IngredientForm';
import Search from './Search';

const Ingredients = () => {

  const [ingredientsState, setIngredientsState] = useState([])

  useEffect(()=> {
    console.log('[useEffect], rendering ingredient')
  })

  const addIngredientHandler = (ingredient) => {
    fetch('https://react-hooks-update-af222-default-rtdb.firebaseio.com/ingredients.json', {
      method: 'POST', 
      body: JSON.stringify(ingredient), 
      headers: { 'Content-Type': 'application/json'}
    }
    ).then(resp => {
      return resp.json()
    }).then( respData => {
      setIngredientsState(prevIngState => [...prevIngState,
        {
          id: respData.name,
          ...ingredient,
        }
        ])
    })


  }

  const onLoadIngredientsHandler = useCallback((ingredients) => {
    setIngredientsState(ingredients)
  }, [])

  return (
    <div className="App">
      <IngredientForm onAddIngredient={addIngredientHandler} />

      <section>
        <Search onLoadIngredients={onLoadIngredientsHandler}/>
        <IngredientList
          ingredients={ingredientsState}
          onRemoveItem={() => { }}
        />
      </section>
    </div>
  );
}


export default Ingredients;
