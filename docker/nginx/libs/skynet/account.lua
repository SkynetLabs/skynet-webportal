local _M = {}

-- fallback - remember to keep those updated
local anon_limits = { ["tierName"] = "anonymous", ["upload"] = 655360, ["download"] = 655360, ["maxUploadSize"] = 1073741824, ["registry"] = 250 }

-- no limits applied 
local no_limits = { ["tierName"] = "internal", ["upload"] = 0, ["download"] = 0, ["maxUploadSize"] = 0, ["registry"] = 0 }

-- handle request exit when access to portal should be restricted
-- currently handles only HTTP_UNAUTHORIZED but can be extended in future
function _M.exit_access_unauthorized(message)
    ngx.status = ngx.HTTP_UNAUTHORIZED
    ngx.header["content-type"] = "text/plain"
    ngx.say(message or "Portal operator restricted access to authenticated users only")
    return ngx.exit(ngx.status)
end

function _M.accounts_enabled()
    return os.getenv("PORTAL_MODULES"):match("a") ~= nil
end

function _M.get_account_limits()
    local cjson = require('cjson')

    if ngx.var.internal_no_limits == "true" then
        return no_limits
    end

    if ngx.var.skynet_jwt == "" then
        return anon_limits
    end

    if ngx.var.account_limits == "" then
        local httpc = require("resty.http").new()
        
        -- 10.10.10.70 points to accounts service (alias not available when using resty-http)
        local res, err = httpc:request_uri("http://10.10.10.70:3000/user/limits", {
            headers = { ["Cookie"] = "skynet-jwt=" .. ngx.var.skynet_jwt }
        })
        
        -- fail gracefully in case /user/limits failed
        if err or (res and res.status ~= ngx.HTTP_OK) then
            ngx.log(ngx.ERR, "Failed accounts service request /user/limits: ", err or ("[HTTP " .. res.status .. "] " .. res.body))
            ngx.var.account_limits = cjson.encode(anon_limits)
        elseif res and res.status == ngx.HTTP_OK then
            ngx.var.account_limits = res.body
        end
    end

    return cjson.decode(ngx.var.account_limits)
end

-- detect whether current user is authenticated
function _M.is_authenticated()
    local limits = _M.get_account_limits()

    return limits.tierName ~= anon_limits.tierName
end

function _M.is_auth_required()
    return os.getenv("ACCOUNTS_LIMIT_ACCESS") == "authenticated"
end

-- check whether access to portal should be restricted
-- based on the configurable environment variable
function _M.is_access_unauthorized()
    return _M.accounts_enabled() and _M.is_auth_required() and not _M.is_authenticated()
end

return _M
