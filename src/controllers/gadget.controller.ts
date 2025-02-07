import { PrismaClient } from "@prisma/client";
import { Request, Response, RequestHandler } from "express";
import { generateMissionSuccessRate } from "../utils/generateMissionSuccessProbability";
import { error } from "console";


const prisma = new PrismaClient();
const adjectives = ["Stealth", "Silent", "Shadow", "BestCompany", "Night"];
const nouns = ["Upraised", "Falcon", "Viper", "Hawk", "Ghost"];
const validStatuses = ["Available", "Deployed", "Destroyed", "Decommissioned"];



export const createGadget: RequestHandler = async (req: Request, res: Response) => {
    try {

        const codeName =
            adjectives[Math.floor(Math.random() * adjectives.length)] + " " +
            nouns[Math.floor(Math.random() * nouns.length)];


        const gadget = await prisma.gadget.create({
            data: {
                name: codeName
            }
        })

        res.status(201).json(gadget)

    } catch (error) {

        res.status(500).json({ error: `Internal server error: ${error}` })
    }

}




export const getGadgets: RequestHandler = async (req: Request, res: Response) => {
    try {

        const gadgets = await prisma.gadget.findMany()

        const gadgetsWithMSRP = gadgets.map(({ decommissionedAt, ...gadget }) => {
            const updatedGadget: any = {
                ...gadget,
                name: `${gadget.name} - ${generateMissionSuccessRate()}% success probability`,
            };

            // only include `decommissionedAt` if it is not null
            if (decommissionedAt !== null) {
                updatedGadget.decommissionedAt = decommissionedAt;
            }

            return updatedGadget;
        });


        gadgetsWithMSRP.sort((a, b) => a.id - b.id);
        res.status(200).json(gadgetsWithMSRP)


    } catch (error) {
        res.status(500).json({ error: `Internal server error: ${error}` })
    }
}



export const updateGadget: RequestHandler = async (req: Request, res: Response) => {
    try {

        const gadgetId = parseInt(req.params.id);

        if (!await prisma.gadget.findUnique({ where: { id: gadgetId } })) {
            res.status(404).json({ error: "Gadget not found!" })
            return
        }

        if (!req.body.name) {
            res.status(422).json({ error: "Gadget Name is required" })
            return
        }

        if (!req.body.status) {
            res.status(422).json({ error: "Gadget Status is required" })
            return
        }

        if (!validStatuses.includes(req.body.status)) {
            res.status(422).json({ error: "Gadget Status must be one of: Available, Deployed, Destroyed, Decommissioned" })
            return
        }

        if (req.body.status == "Decommissioned") {
            res.status(422).json({ error: "To Decommision a Gadget, please send a delete request!!!!" })
            return
        }

        if (req.body.status == "Destroyed") {
            res.status(422).json({ error: "To Destroy a Gadget, Use Self-Destruct Sequence API!!!!" })
            return
        }

        const updatedGadget = await prisma.gadget.update({
            where: {
                id: gadgetId
            },
            data: {
                name: req.body.name,
                status: req.body.status,
                decommissionedAt: null
            }
        })

        res.status(200).json(updatedGadget)

    } catch (error) {
        res.status(500).json({ error: `Internal server error: ${error}` })
    }
}


export const decommissionGadget: RequestHandler = async (req: Request, res: Response) => {
    try {
        const gadgetId = parseInt(req.params.id);
        if (!await prisma.gadget.findUnique({ where: { id: gadgetId } })) {
            res.status(404).json({ error: "Gadget not found!" })
            return
        }

        await prisma.gadget.update({
            where: {
                id: gadgetId
            },
            data: {
                status: "Decommissioned",
                decommissionedAt: new Date()
            }
        })

        res.status(204).send()

    } catch (error) {
        res.status(500).json({ error: `Could not decommision gadget, Internal server error: ${error}` })
    }
}


