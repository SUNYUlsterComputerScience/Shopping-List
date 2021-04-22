// tag::copyright[]
/*******************************************************************************
 * Copyright (c) 2020 IBM Corporation and others.
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v10.html
 *
 * Contributors:
 *     IBM Corporation - initial API and implementation
 *******************************************************************************/
// end::copyright[]
package io.openliberty.guides.application;

import java.util.Set;

import java.io.StringWriter;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import javax.json.JsonArray;
import javax.json.JsonArrayBuilder;
import javax.json.Json;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.Produces;
import javax.ws.rs.PathParam;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import javax.validation.Validator;
import javax.validation.ConstraintViolation;

import com.mongodb.client.FindIterable;
// tag::bsonDocument[]
import org.bson.Document;
// end::bsonDocument[]
import org.bson.types.ObjectId;

// tag::mongoImports1[]
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
// end::mongoImports1[]
// tag::mongoImports2[]
import com.mongodb.client.result.DeleteResult;
import com.mongodb.client.result.UpdateResult;
// end::mongoImports2[]

import org.eclipse.microprofile.openapi.annotations.Operation;
import org.eclipse.microprofile.openapi.annotations.parameters.Parameter;
import org.eclipse.microprofile.openapi.annotations.responses.APIResponse;
import org.eclipse.microprofile.openapi.annotations.responses.APIResponses;

@Path("/food")
@ApplicationScoped
public class FoodService {

    // tag::dbInjection[]
    @Inject
    MongoDatabase db;
    // end::dbInjection[]

    // tag::beanValidator[]
    @Inject
    Validator validator;
    // end::beanValidator[]

    // tag::getViolations[]
    private JsonArray getViolations(FoodItem foodItem) {
        Set<ConstraintViolation<FoodItem>> violations = validator.validate(
        		foodItem);

        JsonArrayBuilder messages = Json.createArrayBuilder();

        for (ConstraintViolation<FoodItem> v : violations) {
            messages.add(v.getMessage());
        }

        return messages.build();
    }
    // end::getViolations[]

    @POST
    @Path("/")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    @APIResponses({
        @APIResponse(
            responseCode = "200",
            description = "Successfully added Food Types."),
        @APIResponse(
            responseCode = "400",
            description = "Invalid crew member configuration.") })
    @Operation(summary = "Add a new crew member to the database.")
    // tag::add[]
    public Response add(FoodItem foodItem) {
        JsonArray violations = getViolations(foodItem);

        if (!violations.isEmpty()) {
            return Response
                    .status(Response.Status.BAD_REQUEST)
                    .entity(violations.toString())
                    .build();
        }

        // tag::getCollection[]
        MongoCollection<Document> food = db.getCollection("Food");
        // end::getCollection[]

        // tag::foodItemCreation[]
        Document newfoodItem = new Document();
        newfoodItem.put("Name", foodItem.getName());
        newfoodItem.put("Food Types", foodItem.getDepartment());
        newfoodItem.put("Aisles", foodItem.getAisle());
        // end::foodItemCreation[]

        // tag::insertOne[]
        food.insertOne(newfoodItem);
        // end::insertOne[]
        
        return Response
            .status(Response.Status.OK)
            .entity(newfoodItem.toJson())
            .build();
    }
    // end::add[]

    @GET
    @Path("/")
    @Produces(MediaType.APPLICATION_JSON)
    @APIResponses({
        @APIResponse(
            responseCode = "200",
            description = "Successfully listed the crew members."),
        @APIResponse(
            responseCode = "500",
            description = "Failed to list the crew members.") })
    @Operation(summary = "List the crew members from the database.")
    // tag::retrieve[]
    public Response retrieve() {
        StringWriter sb = new StringWriter();

        try {
            // tag::getCollectionRead[]
            MongoCollection<Document> food = db.getCollection("Food");
            // end::getCollectionRead[]
            sb.append("[");
            boolean first = true;
            // tag::find[]
            FindIterable<Document> docs = food.find();
            // end::find[]
            for (Document d : docs) {
                if (!first) sb.append(",");
                else first = false;
                sb.append(d.toJson());
            }
            sb.append("]");
        } catch (Exception e) {
            e.printStackTrace(System.out);
            return Response
                .status(Response.Status.INTERNAL_SERVER_ERROR)
                .entity("[\"Unable to list food Items!\"]")
                .build();
        }

        return Response
            .status(Response.Status.OK)
            .entity(sb.toString())
            .build();
    }
    // end::retrieve[]

    @PUT
    @Path("/{id}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    @APIResponses({
        @APIResponse(
            responseCode = "200",
            description = "Successfully updated crew member."),
        @APIResponse(
            responseCode = "400",
            description = "Invalid object id or crew member configuration."),
        @APIResponse(
            responseCode = "404",
            description = "Crew member object id was not found.") })
    @Operation(summary = "Update a crew member in the database.")
    // tag::update[]
    public Response update(FoodItem foodItem,
        @Parameter(
            description = "Object id of the crew member to update.",
            required = true
        )
        @PathParam("id") String id) {

        JsonArray violations = getViolations(foodItem);
        
        if (!violations.isEmpty()) {
            return Response
                    .status(Response.Status.BAD_REQUEST)
                    .entity(violations.toString())
                    .build();
        }

        ObjectId oid;

        try {
            oid = new ObjectId(id);
        } catch (Exception e) {
            return Response
                .status(Response.Status.BAD_REQUEST)
                .entity("[\"Invalid object id!\"]")
                .build();
        }

        // tag::getCollectionUpdate[]
        MongoCollection<Document> food = db.getCollection("Food");
        // end::getCollectionUpdate[]

        // tag::queryUpdate[]
        Document query = new Document("_id", oid);
        // end::queryUpdate[]

        // tag::foodItemUpdate[]
        Document newfoodItem = new Document();
        newfoodItem.put("Name", foodItem.getName());
        newfoodItem.put("Food Type", foodItem.getDepartment());
        newfoodItem.put("Aisles", foodItem.getAisle());
        // end::foodItemUpdate[]

        // tag::replaceOne[]
        UpdateResult updateResult = food.replaceOne(query, newfoodItem);
        // end::replaceOne[]

        // tag::getMatchedCount[]
        if (updateResult.getMatchedCount() == 0) {
        // end::getMatchedCount[]
            return Response
                .status(Response.Status.NOT_FOUND)
                .entity("[\"_id was not found!\"]")
                .build();
        }

        newfoodItem.put("_id", oid);

        return Response
            .status(Response.Status.OK)
            .entity(newfoodItem.toJson())
            .build();
    }
    // end::update[]

    @DELETE
    @Path("/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    @APIResponses({
        @APIResponse(
            responseCode = "200",
            description = "Successfully deleted crew member."),
        @APIResponse(
            responseCode = "400",
            description = "Invalid object id."),
        @APIResponse(
            responseCode = "404",
            description = "Food Item object id was not found.") })
    @Operation(summary = "Delete a crew member from the database.")
    // tag::remove[]
    public Response remove(
        @Parameter(
            description = "Object id of the crew member to delete.",
            required = true
        )
        @PathParam("id") String id) {

        ObjectId oid;

        try {
            oid = new ObjectId(id);
        } catch (Exception e) {
            return Response
                .status(Response.Status.BAD_REQUEST)
                .entity("[\"Invalid object id!\"]")
                .build();
        }

        // tag::getCollectionDelete[]
        MongoCollection<Document> food = db.getCollection("Food");
        // end::getCollectionDelete[]

        // tag::queryDelete[]
        Document query = new Document("_id", oid);
        // end::queryDelete[]

        // tag::deleteOne[]
        DeleteResult deleteResult = food.deleteOne(query);
        // end::deleteOne[]
        
        // tag::getDeletedCount[]
        if (deleteResult.getDeletedCount() == 0) {
        // end::getDeletedCount[]
            return Response
                .status(Response.Status.NOT_FOUND)
                .entity("[\"_id was not found!\"]")
                .build();
        }

        return Response
            .status(Response.Status.OK)
            .entity(query.toJson())
            .build();
    }
    // end::remove[]
}