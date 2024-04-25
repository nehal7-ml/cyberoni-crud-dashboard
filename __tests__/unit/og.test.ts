/**
 * @jest-environment node
 */

import { describe, expect, it, afterAll } from "@jest/globals";
import ogs from 'fetch-opengraph'


describe("check open graph scraper", () => {


    it("fetch og tags from url", async()=> {
        expect.assertions(1)
        const url = "https://www.cybershoptech.com/blogs/post/Every-Parent-Needs-to-Know%3A-Allergy-Medication-That-Safely-Stops-Coughs-in-Toddlers-772b9f06-7efd-4787-b991-71cef170972c"
        const { result } = await ogs.fetch( url );

        console.log(result);
        expect(result.ogTitle).toBeDefined()
    })
})