-- luacheck: ignore os

local utils = require('utils')

describe("is_table_empty", function()
    it("should return true for empty table", function()
        assert.is_true(utils.is_table_empty({}))
    end)

    it("should return false for not empty table", function()
        assert.is_false(utils.is_table_empty({ ["foo"] = "bar" }))
    end)
end)

describe("extract_cookie", function()
    local cookie_string = "aaa=bbb; skynet-jwt=MTY0NzUyr8jD-ytiWtspm0tGabKfooxeIDuWcXhJ3lnY0eEw==; xxx=yyy"

    it("should return nil if cookie string is nil", function()
        local cookie = utils.extract_cookie_value(nil, "aaa")

        assert.is_nil(cookie)
    end)

    it("should return nil if cookie name is not found", function()
        local cookie = utils.extract_cookie(cookie_string, "foo")

        assert.is_nil(cookie)
    end)

    it("should return cookie if cookie_string starts with that cookie name", function()
        local cookie = utils.extract_cookie(cookie_string, "aaa")

        assert.are.equals(cookie, "aaa=bbb")
    end)

    it("should return cookie if cookie_string ends with that cookie name", function()
        local cookie = utils.extract_cookie(cookie_string, "xxx")

        assert.are.equals(cookie, "xxx=yyy")
    end)

    it("should return cookie with custom matcher", function()
        local cookie = utils.extract_cookie(cookie_string, "skynet[-]jwt")

        assert.are.equals(cookie, "skynet-jwt=MTY0NzUyr8jD-ytiWtspm0tGabKfooxeIDuWcXhJ3lnY0eEw==")
    end)
end)

describe("extract_cookie_value", function()
    local cookie_string = "aaa=bbb; skynet-jwt=MTY0NzUyr8jD-ytiWtspm0tGabKfooxeIDuWcXhJ3lnY0eEw==; xxx=yyy"

    it("should return nil if cookie string is nil", function()
        local value = utils.extract_cookie_value(nil, "aaa")

        assert.is_nil(value)
    end)

    it("should return nil if cookie name is not found", function()
        local value = utils.extract_cookie_value(cookie_string, "foo")

        assert.is_nil(value)
    end)

    it("should return value if cookie_string starts with that cookie name", function()
        local value = utils.extract_cookie_value(cookie_string, "aaa")

        assert.are.equals(value, "bbb")
    end)

    it("should return cookie if cookie_string ends with that cookie name", function()
        local value = utils.extract_cookie_value(cookie_string, "xxx")

        assert.are.equals(value, "yyy")
    end)

    it("should return cookie with custom matcher", function()
        local value = utils.extract_cookie_value(cookie_string, "skynet[-]jwt")

        assert.are.equals(value, "MTY0NzUyr8jD-ytiWtspm0tGabKfooxeIDuWcXhJ3lnY0eEw==")
    end)
end)

describe("getenv", function()
    before_each(function()
        stub(os, "getenv")
    end)

    after_each(function()
        os.getenv:revert()
    end)

    it("should return nil for not existing env var", function()
        os.getenv.on_call_with("foo").returns(nil)

        assert.is_nil(utils.getenv("foo"))
    end)

    it("should return nil for env var that is an empty string", function()
        os.getenv.on_call_with("foo").returns("")

        assert.is_nil(utils.getenv("foo"))
    end)

    it("should return the value as is when it is non empty string", function()
        os.getenv.on_call_with("foo").returns("bar")

        assert.is_equal(utils.getenv("foo"), "bar")
    end)

    describe("parse", function()
        it("should throw on not supported parser", function()
            os.getenv.on_call_with("foo").returns("test")

            assert.has_error(function()
                utils.getenv("foo", "starwars")
            end, "utils.getenv: Parsing to 'starwars' is not supported")
        end)

        describe("as boolean", function()
            it("should return nil for not existing env var", function()
                os.getenv.on_call_with("foo").returns(nil)

                assert.is_nil(utils.getenv("foo", "boolean"))
            end)

            it("should return nil for env var that is an empty string", function()
                os.getenv.on_call_with("foo").returns("")

                assert.is_nil(utils.getenv("foo", "boolean"))
            end)

            it("should parse 'true' string as true", function()
                os.getenv.on_call_with("foo").returns("true")

                assert.is_true(utils.getenv("foo", "boolean"))
            end)

            it("should parse 'True' string as true", function()
                os.getenv.on_call_with("foo").returns("True")

                assert.is_true(utils.getenv("foo", "boolean"))
            end)

            it("should parse '1' string as true", function()
                os.getenv.on_call_with("foo").returns("1")

                assert.is_true(utils.getenv("foo", "boolean"))
            end)

            it("should parse 'false' string as false", function()
                os.getenv.on_call_with("foo").returns("false")

                assert.is_false(utils.getenv("foo", "boolean"))
            end)

            it("should parse 'False' string as false", function()
                os.getenv.on_call_with("foo").returns("False")

                assert.is_false(utils.getenv("foo", "boolean"))
            end)

            it("should parse '0' string as false", function()
                os.getenv.on_call_with("foo").returns("0")

                assert.is_false(utils.getenv("foo", "boolean"))
            end)

            it("should throw an error for not supported string", function()
                os.getenv.on_call_with("foo").returns("mandalorian")

                assert.has_error(function()
                    utils.getenv("foo", "boolean")
                end, "utils.getenv: Parsing value 'mandalorian' to boolean is not supported")
            end)
        end)

        describe("as integer", function()
            it("should return nil for not existing env var", function()
                os.getenv.on_call_with("foo").returns(nil)

                assert.is_nil(utils.getenv("foo", "integer"))
            end)

            it("should return nil for env var that is an empty string", function()
                os.getenv.on_call_with("foo").returns("")

                assert.is_nil(utils.getenv("foo", "integer"))
            end)

            it("should parse '0' string as 0", function()
                os.getenv.on_call_with("foo").returns("0")

                assert.equals(utils.getenv("foo", "integer"), 0)
            end)

            it("should parse '1' string as 1", function()
                os.getenv.on_call_with("foo").returns("1")

                assert.equals(utils.getenv("foo", "integer"), 1)
            end)

            it("should parse '-1' string as 1", function()
                os.getenv.on_call_with("foo").returns("-1")

                assert.equals(utils.getenv("foo", "integer"), -1)
            end)

            it("should return nil for non numerical string", function()
                os.getenv.on_call_with("foo").returns("test")

                assert.is_nil(utils.getenv("foo", "integer"))
            end)
        end)
    end)
end)
