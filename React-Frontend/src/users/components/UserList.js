import React from 'react';

import './UserList.css';
import UserItem from './UserItem';

export default function UserList(props)
{
    if(props.items.length===0)
    {
        return (<div className='center'>No user Found</div>);
    }
    return (<>
            <ul className='users-list'>
              {props.items.map(users=>{
                return (<UserItem key={users.id} id={users.id} name={users.name} image={users.image} photocount={users.places} />);
              })}
            </ul>
    </>)
}