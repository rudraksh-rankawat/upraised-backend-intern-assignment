import { Router } from "express";
import { getGadgets, createGadget, updateGadget, decommissionGadget} from "../controllers/gadget.controller";
import { selfDestructGadget } from "../controllers/self.destruct.controller";
import { resourceUsage } from "process";
import { authenticate } from "../middlewares/auth";


const router = Router()
router.use(authenticate)

router.get('/', getGadgets)
router.post('/', createGadget)
router.patch('/:id', updateGadget)
router.delete('/:id/', decommissionGadget)
router.post('/:id/self-destruct', selfDestructGadget)


export default router