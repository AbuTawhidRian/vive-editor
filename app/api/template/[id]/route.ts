import {readTemplateStructureFromJson, saveTemplateStructureToJson} from '@/modules/playground/lib/path-to-json'
import { db } from '@/lib/db'
import { templatePaths } from '@/lib/template'
import path from 'path'
import fs from 'fs/promises'
import { NextRequest } from 'next/server'


function validateJsonStructure(data:unknown):boolean{
    try {
        JSON.parse(JSON.stringify(data))
        return true
    } catch (err) {
        console.error('Invalid json structure',err)
        return false
    }
}

export async function GET(request:NextRequest,{params}:{params: Promise<{id: string}>}){
    const {id} = await params
    if(!id){
        return Response.json({
            error:'Missing playground Id'},
            {status: 400})
    }
    const playground = await db.playground.findUnique({
        where:{id},
        
    })
    if(!playground){
        return Response.json({
            error:'Missing playground'},
            {status: 404})
    }

    const templateKey = playground.template as keyof typeof templatePaths
    const templatePath = templatePaths[templateKey]
    
    if(!templatePath){
        return Response.json({
            error:'Missing templatePath'},
            {status: 404})
    }
    try {
        const inputPath = path.join(process.cwd(),templatePath)
        const outputFile = path.join(process.cwd(),`output/${templateKey}.json`)

        await saveTemplateStructureToJson(inputPath,outputFile)
        const templateStructure = await readTemplateStructureFromJson(outputFile)

        if(!validateJsonStructure(templateStructure.items)){
            return Response.json({
                error:'Invalid json structure'},
                {status: 400})

        }
        await fs.unlink(outputFile )
        return Response.json({
                success: true,
                templateJson: templateStructure},
                {status: 400})
    
    } catch (err) {
         
    }
}