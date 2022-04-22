-- luacheck: ignore os

local skynet_modules = require("skynet.modules")

describe("is_enabled", function()
   before_each(function()
      stub(os, "getenv")
   end)

   after_each(function()
      os.getenv:revert()
   end)

   it("should return false if PORTAL_MODULES are not defined", function()
      os.getenv.on_call_with("PORTAL_MODULES").returns(nil)

      assert.is_false(skynet_modules.is_enabled("a"))
   end)

   it("should return false if PORTAL_MODULES are empty", function()
      os.getenv.on_call_with("PORTAL_MODULES").returns("")

      assert.is_false(skynet_modules.is_enabled("a"))
   end)

   it("should return false if module is not enabled", function()
      os.getenv.on_call_with("PORTAL_MODULES").returns("qwerty")

      assert.is_false(skynet_modules.is_enabled("a"))
   end)

   it("should return true if module is enabled", function()
      os.getenv.on_call_with("PORTAL_MODULES").returns("asdfg")

      assert.is_true(skynet_modules.is_enabled("a"))
   end)

   it("should throw an error for empty module", function()
      assert.has_error(function()
         skynet_modules.is_enabled()
      end, "Module abbreviation 'nil' should be exactly one character long string")
   end)

   it("should throw an error for too long module", function()
      assert.has_error(function()
         skynet_modules.is_enabled("gandalf")
      end, "Module abbreviation 'gandalf' should be exactly one character long string")
   end)
end)

describe("is_disabled", function()
   before_each(function()
      stub(os, "getenv")
   end)

   after_each(function()
      os.getenv:revert()
   end)

   it("should return true if PORTAL_MODULES are not defined", function()
      os.getenv.on_call_with("PORTAL_MODULES").returns(nil)

      assert.is_true(skynet_modules.is_disabled("a"))
   end)

   it("should return true if PORTAL_MODULES are empty", function()
      os.getenv.on_call_with("PORTAL_MODULES").returns("")

      assert.is_true(skynet_modules.is_disabled("a"))
   end)

   it("should return true if module is not enabled", function()
      os.getenv.on_call_with("PORTAL_MODULES").returns("qwerty")

      assert.is_true(skynet_modules.is_disabled("a"))
   end)

   it("should return false if module is enabled", function()
      os.getenv.on_call_with("PORTAL_MODULES").returns("asdfg")

      assert.is_false(skynet_modules.is_disabled("a"))
   end)

   it("should throw an error for empty module", function()
      assert.has_error(function()
         skynet_modules.is_disabled()
      end, "Module abbreviation 'nil' should be exactly one character long string")
   end)

   it("should throw an error for too long module", function()
      assert.has_error(function()
         skynet_modules.is_disabled("gandalf")
      end, "Module abbreviation 'gandalf' should be exactly one character long string")
   end)
end)
