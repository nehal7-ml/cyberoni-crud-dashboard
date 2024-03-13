/**
 * @jest-environment node
 */

import { IndexingRequest, requestIndexing } from "@/lib/googleIndexing";
import { describe, expect, test, it, beforeAll } from "@jest/globals";

// test google indexing

describe("Google indexing service tests", () => {
    it("tests that authorized requests can be made from service accounts", async () => {

        const requests: IndexingRequest[] = [{
            url: "https://data-driven-cyber-oni-chi.vercel.app/blogs",
            type: "URL_UPDATED"
        },
        {
            url: "https://data-driven-cyber-oni-chi.vercel.app/services",
            type: "URL_UPDATED"
        },
    
    
    ]
        const res = await requestIndexing(requests);

        expect(res).toBe(true);


    });
});
