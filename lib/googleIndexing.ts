import { google } from 'googleapis';
import { HttpError } from "./utils";

let serviceEmail = process.env.GOOGLE_SERVICE_EMAIL;
let key = process.env.GOOGLE_SERVICE_KEY;

const jwtClient = new google.auth.JWT(
    serviceEmail,
    "",
    key,
    ["https://www.googleapis.com/auth/indexing"],
    ""
);
const allowedHost = ['https://data-driven-cyber-oni-chi.vercel.app']

export type IndexingRequest = {
    url: string;
    type: "URL_UPDATED" | "URL_DELETED"
}


export async function requestIndexing(request: IndexingRequest[]) {
    try {
        const tokens = await jwtClient.authorize();

        for (let item of request) {
            await indexPage(item, tokens.access_token!)
        }

        return true


    } catch (error) {
        console.log(error);
        return false

    }

}


export async function indexPage(request: IndexingRequest, accessToken?: string) {
    let options = {
        url: "https://indexing.googleapis.com/v3/urlNotifications:publish",
    };

    let token = ""

    if (!accessToken) token = (await jwtClient.authorize()).access_token as string;

    else token = accessToken

    if (!token) throw HttpError(401, "Token invalid");
    try {
        const res = await fetch(options.url, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify(request)
        })
        const resJson = await res.json()
        return resJson
    } catch (error) {
        console.log(error);

    }


}
