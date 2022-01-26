local _M = {}

-- fallback - remember to keep those updated
local anon_limits = { ["tierName"] = "anonymous", ["upload"] = 655360, ["download"] = 655360, ["maxUploadSize"] = 1073741824, ["registry"] = 250 }

-- no limits applied 
local no_limits = { ["tierName"] = "internal", ["upload"] = 0, ["download"] = 0, ["maxUploadSize"] = 0, ["registry"] = 0 }

-- free tier name
local free_tier = "free"

-- handle request exit when access to portal should be restricted to authenticated users only
function _M.exit_access_unauthorized(message)
    ngx.status = ngx.HTTP_UNAUTHORIZED
    ngx.header["content-type"] = "text/plain"
    ngx.say(message or "Portal operator restricted access to authenticated users only")
    return ngx.exit(ngx.status)
end

-- handle request exit when access to portal should be restricted to subscription users only
function _M.exit_access_forbidden(message)
    ngx.status = ngx.HTTP_FORBIDDEN
    ngx.header["content-type"] = "text/plain"
    ngx.say(message or "Portal operator restricted access to users with active subscription only")
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

-- detect whether current user has active subscription
function _M.is_subscription_account()
    local limits = _M.get_account_limits()

    return limits.tierName ~= anon_limits.tierName and limits.tierName ~= free_tier
end

function _M.is_auth_required()
    return os.getenv("ACCOUNTS_LIMIT_ACCESS") == "authenticated"
end

function _M.is_subscription_required()
    return os.getenv("ACCOUNTS_LIMIT_ACCESS") == "subscription"
end

function is_access_always_allowed()
    -- options requests do not attach cookies - should always be available
    -- requests should not be limited based on accounts if accounts are not enabled
    return ngx.req.get_method() == "OPTIONS" or not _M.accounts_enabled()
end

-- check whether access is restricted if portal requires authorization
function _M.is_access_unauthorized()
    if is_access_always_allowed() then return false end

    -- check if authentication is required and request is not authenticated
    return _M.is_auth_required() and not _M.is_authenticated()
end

-- check whether user is authenticated but does not have access to given resources
function _M.is_access_forbidden()
    if is_access_always_allowed() then return false end

    -- check if active subscription is required and request is from user without it
    return _M.is_subscription_required() and not _M.is_subscription_account()
end

return _M
