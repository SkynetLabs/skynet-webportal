local utils = require('utils')

describe("is_table_empty", function()
    it("should return true for empty table", function()
        assert.is_true(utils.is_table_empty({}))
    end)

    it("should return false for not empty table", function()
        assert.is_false(utils.is_table_empty({ ["foo"] = "bar" }))
    end)
end)
