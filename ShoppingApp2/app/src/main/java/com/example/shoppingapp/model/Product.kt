package com.example.shoppingapp.models

import io.realm.RealmObject
import io.realm.annotations.PrimaryKey

open class Product : RealmObject() {
    @PrimaryKey
    var id: String = ""
    var name: String = ""
    var price: Double = 0.0
    var description: String = ""
    var categoryId: String = ""
    var imageUrl: String = ""
}