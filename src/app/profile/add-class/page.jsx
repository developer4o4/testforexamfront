'use client'
import ClassesPage from '@/app/adminPanel/classes/page'
import NotFound from '@/app/not-found'
import { AccessContext } from '@/contexts/contexts'
import React, { useContext } from 'react'

const TeacherAddClass = () => {
  const { profileData } = useContext(AccessContext)
  if (profileData?.class_permissons) return <NotFound />
  return (
    <ClassesPage />
  )
}

export default TeacherAddClass