## Initial DB Setup

### Initial setup of the master node
These steps should either be executed in the running docker container. The important part is that their results on disk are preserved in the volume attached to the master node.

* Create the replication user and make sure to write down the password you set for it because it will need to go into the individual `.pgpass` files on each replica.
```shell script
su - postgres -c "createuser -U postgres repuser -P -c 5 --replication"
```
* Create the database we're going to use:
```sql
  CREATE DATABASE skynet;  
```
* Create an archive directory:
```shell script
su - postgres -c "mkdir -p /var/lib/postgresql/data/mnt/server/achivedir"
```
* Copy `pg_hba.conf` and `postgresql.conf` from the `docker/pg` directory to `/var/lib/postgresql/data` in the container.

### Initial setup for a replica node
* Add a `.pgpass` file to `/home/user/skynet-webportal/` (see [this](https://www.postgresql.org/docs/9.2/libpq-pgpass.html) for details).
* Build and run with `docker-compose` - that will take care fo everything else.

## Recovery Mode

### Promoting a replica to be a master
Create a `recovery.signal` file in the data directory. The contents don't matter, all it matters is that the file exists. It tells PostgreSQL to enter normal archive recovery.

### Change a master to a replica:
Create a `standby.signal` file in the data directory. The contents don't matter, all it matters is that the file exists. It tells PostgreSQL to enter standby mode.

## Removing a replica

If you need to permanently retire a node you need to delete its replication slot on the master node. If you don't do that the master will keep all WAL files in order to make sure the removed replica is able to sync up to it. This will quickly fill up the hard drive.

## Resources:

* The [official Docker image for Postgres](https://hub.docker.com/_/postgres?tab=description) and its [source code](https://github.com/docker-library/postgres/blob/master/13/Dockerfile)
* The setup is loosely based on https://cloud.google.com/community/tutorials/setting-up-postgres-hot-standby. There are some modifications necessitated by the changed features in the latest version. 
* https://www.postgresql.org/docs/9.5/app-pgbasebackup.html
* https://www.postgresql.org/docs/9.2/libpq-pgpass.html
* [PostgreSQL replication by example](https://www.youtube.com/watch?v=5BeC1aD4z8E)
* https://www.cybertec-postgresql.com/en/recovery-conf-is-gone-in-postgresql-v12/
