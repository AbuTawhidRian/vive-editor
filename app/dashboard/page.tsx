import React from 'react'
import EmptyState from './../../modules/dashboard/components/empty-state';
import AddNew from '@/modules/dashboard/components/add-new';
import AddRepo from '@/modules/dashboard/components/add-repo';
import { deleteProjectById, duplicateProjectById, editProjectById, getAllPlaygroundForUser } from '@/modules/dashboard/actions';
import ProjectTable from '@/modules/dashboard/components/project-table';

const page = async() => {
  const playgrounds =await getAllPlaygroundForUser()
  return (
    <div className='flex flex-col justify-start items-center min-h-screen mx-auto max-w-7xl px-4 py-10'>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 w-full'>
        <AddNew/>
        <AddRepo/>

      </div>

      <div className='mt-10 w-full flex flex-col justify-center items-center '>
        {
          Array.isArray(playgrounds) && playgrounds.length === 0 ? ( <EmptyState/> ) 
          : (
             <ProjectTable
            projects={playgrounds || []}
            onDeleteProject={deleteProjectById}
            onUpdateProject={editProjectById}
            // onDuplicateProject={duplicateProjectById}
          />
          )
        }
      </div>
    </div>
  )
}

export default page