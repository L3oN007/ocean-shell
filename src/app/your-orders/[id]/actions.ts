"use server"

import {db} from "@/db";
import {getKindeServerSession} from "@kinde-oss/kinde-auth-nextjs/server";

export const getOrderDetails = async (id: string) => {
    const {getUser} = getKindeServerSession()
    const user = await getUser()
    if (!user?.id || !user.email) {
        throw new Error("You need to be logged in to view this page.")
    }
    return db.order.findUnique({
        where: {
            id,
            userId: user.id,
        },
        include: {
            configuration: true,
            shippingAddress: true,
            billingAddress: true
        }
    });

}