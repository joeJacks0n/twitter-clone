import { NextApiRequest, NextApiResponse } from "next";

import prisma from '@/libs/prismadb';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if ( req.method != 'GET') {
        return res.status(405).end();
    }

    try {
        const { userId } = req.query;

        if (!userId) {
            throw new Error('no ID');
        }
        else if (typeof userId != 'string') {
            throw new Error('not string ');
        }

        const existingUser = await prisma.user.findUnique({
            where: {
                id: userId
            }
    });

    const followersCount = await prisma.user.count({
        where: {
            followingIds: {
                has: userId
            }
        }
    });

    return res.status(200).json({...existingUser, followersCount})

    } catch(error) {
        console.log(error);
        return res.status(400).end();
    }
}