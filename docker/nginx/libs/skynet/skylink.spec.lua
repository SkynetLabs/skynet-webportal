local skynet_skylink = require("skynet.skylink")

describe("base64", function()
   local base32 = "0404dsjvti046fsua4ktor9grrpe76erq9jot9cvopbhsvsu76r4r30"
   local base64 = "AQBG8n_sgEM_nlEp3G0w3vLjmdvSZ46ln8ZXHn-eObZNjA"

   it("should return unchanged base64 skylink", function()
      assert.is.same(skynet_skylink.base64(base64), base64)
   end)
   
   it("should transform base32 skylink into base64", function()
      assert.is.same(skynet_skylink.base64(base32), base64)
   end)
end)

describe("base32", function()
   local base32 = "0404dsjvti046fsua4ktor9grrpe76erq9jot9cvopbhsvsu76r4r30"
   local base64 = "AQBG8n_sgEM_nlEp3G0w3vLjmdvSZ46ln8ZXHn-eObZNjA"

   it("should return unchanged base32 skylink", function()
      assert.is.same(skynet_skylink.base32(base32), base32)
   end)
   
   it("should transform base64 skylink into base32", function()
      assert.is.same(skynet_skylink.base32(base64), base32)
   end)
end)

describe("hash", function()
   local base64 = "EADi4QZWt87sSDCSjVTcmyI5tE_YAsuC90BcCi_jEmG5NA"
   local hash = "6cfb9996ad74e5614bbb8e7228e72f1c1bc14dd9ce8a83b3ccabdb6d8d70f330"

   it("should hash skylink", function()
      assert.is.same(hash, skynet_skylink.hash(base64))
   end)
end)
