import React, { useState } from 'react';
import LoadingIndicator from '../UI/LoadingIndicator'
import Card from '../UI/Card';
import './IngredientForm.css';

const IngredientForm = React.memo(props => {



  const [intialEntTitle, setEntTite] = useState('')
  const [intialEntAmount, setEntAmount] = useState('')


  const submitHandler = event => {
    event.preventDefault();
    props.onAddIngredient({
      title: intialEntTitle, 
      amount: intialEntAmount
    })
  };

  return (
    <section className="ingredient-form">
      <Card>
        <form onSubmit={submitHandler}>
          <div className="form-control">
            <label htmlFor="title">Name</label>
            <input type="text"
              id="title"
              value={intialEntTitle}
              onChange={event =>
                setEntTite(event.target.value)
              }/>
          </div>
          <div className="form-control">
            <label htmlFor="amount">Amount</label>
            <input
              type="number"
              id="amount"
              value={intialEntAmount}
              onChange={event => setEntAmount(event.target.value)
              } />
          </div>
          <div className="ingredient-form__actions">
            <button type="submit">Add Ingredient</button>
            {props.loading && <LoadingIndicator/>}
          </div>
        </form>
      </Card>
    </section>
  );
});

export default IngredientForm;
