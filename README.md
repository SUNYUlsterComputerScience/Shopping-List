![](https://github.com/OpenLiberty/open-liberty/blob/master/logos/logo_horizontal_light_navy.png)

Forked from MongoDB sample application

## Open the following ports:
  9080, 9443

## Create a Docker container for MongoDB
  docker build -t mongo-sample -f assets/Dockerfile .
  docker run --name mongo-guide -p 27017:27017 -d mongo-sample

## Add truststore (might need to use podman cp instead of Docker cp in linuxOne)

    docker cp \
    mongo-guide:/home/mongodb/certs/truststore.p12 \
    start/src/main/liberty/config/resources/security
  docker cp \
    mongo-guide:/home/mongodb/certs/truststore.p12 \
    finish/src/main/liberty/config/resources/security


    The Json for the MongoDB Server is in:
         assets/Json/Layout.json
         assets/Json/Food.json

## To Run Sample application

cd ShoppingList/finish/
    mvn liberty:dev


### Open URL in browser
    https://localhost:9443/mongo/

### Stop server (quit)
    q [ENTER]
