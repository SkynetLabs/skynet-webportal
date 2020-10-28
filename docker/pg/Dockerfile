FROM postgres:13 as postgres

# TODO DEBUG: Remove this when finished.
RUN apt-get update && apt-get install -y procps vim

# Prepare the configs on disk. We'll move them to the data dir after we intialise it.
# See run.sh.
COPY *.conf /var/lib/postgresql/skynet_init_conf/

# This script will check whether the node is already setup or new and it will
# sync it and start it accordingly.
COPY run.sh ./

CMD ["./run.sh"]
