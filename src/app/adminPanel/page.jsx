'use client'
import React, { useContext } from 'react';
import "./page.scss"
import { AccessContext } from '@/contexts/contexts';
import NotFound from '../not-found';
import { usePathname } from 'next/navigation';

const AdminPage = () => {
  return (
    <div className='admin-container'>
      <h1>Admin panelga xush kelibsiz!</h1>
    </div>
  )
}

export default AdminPage