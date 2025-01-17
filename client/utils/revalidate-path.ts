"use server"

import { revalidatePath } from "next/cache"

export async function RevalidateUtility(){
    "use server"

    revalidatePath('bookticket')
}