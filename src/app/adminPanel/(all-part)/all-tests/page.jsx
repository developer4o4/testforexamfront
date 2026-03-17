import TestsList from '@/components/adminPanel/all-tests/all-tests'
import React from 'react';
import "./page.scss";
import TestsTable from '@/components/adminPanel/test/tests-table/tests-table';

const AllTests = () => {
  return (
    <div className='all-tests-container'>
        <TestsTable />
    </div>
  )
}

export default AllTests