import React from 'react'
import '../../components/Loader/loader.css'
import { BarLoader } from 'react-spinners'

function Loader() {
  return (
<div class="loader-container">
  <BarLoader color='#ffb703'/>
</div>

  )
}

export default Loader