# Skynet Portal

## Latest Setup Documentation

Latest Skynet Webportal setup documentation and the setup process Skynet Labs
supports is located at https://docs.siasky.net/webportal-management/overview.

Some of the scripts and setup documentation contained in this repository
(`skynet-webportal`) can be outdated and generally should not be used.

## Web application

Change current directory with `cd packages/website`.

Use `yarn start` to start the development server.

Use `yarn build` to compile the application to `/public` directory.

You can use the below build parameters to customize your web application.

- development example `GATSBY_API_URL=https://siasky.dev yarn start`
- production example `GATSBY_API_URL=https://siasky.net yarn build`

List of available parameters:

- `GATSBY_API_URL`: override api url (defaults to location origin)

## License

Skynet uses a custom [License](./LICENSE.md). The Skynet License is a source code license that allows you to use, modify
and distribute the software, but you must preserve the payment mechanism in the software.

For the purposes of complying with our code license, you can use the following Siacoin address:

`fb6c9320bc7e01fbb9cd8d8c3caaa371386928793c736837832e634aaaa484650a3177d6714a`

### MongoDB Setup

Mongo needs a couple of extra steps in order to start a secure cluster.

- Open port 27017 on all nodes that will take part in the cluster. Ideally, you would only open the port for the other
  nodes in the cluster.
- Manually add a `mgkey` file under `./docker/data/mongo` with the respective secret (
  see [Mongo's keyfile access control](https://docs.mongodb.com/manual/tutorial/enforce-keyfile-access-control-in-existing-replica-set/)
  for details).
- Manually run an initialisation `docker run` with extra environment variables that will initialise the admin user with
  a password (example below).
- During the initialisation run mentioned above, we need to make two extra steps within the container:
  - Change the ownership of `mgkey` to `mongodb:mongodb`
  - Change its permissions to 400
- After these steps are done we can open a mongo shell on the primary node and run `rs.add()` in order to add the new
  node to the cluster. If you don't know which node is primary, log onto any server and jump into the Mongo's container
  (`docker exec -it mongo mongo -u admin -p`) and then get the status of the replica set (`rs.status()`).

Example initialisation docker run command:

```
docker run \
	--rm \
	--name mg \
	-p 27017:27017 \
	-e MONGO_INITDB_ROOT_USERNAME=<admin username> \
	-e MONGO_INITDB_ROOT_PASSWORD=<admin password> \
	-v /home/user/skynet-webportal/docker/data/mongo/db:/data/db \
	-v /home/user/skynet-webportal/docker/data/mongo/mgkey:/data/mgkey \
	mongo --keyFile=/data/mgkey --replSet=skynet
```

Regular docker run command:

```
docker run \
	--rm \
	--name mg \
	-p 27017:27017 \
	-v /home/user/skynet-webportal/docker/data/mongo/db:/data/db \
	-v /home/user/skynet-webportal/docker/data/mongo/mgkey:/data/mgkey \
	mongo --keyFile=/data/mgkey --replSet=skynet
```

Cluster initialisation mongo command:

```
rs.initiate(
  {
    _id : "skynet",
    members: [
      { _id : 0, host : "mongo:27017" }
    ]
  }
)
```

Add more nodes when they are ready:

```
rs.add("second.node.net:27017")
```

## Contributing

### Testing Your Code

Before pushing your code, you should verify that it will pass our online test suite.

**Cypress Tests**
Verify the Cypress test suite by doing the following:

1. In one terminal screen run `GATSBY_API_URL=https://siasky.net website serve`
1. In a second terminal screen run `yarn cypress run`

## Setting up complete skynet server

A setup guide with installation scripts can be found in [setup-scripts/README.md](./setup-scripts/README.md).
