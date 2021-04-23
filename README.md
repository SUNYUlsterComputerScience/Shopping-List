![](https://github.com/OpenLiberty/open-liberty/blob/master/logos/logo_horizontal_light_navy.png)

Forked MongoDB sample application, Oauth sample application and JPA sample application

## Open the following ports:
  7080, 7443, 5050, 5051

## Create a Docker container for MongoDB
  docker build -t mongo-sample -f assets/Dockerfile .
  docker run --name mongo-guide -p 27017:27017 -d mongo-sample

## Add truststore(might need to use podman cp instead of Docker cp in linuxOne)

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

cd ShoppingList/finish/web
    mvn liberty:dev

New terminal

cd ShoppingList/finish/oauth
    mvn liberty:dev


### Open URL in browser
    Web with mongodb
    http://localhost:7080/mongo/
    Oauth
    http://localhost:5050/api/hello.html

  It was intended to have both addresses to commutate after someone logs in from Oauth into the ShoppingList
     Does not work TCP errors

 cd ShoppingList/finish/pom.xml
    Runs the server apps in modules but port errors
