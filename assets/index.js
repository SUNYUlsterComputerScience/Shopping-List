// tag::createUser[]
db.createUser({
  user: "sampleUser",
  pwd: "openliberty",
  roles: [{ role: "readWrite", db: "testdb" }]
});
// end::createUser[]

// tag::createCollection[]
db.createCollection("Food");
db.createCollection("Layout");

// end::createCollection[]
