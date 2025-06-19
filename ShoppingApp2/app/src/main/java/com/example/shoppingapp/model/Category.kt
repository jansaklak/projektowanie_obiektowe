package com.example.shoppingapp.models

import io.realm.RealmObject
import io.realm.annotations.PrimaryKey

open class Category : RealmObject() {
    @PrimaryKey
    var id: String = ""
    var name: String = ""
    var description: String = ""
}