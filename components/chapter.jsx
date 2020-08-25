// user-content-in-list.jsx
import React from 'react'

const UserContentInList = props => {
    const { record, property } = props
    const value = record.params[property.name] 
    const value1 = '/admin/resources/Section?filters.chapterID=';
    return (
  <a href={value1+value} style={{marginBottom: 5 + 'em', float: 'right', textDecoration:'none', padding:'10px 15px', background:'#4268F6', color:'#fff', borderRadius:'0px'}} >View Sections in this Chapter</a>
    )
}

export default UserContentInList