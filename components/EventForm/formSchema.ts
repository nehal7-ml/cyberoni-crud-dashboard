import { FormSchema } from "../DynamicInput"

let mapsPattern = "^https?:\/\/((www\.)?google\.com\/maps\/(embed\?|search\?)|maps\.app\.goo\.gl\/).+$"

const eventFormSchema: FormSchema = {
    type: "object",
    title: "Event Form",
    description: "Schema for creating or updating an event",
    required: true,
    properties: {

        "name": {
            "type": "string",
            "title": "Name",
            "required": true
        },
        "date": {
            "type": "date",
            "title": "Date",
            "required": true
        },
        "eventLink": {
            "type": "string",
            "title": "Event Link",
            "required": true,
            "pattern": "https://.*"
        },
        "description": {
            "type": "text",
            "title": "Description",
            "required": true
        },
        "isVirtual": {
            "type": "boolean",
            "title": "Is Virtual",
            "required": true
        },
        "location": {
            "type": "string",
            "title": "Location",
            "required": false,
            "pattern": "^https?:\\/\\/\\S+$"
        },
        "status": {
            "type": "select",
            "title": "Status",
            "required": true,
            "options": [
                { "label": "Upcoming", "value": "UPCOMING" },
                { "label": "Canceled", "value": "CANCELLED" },
                { "label": "Completed", "value": "COMPLETED" }
            ]
        },
        image: {
            "type": "image",
            "title": "Event Images",
            required: false,
            max: 2

        },
        tags: {
            type: 'tags',
            description: 'Event Tags',
            max: 10,
        }
    },
}


export default eventFormSchema