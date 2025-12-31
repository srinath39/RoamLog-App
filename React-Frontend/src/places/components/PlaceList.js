import React from 'react';
import PlaceItem from './PlaceItem';
import Card from '../../shared/components/UIElements/Card';
import Button from '../../shared/components/FormElements/Button';
import './PlaceList.css'
import { useContext  } from 'react';
import { AuthContext } from '../../shared/context/auth-context';

export default function PlaceList(props)
{
    const auth=useContext(AuthContext);
    if(props.items.length===0)
    {
        return (<div className='place-list center'>
            {(auth.userId===props.userId)? <Card>
                <h2>no place found, may be create one?</h2>
                <Button to='/place/new'>Share Place</Button>
            </Card>:<Card>
                <h2>no place found?</h2>
                <Button to='/'>Go back</Button>
            </Card> }
        </div>);
    }
    return (<ul className='place-list'>
        {props.items.map((place)=>{
        return (<PlaceItem key={place.id} {...place} deletePlace={props.deletePlace} />)
        })}
    </ul>);
};