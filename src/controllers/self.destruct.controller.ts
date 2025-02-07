import { PrismaClient } from "@prisma/client";
import { Request, Response, RequestHandler } from "express";
import { generateSelfDestructionCode } from "../utils/generateSelfDestructionCode";

const prisma = new PrismaClient();


export const selfDestructGadget: RequestHandler = async (req: Request, res: Response) => {
    try {
        const gadgetId = parseInt(req.params.id);
        if (!await prisma.gadget.findUnique({ where: { id: gadgetId } })) {
            res.status(404).json({ error: "Gadget not found!" });
            return
        }

        await prisma.gadget.update({
            where: {
                id: gadgetId
            },
            data: {
                status: "Destroyed",
                decommissionedAt: null
            }
        })

        const selfdcode = generateSelfDestructionCode()

        res.status(200).json({ code: `SELF-DESTRUCTION CODE: ${selfdcode}` })
    } catch (error) {
        res.status(500).json({ error: `Could not decommision gadget, Internal server error: ${error}` })
    }
}


