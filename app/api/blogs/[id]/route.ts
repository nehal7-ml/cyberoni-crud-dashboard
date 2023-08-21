import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res:NextApiResponse) {

    if(req.method ==="GET") {
        res.status(200).json({ name: 'John Doe' })
    }
    if(req.method ==="PATCH") {
        res.status(200).json({ name: 'John Doe' })
    }
    if(req.method ==="DELETE") {
        res.status(200).json({ name: 'John Doe' })
    }
   
   
  }