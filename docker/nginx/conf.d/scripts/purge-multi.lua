-- Tit Petric, Monotek d.o.o., Tue 03 Jan 2017 06:54:56 PM CET
--
-- Delete nginx cached assets with a PURGE request against an endpoint
-- supports extended regular expression PURGE requests (/upload/.*)
--
-- https://scene-si.org/2017/01/08/improving-nginx-lua-cache-purge/
--

function file_exists(name)
    local f = io.open(name, "r")
    if f~=nil then io.close(f) return true else return false end
end

function explode(d, p)
    local t, ll
    t={}
    ll=0
    if(#p == 1) then return {p} end
            while true do
                    l=string.find(p, d, ll, true) -- find the next d in the string
                    if l~=nil then -- if "not not" found then..
                            table.insert(t, string.sub(p, ll, l-1)) -- Save it in our array.
                            ll=l+1 -- save just after where we found it for searching next time.
                    else
                            table.insert(t, string.sub(p, ll)) -- Save what's left in our array.
                            break -- Break at end, as it should be, according to the lua manual.
                    end
            end
    return t
end

function purge(filename)
    if (file_exists(filename)) then
            os.remove(filename)
    end
end

function trim(s)
    return (string.gsub(s, "^%s*(.-)%s*$", "%1"))
end

function exec(cmd)
    local handle = io.popen(cmd)
    local result = handle:read("*all")
    handle:close()
    return trim(result)
end

function list_files(cache_path, purge_pattern)
    local result = exec("/usr/bin/find " .. cache_path .. " -type f | /usr/bin/xargs --no-run-if-empty -n1000 /bin/grep -El -m 1 '^KEY: " .. purge_pattern .. "' 2>&1")
    if result == "" then
            return {}
    end
    return explode("\n", result)
end

if ngx ~= nil then
    -- list all cached items matching uri
    local files = list_files(ngx.var.lua_purge_path, ngx.var.uri)

    ngx.header["Content-type"] = "text/plain; charset=utf-8"
    ngx.header["X-Purged-Count"] = table.getn(files)
    for k, v in pairs(files) do
            purge(v)
    end
    ngx.say("OK")
    ngx.exit(ngx.OK)
end
