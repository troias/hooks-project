import React, { useState, useEffect } from 'react';
import IngredientList from './IngredientList'
import IngredientForm from './IngredientForm';
import Search from './Search';

const Ingredients = () => {

  const [ingredientsState, setIngredientsState] = useState([])

  useEffect(() => {
    fetch('https://react-hooks-update-af222-default-rtdb.firebaseio.com/ingredients.json')
    .then(res => res.json())
    .then(resData => {
      const loadedIngredients = []
      for (const key in resData) {
        loadedIngredients.push({
          id: key, 
          title: resData[key].title, 
          amount: resData[key].amount
        })
      }
      setIngredientsState(loadedIngredients)
    })
  }, [])

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

  return (
    <div className="App">
      <IngredientForm onAddIngredient={addIngredientHandler} />

      <section>
        <Search />
        <IngredientList
          ingredients={ingredientsState}
          onRemoveItem={() => { }}
        />
      </section>
    </div>
  );
}


export default Ingredients;
