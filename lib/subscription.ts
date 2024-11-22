import { auth } from "@clerk/nextjs/server"
import prismadb from "./prismadb"
import { toast } from "sonner"

const DAY_IN_MS = 86_400_000;

export const checkSubscription = async () => {
    const { userId } = auth();

    if (!userId) {
        throw new Error("Unauthorized");
        toast("Unauthorized")

    }

    const userSubscription = await prismadb.userSubscription.findUnique({
        where: {
            userId: userId,
        },
        select: {
            stripeSubscriptionId: true,
            stripeCurrentPeriodEnd: true,
            stripeCustomerId: true,
            stripePriceId: true,
        },
        
    });

    const isValid = userSubscription?.stripePriceId && userSubscription?.stripeCurrentPeriodEnd?.getTime()! + DAY_IN_MS > Date.now();

    return !!isValid;
}