"use client";

import React from 'react'
import { Button } from '@/components/ui/button'
import { toggleStarMarked } from '../actions';
import { StarIcon, StarOffIcon } from 'lucide-react'
import { useState, useEffect, forwardRef } from 'react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation' 

interface MarkedToggleButtonProps extends React.ComponentPropsWithoutRef<typeof Button>{
    markedForRevision: boolean;
    id: string;
}

export const MarkedToggleButton = forwardRef<HTMLButtonElement, MarkedToggleButtonProps>(
    ({markedForRevision, id, onClick, className, children, ...props } , ref ) => {

    const [isMarked, setIsMarked] = useState(markedForRevision)
    const router = useRouter()

    useEffect(()=>{
        setIsMarked(markedForRevision)
    },[markedForRevision]);

    const handleToggle = async (event: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(event);

    // 1. Store the original state in case we need to revert
    const originalMarkedState = isMarked;

    // 2. Optimistically update the UI
    const newMarkedState = !originalMarkedState;
    setIsMarked(newMarkedState);

    try {
        const res = await toggleStarMarked(id, newMarkedState);
        // We only care if the API call succeeded or failed
        const { success, error } = res;

        // 3. First, check for errors
        if (error || !success) {
            toast.error('Failed to update favorite status.');
            // 4. Revert the UI state on failure
            setIsMarked(originalMarkedState);
        } else {
            // 5. SUCCESS! 
            // Show the toast based on the newMarkedState we *sent*.
            if (newMarkedState) {
                // We successfully set it to TRUE
                toast.success('Added to Favorite Successfully');
            } else {
                // We successfully set it to FALSE
                toast.success('Removed from Favorite Successfully');
            }
        }
    } catch (err) {
        console.error('Failed to toggle mark for revision', err);
        toast.error('An unexpected error occurred.');
        // 4. Also revert the UI state if the whole request fails
        setIsMarked(originalMarkedState);
    }
};
   return (
     <Button ref={ref} variant='ghost' className={`flex items-center justify-start w-full px-2 py-1.5 text-sm rounded-md cursor-pointer ${className}`}
     onClick={handleToggle}
     {...props}
     >
     {isMarked ? (<StarIcon size={16} className='text-red-500 mr-2 '/>):(
        <StarOffIcon size={16} className='text-gray-500 mr-2 '/>
     )}
     {children || (isMarked ? 'Remove Favorite' : 'Add to Favorite')}
     </Button>
  )
},
)

MarkedToggleButton.displayName = "MarkedToggleButton";