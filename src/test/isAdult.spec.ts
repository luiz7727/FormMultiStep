import { it, expect } from "vitest";
import { isAdult } from "@/utils/isAdult";

it("it should return true after validate date: 2003-04-20", async () => {

  const date: string = "2003-04-20";

  const result: boolean = isAdult(date);

  expect(result).toBe(true);

})

