'use client'
import React from 'react';
import "./page.scss";
import SciencesTable from '@/components/adminPanel/science/sciences-table/sciences-table';

const AllSciences = () => {
  return <div className='all-sciences-page'>
    <SciencesTable />
  </div>
};

export default AllSciences;
