import { google } from 'googleapis';

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
        let options = {
            url: "https://indexing.googleapis.com/v3/urlNotifications:publish",
        };

        for (let item of request) {
            try {
                const res = await fetch(options.url, {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${tokens?.access_token}`,
                    },
                    body: JSON.stringify(item)
                })
                const resJson = await res.json()
                console.log(resJson);
            } catch (error) {
                console.log(error);

            }
        }

        return true


    } catch (error) {
        console.log(error);
        return false

    }

}

