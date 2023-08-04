
import Navbar from '../components/navbar'
import { useState, useEffect } from 'react'

import { links } from '../assets/data/links'
const Cuadre = () => {

  const [users, setUsers] = useState<any>([])
  const [profiles, setProfiles] = useState([])
  return (
   <>
    <Navbar profiles={profiles} links={links} />
   </>
  );
};

export default Cuadre;