local _M = {}

function _M.reload()
    local httpc = require("resty.http").new()

    -- fetch blocklist records (all blocked skylink hashes)
    -- 10.10.10.10 points to sia service (alias not available when using resty-http)
    local res, err = httpc:request_uri("http://10.10.10.10:9980/skynet/blocklist", {
        headers = {
            ["User-Agent"] = "Sia-Agent",
        }
    })

    -- fail whole request in case this request failed, we want to make sure
    -- the blocklist is pre cached before serving first skylink
    if err or (res and res.status ~= ngx.HTTP_OK) then
        ngx.log(ngx.ERR, "Failed skyd service request /skynet/blocklist: ", err or ("[HTTP " .. res.status .. "] " .. res.body))
        ngx.status = (err and ngx.HTTP_INTERNAL_SERVER_ERROR) or res.status
        ngx.header["content-type"] = "text/plain"
        ngx.say(err or res.body)
        return ngx.exit(ngx.status)
    elseif res and res.status == ngx.HTTP_OK then
        local json = require('cjson')
        local data = json.decode(res.body)

        -- mark all existing entries as expired
        ngx.shared.blocklist:flush_all()

        -- check if blocklist is table (it is null when empty)
        if type(data.blocklist) == "table" then
            -- set all cache entries one by one (resets expiration)
            for i, hash in ipairs(data.blocklist) do
                ngx.shared.blocklist:set(hash, true)
            end
        end

        -- ensure that init flag is persisted
        ngx.shared.blocklist:set("__init", true)

        -- remove all leftover expired entries
        ngx.shared.blocklist:flush_expired()
    end
end

function _M.is_blocked(skylink)
    -- make sure that blocklist has been preloaded
    if not ngx.shared.blocklist:get("__init") then _M.reload() end

    -- hash skylink before comparing it with blocklist
    local hash = require("skynet.skylink").hash(skylink)

    -- we need to use get_stale because we are expiring previous
    -- entries when the blocklist is reloading and we still want
    -- to block them until the reloading is finished
    return ngx.shared.blocklist:get_stale(hash) == true
end

-- exit with 416 illegal content status code
function _M.exit_illegal()
    ngx.status = ngx.HTTP_ILLEGAL
    ngx.header["content-type"] = "text/plain"
    ngx.say("Unavailable For Legal Reasons")
    return ngx.exit(ngx.status)
end

return _M
