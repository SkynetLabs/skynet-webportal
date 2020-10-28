FROM postgres:13 as postgres

ARG master
ENV MASTER=${master}


# We prepare the configs on disk. We'll move them to the data dir after we intialise it.
# See init.sh.
COPY *.conf /var/lib/postgresql/skynet_init_conf/

# From the docs:
#
# If you would like to do additional initialization in an image derived from this one, add one or more *.sql, *.sql.gz,
# or *.sh scripts under /docker-entrypoint-initdb.d (creating the directory if necessary). After the entrypoint calls
# initdb to create the default postgres user and database, it will run any *.sql files, run any executable *.sh scripts,
# and source any non-executable *.sh scripts found in that directory to do further initialization before starting the service.
#
# Warning: scripts in /docker-entrypoint-initdb.d are only run if you start the container with a data directory that is
# empty; any pre-existing database will be left untouched on container startup. One common problem is that if one of your
# /docker-entrypoint-initdb.d scripts fails (which will cause the entrypoint script to exit) and your orchestrator restarts
# the container with the already initialized data directory, it will not continue on with your scripts.
COPY init.sh init.sql /docker-entrypoint-initdb.d/

# This script will check whether the node is master or replica and will initialised and start it accordingly.
COPY run.sh ./

CMD ["run.sh"]
