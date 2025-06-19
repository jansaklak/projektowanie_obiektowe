package com.example.shoppingapp.models

import io.realm.RealmObject
import io.realm.annotations.PrimaryKey

open class CartItem : RealmObject() {
    @PrimaryKey
    var id: String = ""
    var productId: String = ""
    var productName: String = ""
    var price: Double = 0.0
    var quantity: Int = 1
}