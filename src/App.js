/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import './App.css';
import { SelectCurrency } from "./components/Select";
import { usePrevious } from "./hooks/usePrevious";

const App = () => {
  const [option, setOption] = useState([]);
  const [currency, setCurrency] = useState({});
  const [element, setElement] = useState('');
  const [statusBid, setStatusBid] = useState('black')
  const [statusAsk, setStatusAsk] = useState('black')
  const [load, setLoad] = useState(true);
  const prevCalculation = usePrevious(currency.prices);

  useEffect(() => {
    const ws = new WebSocket("wss://wssx.gntapi.com:443");
    ws.onopen = () => {
      console.log('WebSocket Connected');
      ws.send("prices");
      setLoad(false)
    }

    ws.onmessage = (e) => {
      const message = JSON.parse(e.data);
      setCurrency(message);
    }

    return () => {
      ws.onclose = () => {
        console.log('WebSocket Disconnected');
      }
    }
  }, []);
  
  useEffect(() => {
    if (currency) {
      mapOptions(currency)
    }
  }, [currency, currency]);

  useEffect(() => {
    if (element ) {
      if(Number(prevCalculation[element].ask) > Number(currency.prices[element].ask)){
        setStatusBid('red')
      } else if(Number(prevCalculation[element].ask) === Number(currency.prices[element].ask)) {
        setStatusBid('black')
      } else {
        setStatusBid('green')
      }

      if (Number(prevCalculation[element].bid) > Number(currency.prices[element].bid)){
        setStatusAsk('red')
      } else if(Number(prevCalculation[element].bid) === Number(currency.prices[element].bid)){
        setStatusAsk('black')
      } else {
        setStatusAsk('green')
      }
    }
  }, [prevCalculation])

  const mapOptions = ({prices}) => {
    let options = []
    if (currency && prices) {
      for (let key in prices){
        options.push({value: key, label: key})
      }
    }
    setOption(options)
  }

  return (
    <div>
      {
        load ? <span>Conectando con Websocket...</span> :
        <>
          <SelectCurrency 
            options={option} 
            value={element} 
            onChange={(e)=> setElement(e.target.value)}
          />
          <div className="d-flex justify-content-between container-sm mt-5">
            <h5>Ask:
            <span style={{color: statusAsk}}>
              {currency && element ? currency.prices[element].ask: '--'}
            </span>
            </h5>
            <h5>Bid: 
            <span style={{color: statusBid}}>
              {currency && element ? currency.prices[element].bid: '--'}
            </span>
            </h5>
          </div>
        </>
      }
    </div>
  );
}

export default App;
