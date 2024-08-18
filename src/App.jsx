import { useState, useRef, useLayoutEffect, useEffect } from 'react'

import { useFetch } from './hooks/useFetch'

import './App.css'

function App() {

  return (
    <>
      <section>
          <Calculator />
      </section>
    </>
  )
}


const Calculator = ({}) => {

  const [result, setResult] = useState(0),
        [rates, setRates] = useState(null);

  const key = "2a4f6b38944cc8c496f3cb75fa71fb33",
        amountRef = useRef(null),
        refFrom = useRef(null),
        refTo = useRef(null),
        symbolsList = ['USD', 'EUR', 'JPY', 'GBP', 'AUD', 'CAD', 'CHF', 'CNY', 'SEK', 'NZD', 'SGD', 'HKD', 'NOK', 'ZAR', 'MXN', 'INR', 'BRL', 'RUB', 'TRY', 'ARS'];
  
  async function convert(evt) {

    evt.preventDefault();

    if(!amountRef.current.value) return;

    if (!amountRef.current.value) return; // Проверка, введено ли значение

    // Получаем введённую сумму и сохраняем её как число (с двумя знаками после запятой)
    const amount = Number.parseFloat(amountRef.current.value).toFixed(2); 
    const amountFrom = Number.parseFloat((amount / rates[refFrom.current.value])).toFixed(2);
    const amountTo = Number.parseFloat((amountFrom * rates[refTo.current.value])).toFixed(2);

    setResult(amountTo);

    console.log("Исходная валюта в евро: ", amountFrom);
    console.log("Получаемая валюта из исходной:", amountTo);

  }

  useLayoutEffect(() => {

   (async function() {

      const resultFetch = await useFetch({url: `http://api.exchangeratesapi.io/v1/latest?access_key=${key}&symbols=${symbolsList.join(',')}`, cors: true});

      if(resultFetch) {
        setRates(resultFetch.rates);
      } else {
        setRates(null);
      }
      
    })();

  }, [])

  if(!rates) return(
    <form className = {`calcForm`} >
       <h3>Не удалось получить курсы валют. Извините ;'(</h3>
    </form>
  )

  return(
    <form onSubmit={(evt) => convert(evt)} className = {`calcForm`} >

      <label htmlFor = "quantityMoney">сумма</label>
      <input ref = {amountRef} type = "number" step = "0.01" name = "quantityMoney" 
             onChange = {(evt) => {convert(evt)}} />

      <label htmlFor = "from">Из</label>
      <select ref = {refFrom} name = "from"
              onChange = {(evt) => {convert(evt)}}>
        {
          symbolsList.map( (item, index) => {
            if(!index) return <option key = {`keys_from_${index}`} value = {item} selected>{item}</option>
            return <option key = {`keys_from_${index}`} value = {item}>{item}</option>
          })
        }
      </select>

      <label htmlFor = "to">В</label>
      <select ref = {refTo} name = "to"
              onChange = {(evt) => {convert(evt)}}>
        {
          symbolsList.map( (item, index) => {
            if(index === 3) return <option  key = {`keys_from_${index}`} value = {item} selected>{item}</option>
            return <option key = {`keys_from_${index}`}  value = {item}>{item}</option>
          })
        }
      </select>

      <label htmlFor = "quantityMoneyTo">результат</label>
      <input type = "number" name = "result" value = {result} 
             onChange = {(evt) => false} />

    </form>
  )
}

export default App
