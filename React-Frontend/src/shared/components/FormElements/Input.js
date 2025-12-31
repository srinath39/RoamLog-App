import React ,{useReducer,useEffect} from 'react';
import {validate} from '../../util/Validators'
import './Input.css';

function inputReducer(state,action)
{
    switch(action.type)
    {
        case "CHANGE":
            return {...state,isValid:validate(action.value,action.validator),value:action.value};
        case "TOUCH":
            return {...state,isTouched:true};
        default: 
            return state;
    }
}

export default function Input(props)
{
    const [inputState,dispatch]=useReducer(inputReducer,
        {value:props.initialValue||'',
        isValid:props.initialIsValid||false,
        isTouched:false});

    function changeHandler(e)
    {
        dispatch({type:"CHANGE",value:e.target.value,validator:props.validator});
    }
    function touchHandler(e)
    {
        dispatch({type:"TOUCH"});
    }

    const {id,onInput}=props;
    const {value,isValid}=inputState;
    useEffect(()=>{
        onInput(id,value,isValid);
    },[id,onInput,value,isValid]);

    const element= props.element==="input"?
    <input id={props.id}  type={props.type} placeholder={props.placeholder} 
     value={inputState.value} onChange={changeHandler} onBlur={touchHandler} />:
    <textarea id={props.id} rows={props.rows || 3}
     value={inputState.value} onChange={changeHandler} onBlur={touchHandler} />;

    return (<div className={`form-control ${!inputState.isValid&&inputState.isTouched &&'form-control--invalid'}`}>
        <label style={{textAlign:"left"}} htmlFor={props.id}>{props.label}</label>
        {element}
        <div>{!inputState.isValid&&inputState.isTouched&&<p>{props.errorText}</p>}</div>
    </div>);
}