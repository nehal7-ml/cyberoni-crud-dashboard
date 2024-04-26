/**
 *  @jest-environment node
 * 
 */

import { verifyAliExpressId } from "@/lib/aliExpress";
import { verifyAsin } from "@/lib/amazon";
import { describe, expect, it, afterAll } from "@jest/globals";


describe("verify exist unit-test", () => {
    const validAliExpressId ="1005002265613138";
    const invalidAliExpressId = "asdasdasdasdqawerq2e2";
    const   validAmazonId = "B0744NSM3N";
    const invalidAmazonId = "qweqweqweqweeqw";
        it('valid amazon asin', async () => {
            const result = await verifyAsin(validAmazonId);
            expect(result).toBe(true);

        })

        it('invalid amazon asin', async () => {
            const result = await verifyAsin(invalidAmazonId);
            expect(result).toBe(false);
        })

        it('valid aliexpress asin', async () => {
            const result = await verifyAliExpressId(validAliExpressId);
            expect(result).toBe(true);
        })

        it('invalid aliexpress asin', async () => {
            const result = await verifyAliExpressId(invalidAliExpressId);
            expect(result).toBe(false);
        })
})