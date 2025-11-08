'use server'

import {auth} from '@/auth'
import {db} from '@/lib/db'

export const getUserById = async (id: string) => {
    try {
        const user = await db.user.findUnique({
            where: {id},
            include:{
                accounts: true,
            }
        })
        return user
    } catch (err) {
        console.log('Error fetching user by ID:', err)
        return null
    }
}

export const getAccountByUserId = async (userId: string) => {
    try {
        const account = await db.account.findFirst({
            where:{userId}
        })
        return account
    } catch (err) {
        console.log('Error fetching account by user ID:', err)
        return null
    }
}

export const currentUser = async () => {
    const user= await auth()
    return user
}