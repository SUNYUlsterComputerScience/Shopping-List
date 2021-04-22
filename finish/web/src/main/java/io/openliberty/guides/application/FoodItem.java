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

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.Pattern;

// tag::crewMember[]
public class FoodItem {

    @NotEmpty(message = "All Food Items must have a name!")
    private String name;

    @Pattern(regexp = "(Produce|Dairy|Seafood|Prepared Food|Frozen|Drinks|Snack|Baked Goods)",
           message = "Item Type must be one of the listed departments!")
    private String department;

    @NotEmpty(message = "All Food Items must have a name!")
    private String thumbnail;

    @NotEmpty(message = "All Food Items must have a name!")
    private String description;

    @Pattern(regexp = "^\\d+$",
              message = "Aisles Number must be a non-negative integer!")
    private String aisle;


    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }


    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public String getThumbnail() {
        return thumbnail;
    }

    public void setThumbnail(String thumbnail) {
        this.thumbnail = thumbnail;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getAisle(){
        return aisle;
    }

    public void setAisle(String aisle) {
        this.aisle = aisle;
    }



}
// end::FoodItem[]
