import {useReducer,useCallback} from 'react';

const formReducer = (state, action) => {
    switch (action.type) {
      case 'INPUT_CHANGE':
        let formIsValid = true;
        for (const inputId in state.inputs) {
          if(!state.inputs[inputId])
          {
            continue;
          }
          if (inputId === action.inputId) {  //doubt
            formIsValid = formIsValid && action.isValid;
          } else {
            formIsValid = formIsValid && state.inputs[inputId].isValid;
          }
        }
        return {
          ...state,
          inputs: {
            ...state.inputs,
            [action.inputId]: { value: action.value, isValid: action.isValid }
          },
          isValid: formIsValid
        };
      case 'SET_CHANGE':
        return {
          ...state,
          inputs:action.input,isValid:action.valid
        };
      default:
        return state;
    }
  };


export function useForm(initialObject)
{
    const [formState, dispatch] = useReducer(formReducer, initialObject);

      const inputHandler = useCallback((id, value, isValid) => {
        dispatch({
          type: 'INPUT_CHANGE',
          value: value,
          isValid: isValid,
          inputId: id
        });
      }, []);

      const setFormData=useCallback((inputChange,validityChange)=>{
        dispatch({
          type: 'SET_CHANGE',
          input: inputChange,
          valid:validityChange
        });
      },[]);

      return [formState,inputHandler,setFormData];
}