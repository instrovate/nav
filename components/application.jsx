// user-content-in-list.jsx
import React from 'react'

const UserContentInList = props => {
    const { record, property } = props
    const value = record.params[property.name] 
    const value1 = '/uploads/';
    return (
  <a target="_blank" href={value1+value} style={{marginBottom: 5 + 'em', textDecoration:'none', padding:'10px 15px', background:'#4268F6', color:'#fff', borderRadius:'0px'}} >Download Resume</a>
    )
}

export default UserContentInList