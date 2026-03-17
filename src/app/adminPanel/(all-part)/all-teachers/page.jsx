import React from 'react';
import "./page.scss";
import TeachersWithClasses from '@/components/adminPanel/all-teachers/all-teachers';

const AllTeachers = () => {
  return (
    <div className='all-teachers'>
      <TeachersWithClasses />
    </div>
  )
}

export default AllTeachers