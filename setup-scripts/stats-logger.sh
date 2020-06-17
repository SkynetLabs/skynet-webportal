#!/usr/bin/env bash

LOGFILE=$1
SIA_PORT=${SIA_PORT:-9980}

# This is a logger service that pulls some current skynet stats and appends them to json log file.
# You should probably run it using crontab, most likely as a root due to access_log read restrictions.
#
# basic usage:
# /home/user/skynet-webportal/setup-scripts/stats-logger.sh public/logs.json
#
# usage with custom sia port:
# SIA_PORT=9970 /home/user/skynet-webportal/setup-scripts/stats-logger.sh public/logs.json
#
# configuring hourly logging with crontab (run crontab -e)
# 0 * * * * /home/user/skynet-webportal/setup-scripts/stats-logger.sh /home/user/skynet-webportal/public/stats.json >/dev/null 2>&1

if ! [ -x "$(command -v jq)" ]; then
	echo 'Error: jq is not installed. Please install with `sudo apt-get install jq`.' >&2
	exit 1
fi

if ! [ -x "$(command -v sponge)" ]; then
	echo 'Error: sponge is not installed. Please install with `sudo apt-get install moreutils`.' >&2
	exit 1
fi

if [ -z "$LOGFILE" ]; then
	echo 'Error: You need to specify json log file name.' >&2
	exit 1
fi

# create logfile if it doesn't exist and initialize it with empty array
if [ ! -f "$LOGFILE" ]; then
	mkdir -p "`dirname \"$LOGFILE\"`" 2>/dev/null
	echo [] > $LOGFILE
fi

# get downloads count from nginx logs
awk -vDate=`date -d'now-1 hours' +[%d/%b/%Y:%H:%M:%S` ' { if ($4 > Date) print $0}' /var/log/nginx/access.log > /var/log/nginx/access_last_hour.log
DOWNLOADS_COUNT_LAST_HOUR=$(awk '{print $7}' /var/log/nginx/access_last_hour.log | grep -E '/[a-zA-Z0-9_-]{46}(/.*)?' | wc -l)

# get siac output
SKYNET_LS=$(/home/user/go/bin/siac skynet ls --addr localhost:${SIA_PORT} | grep -i listing)
SKYNET_LS_REGEX="Listing (.*) files\/dirs:\s+(.*)"
if [[ "${SKYNET_LS}" =~ $SKYNET_LS_REGEX ]]; then
	SKYFILES_COUNT="${BASH_REMATCH[1]}"
	SKYFILES_SIZE_BYTES=$(echo ${BASH_REMATCH[2]} | sed -r 's/[ B]//g' | numfmt --from=iec)
fi

DATE=$(date -u +"%Y-%m-%d %H:%M:%S")
LOG_ENTRY=$(echo {\"date\":\"${DATE}\", \"skyfiles_count\":${SKYFILES_COUNT}, \"skyfiles_size_bytes\":${SKYFILES_SIZE_BYTES}, \"downloads_count_last_hour\":${DOWNLOADS_COUNT_LAST_HOUR}})
jq -c ". += [${LOG_ENTRY}]" $LOGFILE | sponge $LOGFILE