"use server";

import { db } from "@/lib/db";
import { currentUser } from "@/modules/auth/actions";
import { revalidatePath } from "next/cache";

export const toggleStarMarked = async(playgroundId: string, isChecked: boolean)=>{
  const user = await currentUser()
  const userId = user?.user?.id
  if(!userId){
    throw new Error('User Id is required')
  }

  try {
    if(isChecked){
      await db.starMark.create({
        data:{
          userId: userId!,
          playgroundId,
          isMarked: isChecked
        }
      })
    }else{
      await db.starMark.delete({
        where:{
          userId_playgroundId:{
            userId,
            playgroundId: playgroundId
          }
        }
      })
    }
    revalidatePath('/dashboard')
    return {success: true,isMarked: isChecked}
  } catch (err) {
    console.error('Error updating problem',err)
    return {success: false,error:'Failed to update problem'}
  }
}

export async function getAllPlaygroundForUser() {
  const session = await currentUser();
  const userId = session?.user?.id;
  if (!userId) return [];

  try {
    return await db.playground.findMany({
      where: { userId },
      include: { user: true,StarMark:{
        where:{
          userId: userId
        },select:{
          isMarked: true
        }
      } },
    });
  } catch (err) {
    console.error("Error fetching playgrounds:", err);
    return [];
  }
}

export const createPlayground =async(
  data: {
    title: string;
    template: "REACT" | "NEXTJS" | "EXPRESS" | "VUE" | "HONO" | "ANGULAR";
    description?: string
  }
)=>{
  const session = await currentUser()
  const userId = session?.user?.id;
   if (!userId) throw new Error("Not authenticated");

  const {template,title,description} = data

  try {
    const playground = await db.playground.create({
      data:{  
        title,
        description,
        template,
        userId
      }
    })
    return playground
  } catch (err) {
    console.error("Error creating playground:", err);
    throw err;
  }
}

export const deleteProjectById = async(id:string)=>{
  try {
    await db.playground.delete({
      where:{
        id
      }
    })
    revalidatePath('/dashboard')
  } catch (err) {
    console.error("Error deleting playground:", err);
    throw err;
  }
}


export const editProjectById = async(id: string, data: {title: string, description: string})=>{
  try {
    await db.playground.update({
      where: {id},
      data: data
    })
    revalidatePath('/dashboard')
  } catch (err) {
    console.error("Error updating playground:", err);
    throw err;
  }
}


export const duplicateProjectById = async (id:string)=>{
  try {
    const originalPlayground = await db.playground.findUnique({
      where: {id}
      //todo: add template files
    })
    if(!originalPlayground){
      throw new Error('Original playground not found')
    }
    const duplicatedPlayground = await db.playground.create({
      data:{
        title: `${originalPlayground.title} (Copy)`,
        description: originalPlayground.description,
        template: originalPlayground.template,
        userId: originalPlayground.userId

        //todo: add template files
      }
    })
    revalidatePath('/dashboard')
    return duplicatedPlayground
  } catch (err) {
    console.error("Error duplicating playground:", err);
    throw err;
  }
}