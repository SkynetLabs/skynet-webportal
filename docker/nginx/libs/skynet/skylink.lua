local _M = {}

local basexx = require("basexx")
local hasher = require("hasher")

-- parse any skylink and return base64 version
function _M.parse(skylink)
    if string.len(skylink) == 55 then
        local decoded = basexx.from_basexx(string.upper(skylink), "0123456789ABCDEFGHIJKLMNOPQRSTUV", 5)

        return basexx.to_url64(decoded)
    end

    return skylink
end

-- hash skylink into 32 bytes hash used in blocklist
function _M.hash(skylink)
    -- ensure that the skylink is base64 encoded
    local base64Skylink = _M.parse(skylink)

    -- decode skylink from base64 encoding
    local rawSkylink = basexx.from_url64(base64Skylink)

    -- drop first two bytes and leave just merkle root
    local rawMerkleRoot = string.sub(rawSkylink, 3)

    -- parse with blake2b with key length of 32
    local blake2bHashed = hasher.blake2b(rawMerkleRoot, 32)
    
    -- hex encode the blake hash
    local hexHashed = basexx.to_hex(blake2bHashed)

    -- lowercase the hex encoded hash
    local lowerHexHashed = string.lower(hexHashed)

    return lowerHexHashed
end

return _M
