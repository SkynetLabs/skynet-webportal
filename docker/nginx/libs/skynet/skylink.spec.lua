skylink = require("skynet/skylink")

describe("parse", function()
   local base32 = "0404dsjvti046fsua4ktor9grrpe76erq9jot9cvopbhsvsu76r4r30"
   local base64 = "AQBG8n_sgEM_nlEp3G0w3vLjmdvSZ46ln8ZXHn-eObZNjA"

   it("should return unchanged base64 skylink", function()
      assert.is.same(skylink.parse(base64), base64)
   end)
   
   it("should transform base32 skylink into base64", function()
      assert.is.same(skylink.parse(base32), base64)
   end)
end)
