import React from 'react'
import {Link} from "react-router-dom"
export default function ErrorPage() {
  return (
    <div>
      <h1>oops page not found or you dont have access!!!!</h1>
      <Link to="/">Back</Link>
    </div>
  )
}