import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res:NextApiResponse) {

    if(req.method ==="GET") {
        res.status(400).json({ error: 'Get is not Allowed on this path' })
    }
    if(req.method ==="POST") {
        res.status(400).json({ error: 'Get is not Allowed on this path' })
    }
    if(req.method ==="PATCH") {
        res.status(400).json({ error: 'Patch is not Allowed on this path' })
    }
    if(req.method ==="DELETE") {
        res.status(400).json({ error: 'Delete is not Allowed on this path' })
    }
   
   
  }