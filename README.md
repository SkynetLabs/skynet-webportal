# Skynet Portal

## Web application

Use `yarn workspace webapp start` to start the development server.

Use `yarn workspace webapp build` to compile the application to `/public` directory.

You can use the below build parameters to customize your web application.

- development example `GATSBY_API_URL=https://siasky.dev yarn workspace webapp start`
- production example `GATSBY_API_URL=https://siasky.net yarn workspace webapp build`

List of available parameters:

- `GATSBY_API_URL`: override api url (defaults to location origin)

### MongoDB Setup

Mongo needs a couple of extra steps in order to start a secure cluster.

* Open port 27017 on all nodes that will take part in the cluster. Ideally, you would only open the port for the other
  nodes in the cluster.
* Manually run an initialisation `docker run` with extra environment variables that will initialise the admin user with
  a password (example below).
* Manually add a `mgkey` file under `./docker/data/mongo` with the respective secret (
  see [Mongo's keyfile access control](https://docs.mongodb.com/manual/tutorial/enforce-keyfile-access-control-in-existing-replica-set/)
  for details).
* During the initialisation run mentioned above, we need to make two extra steps within the container:
    * Change the ownership of `mgkey` to `mongodb:mongodb`
    * Change its permissions to 400
* After these steps are done we can open a mongo shell on the master node and run `rs.add()` in order to add the new
  node to the cluster.

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
	-v /home/user/skynet-webportal/docker/data/mongo
```

Cluster initialisation mongo command:

```
rs.initiate(
  {
    _id : "skynet",
    members: [
      { _id : 0, host : "mongo0.example.com:27017" },
      { _id : 1, host : "mongo1.example.com:27017" },
    ]
  }
)
```

### Kratos & Oathkeeper Setup

[Kratos](https://www.ory.sh/kratos) is our user management system of choice and
[Oathkeeper](https://www.ory.sh/oathkeeper) is the identity and access proxy.

Most of the needed config is already under `docker/kratos`. The only two things that need to be changed are the config
for Kratos that might contain you email server password, and the JWKS Oathkeeper uses to sign its JWT tokens.

Make sure to create your own`docker/kratos/config/kratos.yml` by copying the `kratos.yml.sample` in the same directory.
Also make sure to never add that file to source control because it will most probably contain your email password in
plain text!

To override the JWKS you will need to directly edit
`docker/kratos/oathkeeper/id_token.jwks.json` and replace it with your generated key set. If you don't know how to
generate a key set you can use this code:

```go
package main

import (
	"encoding/json"
	"log"
	"os"

	"github.com/ory/hydra/jwk"
)

func main() {
	gen := jwk.RS256Generator{
		KeyLength: 2048,
	}
	jwks, err := gen.Generate("", "sig")
	if err != nil {
		log.Fatal(err)
	}
	jsonbuf, err := json.MarshalIndent(jwks, "", "  ")
	if err != nil {
		log.Fatal("failed to generate JSON: %s", err)
	}
	os.Stdout.Write(jsonbuf)
}
```

While you can directly put the output of this programme into the file mentioned above, you can also remove the public
key from the set and change the `kid` of the private key to not include the prefix `private:`.

### CockroachDB Setup

Kratos uses CockroachDB to store its data. For that data to be shared across all nodes that comprise your portal cluster
setup, we need to set up a CockroachDB cluster, complete with secure communication.

#### Generate the certificates for secure communication

For a detailed walk-through, please check [this guide](https://www.cockroachlabs.com/docs/v20.2/secure-a-cluster.html)
out.

Steps:

1. Start a local cockroach docker instance:
   `docker run -d -v "<local dir>:/cockroach/cockroach-secure" --name=crdb cockroachdb/cockroach start --insecure`
1. Get a shall into that instance: `docker exec -it crdb /bin/bash`
1. Go to the directory we which we mapped to a local dir: `cd /cockroach/cockroach-secure`
1. Create the subdirectories in which to create certificates and keys: `mkdir certs my-safe-directory`
1. Create the CA (Certificate Authority) certificate and key
   pair: `cockroach cert create-ca --certs-dir=certs --ca-key=my-safe-directory/ca.key`
1. Create a client certificate and key pair for the root
   user: `cockroach cert create-client root --certs-dir=certs --ca-key=my-safe-directory/ca.key`
1. Create the certificate and key pair for your
   nodes: `cockroach cert create-node cockroach mynode.siasky.net --certs-dir=certs --ca-key=my-safe-directory/ca.key`.
   Don't forget the `cockroach` node name - it's needed by our docker-compose setup. If you want to create certificates
   for more nodes, just delete the `node.*` files (after you've finished the next steps for this node!) and re-run the
   above command with the new node name.
1. Put the contents of the `certs` folder under `docker/cockroach/certs/*` under your portal's root dir and store the
   content of `my-safe-directory` somewhere safe.
1. Put *another copy* of those certificates under `docker/kratos/cr_certs` and change permissions of the `*.key` files,
   so they can be read by anyone (644).

#### Configure your CockroachDB node

There is some configuration that needs to be added to your `.env`file, namely:

1. CR_NODE - the name of your node
1. CR_IP - the public IP of your node
1. CR_CLUSTER_NODES - a list of IPs and ports which make up your cluster, e.g.
   `95.216.13.185:26257,147.135.37.21:26257,144.76.136.122:26257`. This will be the list of nodes that will make up your
   cluster, so make sure those are accurate.

## Contributing

### Testing Your Code

Before pushing your code, you should verify that it will pass our online test suite.

**Cypress Tests**
Verify the Cypress test suite by doing the following:

1. In one terminal screen run `GATSBY_API_URL=https://siasky.net yarn workspace webapp start`
1. In a second terminal screen run `yarn workspace webapp cypress run`

## Setting up complete skynet server

A setup guide with installation scripts can be found in [setup-scripts/README.md](./setup-scripts/README.md).
